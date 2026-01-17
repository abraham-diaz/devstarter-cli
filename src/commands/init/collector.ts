import type { ProjectType, ProjectStructure } from '../../types/project.js';
import type {
  InitCommandOptions,
  ResolvedInitContext,
  ResolvedBasicContext,
  ResolvedMonorepoContext,
} from '../../types/cli.js';
import { DEFAULT_INIT_OPTIONS } from '../../types/project.js';
import {
  askProjectName,
  askProjectStructure,
  askInitQuestions,
  askTemplate,
  askInitGit,
} from '../../prompts/initPrompts.js';
import { normalizeProjectName } from '../../utils/normalize.js';
import { detectPackageManager } from '../../utils/detectPackageManager.js';
import { listTemplates } from '../../utils/listTemplate.js';
import {
  resolveProjectType,
  resolveTemplateFlag,
  resolveProjectName,
  resolveTemplateFinal,
} from './resolvers.js';

/**
 * Recolecta todas las respuestas necesarias del usuario
 * combinando flags, argumentos, defaults y prompts interactivos
 */
export async function collectInitContext(
  projectNameArg: string | undefined,
  options: InitCommandOptions,
): Promise<ResolvedInitContext> {
  const useDefaults = options.yes ?? false;

  // Paso 1: Obtener nombre del proyecto
  const projectName = await collectProjectName(projectNameArg, useDefaults);

  // Paso 2: Obtener estructura (basic/monorepo)
  const structure = await collectStructure(useDefaults);

  // Paso 3: Bifurcar según estructura
  if (structure === 'monorepo') {
    return collectMonorepoContext(projectName, useDefaults, options);
  }

  return collectBasicContext(projectName, options, useDefaults);
}

async function collectProjectName(
  projectNameArg: string | undefined,
  useDefaults: boolean,
): Promise<string> {
  if (projectNameArg) {
    return normalizeProjectName(projectNameArg);
  }

  if (useDefaults) {
    return normalizeProjectName(resolveProjectName(projectNameArg));
  }

  const answer = await askProjectName();
  return normalizeProjectName(answer.projectName);
}

async function collectStructure(useDefaults: boolean): Promise<ProjectStructure> {
  if (useDefaults) {
    return DEFAULT_INIT_OPTIONS.projectStructure;
  }

  const answer = await askProjectStructure();
  return answer.projectStructure;
}

async function collectBasicContext(
  projectName: string,
  options: InitCommandOptions,
  useDefaults: boolean,
): Promise<ResolvedBasicContext> {
  const typeFromFlag = resolveProjectType(options.type);
  const gitFlagProvided = options.git !== undefined;

  // Obtener tipo de proyecto e initGit
  let projectType: ProjectType;
  let initGit: boolean;

  if (useDefaults) {
    projectType = typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType;
    initGit = gitFlagProvided ? options.git! : DEFAULT_INIT_OPTIONS.initGit;
  } else {
    const answers = await askInitQuestions({
      skipProjectName: true,
      skipProjectType: Boolean(typeFromFlag),
      skipInitGit: gitFlagProvided,
    });
    projectType = typeFromFlag ?? answers.projectType;
    initGit = gitFlagProvided ? options.git! : answers.initGit;
  }

  // Obtener template
  const templates = listTemplates(projectType);
  const templateFromFlag = resolveTemplateFlag(options.template, templates);
  const template = await collectTemplate(templateFromFlag, templates, useDefaults);

  return {
    structure: 'basic',
    projectName,
    projectType,
    template,
    initGit,
    packageManager: detectPackageManager(),
    isDryRun: Boolean(options.dryRun),
  };
}

async function collectMonorepoContext(
  projectName: string,
  useDefaults: boolean,
  options: InitCommandOptions,
): Promise<ResolvedMonorepoContext> {
  // Templates para web (frontend) y api (backend)
  const frontendTemplates = listTemplates('frontend');
  const backendTemplates = listTemplates('backend');
  const gitFlagProvided = options.git !== undefined;

  let webTemplate: string;
  let apiTemplate: string;
  let initGit: boolean;

  if (useDefaults) {
    webTemplate = frontendTemplates[0] ?? 'basic';
    apiTemplate = backendTemplates[0] ?? 'basic';
    initGit = gitFlagProvided ? options.git! : DEFAULT_INIT_OPTIONS.initGit;
  } else {
    const webAnswer = await askTemplate({
      templates: frontendTemplates,
      message: 'Template for apps/web (frontend):',
    });
    webTemplate = webAnswer.template;

    const apiAnswer = await askTemplate({
      templates: backendTemplates,
      message: 'Template for apps/api (backend):',
    });
    apiTemplate = apiAnswer.template;

    if (gitFlagProvided) {
      initGit = options.git!;
    } else {
      const gitAnswer = await askInitGit();
      initGit = gitAnswer.initGit;
    }
  }

  return {
    structure: 'monorepo',
    projectName,
    webTemplate,
    apiTemplate,
    initGit,
    packageManager: 'pnpm', // Monorepo usa pnpm por defecto
    isDryRun: Boolean(options.dryRun),
  };
}

async function collectTemplate(
  templateFlag: string | undefined,
  templates: string[],
  useDefaults: boolean,
): Promise<string> {
  const resolved = resolveTemplateFinal(templateFlag, templates, useDefaults);

  if (resolved) return resolved;

  const answer = await askTemplate({ templates });
  return answer.template;
}
