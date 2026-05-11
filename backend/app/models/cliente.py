from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    documento: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)
    correo: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    vehiculos: Mapped[list["Vehiculo"]] = relationship(
        back_populates="cliente", cascade="all, delete-orphan"
    )
    citas: Mapped[list["Cita"]] = relationship(back_populates="cliente")


if TYPE_CHECKING:
    from app.models.cita import Cita
    from app.models.vehiculo import Vehiculo
