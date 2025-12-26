import fs from 'fs-extra';
import path from 'node:path';
import { initGitRepo } from '../utils/git.js';
export async function createProject({ projectName, projectType, initGit, }) {
    const projectRoot = path.resolve(process.cwd(), projectName);
    if (await fs.pathExists(projectRoot)) {
        throw new Error(`Directory "${projectName}" already exists`);
    }
    await fs.ensureDir(projectRoot);
    await fs.ensureDir(path.join(projectRoot, 'src'));
    if (projectType === 'frontend') {
        await fs.ensureDir(path.join(projectRoot, 'src', 'components'));
    }
    if (projectType === 'backend') {
        await fs.ensureDir(path.join(projectRoot, 'src', 'routes'));
    }
    await fs.writeFile(path.join(projectRoot, 'README.md'), `# ${projectName}\n\nGenerated with devstarter-cli\n`);
    await fs.writeFile(path.join(projectRoot, 'package.json'), JSON.stringify({
        name: projectName,
        private: true,
    }, null, 2));
    await fs.writeFile(path.join(projectRoot, '.gitignore'), `node_modules
dist
.env
`);
    if (initGit) {
        initGitRepo(projectRoot);
    }
}
