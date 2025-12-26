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
