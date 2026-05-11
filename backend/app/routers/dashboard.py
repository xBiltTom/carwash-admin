from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.dashboard import DashboardResumen
from app.services.dashboard_service import get_dashboard_resumen


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/resumen", response_model=DashboardResumen)
def get_dashboard_resumen_endpoint(db: Session = Depends(get_db)) -> DashboardResumen:
    return get_dashboard_resumen(db)
