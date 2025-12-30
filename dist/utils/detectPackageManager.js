import fs from 'node:fs';
import path from 'node:path';
export function detectPackageManager(cwd = process.cwd()) {
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }
    return 'npm';
}
