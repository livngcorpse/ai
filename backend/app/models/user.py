# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.session import Base

class AuthProvider(str, enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"
    GITHUB = "github"

class ThemeType(str, enum.Enum):
    LIGHT = "light"
    DARK = "dark"
    HACKER = "hacker"
    RETRO = "retro"
    CYBERPUNK = "cyberpunk"
    ZEN = "zen"

class ModelType(str, enum.Enum):
    GPT_4O = "gpt-4o"
    GPT_35_TURBO = "gpt-3.5-turbo"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    provider = Column(Enum(AuthProvider), default=AuthProvider.EMAIL)
    preferred_theme = Column(Enum(ThemeType), default=ThemeType.LIGHT)
    preferred_model = Column(Enum(ModelType), default=ModelType.GPT_4O)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")