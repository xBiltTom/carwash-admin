from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.servicio import ServicioCreate, ServicioRead, ServicioUpdate
from app.services.servicio_service import create_servicio, list_servicios, update_servicio


router = APIRouter(prefix="/servicios", tags=["servicios"])


@router.get("", response_model=list[ServicioRead])
def list_servicios_endpoint(db: Session = Depends(get_db)) -> list[ServicioRead]:
    return list_servicios(db)


@router.post("", response_model=ServicioRead, status_code=status.HTTP_201_CREATED)
def create_servicio_endpoint(
    payload: ServicioCreate,
    db: Session = Depends(get_db),
) -> ServicioRead:
    return create_servicio(db, payload)


@router.patch("/{servicio_id}", response_model=ServicioRead)
def update_servicio_endpoint(
    servicio_id: int,
    payload: ServicioUpdate,
    db: Session = Depends(get_db),
) -> ServicioRead:
    return update_servicio(db, servicio_id, payload)
