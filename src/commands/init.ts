import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';

export async function initCommand(): Promise<void> {
  const answers = await askInitQuestions();

  const normalizedName = normalizeProjectName(answers.projectName);

  console.log('\nProject configuration:');
  console.log({
    ...answers,
    projectName: normalizedName,
  });
}