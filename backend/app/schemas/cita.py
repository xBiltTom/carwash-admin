from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict

from app.models.cita import EstadoCita


class CitaBase(BaseModel):
    cliente_id: int
    vehiculo_id: int
    servicio_id: int
    fecha_cita: date
    hora_cita: time
    observaciones: str | None = None


class CitaCreate(CitaBase):
    pass


class CitaEstadoUpdate(BaseModel):
    estado: EstadoCita


class CitaRead(CitaBase):
    id: int
    estado: EstadoCita
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
