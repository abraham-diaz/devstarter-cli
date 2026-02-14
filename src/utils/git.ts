import { execSync } from 'node:child_process';
import fs from 'fs-extra';
import path from 'node:path';

export function initGitRepo(projectRoot: string): void {
  if (!fs.existsSync(projectRoot)) {
    throw new Error('Project root does not exist');
  }

  // check if .git already exists to avoid overwriting existing repos
  if (fs.existsSync(path.join(projectRoot, '.git'))) {
    throw new Error('Git repository already exists in project root');
  }

  try {
    execSync('git init', {
      cwd: projectRoot,
      stdio: 'ignore',
    });

    execSync('git add .', {
      cwd: projectRoot,
      stdio: 'ignore',
    });

    execSync('git commit -m "Initial commit"', {
      cwd: projectRoot,
      stdio: 'ignore',
    });
  } catch {
    throw new Error('Failed to initialize git repository');
  }
}
