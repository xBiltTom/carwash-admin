from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ServicioBase(BaseModel):
    nombre: str
    descripcion: str
    precio: Decimal
    duracion_minutos: int
    activo: bool = True


class ServicioCreate(ServicioBase):
    pass


class ServicioUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    precio: Decimal | None = None
    duracion_minutos: int | None = None
    activo: bool | None = None


class ServicioRead(ServicioBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
