from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.reportes_service import (
    build_pdf_response,
    get_management_report_pdf,
    get_operational_report_pdf,
)


router = APIRouter(prefix="/reportes", tags=["reportes"])


@router.get("/operacional/pdf")
def get_operational_report_endpoint(db: Session = Depends(get_db)) -> StreamingResponse:
    stream, filename = build_pdf_response(
        get_operational_report_pdf(db),
        "reporte_operacional.pdf",
    )
    return StreamingResponse(
        stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/gestion/pdf")
def get_management_report_endpoint(db: Session = Depends(get_db)) -> StreamingResponse:
    stream, filename = build_pdf_response(
        get_management_report_pdf(db),
        "reporte_gestion.pdf",
    )
    return StreamingResponse(
        stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
