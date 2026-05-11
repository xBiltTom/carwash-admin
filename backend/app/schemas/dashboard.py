from decimal import Decimal

from pydantic import BaseModel


class DashboardServicioItem(BaseModel):
    servicio: str
    total: int


class DashboardMetodoPagoItem(BaseModel):
    metodo_pago: str
    total: int


class DashboardResumen(BaseModel):
    total_citas: int
    citas_reservadas: int
    citas_en_atencion: int
    citas_finalizadas: int
    citas_canceladas: int
    ingresos_totales: Decimal
    ingresos_hoy: Decimal
    servicios_mas_solicitados: list[DashboardServicioItem]
    metodos_pago_usados: list[DashboardMetodoPagoItem]
