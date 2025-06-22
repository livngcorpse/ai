# backend/app/api/user.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.utils.deps import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_update.username is not None:
        current_user.username = user_update.username
    if user_update.preferred_theme is not None:
        current_user.preferred_theme = user_update.preferred_theme
    if user_update.preferred_model is not None:
        current_user.preferred_model = user_update.preferred_model
    
    await db.commit()
    await db.refresh(current_user)
    
    return UserResponse.from_orm(current_user)