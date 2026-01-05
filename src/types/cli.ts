import type { ProjectType } from './project.js';
import type { PackageManager } from '../utils/detectPackageManager.js';

export type InitCommandOptions = {
  yes?: boolean;
  type?: string;
  template?: string;
  dryRun?: boolean;
};

export type ResolvedBasicContext = {
  structure: 'basic';
  projectName: string;
  projectType: ProjectType;
  template: string;
  initGit: boolean;
  packageManager: PackageManager;
  isDryRun: boolean;
};

export type ResolvedMonorepoContext = {
  structure: 'monorepo';
  projectName: string;
  webTemplate: string;
  apiTemplate: string;
  initGit: boolean;
  packageManager: PackageManager;
  isDryRun: boolean;
};

export type ResolvedInitContext = ResolvedBasicContext | ResolvedMonorepoContext;
