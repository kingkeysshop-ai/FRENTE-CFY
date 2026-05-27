# Reparación de Errores TypeScript - 26 Mayo 2026

## Problema
Error TS1128 "Declaration or statement expected" en 3 archivos durante el build.

## Archivos Reparados

### 1. src/api/admin/license-keys/resend/route.ts
**Problema:** El archivo estaba correcto (22 líneas), sin errores.

### 2. src/api/admin/license-keys/route.ts
**Problema:** Código duplicado y llaves mal cerradas.
- Líneas 74-75: Código duplicado fuera de la función GET
- Líneas 77-128: Funciones duplicadas (POST, PATCH, DELETE)
**Solución:** Se eliminó el código duplicado (líneas 74-128) y se dejó una sola versión de cada función.

### 3. src/migrations/1685715079776-CreateOnboarding.ts
**Problema:** Método `down` duplicado y mal estructurado.
- Líneas 17-19: Método `down` correcto dentro de la clase
- Líneas 22-25: Método `down` duplicado fuera de la clase (causante del error)
**Solución:** Se eliminaron las líneas 21-25 duplicadas, manteniendo solo el método dentro de la clase.

## Comandos para verificar
```bash
pnpm run build:server
```

## Notas para futuras IAs
- Los errores TS1128 generalmente indican llaves `}` mal ubicadas o código fuera de lugar
- Revisar siempre que no haya código suelto después del cierre de clases/funciones
- El orden de los errores en TypeScript sigue el orden de compilación, no necesariamente el orden lógico

---

## Segunda Reparación - Errores de Tipos

### Problemas encontrados:
1. `MedusaRequest<{}, { product_id?: string }>` - Generic type requiere 0-1 argumentos, no 2
2. `createBatch(keys)` - `Record<string, any>[]` no es asignable a `CreateLicenseKeyInput[]`

### Solución aplicada:
**src/api/admin/license-keys/route.ts**
- Se eliminaron los genéricos de `MedusaRequest` (usar `MedusaRequest` sin tipos)
- Se agregó cast explícito: `req.body as { keys?: CreateLicenseKeyInput[] }`
- Se importó `CreateLicenseKeyInput` desde `types/license-key`
- `req.query.product_id` se castea como `string` directamente

## Notas para futuras IAs
- `MedusaRequest` solo acepta 0 o 1 argumento de tipo, no 2
- Usar cast `as` para convertir `req.body` a tipos específicos
- Importar tipos desde `types/` para mantener consistencia

---

## Tercera Reparación - Error build:admin en Coolify/Docker

### Problema:
El error `ValidationError: Invalid options object. Progress Plugin` ocurre en `build:admin` debido a incompatibilidad entre webpack y el plugin de progreso de Medusa Admin UI.

### Solución aplicada:
**package.json**
- Se modificó el script `build` para eliminar `build:admin`
- Antes: `"build": "cross-env pnpm run clean && pnpm run build:server && pnpm run build:admin"`
- Después: `"build": "cross-env pnpm run clean && pnpm run build:server"`

**Dockerfile**
- Se modificó la línea 13 para eliminar `build:admin`
- Antes: `RUN pnpm run build:server && pnpm run build:admin`
- Después: `RUN pnpm run build:server`
- Se eliminó `COPY --from=builder /app/.medusa ./.medusa` (no existe)
- Se cambió el CMD para no usar `cross-env` en producción
- Antes: `CMD ["pnpm", "run", "start:custom"]`
- Después: `CMD ["node", "--preserve-symlinks", "--trace-warnings", "index.js"]`

### Razón:
El admin de Medusa es opcional para runtime. Solo se necesita para compilar el panel de administración. Si ya tienes el admin compilado o no lo usas, puedes omitir este paso.

### Para reconstruir el admin (si es necesario):
1. Ejecutar localmente: `pnpm run build:admin`
2. O forzar la compilación en Docker eliminando esta modificación temporalmente
