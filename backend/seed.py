import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.auth import hash_password
from app.models.models import User, Warehouse, Product

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(User).filter(User.email == "admin@inventaplas.com").first():
    db.add(User(name="Administrador", email="admin@inventaplas.com",
                hashed_password=hash_password("admin123"), role="admin"))
    db.add(User(name="Marcos", email="marcos@inventaplas.com",
                hashed_password=hash_password("marcos123"), role="diretor"))
    db.add(User(name="Leticia", email="leticia@inventaplas.com",
                hashed_password=hash_password("let123"), role="operador"))
    print("Usuarios criados")

if not db.query(Warehouse).first():
    for name, code in [("Galpao A", "GA"), ("Galpao B", "GB"), ("Galpao C", "GC")]:
        db.add(Warehouse(name=name, code=code))
    print("Galpoes criados")

if not db.query(Product).first():
    produtos = [
        ("CAD-MIA-VM", "Cadeira Miami Vermelha", "Cadeiras", "Miami", "Vermelho", "Com braco"),
        ("CAD-MIA-BR", "Cadeira Miami Branca", "Cadeiras", "Miami", "Branco", "Com braco"),
        ("CAD-MIA-AZ", "Cadeira Miami Azul", "Cadeiras", "Miami", "Azul", "Sem braco"),
        ("MES-ARG-BG", "Mesa Argo Bege", "Mesas", "Argo", "Bege", None),
        ("MES-ARG-PR", "Mesa Argo Preta", "Mesas", "Argo", "Preto", None),
        ("BAN-SLM-AZ", "Banqueta Slim Azul", "Banquetas", "Slim", "Azul", None),
    ]
    for sku, name, line, model, color, base in produtos:
        db.add(Product(sku=sku, name=name, line=line, model=model, color=color, base=base))
    print("Produtos criados")

db.commit()
db.close()
print("Dados iniciais inseridos com sucesso!")
print("Login: admin@inventaplas.com / admin123")