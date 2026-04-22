# Deploy En Vercel (Monorepo)

Este proyecto se despliega como **2 proyectos en Vercel** usando el mismo repo:

1. `client` (frontend Vite)
2. `server` (backend Express serverless)

## 1) Preparar base de datos y variables

### Backend (`server`)

Variables en Vercel Project (server):

- `DATABASE_URL` = conexion MySQL remota
- `JWT_SECRET` = secreto fuerte
- `CORS_ORIGIN` = URL publica del frontend (ej. `https://tu-frontend.vercel.app`)
- `PORT` = `4000` (opcional en Vercel, pero se mantiene por compatibilidad local)

### Frontend (`client`)

Variables en Vercel Project (client):

- `VITE_API_URL` = URL publica del backend (ej. `https://tu-backend.vercel.app`)
- `VITE_WHATSAPP_NUMBER` = numero en formato internacional sin `+`

## 2) Deploy del backend en Vercel

1. Crear nuevo proyecto en Vercel desde tu repo.
2. En **Root Directory** elegir: `server`.
3. Framework: `Other`.
4. Dejar que Vercel use `server/vercel.json` (ya incluido).
5. Configurar env vars del backend.
6. Deploy.

Nota Prisma:
- Ejecuta migraciones contra la base remota antes/despues del primer deploy:
  - Desde local:
  - `cd server`
  - `npx prisma migrate deploy`

## 3) Deploy del frontend en Vercel

1. Crear otro proyecto en Vercel desde el mismo repo.
2. En **Root Directory** elegir: `client`.
3. Framework: `Vite`.
4. Configurar env vars del frontend.
5. Deploy.

`client/vercel.json` ya incluye rewrite SPA para rutas como `/orders/123`.

## 4) Verificacion post deploy

1. Registro / login funcionando.
2. Carrito agrega, incrementa, disminuye, elimina.
3. Checkout crea orden, descuenta stock y vacia carrito.
4. Historial de ordenes y detalle (`/orders/:id`) funcionan.
5. Panel admin protegido por rol.
6. WhatsApp flotante y contacto mail visibles.

## 5) Si aparece error de CORS

Revisa `CORS_ORIGIN` en el proyecto backend y confirma que coincide exactamente con el dominio del frontend (incluyendo `https://`).
