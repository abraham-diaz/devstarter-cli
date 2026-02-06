# devstarter-tool

CLI to generate projects with best practices and predefined configurations.

## Features

- **Project scaffolding**: Create frontend, backend, or monorepo projects in seconds
- **`add` command**: Add features like ESLint, Vitest, and Prettier to existing projects
- **Interactive prompts**: Guided project creation or flag-based configuration
- **Automatic dependency installation**: No need to run `npm install` manually
- **Package manager detection**: Automatically uses npm, pnpm, or yarn
- **Git initialization**: Optional repository setup
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

# Add features to an existing project
devstarter add prettier
devstarter add eslint

# Preview without creating files
devstarter init my-app --dry-run
```

## Commands

### `devstarter init`

Scaffolds a new project from a template.

```bash
devstarter init [project-name] [options]
```

| Option | Description |
|--------|-------------|
| `-y, --yes` | Use default values without prompting |
| `-t, --type <type>` | Project type: `frontend` or `backend` |
| `--template <name>` | Template to use (e.g., `basic`, `react`) |
| `--vitest` | Add Vitest for testing |
| `--no-git` | Skip Git repository initialization |
| `--no-vitest` | Skip Vitest testing framework setup |
| `--dry-run` | Preview changes without creating files |

#### Examples

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

### `devstarter add`

Adds features to an existing project. Automatically detects features already configured and skips them.

```bash
devstarter add [feature] [options]
```

| Option | Description |
|--------|-------------|
| `--list` | List all available features |
| `-y, --yes` | Add all available features without prompting |
| `--dry-run` | Show what would be added without making changes |

#### Available Features

| Feature | Description | What it adds |
|---------|-------------|--------------|
| `eslint` | Linter for JavaScript and TypeScript | `eslint.config.js`, lint script, ESLint + typescript-eslint deps |
| `vitest` | Unit testing framework | `vitest.config.ts`, test scripts, Vitest dep |
| `prettier` | Code formatter | `.prettierrc`, format script, Prettier dep |

#### Examples

```bash
# Add a specific feature
devstarter add prettier
devstarter add eslint
devstarter add vitest

# Interactive mode - choose from available features
devstarter add

# Add all available features at once
devstarter add -y

# List available features
devstarter add --list

# Preview changes
devstarter add prettier --dry-run
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
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Single test run |
| `npm run test:coverage` | Coverage with HTML + text reports |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Adding New Templates

1. Create folder in `src/templates/<type>/<template-name>/`
2. Add template files (use `.tpl` extension for files with placeholders)
3. Available placeholders: `{{projectName}}`
4. Run `npm run build`

## License

MIT
