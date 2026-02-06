import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { prettierFeature } from '../../src/features/prettier.js';
import type { ProjectContext } from '../../src/types/feature.js';

describe('prettierFeature', () => {
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
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'prettier-feature-test-'),
    );
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
      const result = await prettierFeature.detect(createContext());
      expect(result).toBe(false);
    });

    it('should return true when .prettierrc exists', async () => {
      await fs.writeFile(path.join(tempDir, '.prettierrc'), '{}');
      const result = await prettierFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when prettier.config.js exists', async () => {
      await fs.writeFile(path.join(tempDir, 'prettier.config.js'), '');
      const result = await prettierFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when prettier is in devDependencies', async () => {
      const context = createContext({
        packageJson: {
          devDependencies: { prettier: '^3.0.0' },
        },
      });
      const result = await prettierFeature.detect(context);
      expect(result).toBe(true);
    });

    it('should return true when prettier is in dependencies', async () => {
      const context = createContext({
        packageJson: {
          dependencies: { prettier: '^3.0.0' },
        },
      });
      const result = await prettierFeature.detect(context);
      expect(result).toBe(true);
    });
  });

  describe('apply', () => {
    it('should create .prettierrc and update package.json', async () => {
      await prettierFeature.apply(createContext());

      const configExists = await fs.pathExists(
        path.join(tempDir, '.prettierrc'),
      );
      expect(configExists).toBe(true);

      const config = await fs.readJson(path.join(tempDir, '.prettierrc'));
      expect(config.semi).toBe(true);
      expect(config.singleQuote).toBe(true);
      expect(config.trailingComma).toBe('all');
      expect(config.printWidth).toBe(80);
      expect(config.tabWidth).toBe(2);

      const packageJson = await fs.readJson(
        path.join(tempDir, 'package.json'),
      );
      expect(packageJson.devDependencies.prettier).toBe('^3.0.0');
      expect(packageJson.scripts.format).toBe('prettier --write .');
    });
  });
});
