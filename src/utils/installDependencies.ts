import { execSync } from 'node:child_process';
import type { PackageManager } from './detectPackageManager.js';

export function installDependencies(
  projectRoot: string,
  packageManager: PackageManager,
): void {
  const command = packageManager === 'yarn' ? 'yarn' : `${packageManager} install`;

  execSync(command, {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}
