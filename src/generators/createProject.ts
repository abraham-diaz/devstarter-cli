import fs from 'fs-extra';
import path from 'node:path';

import type { ResolvedBasicContext } from '../types/cli.js';
import { getTemplatePath } from '../utils/getTemplatePath.js';
import { copyTemplate } from '../utils/copyTemplate.js';
import { initGitRepo } from '../utils/git.js';

export async function createProject({
  projectName,
  projectType,
  template,
  initGit,
}: ResolvedBasicContext): Promise<void> {
  // 1. Resolver ruta absoluta del proyecto
  const projectRoot = path.resolve(process.cwd(), projectName);

  // 2. Evitar sobrescribir carpetas existentes
  if (await fs.pathExists(projectRoot)) {
    throw new Error(`Directory "${projectName}" already exists`);
  }

  // 3. Resolver el template a usar
  const templatePath = getTemplatePath(projectType, template);

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template not found for type "${projectType}"`);
  }

  // 4. Crear carpeta raíz del proyecto
  await fs.ensureDir(projectRoot);

  // 5. Copiar template y reemplazar placeholders
  await copyTemplate(templatePath, projectRoot, {
    projectName,
  });

  // 6. Inicializar Git (si aplica)
  if (initGit) {
    initGitRepo(projectRoot);
  }
}
