import type { ResolvedInitContext } from '../types/cli.js';
import { styles } from './styles.js';
import { listTemplateFiles } from './listTemplateFiles.js';
import { getTemplatePath } from './getTemplatePath.js';

export function printDryRun(context: ResolvedInitContext): void {
  const baseDir = `./${context.projectName}`;

  console.log(`\n${styles.warning('Dry run – no changes will be made')}\n`);

  console.log(styles.title('Plan'));
  console.log(`${styles.info('- Create directory:')} ${baseDir}`);

  if (context.structure === 'monorepo') {
    printMonorepoPlan(context);
  } else {
    printBasicPlan(context);
  }

  console.log(
    `${styles.info('- Git:')} ${
      context.initGit ? 'would initialize' : 'skipped'
    }\n`,
  );

  console.log(styles.title('Next steps'));
  console.log(`  ${styles.highlight(`cd ${context.projectName}`)}`);
  console.log(`  ${styles.highlight(`${context.packageManager} install`)}`);
  console.log(`  ${styles.highlight(`${context.packageManager} run dev`)}`);
  console.log('');
}

function printBasicPlan(context: ResolvedInitContext & { structure: 'basic' }): void {
  const templatePath = getTemplatePath(context.projectType, context.template);
  const files = listTemplateFiles(templatePath);

  console.log(`${styles.info('- Template:')} ${context.projectType}/${context.template}`);
  console.log(styles.info('- Files:'));

  files.forEach((file) => {
    console.log(`  - ${file}`);
  });
}

function printMonorepoPlan(context: ResolvedInitContext & { structure: 'monorepo' }): void {
  console.log(`${styles.info('- Structure:')} monorepo`);
  console.log(`${styles.info('- Web template:')} frontend/${context.webTemplate}`);
  console.log(`${styles.info('- API template:')} backend/${context.apiTemplate}`);

  console.log(styles.info('- Structure:'));
  console.log('  - apps/');
  console.log('    - web/ (frontend)');
  console.log('    - api/ (backend)');
  console.log('  - packages/');
  console.log('    - shared/');
  console.log('  - package.json');
  console.log('  - pnpm-workspace.yaml');
  console.log('  - tsconfig.base.json');
}
