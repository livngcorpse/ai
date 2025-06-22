# backend/app/api/chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
import json
import asyncio
import openai

from app.db.session import get_db
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message, MessageRole
from app.schemas.message import ChatRequest, MessageResponse
from app.utils.deps import get_current_user
from app.core.config import settings

router = APIRouter()
openai.api_key = settings.OPENAI_API_KEY

@router.post("/send")
async def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Create or get chat
    if request.chat_id:
        stmt = select(Chat).where(
            Chat.id == request.chat_id,
            Chat.user_id == current_user.id
        )
        result = await db.execute(stmt)
        chat = result.scalar_one_or_none()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
    else:
        # Create new chat
        chat = Chat(
            user_id=current_user.id,
            title=request.message[:50] + ("..." if len(request.message) > 50 else "")
        )
        db.add(chat)
        await db.commit()
        await db.refresh(chat)
    
    # Save user message
    user_message = Message(
        chat_id=chat.id,
        user_id=current_user.id,
        role=MessageRole.USER,
        content=request.message
    )
    db.add(user_message)
    await db.commit()
    
    # Get chat history for context
    stmt = select(Message).where(Message.chat_id == chat.id).order_by(Message.created_at)
    result = await db.execute(stmt)
    messages = result.scalars().all()
    
    # Prepare OpenAI messages
    openai_messages = [
        {"role": msg.role.value, "content": msg.content}
        for msg in messages[-10:]  # Last 10 messages for context
    ]
    
    async def generate_response():
        try:
            # Stream response from OpenAI
            response = await openai.ChatCompletion.acreate(
                model=current_user.preferred_model.value,
                messages=openai_messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000
            )
            
            full_response = ""
            async for chunk in response:
                if chunk.choices[0].delta.get("content"):
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield f"data: {json.dumps({'content': content, 'done': False})}\n\n"
            
            # Save assistant message
            assistant_message = Message(
                chat_id=chat.id,
                user_id=current_user.id,
                role=MessageRole.ASSISTANT,
                content=full_response
            )
            db.add(assistant_message)
            await db.commit()
            
            yield f"data: {json.dumps({'content': '', 'done': True, 'chat_id': chat.id})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
    
    return StreamingResponse(
        generate_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )