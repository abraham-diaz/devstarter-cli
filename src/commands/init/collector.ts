import type { ProjectType } from '../../types/project.js';
import type { InitCommandOptions, ResolvedInitContext } from '../../types/cli.js';
import { DEFAULT_INIT_OPTIONS } from '../../types/project.js';
import { askInitQuestions, askTemplate } from '../../prompts/initPrompts.js';
import { normalizeProjectName } from '../../utils/normalize.js';
import { detectPackageManager } from '../../utils/detectPackageManager.js';
import { listTemplates } from '../../utils/listTemplate.js';
import {
  resolveProjectType,
  resolveTemplateFlag,
  resolveProjectName,
  resolveTemplateFinal,
} from './resolvers.js';

type BaseAnswers = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
};

/**
 * Recolecta todas las respuestas necesarias del usuario
 * combinando flags, argumentos, defaults y prompts interactivos
 */
export async function collectInitContext(
  projectNameArg: string | undefined,
  options: InitCommandOptions,
): Promise<ResolvedInitContext> {
  const typeFromFlag = resolveProjectType(options.type);
  const useDefaults = options.yes ?? false;

  // Paso 1: Obtener respuestas base
  const baseAnswers = await collectBaseAnswers(
    projectNameArg,
    typeFromFlag,
    useDefaults,
  );

  // Paso 2: Resolver template
  const templates = listTemplates(baseAnswers.projectType);
  const templateFromFlag = resolveTemplateFlag(options.template, templates);
  const template = await collectTemplate(templateFromFlag, templates, useDefaults);

  // Paso 3: Construir contexto final
  return {
    projectName: normalizeProjectName(baseAnswers.projectName),
    projectType: baseAnswers.projectType,
    template,
    initGit: baseAnswers.initGit,
    packageManager: detectPackageManager(),
    isDryRun: Boolean(options.dryRun),
  };
}

async function collectBaseAnswers(
  projectNameArg: string | undefined,
  typeFromFlag: ProjectType | undefined,
  useDefaults: boolean,
): Promise<BaseAnswers> {
  if (useDefaults) {
    return {
      projectName: resolveProjectName(projectNameArg),
      projectType: typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType,
      initGit: DEFAULT_INIT_OPTIONS.initGit,
    };
  }

  const promptAnswers = await askInitQuestions({
    skipProjectName: Boolean(projectNameArg),
    skipProjectType: Boolean(typeFromFlag),
  });

  return {
    projectName: resolveProjectName(projectNameArg, promptAnswers.projectName),
    projectType: typeFromFlag ?? promptAnswers.projectType,
    initGit: promptAnswers.initGit,
  };
}

async function collectTemplate(
  templateFlag: string | undefined,
  templates: string[],
  useDefaults: boolean,
): Promise<string> {
  const resolved = resolveTemplateFinal(templateFlag, templates, useDefaults);

  if (resolved) return resolved;

  // Necesita input del usuario
  const answer = await askTemplate({ templates });
  return answer.template;
}
