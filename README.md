# TrocSkillHub — Front-end 

This README explains how to install, run and build the application locally, and how to run it with Docker.Currently, two official plugins are available:

## Prerequisites- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- Node.js (recommended versions: 16.x or 18.x)

- npm (or yarn / pnpm) — examples below use `npm`## React Compiler

- Git (for cloning the repository)

- (Optional) Docker & Docker Compose — if you want to run the app in a containerThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Development setup## Expanding the ESLint configuration

```bash
cd app_front-end
```

2. Install dependencies:

```bash
npm install
# or with yarn: yarn
# or with pnpm: pnpm install
```

3. Start the development server (Vite):

```bash
npm run dev
```

By default Vite serves the app at http://localhost:5173 (or another free port if 5173 is in use).

## Useful scripts (from `app_front-end`)

- `npm run dev` — start development server with HMR
- `npm run build` — build the app for production (output in `dist`)
- `npm run preview` — serve the production build locally (if configured)
- `npm run lint` — run ESLint (if configured)

Check `package.json` for the exact scripts available in this project.

## Building for production

1. Create a production build:

```bash
npm run build
```

2. Build output will be written to `app_front-end/dist`.

Serve that folder with any static server (nginx, `serve`, Surge, etc.). This project includes an `nginx.conf` and a `Dockerfile` to help deploy the build.

## Running with Docker / Docker Compose

There is a `Dockerfile` and a `docker-compose.yaml` at the repository root. Minimal examples to build and run the image:

```bash
# Build the Docker image from the repository root
docker build -t trocskillhub-frontend .

# Or use docker compose (from the repository root)
docker compose up --build