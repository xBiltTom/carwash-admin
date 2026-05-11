Estoy desarrollando un sistema llamado CarWash Admin para un examen de laboratorio. Necesito que implementes la base del backend con FastAPI, PostgreSQL, SQLAlchemy 2.0 y Alembic.

Crea la estructura dentro de la carpeta backend/ con:

- app/main.py
- app/core/config.py
- app/db/session.py
- app/db/base.py
- app/db/seed.py
- app/models/
- app/schemas/
- app/routers/
- app/services/
- app/utils/
- alembic/
- alembic.ini
- requirements.txt
- .env.example
- README.md

Usa PostgreSQL como base de datos.

Modelos necesarios:

1. Cliente:
- id
- nombre
- documento
- telefono
- correo
- created_at

2. Vehiculo:
- id
- cliente_id
- placa
- marca
- modelo
- color
- tipo
- created_at

3. Servicio:
- id
- nombre
- descripcion
- precio
- duracion_minutos
- activo
- created_at

4. Cita:
- id
- cliente_id
- vehiculo_id
- servicio_id
- fecha_cita
- hora_cita
- estado
- observaciones
- created_at

Estados de cita:
- RESERVADA
- EN_ATENCION
- FINALIZADA
- CANCELADA

5. Pago:
- id
- cita_id
- monto
- metodo_pago
- estado_pago
- codigo_operacion
- fecha_pago
- created_at

Métodos de pago:
- EFECTIVO
- YAPE
- PLIN
- TARJETA

Estados de pago:
- PENDIENTE
- PAGADO

Requisitos:
- Configurar conexión con PostgreSQL usando DATABASE_URL desde .env.
- Configurar SQLAlchemy 2.0.
- Configurar Alembic para autogenerar migraciones desde los modelos.
- Crear relaciones entre modelos.
- Crear archivo seed.py para insertar servicios iniciales si no existen:
  - Lavado básico
  - Lavado completo
  - Encerado
  - Lavado premium
  - Lavado de motor
- No implementar autenticación.
- No usar Docker.
- Dejar instrucciones en README.md para:
  1. Crear entorno virtual.
  2. Instalar requirements.
  3. Configurar .env.
  4. Ejecutar migraciones con Alembic.
  5. Ejecutar seed.
  6. Levantar FastAPI.

El backend debe poder levantarse con:
uvicorn app.main:app --reload