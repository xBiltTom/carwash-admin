from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pago import PagoCreate, PagoRead
from app.services.pago_service import create_pago, get_pago_or_404, list_pagos
from app.services.reportes_service import build_pdf_response, get_pago_voucher_pdf


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


@router.get("/{pago_id}/voucher/pdf")
def get_pago_voucher_endpoint(pago_id: int, db: Session = Depends(get_db)) -> StreamingResponse:
    stream, filename = build_pdf_response(
        get_pago_voucher_pdf(db, pago_id),
        f"voucher_pago_{pago_id}.pdf",
    )
    return StreamingResponse(
        stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
