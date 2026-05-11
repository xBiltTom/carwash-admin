from decimal import Decimal

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.servicio import Servicio


SERVICIOS_INICIALES = [
    {
        "nombre": "Lavado básico",
        "descripcion": "Lavado exterior y secado general.",
        "precio": Decimal("15.00"),
        "duracion_minutos": 30,
    },
    {
        "nombre": "Lavado completo",
        "descripcion": "Lavado exterior, interior y aspirado.",
        "precio": Decimal("25.00"),
        "duracion_minutos": 50,
    },
    {
        "nombre": "Encerado",
        "descripcion": "Aplicacion de cera protectora para brillo.",
        "precio": Decimal("35.00"),
        "duracion_minutos": 60,
    },
    {
        "nombre": "Lavado premium",
        "descripcion": "Servicio integral con acabados premium.",
        "precio": Decimal("45.00"),
        "duracion_minutos": 75,
    },
    {
        "nombre": "Lavado de motor",
        "descripcion": "Limpieza cuidadosa del compartimiento del motor.",
        "precio": Decimal("30.00"),
        "duracion_minutos": 40,
    },
]


def seed_servicios() -> int:
    inserted = 0

    with SessionLocal() as db:
        for servicio_data in SERVICIOS_INICIALES:
            existing = db.scalar(
                select(Servicio).where(Servicio.nombre == servicio_data["nombre"])
            )
            if existing:
                continue

            db.add(Servicio(**servicio_data))
            inserted += 1

        db.commit()

    return inserted


if __name__ == "__main__":
    inserted = seed_servicios()
    print(f"Servicios insertados: {inserted}")
