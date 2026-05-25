from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Product
from app.schemas.schemas import ProductCreate, ProductOut

router = APIRouter()

@router.get("/", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Product).filter(Product.active == True).order_by(Product.name).all()

@router.post("/", response_model=ProductOut)
def create_product(data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if db.query(Product).filter(Product.sku == data.sku).first():
        raise HTTPException(status_code=400, detail="SKU já cadastrado")
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: str, data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for key, value in data.model_dump().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    product.active = False
    db.commit()
    return {"ok": True}