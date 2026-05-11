from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ClienteBase(BaseModel):
    nombre: str
    documento: str
    telefono: str
    correo: EmailStr


class ClienteCreate(ClienteBase):
    pass


class ClienteRead(ClienteBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
