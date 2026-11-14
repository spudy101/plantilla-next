# Plantilla Next.js

Front base en **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4**, conectado a
[`plantilla-microservicio`](https://github.com/spudy101/plantilla-microservicio) a través del api-gateway.

Incluye: **home pública, login, registro y panel privado**. El diseño es intencionalmente sobrio: los
colores y tipografías viven en tokens (`src/app/globals.css`) para rediseñar sin tocar componentes.

## Decisiones clave

| Decisión | Por qué |
| --- | --- |
| **Patrón BFF**: el navegador nunca habla con el backend | Server actions y server components llaman al gateway desde el servidor de Next. Sin CORS y sin tokens expuestos. |
| **Tokens en cookies httpOnly** (`pm_at`, `pm_rt`) | JavaScript del navegador no puede leerlos → un XSS no roba la sesión. |
| **`proxy.ts`** (antes `middleware.ts`) | Refresca el access token antes de renderizar y protege rutas. |
| **Doble barrera** | `proxy.ts` mira las cookies (rápido); el layout privado valida contra el backend (`/auth/me`). |
| **Server actions + `useActionState`** | Formularios sin estado de carga manual ni fetch en el cliente; funcionan aunque falle JS. |
| **Organización por feature** | Todo lo de auth en `features/auth`; agregar un módulo no toca los demás. |
| **Validación con zod** en el front | Solo para UX: la validación que manda es la del backend (los errores 422 se muestran por campo). |

Lo que **no** trae a propósito (agregar cuando haga falta): librería de componentes, estado global,
React Query (con server components casi no se necesita), i18n.

## Estructura

```
src/
├── app/                         # SOLO routing: páginas delgadas que componen features
│   ├── (public)/                # home — header según haya sesión o no
│   ├── (auth)/login · register  # layout centrado; proxy.ts saca a quien ya tiene sesión
│   ├── (private)/dashboard      # layout que valida al usuario contra el backend
│   ├── layout.tsx · globals.css · error.tsx · not-found.tsx
├── features/
│   ├── auth/
│   │   ├── actions.ts           # server actions: login, register, logout
│   │   ├── auth.api.ts          # llamadas a iam-service
│   │   ├── session.ts           # leer/escribir cookies, getCurrentUser (server-only)
│   │   ├── session-cookies.ts   # definición única de cookies (la comparten actions y proxy)
│   │   ├── schemas.ts · form-state.ts · types.ts
│   │   └── components/          # login-form, register-form, logout-button
│   └── profile/                 # person-service: profile.api.ts + profile-card
├── components/
│   ├── ui/                      # button, input, form-field, alert, card… (sin lógica de negocio)
│   └── layout/                  # site-header
├── lib/
│   ├── api/http.ts · api-error.ts   # fetch al gateway + error tipado (mismo contrato que ApiResponse)
│   ├── env.ts                   # variables validadas con zod
│   └── utils/cn.ts
├── config/routes.ts             # rutas, rutas protegidas y safeRedirectPath (anti open-redirect)
└── proxy.ts
```

**Reglas:**

- `app/` no tiene lógica: importa de `features/`.
- Una feature puede usar `components/`, `lib/` y `config/`, pero no las internas de otra feature.
- Archivos en kebab-case; imports con alias `@/`.
- `session.ts` y `profile.api.ts` son `server-only`; `lib/env.ts` falla si se ejecuta en el navegador (proxy.ts no puede usar `server-only`).

## Flujo de sesión

```
Login (server action) → POST /auth/login → cookies httpOnly → redirect /dashboard
Request a /dashboard → proxy.ts:
   ├─ hay access cookie → sigue
   ├─ no hay access pero sí refresh → POST /auth/refresh → cookies nuevas → sigue
   └─ nada → /login?next=/dashboard
Layout privado → GET /auth/me (con el token) → si 401 → /login
Logout (server action) → POST /auth/logout (revoca en el backend) → borra cookies → /
```

El cookie del access token vence 30 s antes que el JWT, así siempre se refresca a tiempo.

## Puesta en marcha

```bash
cp .env.example .env.local    # API_URL=http://localhost:4000 (gateway)
pnpm install
pnpm dev                      # http://localhost:3000
```

Requiere el backend corriendo (`docker compose up` en plantilla-microservicio).

```bash
pnpm lint · pnpm test · pnpm build · pnpm typecheck
docker build -t plantilla-next .   # imagen standalone
```

> En producción las cookies son `Secure`: la app debe servirse por HTTPS.

## Próximos pasos sugeridos

- Rediseño visual sobre los tokens de `globals.css` y los componentes de `components/ui`.
- Editar perfil (`PUT /api/v1/persons/me`) con el mismo patrón de server action + formulario.
- Bandeja de notificaciones (`/api/v1/notifications`).
- Tests de componentes con Testing Library y e2e con Playwright para el flujo login → panel.
