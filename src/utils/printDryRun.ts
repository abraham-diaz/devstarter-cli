import type { ProjectType } from '../types/project.js';

type PrintDryRunOptions = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn';
};

export function printDryRun({
  projectName,
  projectType,
  initGit,
  packageManager,
  
}: PrintDryRunOptions): void {
  const baseDir = `./${projectName}`;
  const template = `${projectType}/basic`;

  console.log('\nDry run – no changes will be made\n');

  console.log('Plan');
  console.log(`- Create directory: ${baseDir}`);
  console.log(`- Template: ${template}`);
  console.log('- Files:');

  if (projectType === 'backend') {
    console.log('  - package.json');
    console.log('  - README.md');
    console.log('  - src/index.ts');
  } else {
    console.log('  - package.json');
    console.log('  - README.md');
    console.log('  - src/main.ts');
  }

  console.log(`- Git: ${initGit ? 'would initialize' : 'skipped'}\n`);

  console.log('Next steps (if executed)');
  console.log(`  cd ${projectName}`);
  console.log(`  ${packageManager} install`);
  console.log(`  ${packageManager} run dev`);
  console.log('');
}
