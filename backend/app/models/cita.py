import enum
from datetime import date, datetime, time
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class EstadoCita(str, enum.Enum):
    RESERVADA = "RESERVADA"
    EN_ATENCION = "EN_ATENCION"
    FINALIZADA = "FINALIZADA"
    CANCELADA = "CANCELADA"


class Cita(Base):
    __tablename__ = "citas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), nullable=False)
    vehiculo_id: Mapped[int] = mapped_column(ForeignKey("vehiculos.id"), nullable=False)
    servicio_id: Mapped[int] = mapped_column(ForeignKey("servicios.id"), nullable=False)
    fecha_cita: Mapped[date] = mapped_column(Date, nullable=False)
    hora_cita: Mapped[time] = mapped_column(Time, nullable=False)
    estado: Mapped[EstadoCita] = mapped_column(
        Enum(EstadoCita, name="estado_cita"),
        default=EstadoCita.RESERVADA,
        nullable=False,
    )
    observaciones: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    cliente: Mapped["Cliente"] = relationship(back_populates="citas")
    vehiculo: Mapped["Vehiculo"] = relationship(back_populates="citas")
    servicio: Mapped["Servicio"] = relationship(back_populates="citas")
    pagos: Mapped[list["Pago"]] = relationship(back_populates="cita")


if TYPE_CHECKING:
    from app.models.cliente import Cliente
    from app.models.pago import Pago
    from app.models.servicio import Servicio
    from app.models.vehiculo import Vehiculo
