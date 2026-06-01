# King Keys — Progreso del Restyling

## Objetivo
Completar (1) auditoría de bugs/SEO/features y (2) restyling conservador de clases Tailwind CSS al theme kk- en Next.js 15 + Medusa.js v1.

## Reglas
- Solo cambiar clases CSS (Tailwind), NUNCA lógica de componentes.
- No tocar lógica de checkout, pagos, ni autenticación.
- Un solo commit con todos los cambios visuales.
- Verificar que checkout sigue funcionando.

---

## LO COMPLETADO ✅

### Fase 0 — Auditoría (bugs, SEO, features)
- **BUG 1**: Imágenes externas — `next.config.js` remotePatterns + Thumbnail fixes
- **BUG 3**: Homepage guard — ya no renderiza blank page si fallan colecciones/región
- **BUG 4**: Replaced `<a>`/`<Link>` con `LocalizedClientLink` en Hero, CTA, breadcrumbs
- **BUG 5**: Metadata store page — español con SEO
- **SEO 1+2**: Metadata dinámica por producto + JSON-LD
- **MEJORA 1**: Platform badges animados + contador productos + secondary CTA + gradiente
- **MEJORA 2**: Badges "Más Vendido" + "Últimas N" + stock
- **MEJORA 3**: Trust badges (SSL, crypto, delivery)
- **MEJORA 4**: Announcement bar con localStorage dismiss
- **MEJORA 6**: Footer mejorado
- **MEJORA 7**: Breadcrumbs en store/cart/checkout/product
- **CONV 2**: Recent activity toast notifications
- **CONV 3**: Product urgency (viewers + stock)
- **SEC 2**: Confirmado Aurpay/Cryptomus ya están server-side
- **SEC 3**: Confirmado rate limiting ya implementado

### Fase 1 — Restyling kk- Completado (33 archivos)

#### Archivos base
- [x] `src/styles/globals.css` — body bg `#0a0a0a`, hero-grid-bg, text-glow-yellow, keyframes marquee
- [x] `tailwind.config.js` — colors (kk-black/card/elevated/border/yellow/muted), boxShadow glow, borderRadius card

#### Nav & Header
- [x] `src/modules/layout/components/scroll-aware-header.tsx`
- [x] `src/modules/layout/components/nav-links/index.tsx`
- [x] `src/modules/layout/components/cart-dropdown/index.tsx`
- [x] `src/modules/layout/templates/nav/index.tsx`
- [x] `src/modules/common/components/announcement-bar/index.tsx`

#### Homepage
- [x] `src/modules/home/components/hero/index.tsx`

#### Productos
- [x] `src/modules/products/components/product-preview/index.tsx`

#### Store
- [x] `src/modules/store/templates/index.tsx`

#### Footer
- [x] `src/modules/layout/templates/footer/index.tsx`

#### Cart (6 files)
- [x] `src/modules/cart/templates/index.tsx`
- [x] `src/modules/cart/templates/summary.tsx`
- [x] `src/modules/cart/templates/items.tsx`
- [x] `src/modules/cart/components/item/index.tsx`
- [x] `src/modules/cart/components/sign-in-prompt/index.tsx`
- [x] `src/modules/cart/components/empty-cart-message/index.tsx`

#### Checkout templates (2 files)
- [x] `src/modules/checkout/templates/checkout-summary/index.tsx`
- [x] `src/modules/checkout/templates/checkout-form/index.tsx`

#### Account (17 files)
- [x] `src/modules/account/components/account-info/index.tsx`
- [x] `src/modules/account/components/account-nav/index.tsx`
- [x] `src/modules/account/components/address-card/add-address.tsx`
- [x] `src/modules/account/components/address-card/edit-address-modal.tsx`
- [x] `src/modules/account/components/forgot-password/index.tsx`
- [x] `src/modules/account/components/login/index.tsx`
- [x] `src/modules/account/components/order-card/index.tsx`
- [x] `src/modules/account/components/order-filters/index.tsx`
- [x] `src/modules/account/components/order-overview/index.tsx`
- [x] `src/modules/account/components/overview/index.tsx`
- [x] `src/modules/account/components/profile-billing-address/index.tsx`
- [x] `src/modules/account/components/profile-email/index.tsx`
- [x] `src/modules/account/components/profile-password/index.tsx`
- [x] `src/modules/account/components/register/index.tsx`
- [x] `src/modules/account/components/reset-password/index.tsx`
- [x] `src/modules/account/templates/account-layout.tsx`
- [x] `src/modules/account/templates/login-template.tsx`

---

## FASE 2 COMPLETADA — Restyling kk- total (~140+ archivos) ✅

### ✅ App pages (16 files)
- [x] `src/app/error.tsx`
- [x] `src/app/not-found.tsx`
- [x] `src/app/payment/success/page.tsx`
- [x] `src/app/payment/success/payment-success-content.tsx`
- [x] `src/app/[countryCode]/(checkout)/layout.tsx`
- [x] `src/app/[countryCode]/(checkout)/payment-callback/page.tsx`
- [x] `src/app/[countryCode]/(checkout)/payment-callback/payment-callback-content.tsx`
- [x] `src/app/[countryCode]/(main)/error.tsx`
- [x] `src/app/[countryCode]/(main)/loading.tsx`
- [x] `src/app/[countryCode]/(main)/page.tsx`
- [x] `src/app/[countryCode]/(main)/privacy/page.tsx`
- [x] `src/app/[countryCode]/(main)/support/page.tsx`
- [x] `src/app/[countryCode]/(main)/terms/page.tsx`
- [x] `src/app/[countryCode]/(main)/wishlist/page.tsx`
- [x] `src/app/[countryCode]/(main)/wishlist/wishlist-client.tsx`
- [x] `src/app/[countryCode]/(main)/store/loading.tsx`

### ✅ Checkout components (14 files)
- [x] `src/modules/checkout/components/address-select/index.tsx`
- [x] `src/modules/checkout/components/addresses/index.tsx`
- [x] `src/modules/checkout/components/digital-info/index.tsx`
- [x] `src/modules/checkout/components/discount-code/index.tsx`
- [x] `src/modules/checkout/components/payment-container/index.tsx`
- [x] `src/modules/checkout/components/payment/index.tsx`
- [x] `src/modules/checkout/components/review/index.tsx`
- [x] `src/modules/checkout/components/shipping/index.tsx`
- [x] `src/modules/checkout/components/shipping-address/index.tsx`
- [x] `src/modules/checkout/components/submit-button/index.tsx`
- [x] `src/modules/checkout/components/payment-button/index.tsx`
- [x] `src/modules/checkout/components/payment-button/bold-button.tsx`
- [x] `src/modules/checkout/components/payment-button/cryptomus-button.tsx`
- [x] `src/modules/checkout/components/payment-test/index.tsx`

### ✅ Homepage components (5 files)
- [x] `src/modules/home/components/categories-section/index.tsx`
- [x] `src/modules/home/components/why-us/index.tsx`
- [x] `src/modules/home/components/trust-badges/index.tsx`
- [x] `src/modules/home/components/featured-products/product-rail/index.tsx`
- [x] `src/modules/home/components/featured-products/product-rail/CarouselArrows.tsx`

### ✅ Layout components (3 files)
- [x] `src/modules/layout/components/mobile-bottom-nav/index.tsx` (ya usaba colores custom)
- [x] `src/modules/layout/components/side-menu/index.tsx`
- [x] `src/modules/layout/components/search-bar.tsx`

### ✅ Common components (9 files)
- [x] `src/modules/common/components/breadcrumbs/index.tsx`
- [x] `src/modules/common/components/cart-totals/index.tsx`
- [x] `src/modules/common/components/input/index.tsx`
- [x] `src/modules/common/components/checkbox/index.tsx`
- [x] `src/modules/common/components/native-select/index.tsx`
- [x] `src/modules/common/components/toast/index.tsx`
- [x] `src/modules/common/components/recent-activity/index.tsx`
- [x] `src/modules/common/components/abandoned-cart-popup/index.tsx`
- [x] `src/modules/common/components/error-boundary/index.tsx`

### ✅ Product components (5 files)
- [x] `src/modules/products/templates/index.tsx`
- [x] `src/modules/products/templates/product-info/index.tsx`
- [x] `src/modules/products/components/product-tabs/index.tsx`
- [x] `src/modules/products/components/product-urgency/index.tsx`
- [x] `src/modules/products/components/product-preview/price.tsx`

### ✅ Order components (7 files)
- [x] `src/modules/order/templates/order-completed-template.tsx`
- [x] `src/modules/order/components/order-details/index.tsx`
- [x] `src/modules/order/components/payment-details/index.tsx`
- [x] `src/modules/order/components/shipping-details/index.tsx`
- [x] `src/modules/order/components/item/index.tsx`
- [x] `src/modules/order/components/license-keys/index.tsx`
- [x] `src/modules/order/components/help/index.tsx`

### ✅ Category / Collection
- [x] `src/modules/categories/templates/index.tsx`

### ✅ Store
- [x] `src/modules/store/components/empty-search-results/index.tsx`

### ✅ Skeletons (8 files)
- [x] `src/modules/skeletons/components/skeleton-button/index.tsx`
- [x] `src/modules/skeletons/components/skeleton-cart-totals/index.tsx`
- [x] `src/modules/skeletons/components/skeleton-checkout-form/index.tsx`
- [x] `src/modules/skeletons/components/skeleton-line-item/index.tsx`
- [x] `src/modules/skeletons/components/skeleton-order-items/index.tsx`
- [x] `src/modules/skeletons/components/skeleton-order-summary/index.tsx`
- [x] `src/modules/skeletons/templates/skeleton-cart-page/index.tsx`
- [x] `src/modules/skeletons/templates/skeleton-order-confirmed/index.tsx`

### ✅ Other (6 files)
- [x] `src/components/NewsletterSignup.tsx`
- [x] `src/components/ScrollToTop.tsx`
- [x] `src/components/StatsTerminal.tsx`
- [x] `src/modules/wishlist/components/wishlist-button.tsx`
- [x] `src/modules/shipping/components/free-shipping-price-nudge/index.tsx`
- [x] `src/modules/cart/components/cart-item-select/index.tsx`

---

## Paleta kk- (referencia rápida)

| Token | Hex | Uso |
|-------|-----|-----|
| kk-black | `#0a0a0a` | Fondos base, overlay badges |
| kk-card | `#111111` | Cards, paneles, footer |
| kk-elevated | `#1a1a1a` | Image bg, cart footer, stock badge |
| kk-border | `#2a2a2a` | Borders, separadores |
| kk-yellow | `#facc15` | CTAs, active links, badges, logo |
| kk-muted | `#888888` | Texto secundario, links inactivos |
| kk-yellow-hover | `#e6b800` | Hover para botones amarillos |

### Clases de utilidad custom
- `hero-grid-bg` — dot pattern background
- `text-glow-yellow` — text-shadow glow
- `shadow-glow-yellow` / `shadow-glow-yellow-sm` — box-shadow glow
- `.animate-marquee` — marquee animation (25s linear infinite)

### Mapa de reemplazo (regex fácil)
```
bg-gray-950   -> bg-[#0a0a0a]
bg-gray-900   -> bg-[#111111]
bg-gray-800   -> bg-[#1a1a1a]
gray-950      -> [#0a0a0a]
gray-900      -> [#111111]
gray-800      -> [#1a1a1a]
gray-700      -> [#2a2a2a]
gray-600      -> [#2a2a2a]
gray-500      -> [#888888]
gray-400      -> [#888888]
gray-300      -> [#888888]
yellow-400    -> [#facc15]
yellow-500    -> [#e6b800]
yellow-300    -> [#e6b800]

border-gray-700  -> border-[#2a2a2a]
border-gray-600  -> border-[#2a2a2a]
border-yellow-400 -> border-[#facc15]

text-gray-900 sobre bg-yellow-400 -> text-[#0a0a0a]
text-gray-900 sobre bg-[#facc15]  -> text-[#0a0a0a]
```

---

## Verificación
- `npm run build` (necesita .env con NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY y MEDUSA_BACKEND_URL)
- Revisar checkout manualmente: `?step=address|delivery|payment|review`
- No hay cambios de lógica — solo clases CSS
