import { styles } from './styles.js';
import { listTemplateFiles } from './listTemplateFiles.js';
import { getTemplatePath } from './getTemplatePath.js';
export function printDryRun({ projectName, projectType, template, initGit, }) {
    const baseDir = `./${projectName}`;
    const templatePath = getTemplatePath(projectType, template);
    const files = listTemplateFiles(templatePath);
    console.log(`\n${styles.warning('Dry run – no changes will be made')}\n`);
    console.log(styles.title('Plan'));
    console.log(`${styles.info('- Create directory:')} ${baseDir}`);
    console.log(`${styles.info('- Template:')} ${projectType}/${template}`);
    console.log(styles.info('- Files:'));
    files.forEach((file) => {
        console.log(`  - ${file}`);
    });
    console.log(`${styles.info('- Git:')} ${initGit ? 'would initialize' : 'skipped'}\n`);
    console.log(styles.title('Next steps'));
    console.log(`  ${styles.highlight(`cd ${projectName}`)}`);
    console.log(`  ${styles.highlight('npm install')}`);
    console.log(`  ${styles.highlight('npm run dev')}`);
    console.log('');
}
