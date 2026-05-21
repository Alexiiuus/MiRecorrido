# MiRecorrido API

API REST para datos GTFS estáticos de transporte urbano de Córdoba.

Expone rutas, patrones de recorrido, paradas y horarios programados a partir de un dataset GTFS estático. Sin GPS en tiempo real, sin predicciones, sin autenticación.

## Tecnologías

| Tecnología | Versión |
|---|---|
| Python | 3.11+ |
| FastAPI | 0.115 |
| SQLAlchemy | 2.0 |
| PostgreSQL | 16 |
| Alembic | 1.13 |
| Pandas | 2.2 |
| Uvicorn | 0.30 |
| Docker Compose | 3.x |

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/) (recomendado)
- Python 3.11+ (para ejecución local sin Docker)
- PostgreSQL 16 (solo para ejecución local sin Docker)
- Archivo GTFS estático en formato `.zip` o carpeta

## Configuración de variables de entorno

```bash
cp .env.example .env
```

Variables disponibles en `.env`:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql+psycopg2://postgres:postgres@db:5432/mirecorrido` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nombre de la base de datos | `mirecorrido` |

> No commitees `.env`. El archivo `.env.example` sirve como referencia.

## Instalación y ejecución

### Con Docker (recomendado)

```bash
# Pararse en la carpeta backend
cd backend

# Crear archivo de entorno
cp .env.example .env

# Construir y levantar servicios
docker compose up --build -d

# Verificar que ambos servicios estén corriendo
docker compose ps

# Ver logs
docker compose logs -f api
```

La API queda disponible en `http://localhost:8000`.

### Local (sin Docker)

```bash
# Pararse en la carpeta backend
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env para conexión local
# DATABASE_URL apuntando a PostgreSQL en localhost
# Ejemplo:
# DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/mirecorrido

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> Requiere PostgreSQL corriendo localmente con la base de datos y credenciales configuradas en `.env`.

### Comandos de Docker útiles

```bash
# Detener servicios
docker compose down

# Detener y eliminar volúmenes (borra datos de BD)
docker compose down -v

# Ver logs en vivo
docker compose logs -f

# Acceder a la terminal del contenedor api
docker compose exec api bash

# Ver estado
docker compose ps
```

## Migraciones de base de datos

Las tablas se crean automáticamente al ejecutar el script de importación GTFS. Si se prefiere usar Alembic:

```bash
# Dentro del contenedor
docker compose exec api alembic revision --autogenerate -m "descripcion"
docker compose exec api alembic upgrade head

# Revertir última migración
docker compose exec api alembic downgrade -1

# Ver historial
docker compose exec api alembic history
```

Para crear tablas sin Alembic (útil para primera carga):

```bash
docker compose exec api python -c "
from app.db.base import Base
from app.db.session import engine
from app.models import *
Base.metadata.create_all(bind=engine)
"
```

## Importar datos GTFS

### Por línea de comandos (CLI)

```bash
# Crear carpeta y copiar archivo GTFS
mkdir -p data
# Copiar cordoba.zip a data/

# Importar desde ZIP
docker compose exec api python -m app.scripts.import_gtfs --path /app/data/cordoba.zip

# Limpiar datos existentes antes de importar
docker compose exec api python -m app.scripts.import_gtfs --path /app/data/cordoba.zip --clear

# Importar desde carpeta
docker compose exec api python -m app.scripts.import_gtfs --path /app/data/cordoba_gtfs
```

### Por API (HTTP)

```
POST /gtfs/import
```

Sube un archivo `.zip` GTFS mediante `multipart/form-data`. Acepta un parámetro opcional `clear` (default: `true`).

```bash
curl -X POST "http://localhost:8000/gtfs/import?clear=true" \
  -F "file=@/ruta/al/cordoba.zip"
```

Respuesta exitosa:
```json
{
  "status": "success",
  "message": "GTFS importado correctamente",
  "filename": "cordoba.zip",
  "clear": true,
  "required_files_found": ["routes.txt", "trips.txt", "stop_times.txt", "stops.txt", "shapes.txt", "calendar.txt"],
  "optional_files_found": ["agency.txt", "calendar_dates.txt"],
  "rows_per_table": {
    "routes": 150,
    "trips": 5200,
    "stop_times": 120000,
    "stops": 2800,
    "shapes": 45000,
    "calendar": 15,
    "agency": 1,
    "calendar_dates": 30
  }
}
```

Errores posibles:
- `400` si el archivo no es `.zip`, está corrupto o faltan archivos obligatorios.
- `500` si falla la importación en base de datos.

Swagger disponible en `http://localhost:8000/docs` para probar el endpoint interactivamente.

## Tests

El proyecto no incluye tests aún. Para ejecutar tests en el futuro:

```bash
docker compose exec api pytest
```

## Endpoints

### Documentación interactiva

- Swagger UI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

### Health Check

```
GET /health
```

Respuesta: `{"status": "ok"}`

### Líneas

```
GET /routes                              # Listar todas las líneas
GET /routes/{route_id}                   # Detalle de una línea
```

### Patrones de recorrido

```
GET /routes/{route_id}/patterns                               # Todos los patrones
GET /routes/{route_id}/patterns?date=2024-09-01               # Filtrados por fecha
GET /routes/{route_id}/patterns?direction_id=0                # Filtrados por dirección
GET /routes/{route_id}/patterns?date=2024-09-01&direction_id=1
```

### Shape (geometría para mapa)

```
GET /patterns/{pattern_id}/shape
```

### Paradas de un patrón

```
GET /patterns/{pattern_id}/stops
```

### Importar GTFS
```
POST /gtfs/import                              # Subir archivo .zip GTFS (multipart)
POST /gtfs/import?clear=false                  # Sin limpiar tablas existentes
```

### Horarios por parada

```
GET /stops/{stop_id}/times                                    # Próximos 20 horarios
GET /stops/{stop_id}/times?date=2024-09-01                    # Filtrados por fecha
GET /stops/{stop_id}/times?from_time=14:00:00                 # Desde una hora
GET /stops/{stop_id}/times?limit=10                           # Cantidad de resultados
```

El `pattern_id` sigue el formato: `route_{route_id}_dir_{direction_id}_shape_{shape_id}_trip_{trip_id}`.

### Ejemplos con curl

```bash
# Health
curl http://localhost:8000/health

# Listar líneas
curl http://localhost:8000/routes

# Patrones de línea 100
curl "http://localhost:8000/routes/100/patterns"

# Shape de patrón
curl "http://localhost:8000/patterns/route_100_dir_0_shape_sh001_trip_t001/shape"

# Paradas de patrón
curl "http://localhost:8000/patterns/route_100_dir_0_shape_sh001_trip_t001/stops"

# Horarios de parada 123 para una fecha
curl "http://localhost:8000/stops/123/times?date=2024-09-01&from_time=08:00:00&limit=10"

# Importar GTFS vía API
curl -X POST "http://localhost:8000/gtfs/import?clear=true" \
  -F "file=@./data/cordoba.zip"
```

## Estructura del proyecto

```
backend/
├── app/
│   ├── api/            # Rutas/controllers (health, routes, patterns, stops)
│   ├── core/           # Config (pydantic-settings)
│   ├── db/             # Base declarativa y sesión SQLAlchemy
│   ├── models/         # Modelos SQLAlchemy (agency, route, trip, stop, etc.)
│   ├── repositories/   # Acceso a datos (consultas SQL)
│   ├── schemas/        # Schemas Pydantic (request/response)
│   ├── scripts/        # Script de importación GTFS
│   ├── services/       # Lógica de negocio
│   └── main.py         # Punto de entrada FastAPI
├── alembic/            # Migraciones
├── alembic.ini         # Configuración de Alembic
├── docker-compose.yml  # Servicios api + db
├── Dockerfile          # Imagen del contenedor API
├── requirements.txt    # Dependencias Python
└── .env.example        # Variables de entorno de referencia
```

## Notas importantes

- El dataset es **GTFS estático**. No hay GPS en tiempo real, ni predicciones, ni autenticación.
- Los horarios pueden tener valores mayores a 24:00:00 (ej. `25:10:00`). Se almacenan como string sin convertir.
- Los patrones agrupan trips por `route_id`, `direction_id`, `shape_id` y `headsign`.
- La importación GTFS usa `TRUNCATE ... RESTART IDENTITY CASCADE` antes de insertar. Usar `--clear` para limpiar tablas manualmente.
- Los archivos críticos son: `routes.txt`, `trips.txt`, `stop_times.txt`, `stops.txt`, `shapes.txt`, `calendar.txt`. `agency.txt` y `calendar_dates.txt` son opcionales.
- No hay tests configurados. Agregar tests para nuevas features.
