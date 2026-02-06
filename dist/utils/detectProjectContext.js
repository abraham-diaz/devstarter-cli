import fs from 'fs-extra';
import path from 'node:path';
import { detectPackageManager } from './detectPackageManager.js';
export async function detectProjectContext(cwd = process.cwd()) {
    const packageJsonPath = path.join(cwd, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
        throw new Error('No package.json found in current directory. Run this command from a project root.');
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const hasTypescript = await fs.pathExists(path.join(cwd, 'tsconfig.json'));
    const packageManager = detectPackageManager(cwd);
    return {
        root: cwd,
        packageJson,
        hasTypescript,
        packageManager,
    };
}
