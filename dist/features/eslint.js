import fs from 'fs-extra';
import path from 'node:path';
const ESLINT_CONFIG_TS = `import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/'],
  },
);
`;
const ESLINT_CONFIG_JS = `import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
  {
    ignores: ['dist/'],
  },
];
`;
async function detect(context) {
    const configFiles = [
        'eslint.config.js',
        'eslint.config.mjs',
        'eslint.config.cjs',
        '.eslintrc.js',
        '.eslintrc.json',
        '.eslintrc.yml',
        '.eslintrc',
    ];
    for (const file of configFiles) {
        if (await fs.pathExists(path.join(context.root, file))) {
            return true;
        }
    }
    const deps = {
        ...(context.packageJson.dependencies ?? {}),
        ...(context.packageJson.devDependencies ?? {}),
    };
    return 'eslint' in deps;
}
async function apply(context) {
    const packageJsonPath = path.join(context.root, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    const devDeps = {
        eslint: '^9.0.0',
        '@eslint/js': '^9.0.0',
    };
    if (context.hasTypescript) {
        devDeps['typescript-eslint'] = '^8.0.0';
    }
    packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...devDeps,
    };
    packageJson.scripts = {
        ...packageJson.scripts,
        lint: 'eslint .',
    };
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    const configContent = context.hasTypescript
        ? ESLINT_CONFIG_TS
        : ESLINT_CONFIG_JS;
    await fs.writeFile(path.join(context.root, 'eslint.config.js'), configContent);
}
export const eslintFeature = {
    id: 'eslint',
    name: 'ESLint',
    description: 'Linter for JavaScript and TypeScript',
    detect,
    apply,
};
