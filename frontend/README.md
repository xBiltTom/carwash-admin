# CarWash Admin Frontend

Frontend de `CarWash Admin` construido con Next.js App Router, TypeScript y TailwindCSS.

## Requisitos

- Node.js 20+
- Backend FastAPI ejecutandose en `http://localhost:8000`

## Configuracion

1. Instala dependencias.

```bash
npm install
```

2. Crea el archivo de entorno.

```bash
cp .env.example .env.local
```

3. Ejecuta el servidor de desarrollo.

```bash
npm run dev
```

4. Abre `http://localhost:3000`.

## Variable de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Pantallas

- `/dashboard`
- `/clientes`
- `/vehiculos`
- `/citas`
- `/pagos`
- `/reportes`

## Funcionalidades

- Dashboard con metricas del backend
- Registro y listado de clientes
- Registro y listado de vehiculos
- Registro y gestion visual de citas
- Mensaje claro cuando un horario supera el limite de 2 citas paralelas
- Registro de pagos y descarga de voucher PDF
- Descarga de reportes operacional y de gestion
