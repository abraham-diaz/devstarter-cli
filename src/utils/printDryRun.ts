import type { ProjectType } from '../types/project.js';
import { styles } from './styles.js';
import { listTemplateFiles } from './listTemplateFiles.js';
import { getTemplatePath } from './getTemplatePath.js';

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
}: PrintDryRunOptions): void {
  const baseDir = `./${projectName}`;
  const templatePath = getTemplatePath(projectType);
  const files = listTemplateFiles(templatePath);

  console.log(`\n${styles.warning('Dry run – no changes will be made')}\n`);

  console.log(styles.title('Plan'));
  console.log(`${styles.info('- Create directory:')} ${baseDir}`);
  console.log(`${styles.info('- Template:')} ${projectType}/basic`);
  console.log(styles.info('- Files:'));

  files.forEach((file) => {
    console.log(`  - ${file}`);
  });

  console.log(
    `${styles.info('- Git:')} ${
      initGit ? 'would initialize' : 'skipped'
    }\n`,
  );

  console.log(styles.title('Next steps'));
  console.log(`  ${styles.highlight(`cd ${projectName}`)}`);
  console.log(`  ${styles.highlight('npm install')}`);
  console.log(`  ${styles.highlight('npm run dev')}`);
  console.log('');
}
