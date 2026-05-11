from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.cliente import ClienteCreate, ClienteRead
from app.services.cliente_service import create_cliente, get_cliente_or_404, list_clientes


router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("", response_model=ClienteRead, status_code=status.HTTP_201_CREATED)
def create_cliente_endpoint(
    payload: ClienteCreate,
    db: Session = Depends(get_db),
) -> ClienteRead:
    return create_cliente(db, payload)


@router.get("", response_model=list[ClienteRead])
def list_clientes_endpoint(db: Session = Depends(get_db)) -> list[ClienteRead]:
    return list_clientes(db)


@router.get("/{cliente_id}", response_model=ClienteRead)
def get_cliente_endpoint(cliente_id: int, db: Session = Depends(get_db)) -> ClienteRead:
    return get_cliente_or_404(db, cliente_id)
