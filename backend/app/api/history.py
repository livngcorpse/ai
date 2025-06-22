# backend/app/api/history.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, delete
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message
from app.schemas.chat import ChatResponse, ChatWithMessages, ChatUpdate
from app.utils.deps import get_current_user

router = APIRouter()

@router.get("/chats", response_model=List[ChatResponse])
async def get_user_chats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Chat).where(Chat.user_id == current_user.id).order_by(Chat.created_at.desc())
    result = await db.execute(stmt)
    chats = result.scalars().all()
    return [ChatResponse.from_orm(chat) for chat in chats]

@router.get("/chats/{chat_id}", response_model=ChatWithMessages)
async def get_chat_with_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Chat).options(selectinload(Chat.messages)).where(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    )
    result = await db.execute(stmt)
    chat = result.scalar_one_or_none()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return ChatWithMessages.from_orm(chat)

@router.put("/chats/{chat_id}", response_model=ChatResponse)
async def update_chat(
    chat_id: int,
    chat_update: ChatUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Chat).where(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    )
    result = await db.execute(stmt)
    chat = result.scalar_one_or_none()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    if chat_update.title is not None:
        chat.title = chat_update.title
    
    await db.commit()
    await db.refresh(chat)
    
    return ChatResponse.from_orm(chat)

@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Chat).where(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    )
    result = await db.execute(stmt)
    chat = result.scalar_one_or_none()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    await db.delete(chat)
    await db.commit()
    
    return {"message": "Chat deleted successfully"}