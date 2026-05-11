from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cita import Cita
from app.models.pago import EstadoPago, Pago
from app.schemas.pago import PagoCreate


def create_pago(db: Session, payload: PagoCreate) -> Pago:
    cita = db.get(Cita, payload.cita_id)
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada.",
        )

    pago_data = payload.model_dump()
    pago_data["fecha_pago"] = (
        datetime.now(timezone.utc)
        if payload.estado_pago == EstadoPago.PAGADO
        else None
    )

    pago = Pago(**pago_data)
    db.add(pago)
    db.commit()
    db.refresh(pago)
    return pago


def list_pagos(db: Session) -> list[Pago]:
    return list(db.scalars(select(Pago).order_by(Pago.id.desc())).all())


def get_pago_or_404(db: Session, pago_id: int) -> Pago:
    pago = db.get(Pago, pago_id)
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado.",
        )
    return pago
