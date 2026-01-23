# devstarter-tool

CLI to generate projects with best practices and predefined configurations.

## Installation

```bash
npm install -g devstarter-tool
```

Or run directly with npx:

```bash
npx devstarter-tool init my-app
```

## Usage

### Basic command

```bash
devstarter init [project-name]
```

### Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Use default values without prompting |
| `-t, --type <type>` | Project type: `frontend` or `backend` |
| `--template <name>` | Template to use |
| `--dry-run` | Preview changes without creating files |
| `--no-git` | Skip git repository initialization |
| `--no-vitest` | Skip Vitest testing framework setup |

### Examples

```bash
# Full interactive mode
devstarter init

# Create project with specific name
devstarter init my-app

# Create frontend project without prompts
devstarter init my-app --type frontend -y

# Preview what files would be created
devstarter init my-app --type frontend --dry-run

# Create project without git initialization
devstarter init my-app --no-git

# Create project without Vitest setup
devstarter init my-app --no-vitest
```

## Project Structures

### Basic (single project)

```
my-app/
├── src/
│   ├── main.ts (or main.tsx for React)
│   └── __tests__/
│       └── example.test.ts
├── vitest.config.ts
├── package.json
├── README.md
└── .git/ (if git is initialized)
```

### Monorepo (full-stack)

```
my-app/
├── apps/
│   ├── web/        <- frontend template
│   └── api/        <- backend template
├── packages/
│   └── shared/     <- shared code
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Available Templates

### Frontend

| Template | Description |
|----------|-------------|
| `basic` | Minimal TypeScript with basic structure |
| `react` | React 18 + Vite + TypeScript |

### Backend

| Template | Description |
|----------|-------------|
| `basic` | Express + TypeScript |

## Features

- Project structure selection (basic or monorepo)
- Automatic package manager detection (npm, pnpm, yarn)
- Interactive template selection
- Optional Git repository initialization
- Optional Vitest testing framework setup
- Dry-run mode to preview changes
- Automatic project name normalization (kebab-case)
- Colored output for better readability

## Testing Setup (Vitest)

By default, projects are created with Vitest configured. This includes:

- `vitest` as a dev dependency
- `vitest.config.ts` configuration file
- Example test file in `src/__tests__/example.test.ts`
- `test` script in package.json

For React projects, it also adds `jsdom` for DOM testing.

To skip Vitest setup, use the `--no-vitest` flag:

```bash
devstarter init my-app --no-vitest
```

## Development

### Requirements

- Node.js 18+
- npm, pnpm or yarn

### Setup

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

### Available Scripts

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
