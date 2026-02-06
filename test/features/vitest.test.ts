import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { vitestFeature } from '../../src/features/vitest.js';
import type { ProjectContext } from '../../src/types/feature.js';

describe('vitestFeature', () => {
  let tempDir: string;

  function createContext(
    overrides: Partial<ProjectContext> = {},
  ): ProjectContext {
    return {
      root: tempDir,
      packageJson: {},
      hasTypescript: true,
      packageManager: 'npm',
      ...overrides,
    };
  }

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vitest-feature-test-'));
    await fs.writeJson(path.join(tempDir, 'package.json'), {
      name: 'test-project',
      scripts: {},
      devDependencies: {},
    });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('detect', () => {
    it('should return false on a clean project', async () => {
      const result = await vitestFeature.detect(createContext());
      expect(result).toBe(false);
    });

    it('should return true when vitest.config.ts exists', async () => {
      await fs.writeFile(path.join(tempDir, 'vitest.config.ts'), '');
      const result = await vitestFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when vitest.config.js exists', async () => {
      await fs.writeFile(path.join(tempDir, 'vitest.config.js'), '');
      const result = await vitestFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when vitest is in devDependencies', async () => {
      const context = createContext({
        packageJson: {
          devDependencies: { vitest: '^3.0.0' },
        },
      });
      const result = await vitestFeature.detect(context);
      expect(result).toBe(true);
    });

    it('should return true when vitest is in dependencies', async () => {
      const context = createContext({
        packageJson: {
          dependencies: { vitest: '^3.0.0' },
        },
      });
      const result = await vitestFeature.detect(context);
      expect(result).toBe(true);
    });
  });

  describe('apply', () => {
    it('should create vitest.config.ts and update package.json', async () => {
      await vitestFeature.apply(createContext());

      const configExists = await fs.pathExists(
        path.join(tempDir, 'vitest.config.ts'),
      );
      expect(configExists).toBe(true);

      const packageJson = await fs.readJson(path.join(tempDir, 'package.json'));
      expect(packageJson.devDependencies.vitest).toBe('^3.0.0');
      expect(packageJson.scripts.test).toBe('vitest');
      expect(packageJson.scripts['test:run']).toBe('vitest run');
    });
  });
});
