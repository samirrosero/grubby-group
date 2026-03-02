# IPS Salud (Proyecto de Salud)

Este repositorio alberga una aplicación web de ejemplo construida con Astro y un servidor Express/SQLite para manejar el registro de pacientes y la gestión de citas médicas.

El sitio incluye:

- Página de aterrizaje con información sobre el servicio de salud.
- Formulario para registrar pacientes (`/registro`).
- Interfaz para agendar citas (`/agendar`).
- Vista de las citas programadas (`/citas`).
- Backend simple en `backend/server.js` con endpoints REST y base de datos SQLite.

## 🚀 Estructura del proyecto

```
/
├── backend/                # servidor Node/Express
│   └── server.js
├── public/                 # activos estáticos (CSS, JS, imágenes)
│   ├── css/
│   └── js/
├── src/
│   └── pages/              # rutas Astro
│       ├── index.astro
│       ├── registro.astro
│       ├── agendar.astro
│       └── citas.astro
└── package.json
```

## 🧞 Comandos útiles

Ejecuta los siguientes comandos en la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                            |
| `npm run dev`             | Inicia el servidor Astro en `localhost:4321`    |
| `npm run build`           | Genera el sitio de producción en `./dist/`      |
| `npm run preview`         | Vista previa de la compilación                  |
| `node backend/server.js`  | Inicia el backend en `http://localhost:3000`    |

> ⚠️ Asegúrate de ejecutar primero `npm install` en la raíz antes de iniciar cualquiera de los servidores.

## 🛠 Tecnología

- [Astro](https://astro.build) para el frontend
- [Express](https://expressjs.com) + [SQLite](https://www.sqlite.org) para el backend

## 📄 Notas

Este es un ejemplo básico y se puede extender con autenticación, validación de formularios, estilos avanzados, etc.
