# backend/app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
import secrets

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    @field_validator('SECRET_KEY')
    @classmethod
    def validate_secret_key(cls, v):
        if not v:
            # Generate a secure secret key if not provided
            return secrets.token_urlsafe(32)
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    @field_validator('DATABASE_URL')
    @classmethod
    def validate_database_url(cls, v):
        if not v:
            raise ValueError("DATABASE_URL is required")
        return v
    
    @field_validator('OPENAI_API_KEY')
    @classmethod
    def validate_openai_key(cls, v):
        if not v:
            raise ValueError("OPENAI_API_KEY is required")
        if not v.startswith('sk-'):
            raise ValueError("OPENAI_API_KEY must be a valid OpenAI API key")
        return v
    
    @field_validator('ALLOWED_ORIGINS')
    @classmethod
    def validate_cors_origins(cls, v):
        # In production, be more restrictive
        if isinstance(v, str):
            return [v]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()