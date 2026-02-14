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

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install --frozen-lockfile';
    case 'yarn':
      return 'yarn install --frozen-lockfile';
    default:
      return 'npm ci';
  }
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case 'pnpm':
      return `pnpm run ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    default:
      return `npm run ${script}`;
  }
}
