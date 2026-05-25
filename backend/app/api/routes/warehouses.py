from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Warehouse
from app.schemas.schemas import WarehouseCreate, WarehouseOut

router = APIRouter()

@router.get("/", response_model=List[WarehouseOut])
def list_warehouses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Warehouse).filter(Warehouse.active == True).all()

@router.post("/", response_model=WarehouseOut)
def create_warehouse(data: WarehouseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if db.query(Warehouse).filter(Warehouse.code == data.code).first():
        raise HTTPException(status_code=400, detail="Código já cadastrado")
    wh = Warehouse(**data.model_dump())
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh