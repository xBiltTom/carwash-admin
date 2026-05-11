# CarWash Admin Backend

Base del backend para el sistema `CarWash Admin` usando FastAPI, PostgreSQL, SQLAlchemy 2.0 y Alembic.

## Requisitos

- Python 3.12+
- PostgreSQL

## Estructura

```text
backend/
├── alembic/
├── app/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── utils/
├── .env.example
├── alembic.ini
├── README.md
└── requirements.txt
```

## Puesta en marcha

1. Crear el entorno virtual.

```powershell
python -m venv venv
```

2. Activar el entorno virtual.

```powershell
.\venv\Scripts\Activate.ps1
```

3. Instalar dependencias.

```powershell
pip install -r requirements.txt
```

4. Configurar el archivo `.env`.

```powershell
Copy-Item .env.example .env
```

Completa `DATABASE_URL` con tus credenciales de PostgreSQL.

5. Crear la migracion inicial.

```powershell
alembic revision --autogenerate -m "create initial tables"
```

6. Ejecutar migraciones.

```powershell
alembic upgrade head
```

7. Ejecutar el seed inicial de servicios.

```powershell
python -m app.db.seed
```

8. Levantar FastAPI.

```powershell
uvicorn app.main:app --reload
```

## Endpoints base

- `GET /health`: valida que la API este levantada.
