export type ProjectType = 'frontend' | 'backend';

export type CreateProjectOptions = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
};

export type InitAnswers = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
};

export const DEFAULT_INIT_OPTIONS = {
  projectType: 'frontend' as const,
  initGit: true,
};
