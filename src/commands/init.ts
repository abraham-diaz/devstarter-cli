import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';

export async function initCommand(): Promise<void> {
  const answers = await askInitQuestions();

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
