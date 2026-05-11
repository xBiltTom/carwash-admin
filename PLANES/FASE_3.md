Continúa con el backend de CarWash Admin.

Ahora implementa dashboard, generación de voucher y reportes PDF.

Endpoints requeridos:

Dashboard:
- GET /api/dashboard/resumen

Debe devolver:
- total_citas
- citas_reservadas
- citas_en_atencion
- citas_finalizadas
- citas_canceladas
- ingresos_totales
- ingresos_hoy
- servicios_mas_solicitados
- metodos_pago_usados

Reportes:
- GET /api/reportes/operacional/pdf
- GET /api/reportes/gestion/pdf
- GET /api/pagos/{id}/voucher/pdf

Usa ReportLab para generar PDF.

Reporte operacional:
Debe mostrar las citas del día:
- fecha
- hora
- cliente
- placa
- servicio
- estado
- pago si existe

Reporte de gestión:
Debe mostrar:
- total de citas
- total de ingresos pagados
- citas por estado
- servicios más solicitados
- métodos de pago utilizados

Voucher PDF:
Debe mostrar:
- título: VOUCHER / RECIBO DE PAGO
- número de pago
- fecha de emisión
- cliente
- documento
- vehículo
- placa
- servicio
- fecha y hora de cita
- monto
- método de pago
- estado de pago
- código de operación

Requisitos técnicos:
- Los PDFs deben devolverse como FileResponse o StreamingResponse.
- No guardar archivos permanentes innecesarios; usar archivos temporales si hace falta.
- El frontend debe poder descargar los PDFs.
- Mantener el código organizado en services/reportes_service.py y utils/pdf.py.
- Actualizar README con estos endpoints.