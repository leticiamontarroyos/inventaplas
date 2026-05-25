from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, StockPosition, ProductionEntry, DispatchEntry, StockAdjustment, MovementLog
from app.schemas.schemas import (ProductionCreate, ProductionOut, DispatchCreate, DispatchOut,
                                  AdjustmentCreate, AdjustmentOut, StockPositionOut, MovementOut)

router = APIRouter()

def _get_or_create_position(db, product_id, warehouse_id) -> StockPosition:
    pos = db.query(StockPosition).filter(
        StockPosition.product_id == product_id,
        StockPosition.warehouse_id == warehouse_id
    ).first()
    if not pos:
        pos = StockPosition(product_id=product_id, warehouse_id=warehouse_id, quantity=0)
        db.add(pos)
        db.flush()
    return pos

def _log(db, product_id, warehouse_id, move_type, delta, qty_after, ref_id, ref_type, user_id, notes=None):
    entry = MovementLog(
        product_id=product_id, warehouse_id=warehouse_id,
        move_type=move_type, qty_delta=delta, qty_after=qty_after,
        reference_id=ref_id, reference_type=ref_type,
        performed_by_id=user_id, notes=notes
    )
    db.add(entry)

@router.get("/positions", response_model=List[StockPositionOut])
def get_stock(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(StockPosition)
              .options(joinedload(StockPosition.product), joinedload(StockPosition.warehouse))
              .filter(StockPosition.quantity > 0)
              .order_by(StockPosition.quantity.desc())
              .all())

@router.post("/production", response_model=ProductionOut)
def register_production(data: ProductionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantidade deve ser maior que zero")
    entry = ProductionEntry(**data.model_dump(), entered_by_id=current_user.id)
    db.add(entry)
    db.flush()
    pos = _get_or_create_position(db, data.product_id, data.warehouse_id)
    pos.quantity += data.quantity
    _log(db, data.product_id, data.warehouse_id, "entrada", data.quantity, pos.quantity,
         entry.id, "production", current_user.id, data.notes)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/production", response_model=List[ProductionOut])
def list_production(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(ProductionEntry)
              .options(joinedload(ProductionEntry.product), joinedload(ProductionEntry.warehouse))
              .order_by(ProductionEntry.production_date.desc())
              .limit(200).all())

@router.post("/dispatch", response_model=DispatchOut)
def register_dispatch(data: DispatchCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantidade deve ser maior que zero")
    pos = _get_or_create_position(db, data.product_id, data.warehouse_id)
    if pos.quantity < data.quantity:
        raise HTTPException(status_code=400, detail=f"Saldo insuficiente. Disponível: {pos.quantity}")
    entry = DispatchEntry(**data.model_dump(), dispatched_by_id=current_user.id)
    db.add(entry)
    db.flush()
    pos.quantity -= data.quantity
    _log(db, data.product_id, data.warehouse_id, "saida", -data.quantity, pos.quantity,
         entry.id, "dispatch", current_user.id, data.notes)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/dispatch", response_model=List[DispatchOut])
def list_dispatch(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(DispatchEntry)
              .options(joinedload(DispatchEntry.product), joinedload(DispatchEntry.warehouse))
              .order_by(DispatchEntry.dispatch_at.desc())
              .limit(200).all())

@router.post("/adjustment", response_model=AdjustmentOut)
def register_adjustment(data: AdjustmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.qty_counted < 0:
        raise HTTPException(status_code=400, detail="Quantidade contada não pode ser negativa")
    pos = _get_or_create_position(db, data.product_id, data.warehouse_id)
    before = pos.quantity
    diff = data.qty_counted - before
    adj = StockAdjustment(product_id=data.product_id, warehouse_id=data.warehouse_id,
                          qty_before=before, qty_counted=data.qty_counted,
                          qty_diff=diff, reason=data.reason, adjusted_by_id=current_user.id)
    db.add(adj)
    db.flush()
    pos.quantity = data.qty_counted
    _log(db, data.product_id, data.warehouse_id, "ajuste", diff, pos.quantity,
         adj.id, "adjustment", current_user.id, data.reason)
    db.commit()
    db.refresh(adj)
    return adj

@router.get("/movements", response_model=List[MovementOut])
def list_movements(limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(MovementLog)
              .options(joinedload(MovementLog.product), joinedload(MovementLog.warehouse))
              .order_by(MovementLog.created_at.desc())
              .limit(limit).all())