# backend/app/schemas/message.py
from pydantic import BaseModel
from datetime import datetime
from app.models.message import MessageRole
from typing import Optional

class MessageBase(BaseModel):
    role: MessageRole
    content: str

class MessageCreate(MessageBase):
    chat_id: int

class MessageResponse(MessageBase):
    id: int
    chat_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[int] = None