import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export function detectPackageManager(
  cwd: string = process.cwd(),
): PackageManager {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}
