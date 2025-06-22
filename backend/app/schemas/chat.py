# backend/app/schemas/chat.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatBase(BaseModel):
    title: str

class ChatCreate(ChatBase):
    pass

class ChatUpdate(BaseModel):
    title: Optional[str] = None

class ChatResponse(ChatBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatWithMessages(ChatResponse):
    messages: List["MessageResponse"] = []