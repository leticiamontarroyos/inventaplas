from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum

def gen_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    admin = "admin"
    diretor = "diretor"
    operador = "operador"

class ShiftEnum(str, enum.Enum):
    manha = "manha"
    noite = "noite"

class MoveType(str, enum.Enum):
    entrada = "entrada"
    saida = "saida"
    ajuste = "ajuste"
    abertura = "abertura"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.operador)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=gen_uuid)
    sku = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    line = Column(String(100))
    model = Column(String(100))
    color = Column(String(100))
    base = Column(String(100))
    finish = Column(String(100))
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StockPosition(Base):
    __tablename__ = "stock_positions"
    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    min_alert = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    product = relationship("Product")
    warehouse = relationship("Warehouse")

class ProductionEntry(Base):
    __tablename__ = "production_entries"
    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    lot = Column(String(50))
    shift = Column(Enum(ShiftEnum))
    machine = Column(String(50))
    operator_name = Column(String(100))
    entered_by_id = Column(String, ForeignKey("users.id"))
    production_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    product = relationship("Product")
    warehouse = relationship("Warehouse")
    entered_by = relationship("User")

class DispatchEntry(Base):
    __tablename__ = "dispatch_entries"
    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    order_number = Column(String(50))
    client = Column(String(150))
    truck_plate = Column(String(20))
    dispatched_by_id = Column(String, ForeignKey("users.id"))
    dispatch_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    product = relationship("Product")
    warehouse = relationship("Warehouse")
    dispatched_by = relationship("User")

class StockAdjustment(Base):
    __tablename__ = "stock_adjustments"
    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    qty_before = Column(Integer, nullable=False)
    qty_counted = Column(Integer, nullable=False)
    qty_diff = Column(Integer, nullable=False)
    reason = Column(Text)
    adjusted_by_id = Column(String, ForeignKey("users.id"))
    adjusted_at = Column(DateTime(timezone=True), server_default=func.now())
    product = relationship("Product")
    warehouse = relationship("Warehouse")
    adjusted_by = relationship("User")

class MovementLog(Base):
    __tablename__ = "movement_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    move_type = Column(Enum(MoveType), nullable=False)
    qty_delta = Column(Integer, nullable=False)
    qty_after = Column(Integer, nullable=False)
    reference_id = Column(String)
    reference_type = Column(String(50))
    performed_by_id = Column(String, ForeignKey("users.id"))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    product = relationship("Product")
    warehouse = relationship("Warehouse")
    performed_by = relationship("User")