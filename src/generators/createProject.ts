import fs from 'fs-extra';
import path from 'node:path';

import type { ResolvedBasicContext } from '../types/cli.js';
import { getTemplatePath } from '../utils/getTemplatePath.js';
import { copyTemplate } from '../utils/copyTemplate.js';
import { initGitRepo } from '../utils/git.js';
import { setupVitest } from '../utils/setupVitest.js';
import { installDependencies } from '../utils/installDependencies.js';

export async function createProject({
  projectName,
  projectType,
  template,
  initGit,
  useVitest,
  packageManager,
}: ResolvedBasicContext): Promise<void> {

  const projectRoot = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(projectRoot)) {
    throw new Error(`Directory "${projectName}" already exists`);
  }

  const templatePath = getTemplatePath(projectType, template);

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template not found for type "${projectType}"`);
  }

  await fs.ensureDir(projectRoot);

  await copyTemplate(templatePath, projectRoot, {
    projectName,
  });

  if (useVitest) {
    await setupVitest(projectRoot);
  }

  installDependencies(projectRoot, packageManager);

  if (initGit) {
    initGitRepo(projectRoot);
  }
}
