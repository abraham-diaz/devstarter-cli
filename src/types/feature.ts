import type { PackageManager } from '../utils/detectPackageManager.js';

export type ProjectContext = {
  root: string;
  packageJson: Record<string, unknown>;
  hasTypescript: boolean;
  packageManager: PackageManager;
};

export type FeatureOptions = Record<string, unknown>;

export type FeatureDefinition = {
  id: string;
  name: string;
  description: string;
  detect: (context: ProjectContext) => Promise<boolean>;
  prompt?: (context: ProjectContext) => Promise<FeatureOptions>;
  apply: (context: ProjectContext, options?: FeatureOptions) => Promise<void>;
};
