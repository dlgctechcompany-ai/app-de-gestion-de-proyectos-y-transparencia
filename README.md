# ¿Cumplió? — Veeduría ciudadana

Menos blablá, más acción. Sitio de seguimiento ciudadano a las promesas de
gobierno de presidentes, gobernadores y alcaldes en Colombia: qué
prometieron, qué se ha hecho, qué falta, por qué no se ha hecho y cuándo se
espera que esté listo.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **Supabase** (Postgres + Auth) como backend
- Despliegue recomendado: **Vercel**

## Estructura

- `/` — listado público de promesas con barra de progreso, filtros por
  categoría y estado.
- `/promesas/[id]` — detalle de una promesa: qué se prometió, historial de
  actualizaciones, por qué no se ha hecho, fuentes.
- `/admin` — panel protegido (requiere login) para cargar funcionarios,
  categorías, promesas y actualizaciones de seguimiento.
- `/admin/login` — acceso del equipo editorial.

## Modelo de datos (Supabase)

- `officials` — funcionarios (presidente, gobernador, alcalde).
- `categories` — categorías temáticas (seguridad, salud, economía, etc.).
- `promises` — promesas/proyectos: título, descripción, estado, % de avance,
  fecha meta, fuente.
- `promise_updates` — historial de seguimiento de cada promesa: qué pasó,
  por qué no se ha hecho, nuevo estado/avance, fuente.
- `admin_profiles` — quién puede editar desde el panel (referencia a
  `auth.users`).

Todo el contenido es de lectura pública (RLS `select using (true)`); solo
usuarios en `admin_profiles` con `is_admin = true` pueden escribir.

## Cómo cargar y mantener el contenido (modelo híbrido)

Fase 1 (ahora): carga y actualización manual desde `/admin`. Cada promesa
tiene su propio historial de actualizaciones con fecha, fuente y motivo de
bloqueo si aplica.

Fase 2 (futuro): automatizar la extracción desde fuentes oficiales (SECOP,
planes de desarrollo, rendición de cuentas) una vez el modelo de datos esté
validado con datos reales.

## Desarrollo local

```bash
npm install
npm run dev
```

Necesitas un archivo `.env.local` (ver `.env.example`) con las credenciales
del proyecto de Supabase.

## Desplegar

1. Sube este repo a GitHub.
2. Impórtalo en [Vercel](https://vercel.com/new).
3. Agrega las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` en la configuración del proyecto en
   Vercel (los mismos valores de `.env.local`).
4. Deploy.

> Nota: este proyecto se construyó y verificó (`npm run build`) dentro de un
> entorno en la nube cuya política de red no permite salidas hacia
> `*.supabase.co`, así que la vista previa en vivo no se pudo probar desde
> ahí. El esquema, las políticas de seguridad (RLS) y los datos sembrados sí
> se verificaron directamente en Supabase. En Vercel (o en tu máquina local)
> no hay esa restricción y la app debería funcionar de inmediato.

## Pendientes sugeridos

- Habilitar "Leaked Password Protection" en Supabase Auth (Authentication →
  Policies) — es un ajuste de configuración, no de esquema.
- Agregar gobernadores/alcaldes cuando se defina el siguiente nivel a cubrir.
- Fase 2 de datos: automatizar fuentes oficiales.
- Definir dominio propio y branding definitivo.
