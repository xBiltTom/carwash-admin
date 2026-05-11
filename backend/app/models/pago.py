import enum
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MetodoPago(str, enum.Enum):
    EFECTIVO = "EFECTIVO"
    YAPE = "YAPE"
    PLIN = "PLIN"
    TARJETA = "TARJETA"


class EstadoPago(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    PAGADO = "PAGADO"


class Pago(Base):
    __tablename__ = "pagos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cita_id: Mapped[int] = mapped_column(ForeignKey("citas.id"), nullable=False)
    monto: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    metodo_pago: Mapped[MetodoPago] = mapped_column(
        Enum(MetodoPago, name="metodo_pago"), nullable=False
    )
    estado_pago: Mapped[EstadoPago] = mapped_column(
        Enum(EstadoPago, name="estado_pago"),
        default=EstadoPago.PENDIENTE,
        nullable=False,
    )
    codigo_operacion: Mapped[str | None] = mapped_column(String(60))
    fecha_pago: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    cita: Mapped["Cita"] = relationship(back_populates="pagos")


if TYPE_CHECKING:
    from app.models.cita import Cita
