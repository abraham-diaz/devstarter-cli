import prompts from 'prompts';

export type InitAnswers = {
  projectName: string;
  projectType: 'frontend' | 'backend';
};

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
  ]);
}
