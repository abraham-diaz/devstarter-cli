import fs from 'fs-extra';
import path from 'node:path';
const PRETTIER_CONFIG = `{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2
}
`;
async function detect(context) {
    const configFiles = [
        '.prettierrc',
        '.prettierrc.json',
        '.prettierrc.yaml',
        '.prettierrc.yml',
        '.prettierrc.js',
        '.prettierrc.cjs',
        '.prettierrc.mjs',
        'prettier.config.js',
        'prettier.config.cjs',
        'prettier.config.mjs',
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
    return 'prettier' in deps;
}
async function apply(context) {
    const packageJsonPath = path.join(context.root, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.devDependencies = {
        ...packageJson.devDependencies,
        prettier: '^3.0.0',
    };
    packageJson.scripts = {
        ...packageJson.scripts,
        format: 'prettier --write .',
    };
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    await fs.writeFile(path.join(context.root, '.prettierrc'), PRETTIER_CONFIG);
}
export const prettierFeature = {
    id: 'prettier',
    name: 'Prettier',
    description: 'Code formatter for JavaScript and TypeScript',
    detect,
    apply,
};
