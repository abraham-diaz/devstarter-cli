import prompts, { PromptObject } from 'prompts';
import type { InitAnswers } from '../types/project.js';

type AskInitQuestionsOptions = {
  skipProjectName?: boolean;
  skipProjectType?: boolean;
};

type AskTemplateOptions = {
  templates: string[];
};

export class PromptCancelledError extends Error {
  constructor() {
    super('Operation cancelled');
    this.name = 'PromptCancelledError';
  }
}

const onCancel = () => {
  throw new PromptCancelledError();
};

export async function askInitQuestions(
  options: AskInitQuestionsOptions = {},
): Promise<Omit<InitAnswers, 'template'>> {
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

  return prompts(questions, { onCancel }) as Promise<Omit<InitAnswers, 'template'>>;
}

export async function askTemplate(
  options: AskTemplateOptions,
): Promise<{ template: string }> {
  if (options.templates.length === 1) {
    return { template: options.templates[0] };
  }

  return prompts(
    {
      type: 'select',
      name: 'template',
      message: 'Template:',
      choices: options.templates.map((t) => ({
        title: t,
        value: t,
      })),
    },
    { onCancel },
  ) as Promise<{ template: string }>;
}
