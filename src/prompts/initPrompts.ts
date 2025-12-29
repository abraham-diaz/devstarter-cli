import prompts, { PromptObject } from 'prompts';
import type { InitAnswers } from '../types/project.js';

type AskInitQuestionsOptions = {
  skipProjectName?: boolean;
  skipProjectType?: boolean;
};

export async function askInitQuestions(
  options: AskInitQuestionsOptions = {},
): Promise<InitAnswers> {
  const questions: PromptObject[] = [];

  if (!options.skipProjectName) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      validate: (value: string) =>
        value.length < 1 ? 'Project name is required' : true,
    });
  }

  if (!options.skipProjectType) {
    questions.push({
      type: 'select',
      name: 'projectType',
      message: 'Project type:',
      choices: [
        { title: 'Frontend', value: 'frontend' },
        { title: 'Backend', value: 'backend' },
      ],
    });
  }

  questions.push({
    type: 'confirm',
    name: 'initGit',
    message: 'Initialize a git repository?',
    initial: true,
  });

  return prompts(questions) as Promise<InitAnswers>;
}
