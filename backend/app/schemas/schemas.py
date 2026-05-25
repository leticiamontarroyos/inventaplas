from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    user_role: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "operador"

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    active: bool
    class Config:
        from_attributes = True

class WarehouseCreate(BaseModel):
    name: str
    code: str

class WarehouseOut(BaseModel):
    id: str
    name: str
    code: str
    active: bool
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    sku: str
    name: str
    line: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    base: Optional[str] = None
    finish: Optional[str] = None

class ProductOut(BaseModel):
    id: str
    sku: str
    name: str
    line: Optional[str]
    model: Optional[str]
    color: Optional[str]
    base: Optional[str]
    finish: Optional[str]
    active: bool
    class Config:
        from_attributes = True

class StockPositionOut(BaseModel):
    id: str
    product_id: str
    warehouse_id: str
    quantity: int
    min_alert: int
    product: ProductOut
    warehouse: WarehouseOut
    updated_at: Optional[datetime]
    class Config:
        from_attributes = True

class ProductionCreate(BaseModel):
    product_id: str
    warehouse_id: str
    quantity: int
    lot: Optional[str] = None
    shift: Optional[str] = None
    machine: Optional[str] = None
    operator_name: Optional[str] = None
    notes: Optional[str] = None

class ProductionOut(BaseModel):
    id: str
    product_id: str
    warehouse_id: str
    quantity: int
    lot: Optional[str]
    shift: Optional[str]
    machine: Optional[str]
    operator_name: Optional[str]
    notes: Optional[str]
    production_date: Optional[datetime]
    product: ProductOut
    warehouse: WarehouseOut
    class Config:
        from_attributes = True

class DispatchCreate(BaseModel):
    product_id: str
    warehouse_id: str
    quantity: int
    order_number: Optional[str] = None
    client: Optional[str] = None
    truck_plate: Optional[str] = None
    notes: Optional[str] = None

class DispatchOut(BaseModel):
    id: str
    product_id: str
    warehouse_id: str
    quantity: int
    order_number: Optional[str]
    client: Optional[str]
    truck_plate: Optional[str]
    dispatch_at: Optional[datetime]
    product: ProductOut
    warehouse: WarehouseOut
    class Config:
        from_attributes = True

class AdjustmentCreate(BaseModel):
    product_id: str
    warehouse_id: str
    qty_counted: int
    reason: Optional[str] = None

class AdjustmentOut(BaseModel):
    id: str
    product_id: str
    warehouse_id: str
    qty_before: int
    qty_counted: int
    qty_diff: int
    reason: Optional[str]
    adjusted_at: Optional[datetime]
    product: ProductOut
    warehouse: WarehouseOut
    class Config:
        from_attributes = True

class MovementOut(BaseModel):
    id: int
    move_type: str
    qty_delta: int
    qty_after: int
    reference_type: Optional[str]
    notes: Optional[str]
    created_at: Optional[datetime]
    product: ProductOut
    warehouse: WarehouseOut
    class Config:
        from_attributes = True