import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';
import { DEFAULT_INIT_OPTIONS } from '../types/project.js';

type InitCommandOptions = {
  yes?: boolean;
};

export async function initCommand(options: InitCommandOptions): Promise<void> {
  let answers;

  if (options.yes) {
    answers = {
      projectName: process.cwd().split(/[\\/]/).pop() ?? 'my-app',
      projectType: DEFAULT_INIT_OPTIONS.projectType,
      initGit: DEFAULT_INIT_OPTIONS.initGit,
    };
  } else {
    answers = await askInitQuestions();
  }

  const projectName = normalizeProjectName(answers.projectName);

  try {
    await createProject({
      projectName,
      projectType: answers.projectType,
      initGit: answers.initGit,
    });

    console.log(`\nProject "${projectName}" created successfully`);
  } catch (error) {
    console.error('\nError creating project:');
    console.error((error as Error).message);
  }
}
