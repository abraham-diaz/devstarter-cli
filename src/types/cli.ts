import type { ProjectType } from './project.js';
import type { PackageManager } from '../utils/detectPackageManager.js';

export type InitCommandOptions = {
  yes?: boolean;
  type?: string;
  template?: string;
  dryRun?: boolean;
};

export type ResolvedInitContext = {
  projectName: string;
  projectType: ProjectType;
  template: string;
  initGit: boolean;
  packageManager: PackageManager;
  isDryRun: boolean;
};
