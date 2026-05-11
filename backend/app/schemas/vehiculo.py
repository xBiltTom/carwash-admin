from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VehiculoBase(BaseModel):
    cliente_id: int
    placa: str
    marca: str
    modelo: str
    color: str
    tipo: str


class VehiculoCreate(VehiculoBase):
    pass


class VehiculoRead(VehiculoBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
