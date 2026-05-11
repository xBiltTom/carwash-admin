from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.pago import EstadoPago, MetodoPago


class PagoBase(BaseModel):
    cita_id: int
    monto: Decimal
    metodo_pago: MetodoPago
    estado_pago: EstadoPago
    codigo_operacion: str | None = None


class PagoCreate(PagoBase):
    pass


class PagoRead(PagoBase):
    id: int
    fecha_pago: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
