from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import citas, clientes, dashboard, pagos, reportes, servicios, vehiculos


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router, prefix="/api")
app.include_router(vehiculos.router, prefix="/api")
app.include_router(servicios.router, prefix="/api")
app.include_router(citas.router, prefix="/api")
app.include_router(pagos.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(reportes.router, prefix="/api")


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "app": settings.PROJECT_NAME}
