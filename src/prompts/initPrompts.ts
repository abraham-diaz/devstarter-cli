import prompts, { PromptObject } from 'prompts';
import type { InitAnswers, ProjectStructure } from '../types/project.js';

type AskInitQuestionsOptions = {
  skipProjectName?: boolean;
  skipProjectType?: boolean;
  skipInitGit?: boolean;
};

type AskTemplateOptions = {
  templates: string[];
  message?: string;
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

export async function askProjectName(): Promise<{ projectName: string }> {
  return prompts(
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      validate: (value: string) =>
        value.length < 1 ? 'Project name is required' : true,
    },
    { onCancel },
  ) as Promise<{ projectName: string }>;
}

export async function askProjectStructure(): Promise<{ projectStructure: ProjectStructure }> {
  return prompts(
    {
      type: 'select',
      name: 'projectStructure',
      message: 'Project structure:',
      choices: [
        { title: 'Basic', value: 'basic', description: 'Single project (frontend or backend)' },
        { title: 'Monorepo', value: 'monorepo', description: 'Full-stack with apps/web + apps/api' },
      ],
    },
    { onCancel },
  ) as Promise<{ projectStructure: ProjectStructure }>;
}

export async function askInitQuestions(
  options: AskInitQuestionsOptions = {},
): Promise<Omit<InitAnswers, 'template' | 'projectStructure'>> {
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

  if (!options.skipInitGit) {
    questions.push({
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize a git repository?',
      initial: true,
    });
  }

  return prompts(questions, { onCancel }) as Promise<Omit<InitAnswers, 'template' | 'projectStructure'>>;
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
      message: options.message ?? 'Template:',
      choices: options.templates.map((t) => ({
        title: t,
        value: t,
      })),
    },
    { onCancel },
  ) as Promise<{ template: string }>;
}

export async function askInitGit(): Promise<{ initGit: boolean }> {
  return prompts(
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize a git repository?',
      initial: true,
    },
    { onCancel },
  ) as Promise<{ initGit: boolean }>;
}
