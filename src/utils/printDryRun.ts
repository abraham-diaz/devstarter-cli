import type { ProjectType } from '../types/project.js';
import {styles} from './styles.js';

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

  console.log(`\n${styles.warning('Dry run – no changes will be made')}\n`);

console.log(styles.title('Plan'));
console.log(`${styles.info('- Create directory:')} ${baseDir}`);
console.log(`${styles.info('- Template:')} ${template}`);
console.log(styles.info('- Files:'));

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

  console.log(styles.title('Next steps (if executed'));
console.log(`  ${styles.highlight(`cd ${projectName}`)}`);
console.log(`  ${styles.highlight(`${packageManager} install`)}`);
console.log(`  ${styles.highlight(`${packageManager} run dev`)}`);
console.log('');
}
