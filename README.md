# devstarter-tool

CLI to generate projects with best practices and predefined configurations.

## Features

- **Project structures**: Basic (single project) or Monorepo (full-stack)
- **Automatic dependency installation**: No need to run `npm install` manually
- **Vitest integration**: Optional testing setup with one flag
- **Package manager detection**: Automatically uses npm, pnpm, or yarn
- **Git initialization**: Optional repository setup
- **Interactive prompts**: Guided project creation
- **Dry-run mode**: Preview changes before creating files

## Installation

```bash
npm install -g devstarter-tool
```

Or run directly with npx:

```bash
npx devstarter-tool init my-app
```

## Quick Start

```bash
# Interactive mode - guided setup
devstarter init

# Quick project with defaults
devstarter init my-app -y

# Frontend project with Vitest
devstarter init my-app --type frontend --vitest

# Preview without creating files
devstarter init my-app --dry-run
```

## Usage

```bash
devstarter init [project-name] [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Use default values without prompting |
| `-t, --type <type>` | Project type: `frontend` or `backend` |
| `--template <name>` | Template to use (e.g., `basic`, `react`) |
| `--vitest` | Add Vitest for testing |
| `--no-git` | Skip Git repository initialization |
| `--dry-run` | Preview changes without creating files |

### Examples

```bash
# Full interactive mode
devstarter init

# Create project with specific name
devstarter init my-app

# Frontend with React template
devstarter init my-app --type frontend --template react

# Backend with testing setup
devstarter init my-api --type backend --vitest

# Quick frontend with all defaults
devstarter init my-app --type frontend -y

# Create without Git
devstarter init my-app --no-git
```

## Project Structures

### Basic (single project)

```
my-app/
├── src/
│   └── main.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts   # if --vitest
├── node_modules/
└── .git/              # if git initialized
```

### Monorepo (full-stack)

```
my-app/
├── apps/
│   ├── web/           # frontend template
│   │   ├── src/
│   │   ├── package.json
│   │   └── vitest.config.ts
│   └── api/           # backend template
│       ├── src/
│       ├── package.json
│       └── vitest.config.ts
├── packages/
│   └── shared/        # shared code
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Available Templates

### Frontend

| Template | Description |
|----------|-------------|
| `basic` | Vite + TypeScript |
| `react` | React 18 + Vite + TypeScript |

### Backend

| Template | Description |
|----------|-------------|
| `basic` | Express + TypeScript |

## Vitest Integration

When using `--vitest`, the CLI adds:

- `vitest` as a dev dependency
- `vitest.config.ts` with basic configuration
- `test` and `test:run` scripts in package.json

```bash
# Create project with Vitest
devstarter init my-app --vitest

# Then run tests
cd my-app
npm test
```

## Requirements

- Node.js 18+
- npm, pnpm, or yarn

## Development

```bash
# Clone repository
git clone https://github.com/abraham-diaz/devstarter-cli.git
cd devstarter-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/cli.js init test-app --dry-run
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript and copy templates |
| `npm run dev` | Watch mode for development |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Adding New Templates

1. Create folder in `src/templates/<type>/<template-name>/`
2. Add template files (use `.tpl` extension for files with placeholders)
3. Available placeholders: `{{projectName}}`
4. Run `npm run build`

## License

MIT
