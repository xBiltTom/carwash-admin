from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cliente import Cliente
from app.models.vehiculo import Vehiculo
from app.schemas.vehiculo import VehiculoCreate


def create_vehiculo(db: Session, payload: VehiculoCreate) -> Vehiculo:
    cliente = db.get(Cliente, payload.cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    existing_placa = db.scalar(select(Vehiculo).where(Vehiculo.placa == payload.placa))
    if existing_placa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un vehiculo con esa placa.",
        )

    vehiculo = Vehiculo(**payload.model_dump())
    db.add(vehiculo)
    db.commit()
    db.refresh(vehiculo)
    return vehiculo


def list_vehiculos(db: Session) -> list[Vehiculo]:
    return list(db.scalars(select(Vehiculo).order_by(Vehiculo.id.desc())).all())


def get_vehiculo_or_404(db: Session, vehiculo_id: int) -> Vehiculo:
    vehiculo = db.get(Vehiculo, vehiculo_id)
    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehiculo no encontrado.",
        )
    return vehiculo
