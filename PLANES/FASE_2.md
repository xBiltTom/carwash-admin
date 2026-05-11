Continúa con el backend de CarWash Admin.

Implementa routers, schemas y servicios para exponer una API REST funcional usando FastAPI, SQLAlchemy y Pydantic.

Endpoints requeridos:

Clientes:
- POST /api/clientes
- GET /api/clientes
- GET /api/clientes/{id}

Vehículos:
- POST /api/vehiculos
- GET /api/vehiculos
- GET /api/vehiculos/{id}

Servicios:
- GET /api/servicios
- POST /api/servicios
- PATCH /api/servicios/{id}

Citas:
- POST /api/citas
- GET /api/citas
- GET /api/citas/{id}
- PATCH /api/citas/{id}/estado

Pagos:
- POST /api/pagos
- GET /api/pagos
- GET /api/pagos/{id}

Regla principal del negocio:
El lavadero puede atender máximo 2 citas en paralelo por cada fecha y hora.

Al crear una cita:
- Contar cuántas citas existen con la misma fecha_cita y hora_cita.
- Solo considerar citas con estado RESERVADA o EN_ATENCION.
- Si ya existen 2 citas activas en ese horario, rechazar con HTTP 400.
- Si hay 0 o 1, permitir el registro.

Estados que ocupan cupo:
- RESERVADA
- EN_ATENCION

Estados que liberan cupo:
- FINALIZADA
- CANCELADA

También implementar:
- Validación de que cliente, vehículo y servicio existan antes de crear una cita.
- Validación de que el vehículo pertenezca al cliente seleccionado.
- Al registrar pago, validar que la cita exista.
- Si el pago se registra como PAGADO, guardar fecha_pago.
- CORS habilitado para frontend local en http://localhost:3000.
- Respuestas limpias con Pydantic.
- Manejo de errores con HTTPException.

No implementar autenticación.
Priorizar que todos los endpoints funcionen correctamente para el examen.