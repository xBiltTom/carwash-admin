from datetime import date, datetime
from io import BytesIO

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.cita import Cita, EstadoCita
from app.models.pago import EstadoPago, Pago
from app.models.servicio import Servicio
from app.utils.pdf import build_simple_pdf


def get_operational_report_pdf(db: Session) -> bytes:
    today = date.today()
    citas = list(
        db.scalars(
            select(Cita)
            .options(
                joinedload(Cita.cliente),
                joinedload(Cita.vehiculo),
                joinedload(Cita.servicio),
                joinedload(Cita.pagos),
            )
            .where(Cita.fecha_cita == today)
            .order_by(Cita.hora_cita.asc(), Cita.id.asc())
        ).unique().all()
    )

    rows = [
        [
            "Fecha",
            "Hora",
            "Cliente",
            "Placa",
            "Servicio",
            "Estado",
            "Pago",
        ]
    ]

    for cita in citas:
        pago = next((item for item in cita.pagos if item.estado_pago == EstadoPago.PAGADO), None)
        rows.append(
            [
                cita.fecha_cita.strftime("%Y-%m-%d"),
                cita.hora_cita.strftime("%H:%M"),
                cita.cliente.nombre,
                cita.vehiculo.placa,
                cita.servicio.nombre,
                cita.estado.value,
                f"S/ {pago.monto}" if pago else "-",
            ]
        )

    if len(rows) == 1:
        rows.append([today.strftime("%Y-%m-%d"), "-", "Sin citas", "-", "-", "-", "-"])

    return build_simple_pdf(
        title="Reporte Operacional",
        subtitle=f"Citas del dia {today.strftime('%Y-%m-%d')}",
        rows=rows,
    )


def get_management_report_pdf(db: Session) -> bytes:
    total_citas = db.scalar(select(func.count(Cita.id))) or 0
    total_ingresos = db.scalar(
        select(func.coalesce(func.sum(Pago.monto), 0)).where(Pago.estado_pago == EstadoPago.PAGADO)
    ) or 0

    citas_por_estado = db.execute(
        select(Cita.estado, func.count(Cita.id)).group_by(Cita.estado).order_by(Cita.estado.asc())
    ).all()
    servicios_mas_solicitados = db.execute(
        select(Servicio.nombre, func.count(Cita.id))
        .join(Cita, Cita.servicio_id == Servicio.id)
        .group_by(Servicio.id, Servicio.nombre)
        .order_by(func.count(Cita.id).desc(), Servicio.nombre.asc())
        .limit(5)
    ).all()
    metodos_pago = db.execute(
        select(Pago.metodo_pago, func.count(Pago.id))
        .group_by(Pago.metodo_pago)
        .order_by(func.count(Pago.id).desc(), Pago.metodo_pago.asc())
    ).all()

    rows = [
        ["Indicador", "Valor"],
        ["Total de citas", str(total_citas)],
        ["Total de ingresos pagados", f"S/ {total_ingresos}"],
        ["", ""],
        ["Citas por estado", ""],
    ]
    rows.extend([[estado.value, str(total)] for estado, total in citas_por_estado])
    rows.append(["", ""])
    rows.append(["Servicios mas solicitados", ""])
    rows.extend([[nombre, str(total)] for nombre, total in servicios_mas_solicitados] or [["Sin datos", "0"]])
    rows.append(["", ""])
    rows.append(["Metodos de pago utilizados", ""])
    rows.extend([[metodo.value, str(total)] for metodo, total in metodos_pago] or [["Sin datos", "0"]])

    return build_simple_pdf(
        title="Reporte de Gestion",
        subtitle="Resumen general del negocio",
        rows=rows,
    )


def get_pago_voucher_pdf(db: Session, pago_id: int) -> bytes:
    pago = db.scalar(
        select(Pago)
        .options(
            joinedload(Pago.cita).joinedload(Cita.cliente),
            joinedload(Pago.cita).joinedload(Cita.vehiculo),
            joinedload(Pago.cita).joinedload(Cita.servicio),
        )
        .where(Pago.id == pago_id)
    )
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado.",
        )

    cita = pago.cita
    fecha_emision = datetime.now().strftime("%Y-%m-%d %H:%M")
    rows = [
        ["Numero de pago", str(pago.id)],
        ["Fecha de emision", fecha_emision],
        ["Cliente", cita.cliente.nombre],
        ["Documento", cita.cliente.documento],
        ["Vehiculo", f"{cita.vehiculo.marca} {cita.vehiculo.modelo}"],
        ["Placa", cita.vehiculo.placa],
        ["Servicio", cita.servicio.nombre],
        ["Fecha y hora de cita", f"{cita.fecha_cita} {cita.hora_cita.strftime('%H:%M')}"],
        ["Monto", f"S/ {pago.monto}"],
        ["Metodo de pago", pago.metodo_pago.value],
        ["Estado de pago", pago.estado_pago.value],
        ["Codigo de operacion", pago.codigo_operacion or "-"],
    ]

    return build_simple_pdf(
        title="VOUCHER / RECIBO DE PAGO",
        subtitle="Comprobante de pago generado por CarWash Admin",
        rows=rows,
    )


def build_pdf_response(content: bytes, filename: str) -> tuple[BytesIO, str]:
    return BytesIO(content), filename
