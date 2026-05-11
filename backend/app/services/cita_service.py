from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cita import Cita, EstadoCita
from app.models.cliente import Cliente
from app.models.servicio import Servicio
from app.models.vehiculo import Vehiculo
from app.schemas.cita import CitaCreate


ESTADOS_ACTIVOS_CITA = [EstadoCita.RESERVADA, EstadoCita.EN_ATENCION]


def create_cita(db: Session, payload: CitaCreate) -> Cita:
    cliente = db.get(Cliente, payload.cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    vehiculo = db.get(Vehiculo, payload.vehiculo_id)
    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehiculo no encontrado.",
        )

    servicio = db.get(Servicio, payload.servicio_id)
    if not servicio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Servicio no encontrado.",
        )

    if vehiculo.cliente_id != payload.cliente_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El vehiculo no pertenece al cliente seleccionado.",
        )

    active_count = db.scalar(
        select(func.count(Cita.id)).where(
            Cita.fecha_cita == payload.fecha_cita,
            Cita.hora_cita == payload.hora_cita,
            Cita.estado.in_(ESTADOS_ACTIVOS_CITA),
        )
    )
    if active_count >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay cupos disponibles para esa fecha y hora.",
        )

    cita = Cita(**payload.model_dump(), estado=EstadoCita.RESERVADA)
    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita


def list_citas(db: Session) -> list[Cita]:
    return list(db.scalars(select(Cita).order_by(Cita.id.desc())).all())


def get_cita_or_404(db: Session, cita_id: int) -> Cita:
    cita = db.get(Cita, cita_id)
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada.",
        )
    return cita


def update_cita_estado(db: Session, cita_id: int, estado: EstadoCita) -> Cita:
    cita = get_cita_or_404(db, cita_id)

    if estado in ESTADOS_ACTIVOS_CITA and cita.estado not in ESTADOS_ACTIVOS_CITA:
        active_count = db.scalar(
            select(func.count(Cita.id)).where(
                Cita.fecha_cita == cita.fecha_cita,
                Cita.hora_cita == cita.hora_cita,
                Cita.estado.in_(ESTADOS_ACTIVOS_CITA),
                Cita.id != cita.id,
            )
        )
        if active_count >= 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay cupos disponibles para reactivar la cita en ese horario.",
            )

    cita.estado = estado
    db.commit()
    db.refresh(cita)
    return cita
