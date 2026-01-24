import type { ResolvedInitContext } from '../types/cli.js';
import { styles } from './styles.js';

export function printSummary(context: ResolvedInitContext): void {
  console.log(`\n${styles.success('✔ Project created successfully')}\n`);

  console.log(styles.title('Summary'));

  if (context.structure === 'monorepo') {
    console.log(`${styles.info('- Structure:')} monorepo`);
    console.log(`${styles.info('- Web template:')} frontend/${context.webTemplate}`);
    console.log(`${styles.info('- API template:')} backend/${context.apiTemplate}`);
  } else {
    console.log(`${styles.info('- Template:')} ${context.projectType}/${context.template}`);
  }

  console.log(`${styles.info('- Directory:')} ./${context.projectName}`);
  console.log(
    `${styles.info('- Git:')} ${
      context.initGit ? styles.success('initialized') : styles.muted('not initialized')
    }\n`,
  );

  console.log(styles.title('Next steps'));
  console.log(`  ${styles.highlight(`cd ${context.projectName}`)}`);
  console.log(`  ${styles.highlight(`${context.packageManager} run dev`)}`);
  console.log('');
}
