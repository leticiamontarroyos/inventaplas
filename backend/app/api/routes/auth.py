from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import verify_password, create_token, hash_password, get_current_user
from app.models.models import User
from app.schemas.schemas import LoginRequest, TokenResponse, UserCreate, UserOut

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.active == True).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    token = create_token({"sub": user.id})
    return TokenResponse(access_token=token, user_name=user.name, user_role=user.role)

@router.post("/users", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas admin pode criar usuários")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    user = User(name=data.name, email=data.email, hashed_password=hash_password(data.password), role=data.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/users/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user