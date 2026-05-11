from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pago import PagoCreate, PagoRead
from app.services.pago_service import create_pago, get_pago_or_404, list_pagos


router = APIRouter(prefix="/pagos", tags=["pagos"])


@router.post("", response_model=PagoRead, status_code=status.HTTP_201_CREATED)
def create_pago_endpoint(payload: PagoCreate, db: Session = Depends(get_db)) -> PagoRead:
    return create_pago(db, payload)


@router.get("", response_model=list[PagoRead])
def list_pagos_endpoint(db: Session = Depends(get_db)) -> list[PagoRead]:
    return list_pagos(db)


@router.get("/{pago_id}", response_model=PagoRead)
def get_pago_endpoint(pago_id: int, db: Session = Depends(get_db)) -> PagoRead:
    return get_pago_or_404(db, pago_id)
