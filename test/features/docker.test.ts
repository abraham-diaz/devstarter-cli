import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { dockerFeature } from '../../src/features/docker.js';
import type { ProjectContext } from '../../src/types/feature.js';

describe('dockerFeature', () => {
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
      path.join(os.tmpdir(), 'docker-feature-test-'),
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
      const result = await dockerFeature.detect(createContext());
      expect(result).toBe(false);
    });

    it('should return true when Dockerfile exists', async () => {
      await fs.writeFile(path.join(tempDir, 'Dockerfile'), '');
      const result = await dockerFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when docker-compose.yml exists', async () => {
      await fs.writeFile(path.join(tempDir, 'docker-compose.yml'), '');
      const result = await dockerFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when compose.yml exists', async () => {
      await fs.writeFile(path.join(tempDir, 'compose.yml'), '');
      const result = await dockerFeature.detect(createContext());
      expect(result).toBe(true);
    });
  });

  describe('apply', () => {
    it('should create Dockerfile, docker-compose.yml, and .dockerignore', async () => {
      await dockerFeature.apply(createContext());

      expect(await fs.pathExists(path.join(tempDir, 'Dockerfile'))).toBe(true);
      expect(
        await fs.pathExists(path.join(tempDir, 'docker-compose.yml')),
      ).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.dockerignore'))).toBe(
        true,
      );
    });

    it('should generate backend Dockerfile by default', async () => {
      await dockerFeature.apply(createContext());

      const dockerfile = await fs.readFile(
        path.join(tempDir, 'Dockerfile'),
        'utf-8',
      );
      expect(dockerfile).toContain('CMD ["node", "dist/index.js"]');
      expect(dockerfile).toContain('EXPOSE 3000');
      expect(dockerfile).not.toContain('nginx');
    });

    it('should generate frontend Dockerfile when vite is in deps', async () => {
      const context = createContext({
        packageJson: {
          devDependencies: { vite: '^5.0.0' },
        },
      });

      await dockerFeature.apply(context);

      const dockerfile = await fs.readFile(
        path.join(tempDir, 'Dockerfile'),
        'utf-8',
      );
      expect(dockerfile).toContain('nginx:alpine');
      expect(dockerfile).toContain('EXPOSE 80');
      expect(dockerfile).not.toContain('node dist/index.js');
    });

    it('should use pnpm install command when packageManager is pnpm', async () => {
      const context = createContext({ packageManager: 'pnpm' });
      await dockerFeature.apply(context);

      const dockerfile = await fs.readFile(
        path.join(tempDir, 'Dockerfile'),
        'utf-8',
      );
      expect(dockerfile).toContain('pnpm install --frozen-lockfile');
    });

    it('should map port 8080:80 for frontend in docker-compose', async () => {
      const context = createContext({
        packageJson: {
          devDependencies: { vite: '^5.0.0' },
        },
      });

      await dockerFeature.apply(context);

      const compose = await fs.readFile(
        path.join(tempDir, 'docker-compose.yml'),
        'utf-8',
      );
      expect(compose).toContain('8080:80');
    });

    it('should map port 3000:3000 for backend in docker-compose', async () => {
      await dockerFeature.apply(createContext());

      const compose = await fs.readFile(
        path.join(tempDir, 'docker-compose.yml'),
        'utf-8',
      );
      expect(compose).toContain('3000:3000');
    });

    it('should include node_modules and .env in .dockerignore', async () => {
      await dockerFeature.apply(createContext());

      const ignore = await fs.readFile(
        path.join(tempDir, '.dockerignore'),
        'utf-8',
      );
      expect(ignore).toContain('node_modules');
      expect(ignore).toContain('.env');
    });
  });
});
