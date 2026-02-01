import fs from 'fs-extra';
import path from 'node:path';
import { getTemplatePath } from '../utils/getTemplatePath.js';
import { copyTemplate } from '../utils/copyTemplate.js';
import { initGitRepo } from '../utils/git.js';
import { setupVitest } from '../utils/setupVitest.js';
import { installDependencies } from '../utils/installDependencies.js';
export async function createMonorepo({ projectName, webTemplate, apiTemplate, initGit, useVitest, packageManager, }) {
    // 1. Resolver ruta absoluta del proyecto
    const projectRoot = path.resolve(process.cwd(), projectName);
    // 2. Evitar sobrescribir carpetas existentes
    if (await fs.pathExists(projectRoot)) {
        throw new Error(`Directory "${projectName}" already exists`);
    }
    // 3. Crear estructura base del monorepo
    await fs.ensureDir(projectRoot);
    await fs.ensureDir(path.join(projectRoot, 'apps'));
    await fs.ensureDir(path.join(projectRoot, 'packages'));
    // 4. Crear archivos de configuración del monorepo
    await createMonorepoConfig(projectRoot, projectName);
    // 5. Copiar template de frontend a apps/web
    const webTemplatePath = getTemplatePath('frontend', webTemplate);
    if (await fs.pathExists(webTemplatePath)) {
        await copyTemplate(webTemplatePath, path.join(projectRoot, 'apps', 'web'), {
            projectName: `${projectName}-web`,
        });
    }
    // 6. Copiar template de backend a apps/api
    const apiTemplatePath = getTemplatePath('backend', apiTemplate);
    if (await fs.pathExists(apiTemplatePath)) {
        await copyTemplate(apiTemplatePath, path.join(projectRoot, 'apps', 'api'), {
            projectName: `${projectName}-api`,
        });
    }
    // 7. Crear package shared básico
    await createSharedPackage(projectRoot, projectName);
    // 8. Configurar Vitest en apps (si aplica)
    if (useVitest) {
        await setupVitest(path.join(projectRoot, 'apps', 'web'));
        await setupVitest(path.join(projectRoot, 'apps', 'api'));
    }
    // 9. Instalar dependencias
    installDependencies(projectRoot, packageManager);
    // 10. Inicializar Git (si aplica)
    if (initGit) {
        initGitRepo(projectRoot);
    }
}
async function createMonorepoConfig(projectRoot, projectName) {
    // package.json raíz
    const rootPackageJson = {
        name: projectName,
        private: true,
        scripts: {
            dev: 'pnpm -r dev',
            build: 'pnpm -r build',
            lint: 'pnpm -r lint',
        },
    };
    await fs.writeJson(path.join(projectRoot, 'package.json'), rootPackageJson, {
        spaces: 2,
    });
    // pnpm-workspace.yaml
    const workspaceConfig = `packages:
  - 'apps/*'
  - 'packages/*'
`;
    await fs.writeFile(path.join(projectRoot, 'pnpm-workspace.yaml'), workspaceConfig);
    // tsconfig.base.json
    const tsconfigBase = {
        compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            declaration: true,
            declarationMap: true,
            composite: true,
        },
    };
    await fs.writeJson(path.join(projectRoot, 'tsconfig.base.json'), tsconfigBase, {
        spaces: 2,
    });
    // README.md
    const readme = `# ${projectName}

Monorepo project created with devstarter-cli.

## Structure

\`\`\`
${projectName}/
├─ apps/
│  ├─ web/        ← frontend
│  └─ api/        ← backend
├─ packages/
│  └─ shared/     ← shared code
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
\`\`\`

## Getting Started

\`\`\`bash
pnpm dev
\`\`\`
`;
    await fs.writeFile(path.join(projectRoot, 'README.md'), readme);
}
async function createSharedPackage(projectRoot, projectName) {
    const sharedDir = path.join(projectRoot, 'packages', 'shared');
    await fs.ensureDir(path.join(sharedDir, 'src'));
    // package.json para shared
    const sharedPackageJson = {
        name: `@${projectName}/shared`,
        version: '0.0.1',
        private: true,
        type: 'module',
        main: './src/index.ts',
        types: './src/index.ts',
        scripts: {
            build: 'tsc',
            dev: 'tsc --watch',
        },
    };
    await fs.writeJson(path.join(sharedDir, 'package.json'), sharedPackageJson, {
        spaces: 2,
    });
    // tsconfig.json para shared
    const sharedTsconfig = {
        extends: '../../tsconfig.base.json',
        compilerOptions: {
            outDir: './dist',
            rootDir: './src',
        },
        include: ['src'],
    };
    await fs.writeJson(path.join(sharedDir, 'tsconfig.json'), sharedTsconfig, {
        spaces: 2,
    });
    // index.ts básico
    const indexContent = `// Shared utilities and types
export {};
`;
    await fs.writeFile(path.join(sharedDir, 'src', 'index.ts'), indexContent);
}
