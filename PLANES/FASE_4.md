Desarrolla el frontend de CarWash Admin usando Next.js con App Router, TypeScript y TailwindCSS.

Debe conectarse al backend FastAPI en:
http://localhost:8000/api

Crea la estructura:

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── clientes/page.tsx
│   │   ├── vehiculos/page.tsx
│   │   ├── citas/page.tsx
│   │   ├── pagos/page.tsx
│   │   └── reportes/page.tsx
│   │
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── DataTable.tsx
│   │   └── StatusBadge.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── types/

Pantallas requeridas:

1. Dashboard:
- Mostrar métricas principales desde /api/dashboard/resumen.
- Mostrar total de citas.
- Mostrar citas reservadas, en atención, finalizadas y canceladas.
- Mostrar ingresos totales e ingresos del día.
- Mostrar servicios más solicitados.

2. Clientes:
- Formulario para registrar cliente.
- Tabla de clientes.

3. Vehículos:
- Formulario para registrar vehículo.
- Selector de cliente.
- Tabla de vehículos.

4. Citas:
- Formulario para registrar cita.
- Selectores de cliente, vehículo y servicio.
- Fecha y hora.
- Observaciones.
- Tabla de citas.
- Botones para cambiar estado:
  - RESERVADA
  - EN_ATENCION
  - FINALIZADA
  - CANCELADA
- Mostrar visualmente el estado.

Regla visual:
- Si el backend rechaza una cita porque ya existen 2 citas en ese horario, mostrar mensaje de error claro:
  "No hay cupos disponibles para este horario. Máximo 2 citas en paralelo."

5. Pagos:
- Formulario para registrar pago asociado a una cita.
- Método de pago.
- Estado de pago.
- Código de operación.
- Tabla de pagos.
- Botón para descargar voucher PDF.

6. Reportes:
- Botón para descargar reporte operacional PDF.
- Botón para descargar reporte de gestión PDF.

Requisitos:
- Usar fetch o axios centralizado en src/lib/api.ts.
- Usar Tailwind para un diseño limpio tipo panel administrativo.
- No implementar login.
- No usar librerías complejas de UI.
- Priorizar funcionalidad y claridad.
- Agregar .env.example con NEXT_PUBLIC_API_URL=http://localhost:8000/api.
- Agregar README con instrucciones:
  npm install
  npm run dev

El resultado debe verse como un panel administrativo simple, claro y funcional para el examen.