import fs from 'fs-extra';
import path from 'node:path';
import type { FeatureDefinition, ProjectContext } from '../types/feature.js';
import { setupVitest } from '../utils/setupVitest.js';

async function detect(context: ProjectContext): Promise<boolean> {
  const configFiles = [
    'vitest.config.ts',
    'vitest.config.js',
    'vitest.config.mts',
    'vitest.config.mjs',
  ];

  for (const file of configFiles) {
    if (await fs.pathExists(path.join(context.root, file))) {
      return true;
    }
  }

  const deps = {
    ...((context.packageJson.dependencies as Record<string, string>) ?? {}),
    ...((context.packageJson.devDependencies as Record<string, string>) ?? {}),
  };

  return 'vitest' in deps;
}

async function apply(context: ProjectContext): Promise<void> {
  await setupVitest(context.root);
}

export const vitestFeature: FeatureDefinition = {
  id: 'vitest',
  name: 'Vitest',
  description: 'Unit testing framework for JavaScript and TypeScript',
  detect,
  apply,
};
