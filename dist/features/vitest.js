import fs from 'fs-extra';
import path from 'node:path';
import { setupVitest } from '../utils/setupVitest.js';
async function detect(context) {
    const configFiles = [
        'vitest.config.ts',
        'vitest.config.js',
        'vitest.config.mts',
        'vitest.config.mjs',
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
    return 'vitest' in deps;
}
async function apply(context) {
    await setupVitest(context.root);
}
export const vitestFeature = {
    id: 'vitest',
    name: 'Vitest',
    description: 'Unit testing framework for JavaScript and TypeScript',
    detect,
    apply,
};
