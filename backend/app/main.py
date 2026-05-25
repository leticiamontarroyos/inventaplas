from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api.routes import auth, products, warehouses, stock

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InventaPlas API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(warehouses.router, prefix="/api/warehouses", tags=["warehouses"])
app.include_router(stock.router, prefix="/api/stock", tags=["stock"])

@app.get("/")
def root():
    return {"status": "ok", "sistema": "InventaPlas"}