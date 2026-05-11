from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.servicio import Servicio
from app.schemas.servicio import ServicioCreate, ServicioUpdate


def create_servicio(db: Session, payload: ServicioCreate) -> Servicio:
    existing = db.scalar(select(Servicio).where(Servicio.nombre == payload.nombre))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un servicio con ese nombre.",
        )

    servicio = Servicio(**payload.model_dump())
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio


def list_servicios(db: Session) -> list[Servicio]:
    return list(db.scalars(select(Servicio).order_by(Servicio.id.desc())).all())


def get_servicio_or_404(db: Session, servicio_id: int) -> Servicio:
    servicio = db.get(Servicio, servicio_id)
    if not servicio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Servicio no encontrado.",
        )
    return servicio


def update_servicio(db: Session, servicio_id: int, payload: ServicioUpdate) -> Servicio:
    servicio = get_servicio_or_404(db, servicio_id)
    updates = payload.model_dump(exclude_unset=True)

    if "nombre" in updates:
        existing = db.scalar(
            select(Servicio).where(
                Servicio.nombre == updates["nombre"],
                Servicio.id != servicio_id,
            )
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un servicio con ese nombre.",
            )

    for field, value in updates.items():
        setattr(servicio, field, value)

    db.commit()
    db.refresh(servicio)
    return servicio
