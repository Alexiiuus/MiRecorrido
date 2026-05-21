# MiRecorrido App

App mobile para consultar líneas de colectivo, recorridos, paradas y horarios programados del transporte urbano de Córdoba, Argentina.

Consume la API REST [MiRecorrido API](https://github.com/tu-usuario/mirecorrido-api) con datos GTFS estáticos.

## Requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`) o `npx expo`
- Dispositivo físico o emulador (Android/iOS)
- Backend MiRecorrido API corriendo (ver `backend/README.md`)

## Instalación

```bash
cd frontend
npm install
```

## Configuración

Editar `src/config/env.ts` para apuntar a la URL del backend:

```ts
export const API_BASE_URL = "http://localhost:8000";
// Para dispositivo físico, usar IP local de la máquina:
// export const API_BASE_URL = "http://192.168.1.50:8000";
```

## Ejecutar

```bash
npx expo start
```

Escaneá el QR con Expo Go (Android/iOS) o presioná `a` para emulador Android / `i` para simulador iOS.

## Pantallas

| Pantalla | Descripción |
|---|---|
| **RoutesScreen** | Lista de líneas de colectivo con buscador |
| **PatternSelectionScreen** | Variantes/recorridos de una línea seleccionada |
| **MapScreen** | Mapa con el recorrido dibujado y paradas |

## Flujo de la app

1. Al abrir la app se listan las líneas disponibles (`GET /routes`).
2. Se selecciona una línea y se ven sus patrones/variantes (`GET /routes/{id}/patterns`).
3. Se selecciona un patrón y se muestra el mapa con el recorrido (`GET /patterns/{id}/shape`) y paradas (`GET /patterns/{id}/stops`).
4. Al tocar una parada se consultan los horarios disponibles (`GET /stops/{id}/times`).

## Estructura del proyecto

```
src/
├── api/           # Cliente HTTP y funciones por recurso
├── components/    # Componentes reutilizables
├── config/        # Configuración (URL del backend)
├── navigation/    # Navegación (React Navigation)
├── screens/       # Pantallas de la app
└── types/         # Interfaces TypeScript
```

## Limitaciones actuales

- No hay GPS en tiempo real del colectivo.
- No hay predicción de llegada.
- No hay autenticación ni login.
- No hay favoritos ni historial.
- Los horarios son los programados en el GTFS estático, pueden tener valores > 24:00:00.
