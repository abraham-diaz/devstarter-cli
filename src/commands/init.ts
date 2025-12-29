import type { ProjectType, InitAnswers } from '../types/project.js';
import { DEFAULT_INIT_OPTIONS } from '../types/project.js';
import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';

type InitCommandOptions = {
  yes?: boolean;
  type?: string;
};

function resolveProjectType(
  optionType?: string,
): ProjectType | undefined {
  if (!optionType) return undefined;
  if (optionType === 'frontend' || optionType === 'backend') {
    return optionType;
  }
  throw new Error(
    `Invalid --type value "${optionType}". Use "frontend" or "backend".`,
  );
}

export async function initCommand(
  projectNameArg: string | undefined,
  options: InitCommandOptions,
): Promise<void> {
  let answers: InitAnswers;

  const typeFromFlag = resolveProjectType(options.type);

  // 1) Modo no interactivo
  if (options.yes) {
    answers = {
      projectName:
        projectNameArg ??
        process.cwd().split(/[\\/]/).pop() ??
        'my-app',
      projectType:
        typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType,
      initGit: DEFAULT_INIT_OPTIONS.initGit,
    };
  } else {
    // 2) Modo interactivo
    const promptAnswers = await askInitQuestions({
      skipProjectName: Boolean(projectNameArg),
      // si hay --type, no preguntamos tipo
      skipProjectType: Boolean(typeFromFlag),
    });

    answers = {
      ...promptAnswers,
      projectName: projectNameArg ?? promptAnswers.projectName,
      projectType:
        typeFromFlag ?? promptAnswers.projectType,
    };
  }

  const projectName = normalizeProjectName(answers.projectName);

  try {
    await createProject({
      projectName,
      projectType: answers.projectType,
      initGit: answers.initGit,
    });

    console.log(
      `\nProject "${projectName}" created successfully (${answers.projectType})`,
    );
  } catch (error) {
    console.error('\nError creating project:');
    console.error((error as Error).message);
  }
}
