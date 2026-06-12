# PLAN DE MIGRACIÓN: Backend Medusa v2 + Frontend v2 para Coolify

> **Proyecto**: King Keys / El Reino Digital — tienda de licencias digitales  
> **Estado actual**: Frontend v2 downgradeado a v1 | Backend v1 (no funcional para v2)  
> **Objetivo**: Backend Medusa v2 limpio + Frontend restaurado a v2 nativo + Deploy en Coolify  
> **Fecha del plan**: Junio 2026

---

## 1. DIAGNÓSTICO

### Lo que pasó
1. El frontend se construyó para Medusa v2 (~294 archivos, patrones v2)
2. El backend nunca fue realmente v2 o falló estrepitosamente
3. Se hizo un downgrade de emergencia en 2 días (commits 27-28 mayo 2026):
   - 5 archivos de capa de datos cambiados (`fields` → `expand`, endpoints v2 → v1)
   - 6 archivos de checkout (`payment_collection` → `payment_sessions`)
   - 1 archivo de compatibilidad (`config.ts` wrappers v2→v1)
4. El backend v1 "fue un infierno" — no sirve para v2, toca reconstruirlo

### Lo bueno
- El frontend está **listo para v2** — solo hay que revertir ~30 líneas en ~12 archivos
- Los 36 endpoints que consume el frontend están perfectamente mapeados
- Medusa v2 ya es estable y tiene módulos oficiales para la mayoría de funcionalidades

---

## 2. ESTRUCTURA DEL BACKEND V2

```
medusa-v2-backend/
├── package.json
├── medusa-config.ts
├── .env
├── src/
│   ├── admin/                          # Panel admin (incluido en v2)
│   │   ├── routes/                     # Páginas custom del admin
│   │   └── widgets/                    # Widgets del dashboard
│   │
│   ├── api/                            # API Routes custom
│   │   ├── store/                      # Endpoints públicos (storefront)
│   │   │   └── license-keys/           # ← CUSTOM: License Keys
│   │   │       ├── [orderId]/
│   │   │       │   ├── route.ts        # GET  /store/license-keys/:orderId
│   │   │       │   └── resend/
│   │   │       │       └── route.ts    # POST /store/license-keys/:orderId/resend
│   │   │       └── route.ts
│   │   └── admin/                      # Endpoints admin (si se necesitan)
│   │
│   ├── modules/                        # Módulos custom (lógica de negocio)
│   │   └── license-key/               # ← CUSTOM: Módulo de License Keys
│   │       ├── index.ts               # Definición del módulo
│   │       ├── models/
│   │       │   └── license-key.ts     # Entidad: LicenseKey
│   │       ├── service.ts             # Lógica: generar, asignar, entregar, reenviar
│   │       └── migrations/
│   │           └── *.ts               # Migraciones de BD
│   │
│   ├── workflows/                      # Workflows (procesos de negocio)
│   │   └── deliver-license-keys/      # ← CUSTOM: Entrega de keys post-compra
│   │       ├── index.ts               # Workflow definition
│   │       └── steps/
│   │           ├── get-license-keys.ts
│   │           ├── mark-as-delivered.ts
│   │           └── send-email.ts      # Opcional: email con las keys
│   │
│   ├── subscribers/                    # Event subscribers
│   │   └── order-placed-handler.ts    # ← CUSTOM: Dispara workflow al completar orden
│   │
│   └── links/                          # Module links (extiende entidades core)
│       └── order-license-key.ts       # Relaciona Order ↔ LicenseKey
```

### Medusa v2 Core (INCLUIDO, no hay que programar)
| Funcionalidad | Qué lo cubre en v2 |
|---|---|
| Productos, variantes, precios | `@medusajs/product` |
| Carrito de compras | `@medusajs/cart` |
| Órdenes | `@medusajs/order` |
| Clientes + direcciones | `@medusajs/customer` |
| Autenticación (login/register/JWT) | `@medusajs/auth` |
| Regiones + países | `@medusajs/region` |
| Categorías | `@medusajs/product` (product categories) |
| Colecciones | `@medusajs/product` (collections) |
| Envíos / Shipping | `@medusajs/fulfillment` |
| Impuestos | `@medusajs/tax` |
| Stripe (payment) | `@medusajs/payment-stripe` (OFICIAL) |
| Admin panel | Incluido en `@medusajs/medusa` |
| Workflows engine | `@medusajs/workflows-sdk` (incluido) |

---

## 3. LO QUE HAY QUE CONSTRUIR (CUSTOM)

### 3.1 Módulo: License Keys

**Entidad `LicenseKey`:**
```typescript
{
  id: string
  key: string                    // La clave de licencia (ej: XXXXX-XXXXX-XXXXX)
  product_id: string             // Relación con producto Medusa
  order_id?: string              // Orden a la que fue asignada
  status: "available" | "assigned" | "delivered" | "revoked"
  delivery_status: "pending" | "sent" | "failed"
  delivery_error?: string        // Mensaje de error si falló la entrega
  created_at: Date
  updated_at: Date
}
```

**Operaciones del servicio:**
- `generateKeys(productId, count)` — Generar N keys para un producto
- `assignKeys(orderId, items)` — Asignar keys disponibles a una orden
- `getKeysByOrder(orderId)` — Consultar keys de una orden
- `resendKeys(orderId, keyIds?)` — Reenviar keys (actualiza delivery_status)
- `revokeKey(keyId)` — Revocar una key

**API Routes expuestas:**
```
GET  /store/license-keys/:orderId        → Devuelve { license_keys: LicenseKey[] }
POST /store/license-keys/:orderId/resend → Body { key_ids?: string[] } → { results: [...] }
```

### 3.2 Workflow: Deliver License Keys

Se dispara con el evento `order.placed`:

```
order.placed
  → get-license-keys (busca keys asignadas a la orden)
  → mark-as-delivered (actualiza delivery_status a "sent")
  → [opcional] send-email (envía keys por email)
```

### 3.3 Payment Providers Custom (3)

Medusa v2 tiene arquitectura de payment providers por módulo. Cada uno necesita:

```
src/modules/<provider>/
├── index.ts          # Module definition
├── service.ts        # Payment provider service
└── types.ts          # Types/config
```

#### a) Aurpay (Crypto)
- **API externa**: `POST {AURPAY_API_BASE}/api/order/pay-url`
- **Auth**: API-Key header + HMAC webhook token
- **Flujo**: initiatePayment → redirect_url → webhook callback → capture
- **Archivos actuales de referencia**: `src/app/api/aurpay/create-invoice/route.ts`, `src/app/api/aurpay/webhook/route.ts`

#### b) Cryptomus (Crypto)
- **API externa**: `POST https://api.cryptomus.com/v1/payment`
- **Auth**: merchant + MD5 signature
- **Flujo**: initiatePayment → redirect_url → webhook callback → capture
- **Archivos actuales de referencia**: `src/app/api/cryptomus/create-invoice/route.ts`, `src/app/api/cryptomus/webhook/route.ts`

#### c) Bold (Colombia)
- **API externa**: Bold payment gateway
- **Flujo**: initiatePayment → redirect_url → callback → capture
- **Archivo actual de referencia**: `src/modules/checkout/components/payment-button/bold-button.tsx`

### 3.4 Endpoints custom: Test Payment (solo dev)

```
POST /hooks/test-payment
Body: { order_id }
→ Simula captura de pago para testing
```

---

## 4. CAMBIOS EN EL FRONTEND (ESTE REPO)

### Reversión del downgrade (~12 archivos, ~30 líneas)

| Archivo | Cambio |
|---|---|
| `src/lib/config.ts` | Eliminar wrappers compat v1, usar `@medusajs/js-sdk` nativo |
| `src/lib/data/variants.ts` | `/store/variants/` → `/store/product-variants/` |
| `src/lib/data/orders.ts` | `expand=` → `fields=`, restaurar endpoints transfer v2 |
| `src/lib/data/collections.ts` | Restaurar tipos y manejo v2 |
| `src/lib/data/cart.ts` | Restaurar `payment_collection` access, eliminar fallbacks v1 |
| `src/modules/checkout/components/payment/index.tsx` | `payment_sessions` → `payment_collection` (6 archivos) |
| `src/modules/checkout/components/payment-button/*.tsx` | Mismo cambio |
| `src/modules/checkout/components/payment-wrapper/index.tsx` | Mismo cambio |
| `src/modules/checkout/components/review/index.tsx` | Mismo cambio |
| `src/types/medusa-v1-shims.d.ts` | **ELIMINAR** — usar tipos nativos de `@medusajs/types` v2 |
| `package.json` | `@medusajs/medusa-js` → `@medusajs/js-sdk`, `@medusajs/types` v1 → v2 |

### Lo que NO cambia
- Los 251 componentes TSX (ya usan patrones v2 a través de los wrappers)
- Tailwind, temas, animaciones, layout
- Las API routes internas de Next.js (aurpay/cryptomus create-invoice + webhook) se simplifican porque ahora el backend maneja los payment providers nativamente

---

## 5. MAPEO DE ENDPOINTS: v1 → v2

El frontend espera 36 endpoints. Así cambian en v2:

| # | v1 Endpoint | v2 Equivalente | Tipo |
|---|---|---|---|
| 1 | `GET /store/products` | `GET /store/products` | Core — misma ruta, query params cambian (`expand` → `fields`) |
| 2 | `GET /store/variants/:id` | `GET /store/products/:id/variants` o SDK `sdk.store.product.listVariants()` | Core |
| 3 | `GET /store/collections` | `GET /store/collections` | Core |
| 4 | `GET /store/collections/:id` | `GET /store/collections/:id` | Core |
| 5 | `GET /store/product-categories` | `GET /store/product-categories` | Core |
| 6 | `GET /store/regions` | `GET /store/regions` | Core |
| 7 | `GET /store/regions/:id` | `GET /store/regions/:id` | Core |
| 8 | `POST /store/carts` | `POST /store/carts` | Core |
| 9 | `GET /store/carts/:id` | `GET /store/carts/:id` | Core |
| 10 | `POST /store/carts/:id` | `POST /store/carts/:id` | Core |
| 11 | `POST /store/carts/:id/line-items` | `POST /store/carts/:id/line-items` | Core |
| 12 | `POST /store/carts/:id/line-items/:lid` | `POST /store/carts/:id/line-items/:lid` | Core |
| 13 | `DELETE /store/carts/:id/line-items/:lid` | `DELETE /store/carts/:id/line-items/:lid` | Core |
| 14 | `POST /store/carts/:id/shipping-methods` | `POST /store/carts/:id/shipping-methods` | Core |
| 15 | `POST /store/carts/:id/complete` | `POST /store/carts/:id/complete` | Core |
| 16 | `POST /store/carts/:id/payment-sessions` | Ya no existe — el payment module lo abstrae | Core (cambia) |
| 17 | `POST /store/carts/:id/payment-session` | Ya no existe — `sdk.store.cart.createPaymentCollection()` | Core (cambia) |
| 18 | `GET /store/shipping-options/:cartId` | `GET /store/shipping-options` con `cart_id` param | Core |
| 19 | `POST /store/shipping-options/:id/calculate` | `POST /store/shipping-options/:id/calculate` | Core |
| 20 | `POST /store/auth/token` | `POST /auth/customer/emailpass` o SDK `sdk.auth.login()` | Core (cambia ruta) |
| 21 | `POST /store/customers` | `POST /auth/customer/emailpass/register` o SDK `sdk.auth.register()` | Core (cambia ruta) |
| 22 | `DELETE /store/auth` | `POST /auth/session` (logout) o SDK | Core (cambia) |
| 23 | `POST /store/customers/password-token` | `POST /auth/customer/emailpass/reset-password` | Core (cambia ruta) |
| 24 | `POST /store/customers/password-reset` | `POST /auth/customer/emailpass/reset-password` (confirm) | Core (cambia ruta) |
| 25 | `GET /store/customers/me` | `GET /store/customers/me` | Core |
| 26 | `POST /store/customers/me` | `POST /store/customers/me` | Core |
| 27 | `POST /store/customers/me/addresses` | `POST /store/customers/me/addresses` | Core |
| 28 | `POST /store/customers/me/addresses/:id` | `POST /store/customers/me/addresses/:id` | Core |
| 29 | `DELETE /store/customers/me/addresses/:id` | `DELETE /store/customers/me/addresses/:id` | Core |
| 30 | `GET /store/orders/:id` | `GET /store/orders/:id` | Core |
| 31 | `GET /store/orders?cart_id=:id` | `GET /store/orders?cart_id=:id` | Core |
| 32 | `POST /store/orders/batch/customer/confirm` | `POST /store/orders/:id/transfer/request` | Core (cambia ruta) |
| 33 | `POST /store/orders/customer/confirm` | `POST /store/orders/:id/transfer/accept` | Core (cambia ruta) |
| 34 | `POST /hooks/test-payment` | Custom API route en v2 | Custom |
| 35 | `GET /store/license-keys/:orderId` | Custom API route en v2 | Custom |
| 36 | `POST /store/license-keys/:orderId/resend` | Custom API route en v2 | Custom |

---

## 6. DESPLIEGUE EN COOLIFY

### Arquitectura de servicios

```
┌─────────────────────────────────────────┐
│                 COOLIFY                  │
│                                         │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL   │  │     Redis        │ │
│  │  (medusa-db)  │  │  (cache/events)  │ │
│  └──────┬───────┘  └────────┬─────────┘ │
│         │                   │           │
│  ┌──────┴───────────────────┴─────────┐ │
│  │     Servicio 1: medusa-backend      │ │
│  │     - Node.js (Medusa v2)          │ │
│  │     - Puerto 9000                   │ │
│  │     - Admin panel en /app           │ │
│  └────────────────┬───────────────────┘ │
│                   │                     │
│  ┌────────────────┴───────────────────┐ │
│  │     Servicio 2: kingkeys-frontend   │ │
│  │     - Next.js 15                    │ │
│  │     - Puerto 3000                   │ │
│  │     - MEDUSA_BACKEND_URL → backend  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Configuración en Coolify

#### Servicio 1: `medusa-backend`
```yaml
Tipo: Node.js / Docker
Repositorio: [nuevo-repo]/medusa-v2-backend
Build command: pnpm build
Start command: pnpm start
Puerto: 9000

Variables de entorno:
  DATABASE_URL=postgresql://user:pass@postgres:5432/medusa
  REDIS_URL=redis://redis:6379
  JWT_SECRET=<generado>
  COOKIE_SECRET=<generado>
  MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
  
  # Stripe
  STRIPE_API_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  
  # Aurpay
  AURPAY_API_KEY=...
  AURPAY_API_BASE=https://api.aurpay.net
  AURPAY_WEBHOOK_SECRET=...
  
  # Cryptomus
  CRYPTOMUS_MERCHANT_ID=...
  CRYPTOMUS_API_KEY=...
  CRYPTOMUS_WEBHOOK_SECRET=...
  
  # Bold
  BOLD_API_KEY=...
  BOLD_SECRET_KEY=...
  
  # Frontend URL (CORS)
  STORE_CORS=http://kingkeys-frontend:3000
  ADMIN_CORS=http://kingkeys-frontend:3000
```

#### Servicio 2: `kingkeys-frontend`
```yaml
Tipo: Node.js / Docker
Repositorio: [mismo repo actual]
Build command: pnpm build
Start command: pnpm start
Puerto: 3000

Variables de entorno:
  MEDUSA_BACKEND_URL=http://medusa-backend:9000
  NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.tudominio.com
  MEDUSA_PUBLISHABLE_KEY=pk_...
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
  
  # Stripe (client-side)
  NEXT_PUBLIC_STRIPE_KEY=pk_live_...
  
  # Crypto
  NEXT_PUBLIC_CRYPTOMUS_MERCHANT_ID=...
  NEXT_PUBLIC_CRYPTOMUS_API_KEY=...
  CRYPTOMUS_API_KEY=...
  CRYPTOMUS_WEBHOOK_SECRET=...
  
  AURPAY_API_KEY=...
  AURPAY_API_BASE=https://api.aurpay.net
  AURPAY_WEBHOOK_SECRET=...
  
  BOLD_API_KEY=...
  
  # S3/MinIO para imágenes
  MINIO_ENDPOINT=...
  MINIO_ACCESS_KEY=...
  MINIO_SECRET_KEY=...
  MINIO_BUCKET=...
```

#### Servicio 3: `medusa-postgres`
```yaml
Tipo: PostgreSQL
Versión: 15
Database: medusa
```

#### Servicio 4: `medusa-redis`
```yaml
Tipo: Redis
Versión: 7
```

---

## 7. ESTRATEGIA DE MIGRACIÓN

### Fase 1: Backend v2 (4-6 semanas)
1. Crear proyecto Medusa v2 base: `npx create-medusa-app@latest`
2. Configurar módulos core (product, cart, order, customer, auth, region, fulfillment, tax)
3. Migrar datos de productos, colecciones, categorías desde v1
4. Configurar Stripe (módulo oficial)
5. Construir módulo License Keys (modelo + servicio + migraciones)
6. Construir API routes de license keys
7. Construir workflow `deliver-license-keys`
8. Construir subscriber `order.placed` → workflow
9. Construir payment providers custom (Aurpay, Cryptomus, Bold)
10. Configurar webhooks de cada provider
11. Construir endpoint test-payment (dev)
12. Probar todos los 36 endpoints individualmente

### Fase 2: Frontend v2 (1-2 semanas)
1. Instalar `@medusajs/js-sdk` y `@medusajs/types` v2
2. Reescribir `src/lib/config.ts` con SDK v2 nativo
3. Actualizar `src/lib/data/*.ts` (15 archivos) a tipos y endpoints v2
4. Restaurar `payment_collection` en 6 componentes de checkout
5. Eliminar `medusa-v1-shims.d.ts`
6. Simplificar rutas API de Aurpay/Cryptomus (ahora delegadas al backend)
7. Actualizar middleware si es necesario

### Fase 3: Integración (1-2 semanas)
1. Conectar frontend → backend en entorno staging
2. Test de flujo completo: navegar → agregar al carrito → checkout → pago → recibir keys
3. Test de los 4 payment providers
4. Test de login/register/reset password
5. Test de transferencia de órdenes
6. Test de reenvío de license keys
7. Pruebas de carga/rate limiting

### Fase 4: Coolify (1 semana)
1. Crear servicios en Coolify (backend, frontend, postgres, redis)
2. Configurar variables de entorno
3. Configurar dominios y SSL
4. Deploy staging → validar → production cutover

---

## 8. ESTIMACIÓN DE ESFUERZO

| Fase | Tareas | Semanas |
|---|---|---|
| 1. Backend v2 | Core + License Keys + Payment Providers | 4-6 |
| 2. Frontend v2 | Revertir downgrade + adaptar SDK | 1-2 |
| 3. Integración | Testing completo | 1-2 |
| 4. Coolify | Deploy + SSL + cutover | 1 |
| **Total** | | **7-11 semanas** |

### Desglose por componente

| Componente | Días estimados |
|---|---|
| Medusa v2 base + Stripe + datos | 5-7 |
| License Keys module + API + workflow | 5-8 |
| Aurpay payment provider | 3-5 |
| Cryptomus payment provider | 3-5 |
| Bold payment provider | 2-4 |
| Frontend (reversión downgrade) | 5-7 |
| Testing integral | 5-10 |
| Coolify deploy | 3-5 |

---

## 9. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Las APIs de Aurpay/Cryptomus/Bold cambian | Baja | Medio | Abstraer en el módulo, con tests |
| Migración de datos v1→v2 con pérdida | Media | Alto | Backup completo, migrar en staging primero |
| Los 3 payment providers custom son complejos | Alta | Medio | Empezar con Stripe (oficial), luego uno por uno |
| Rate limiting / webhooks no funcionan igual en v2 | Media | Medio | Revisar middleware de v2 equivalente |
| License keys no se entregan correctamente | Media | Alto | Test exhaustivo del workflow + idempotencia |
| Tiempo total subestimado | Media | Medio | Priorizar: Stripe + License Keys primero, crypto después |

---

## 10. PLAN ALTERNATIVO (si el tiempo es crítico)

Si 7-11 semanas es demasiado:

### MVP v2 en 4 semanas
1. Backend v2 core + Stripe (único payment) — **Semana 1-2**
2. Módulo License Keys (imprescindible) — **Semana 2-3**
3. Frontend revertido a v2 — **Semana 3**
4. Integración + deploy Coolify — **Semana 4**

Los pagos crypto (Aurpay, Cryptomus, Bold) se añaden después como módulos adicionales sin afectar lo ya funcionando.

---

## 11. RECURSOS ÚTILES

- [Medusa v2 Docs](https://docs.medusajs.com/v2)
- [Medusa v2 JS SDK](https://docs.medusajs.com/v2/js-sdk)
- [Crear un payment provider en v2](https://docs.medusajs.com/v2/resources/commerce-modules/payment/payment-provider)
- [Crear un módulo custom en v2](https://docs.medusajs.com/v2/advanced-development/modules/create)
- [Workflows en v2](https://docs.medusajs.com/v2/advanced-development/workflows)
- [API Routes en v2](https://docs.medusajs.com/v2/advanced-development/api-routes)
- [Deploy en Coolify](https://docs.medusajs.com/v2/deployment/coolify)

---

## 12. PRÓXIMOS PASOS INMEDIATOS

1. [ ] Crear repositorio `medusa-v2-backend`
2. [ ] `npx create-medusa-app@latest` con PostgreSQL + Redis
3. [ ] Configurar Stripe y hacer un pago de prueba
4. [ ] Migrar productos/colecciones/categorías desde el backend v1
5. [ ] Construir módulo License Keys (el más crítico)
6. [ ] Revertir frontend a v2 en este repo
7. [ ] Conectar frontend → backend y probar flujo mínimo (Stripe only)

---

> **Nota**: Este documento es un plan vivo. Actualizarlo conforme avance la migración.
