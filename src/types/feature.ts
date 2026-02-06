import type { PackageManager } from '../utils/detectPackageManager.js';

export type ProjectContext = {
  root: string;
  packageJson: Record<string, unknown>;
  hasTypescript: boolean;
  packageManager: PackageManager;
};

export type FeatureDefinition = {
  id: string;
  name: string;
  description: string;
  detect: (context: ProjectContext) => Promise<boolean>;
  apply: (context: ProjectContext) => Promise<void>;
};
