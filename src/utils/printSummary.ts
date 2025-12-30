import type { ProjectType } from '../types/project.js';
import {styles} from './styles.js';


type PrintSummaryOptions = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn';
};

export function printSummary({
  projectName,
  projectType,
  initGit,
  packageManager,
}: PrintSummaryOptions): void {
console.log(`\n${styles.success('✔ Project created successfully')}\n`);

console.log(styles.title('Summary'));
console.log(`${styles.info('- Type:')} ${projectType}`);
console.log(`${styles.info('- Directory:')} ./${projectName}`);
console.log(
  `${styles.info('- Git:')} ${
    initGit ? styles.success('initialized') : styles.muted('not initialized')
  }\n`,
);

console.log(styles.title('Next steps'));
console.log(`  ${styles.highlight(`cd ${projectName}`)}`);
console.log(`  ${styles.highlight(`${packageManager} install`)}`);
console.log(`  ${styles.highlight(`${packageManager} run dev`)}`);
console.log('');

}
