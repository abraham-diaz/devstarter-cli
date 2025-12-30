# devStarter CLI

CLI para generar proyectos con buenas prácticas y configuraciones predefinidas.

## Instalacion

```bash
npm install -g devstarter-cli
```

O ejecutar directamente con npx:

```bash
npx devstarter-cli init my-app
```

## Uso

### Comando basico

```bash
devstarter init [nombre-proyecto]
```

### Opciones

| Opcion | Descripcion |
|--------|-------------|
| `-y, --yes` | Usar valores por defecto sin preguntar |
| `-t, --type <tipo>` | Tipo de proyecto: `frontend` o `backend` |
| `--dry-run` | Previsualizar cambios sin crear archivos |

### Ejemplos

```bash
# Modo interactivo completo
devstarter init

# Crear proyecto con nombre especifico
devstarter init my-app

# Crear proyecto frontend sin preguntas
devstarter init my-app --type frontend -y

# Previsualizar que archivos se crearian
devstarter init my-app --type frontend --dry-run
```

## Templates disponibles

### Frontend

| Template | Descripcion |
|----------|-------------|
| `basic` | TypeScript minimal con estructura basica |
| `react` | React 18 + Vite + TypeScript |

### Backend

| Template | Descripcion |
|----------|-------------|
| `basic` | Express + TypeScript |

## Estructura de proyecto generado

```
my-app/
├── src/
│   └── main.ts (o main.tsx para React)
├── package.json
├── README.md
└── .git/ (si se inicializa git)
```

## Caracteristicas

- Deteccion automatica del package manager (npm, pnpm, yarn)
- Seleccion interactiva de templates
- Inicializacion de repositorio Git opcional
- Modo dry-run para previsualizar cambios
- Normalizacion automatica de nombres de proyecto (kebab-case)
- Output con colores para mejor legibilidad

## Desarrollo

### Requisitos

- Node.js 18+
- npm, pnpm o yarn

### Setup

```bash
# Clonar repositorio
git clone https://github.com/abraham-diaz/devStarter-cli.git
cd devStarter-cli

# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar localmente
node dist/cli.js init test-app --dry-run
```

### Scripts disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run build` | Compila TypeScript y copia templates |
| `npm run dev` | Modo watch para desarrollo |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea codigo con Prettier |

### Agregar nuevos templates

1. Crear carpeta en `src/templates/<tipo>/<nombre-template>/`
2. Agregar archivos del template (usar `.tpl` para archivos con placeholders)
3. Placeholders disponibles: `{{projectName}}`
4. Ejecutar `npm run build`

## Licencia

MIT
