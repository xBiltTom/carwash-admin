from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.cita import CitaCreate, CitaEstadoUpdate, CitaRead
from app.services.cita_service import create_cita, get_cita_or_404, list_citas, update_cita_estado


router = APIRouter(prefix="/citas", tags=["citas"])


@router.post("", response_model=CitaRead, status_code=status.HTTP_201_CREATED)
def create_cita_endpoint(payload: CitaCreate, db: Session = Depends(get_db)) -> CitaRead:
    return create_cita(db, payload)


@router.get("", response_model=list[CitaRead])
def list_citas_endpoint(db: Session = Depends(get_db)) -> list[CitaRead]:
    return list_citas(db)


@router.get("/{cita_id}", response_model=CitaRead)
def get_cita_endpoint(cita_id: int, db: Session = Depends(get_db)) -> CitaRead:
    return get_cita_or_404(db, cita_id)


@router.patch("/{cita_id}/estado", response_model=CitaRead)
def update_cita_estado_endpoint(
    cita_id: int,
    payload: CitaEstadoUpdate,
    db: Session = Depends(get_db),
) -> CitaRead:
    return update_cita_estado(db, cita_id, payload.estado)
