# CoSpace

Plataforma fullstack de reservas de espacios de coworking (escritorios, salas de reuniones y cabinas) por horas.
Los usuarios se registran, exploran el catálogo, reservan y cancelan sus reservas; los administradores gestionan los espacios.
Hecha con Next.js 16 (App Router), TypeScript, Prisma y PostgreSQL (Supabase).

## 1. Requisitos previos

- Node.js 22 o superior y npm
- Una cuenta de [Supabase](https://supabase.com) con un proyecto creado (o PostgreSQL local)
- Docker (opcional, para ejecutar la imagen)

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa:

| Variable | Para qué sirve | Cómo obtenerla |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | Supabase → botón **Connect** → **Session pooler** (puerto 5432). Reemplaza `[YOUR-PASSWORD]` por la contraseña de la base de datos |
| `JWT_ACCESS_SECRET` | Firma el access token | `openssl rand -base64 48` |
| `JWT_REFRESH_SECRET` | Firma el refresh token (distinto al anterior) | `openssl rand -base64 48` |
| `ACCESS_TOKEN_EXPIRES_IN` | Duración del access token | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Duración del refresh token | `7d` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credenciales del administrador que crea el seed | Las que quieras |

## 3. Ejecución en desarrollo (en este orden)

```bash
git clone <URL-DEL-REPOSITORIO>
cd <CARPETA>
npm install                       # instala dependencias y genera el cliente de Prisma
cp .env.example .env              # y completa los valores
npx prisma migrate deploy         # crea las tablas
npx prisma db seed                # crea el admin, usuarios y espacios de ejemplo
npm run dev                       # http://localhost:3000
```

## 4. Credenciales de ejemplo (seed)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@cospace.com` | `Admin1234!` (o lo que pongas en `.env`) |
| Usuarios | `ana@cospace.com`, `luis@cospace.com` | `User1234!` |

## 5. Ejecución con Docker

```bash
docker build -t cospace .
docker run -p 3000:3000 --env-file .env cospace
```

Las variables se pasan con `--env-file .env`. Las migraciones y el seed se ejecutan aparte (paso 3), apuntando a la misma base de datos.

## 6. Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Compila y ejecuta en producción |
| `npm run lint` | ESLint |
| `npm test` | Pruebas de las reglas de reserva (Vitest) |
| `npx prisma migrate deploy` | Aplica las migraciones |
| `npx prisma db seed` | Carga los datos de ejemplo |
| `npx prisma studio` | Explorador visual de la base de datos |

## 7. Estructura de carpetas

```
prisma/                 esquema, migraciones y seed
messages/               textos en español e inglés
src/
├── proxy.ts            protege rutas privadas y de admin, renueva la sesión y aplica el idioma
├── i18n/               configuración de next-intl
├── app/
│   ├── [locale]/       páginas por route group: (public) (auth) (private) (admin)
│   └── api/            route handlers: auth, spaces, bookings, admin
├── features/           código por funcionalidad
│   ├── auth/           tokens, cookies, sesión, servicio y formularios
│   ├── spaces/         catálogo, detalle, administración de espacios
│   ├── bookings/       reglas de reserva, servicio, formulario y panel
│   └── home/           página de inicio
└── shared/             UI reutilizable, layouts, cliente HTTP, tipos y utilidades de servidor
```

## 8. Decisiones

- **Renderizado:** Home SSG, catálogo y detalle SSR, dashboard CSR.
- **Zona horaria:** las fechas se guardan en UTC; el horario de 7:00 a 21:00 se valida en `America/Bogota`.
- **Concurrencia:** crear una reserva bloquea la fila del espacio y la del usuario (`SELECT ... FOR UPDATE`), así dos reservas simultáneas no pueden ocupar el mismo hueco.
- **Códigos HTTP:** 400 datos inválidos (reglas 1-3), 401 sin sesión, 403 sin permiso, 404 no existe o es de otro usuario, 409 conflicto (reglas 4-7, 10, 13).
- **Seguridad:** tokens solo en cookies `httpOnly`, `secure` y `sameSite`; el refresh token se guarda hasheado, rota en cada uso y el logout lo revoca. Cada handler valida sesión y rol, sin depender del proxy.

## 9. URL desplegada

https://<tu-app>.vercel.app
