from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Vehiculo(Base):
    __tablename__ = "vehiculos"
    __table_args__ = (UniqueConstraint("placa", name="uq_vehiculos_placa"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), nullable=False)
    placa: Mapped[str] = mapped_column(String(15), nullable=False)
    marca: Mapped[str] = mapped_column(String(60), nullable=False)
    modelo: Mapped[str] = mapped_column(String(60), nullable=False)
    color: Mapped[str] = mapped_column(String(40), nullable=False)
    tipo: Mapped[str] = mapped_column(String(40), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    cliente: Mapped["Cliente"] = relationship(back_populates="vehiculos")
    citas: Mapped[list["Cita"]] = relationship(back_populates="vehiculo")


if TYPE_CHECKING:
    from app.models.cita import Cita
    from app.models.cliente import Cliente
