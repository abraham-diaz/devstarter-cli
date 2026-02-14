import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import type { ProjectContext } from '../../src/types/feature.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

import prompts from 'prompts';
import { ciFeature } from '../../src/features/ci.js';

const mockPrompts = vi.mocked(prompts);

describe('ciFeature', () => {
  let tempDir: string;

  function createContext(
    overrides: Partial<ProjectContext> = {},
  ): ProjectContext {
    return {
      root: tempDir,
      packageJson: {
        scripts: {
          lint: 'eslint .',
          test: 'vitest run',
          build: 'tsc',
        },
      },
      hasTypescript: true,
      packageManager: 'npm',
      ...overrides,
    };
  }

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ci-feature-test-'));
    await fs.writeJson(path.join(tempDir, 'package.json'), {
      name: 'test-project',
      scripts: { lint: 'eslint .', test: 'vitest run', build: 'tsc' },
      devDependencies: {},
    });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    vi.restoreAllMocks();
  });

  describe('detect', () => {
    it('should return false on a clean project', async () => {
      const result = await ciFeature.detect(createContext());
      expect(result).toBe(false);
    });

    it('should return true when .gitlab-ci.yml exists', async () => {
      await fs.writeFile(path.join(tempDir, '.gitlab-ci.yml'), '');
      const result = await ciFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when .github/workflows/ has yml files', async () => {
      const workflowsDir = path.join(tempDir, '.github', 'workflows');
      await fs.ensureDir(workflowsDir);
      await fs.writeFile(path.join(workflowsDir, 'ci.yml'), '');
      const result = await ciFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return false when .github/workflows/ exists but is empty', async () => {
      const workflowsDir = path.join(tempDir, '.github', 'workflows');
      await fs.ensureDir(workflowsDir);
      const result = await ciFeature.detect(createContext());
      expect(result).toBe(false);
    });
  });

  describe('prompt', () => {
    it('should return selected provider', async () => {
      mockPrompts.mockResolvedValue({ provider: 'github' });
      const result = await ciFeature.prompt!(createContext());
      expect(result).toEqual({ provider: 'github' });
    });

    it('should throw when selection is cancelled', async () => {
      mockPrompts.mockResolvedValue({});
      await expect(ciFeature.prompt!(createContext())).rejects.toThrow(
        'CI provider selection cancelled',
      );
    });
  });

  describe('apply - GitHub Actions', () => {
    it('should create .github/workflows/ci.yml', async () => {
      await ciFeature.apply(createContext(), { provider: 'github' });

      const ciPath = path.join(
        tempDir,
        '.github',
        'workflows',
        'ci.yml',
      );
      expect(await fs.pathExists(ciPath)).toBe(true);
    });

    it('should include checkout, setup-node, and install steps', async () => {
      await ciFeature.apply(createContext(), { provider: 'github' });

      const workflow = await fs.readFile(
        path.join(tempDir, '.github', 'workflows', 'ci.yml'),
        'utf-8',
      );
      expect(workflow).toContain('actions/checkout@v4');
      expect(workflow).toContain('actions/setup-node@v4');
      expect(workflow).toContain('npm ci');
    });

    it('should include lint, test, and build steps when scripts exist', async () => {
      await ciFeature.apply(createContext(), { provider: 'github' });

      const workflow = await fs.readFile(
        path.join(tempDir, '.github', 'workflows', 'ci.yml'),
        'utf-8',
      );
      expect(workflow).toContain('npm run lint');
      expect(workflow).toContain('npm run test');
      expect(workflow).toContain('npm run build');
    });

    it('should omit lint/test/build steps when scripts are absent', async () => {
      const context = createContext({ packageJson: { scripts: {} } });
      await ciFeature.apply(context, { provider: 'github' });

      const workflow = await fs.readFile(
        path.join(tempDir, '.github', 'workflows', 'ci.yml'),
        'utf-8',
      );
      expect(workflow).not.toContain('npm run lint');
      expect(workflow).not.toContain('npm run test');
      expect(workflow).not.toContain('npm run build');
    });

    it('should use pnpm commands when packageManager is pnpm', async () => {
      const context = createContext({ packageManager: 'pnpm' });
      await ciFeature.apply(context, { provider: 'github' });

      const workflow = await fs.readFile(
        path.join(tempDir, '.github', 'workflows', 'ci.yml'),
        'utf-8',
      );
      expect(workflow).toContain('pnpm install --frozen-lockfile');
      expect(workflow).toContain('pnpm run lint');
    });
  });

  describe('apply - GitLab CI', () => {
    it('should create .gitlab-ci.yml', async () => {
      await ciFeature.apply(createContext(), { provider: 'gitlab' });

      expect(
        await fs.pathExists(path.join(tempDir, '.gitlab-ci.yml')),
      ).toBe(true);
    });

    it('should include stages and install job', async () => {
      await ciFeature.apply(createContext(), { provider: 'gitlab' });

      const config = await fs.readFile(
        path.join(tempDir, '.gitlab-ci.yml'),
        'utf-8',
      );
      expect(config).toContain('stages:');
      expect(config).toContain('install:');
      expect(config).toContain('npm ci');
    });

    it('should include lint, test, and build jobs when scripts exist', async () => {
      await ciFeature.apply(createContext(), { provider: 'gitlab' });

      const config = await fs.readFile(
        path.join(tempDir, '.gitlab-ci.yml'),
        'utf-8',
      );
      expect(config).toContain('lint:');
      expect(config).toContain('test:');
      expect(config).toContain('build:');
    });

    it('should omit lint/test/build jobs when scripts are absent', async () => {
      const context = createContext({ packageJson: { scripts: {} } });
      await ciFeature.apply(context, { provider: 'gitlab' });

      const config = await fs.readFile(
        path.join(tempDir, '.gitlab-ci.yml'),
        'utf-8',
      );
      expect(config).not.toContain('lint:');
      expect(config).not.toContain('test:');
      expect(config).not.toContain('build:');
    });
  });
});
