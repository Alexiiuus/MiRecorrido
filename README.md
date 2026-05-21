# MiRecorrido

App mobile para consultar líneas de colectivo, recorridos, paradas y horarios programados del transporte urbano de Córdoba, Argentina, usando datos GTFS estáticos.

- **Backend:** FastAPI + PostgreSQL 16 + SQLAlchemy 2 (ver `backend/README.md`)
- **Frontend:** React Native + Expo SDK 54 (ver `frontend/README.md`)

## Requisitos

- Docker y Docker Compose (recomendado para backend)
- Node.js 18+ y Expo Go (para frontend)

## Inicio rápido

```bash
# 1. Backend
cd backend
cp .env.example .env
docker compose up --build -d

# 2. Importar datos GTFS
docker compose exec api python -m app.scripts.import_gtfs --path /app/data/cordoba.zip

# 3. Frontend
cd frontend
npm install
npx expo start
```

Ver documentación detallada en `backend/README.md` y `frontend/README.md`.