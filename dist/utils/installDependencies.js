import { execSync } from 'node:child_process';
export function installDependencies(projectRoot, packageManager) {
    const command = packageManager === 'yarn' ? 'yarn' : `${packageManager} install`;
    execSync(command, {
        cwd: projectRoot,
        stdio: 'inherit',
    });
}
