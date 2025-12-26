import prompts from 'prompts';
import type { InitAnswers } from '../types/project.js';

export async function askInitQuestions(): Promise<InitAnswers> {
  return prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      validate: (value: string) =>
        value.length < 1 ? 'Project name is required' : true,
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'Project type:',
      choices: [
        { title: 'Frontend', value: 'frontend' },
        { title: 'Backend', value: 'backend' },
      ],
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize a git repository?',
      initial: true,
    },
  ]);
}
