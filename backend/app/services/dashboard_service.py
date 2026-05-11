from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cita import Cita, EstadoCita
from app.models.pago import EstadoPago, Pago
from app.models.servicio import Servicio
from app.schemas.dashboard import (
    DashboardMetodoPagoItem,
    DashboardResumen,
    DashboardServicioItem,
)


def get_dashboard_resumen(db: Session) -> DashboardResumen:
    total_citas = db.scalar(select(func.count(Cita.id))) or 0

    citas_por_estado = {
        estado: total
        for estado, total in db.execute(
            select(Cita.estado, func.count(Cita.id)).group_by(Cita.estado)
        ).all()
    }

    ingresos_totales = db.scalar(
        select(func.coalesce(func.sum(Pago.monto), 0)).where(
            Pago.estado_pago == EstadoPago.PAGADO
        )
    ) or Decimal("0")

    today = date.today()
    ingresos_hoy = db.scalar(
        select(func.coalesce(func.sum(Pago.monto), 0))
        .join(Cita, Cita.id == Pago.cita_id)
        .where(
            Pago.estado_pago == EstadoPago.PAGADO,
            Cita.fecha_cita == today,
        )
    ) or Decimal("0")

    servicios_mas_solicitados_rows = db.execute(
        select(Servicio.nombre, func.count(Cita.id).label("total"))
        .join(Cita, Cita.servicio_id == Servicio.id)
        .group_by(Servicio.id, Servicio.nombre)
        .order_by(func.count(Cita.id).desc(), Servicio.nombre.asc())
        .limit(5)
    ).all()

    metodos_pago_rows = db.execute(
        select(Pago.metodo_pago, func.count(Pago.id).label("total"))
        .group_by(Pago.metodo_pago)
        .order_by(func.count(Pago.id).desc(), Pago.metodo_pago.asc())
    ).all()

    return DashboardResumen(
        total_citas=total_citas,
        citas_reservadas=citas_por_estado.get(EstadoCita.RESERVADA, 0),
        citas_en_atencion=citas_por_estado.get(EstadoCita.EN_ATENCION, 0),
        citas_finalizadas=citas_por_estado.get(EstadoCita.FINALIZADA, 0),
        citas_canceladas=citas_por_estado.get(EstadoCita.CANCELADA, 0),
        ingresos_totales=ingresos_totales,
        ingresos_hoy=ingresos_hoy,
        servicios_mas_solicitados=[
            DashboardServicioItem(servicio=nombre, total=total)
            for nombre, total in servicios_mas_solicitados_rows
        ],
        metodos_pago_usados=[
            DashboardMetodoPagoItem(metodo_pago=metodo_pago.value, total=total)
            for metodo_pago, total in metodos_pago_rows
        ],
    )
