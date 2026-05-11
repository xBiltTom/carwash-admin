from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Servicio(Base):
    __tablename__ = "servicios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    precio: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    duracion_minutos: Mapped[int] = mapped_column(nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    citas: Mapped[list["Cita"]] = relationship(back_populates="servicio")


if TYPE_CHECKING:
    from app.models.cita import Cita
