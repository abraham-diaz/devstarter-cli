export type ProjectType = 'frontend' | 'backend';
export type ProjectStructure = 'basic' | 'monorepo';

export type CreateProjectOptions = {
  projectName: string;
  projectType: ProjectType;
  template: string;
  initGit: boolean;
};

export type CreateMonorepoOptions = {
  projectName: string;
  webTemplate: string;
  apiTemplate: string;
  initGit: boolean;
};

export type InitAnswers = {
  projectName: string;
  projectStructure: ProjectStructure;
  projectType: ProjectType;
  template: string;
  initGit: boolean;
};

export const DEFAULT_INIT_OPTIONS = {
  projectStructure: 'basic' as const,
  projectType: 'frontend' as const,
  initGit: true,
};
