from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.vehiculo import VehiculoCreate, VehiculoRead
from app.services.vehiculo_service import create_vehiculo, get_vehiculo_or_404, list_vehiculos


router = APIRouter(prefix="/vehiculos", tags=["vehiculos"])


@router.post("", response_model=VehiculoRead, status_code=status.HTTP_201_CREATED)
def create_vehiculo_endpoint(
    payload: VehiculoCreate,
    db: Session = Depends(get_db),
) -> VehiculoRead:
    return create_vehiculo(db, payload)


@router.get("", response_model=list[VehiculoRead])
def list_vehiculos_endpoint(db: Session = Depends(get_db)) -> list[VehiculoRead]:
    return list_vehiculos(db)


@router.get("/{vehiculo_id}", response_model=VehiculoRead)
def get_vehiculo_endpoint(vehiculo_id: int, db: Session = Depends(get_db)) -> VehiculoRead:
    return get_vehiculo_or_404(db, vehiculo_id)
