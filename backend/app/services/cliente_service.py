from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate


def create_cliente(db: Session, payload: ClienteCreate) -> Cliente:
    existing_documento = db.scalar(
        select(Cliente).where(Cliente.documento == payload.documento)
    )
    if existing_documento:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con ese documento.",
        )

    existing_correo = db.scalar(select(Cliente).where(Cliente.correo == payload.correo))
    if existing_correo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con ese correo.",
        )

    cliente = Cliente(**payload.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def list_clientes(db: Session) -> list[Cliente]:
    return list(db.scalars(select(Cliente).order_by(Cliente.id.desc())).all())


def get_cliente_or_404(db: Session, cliente_id: int) -> Cliente:
    cliente = db.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )
    return cliente
