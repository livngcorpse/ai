# backend/app/schemas/chat.py:

from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from app.schemas.message import MessageResponse

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