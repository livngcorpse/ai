# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import AuthProvider, ThemeType, ModelType

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    preferred_theme: Optional[ThemeType] = None
    preferred_model: Optional[ModelType] = None

class UserResponse(UserBase):
    id: int
    provider: AuthProvider
    preferred_theme: ThemeType
    preferred_model: ModelType
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse