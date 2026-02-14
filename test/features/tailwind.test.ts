import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { tailwindFeature } from '../../src/features/tailwind.js';
import type { ProjectContext } from '../../src/types/feature.js';

describe('tailwindFeature', () => {
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
      path.join(os.tmpdir(), 'tailwind-feature-test-'),
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
      const result = await tailwindFeature.detect(createContext());
      expect(result).toBe(false);
    });

    it('should return true when tailwind.config.js exists', async () => {
      await fs.writeFile(path.join(tempDir, 'tailwind.config.js'), '');
      const result = await tailwindFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when tailwind.config.ts exists', async () => {
      await fs.writeFile(path.join(tempDir, 'tailwind.config.ts'), '');
      const result = await tailwindFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should return true when tailwindcss is in devDependencies', async () => {
      const context = createContext({
        packageJson: {
          devDependencies: { tailwindcss: '^4.0.0' },
        },
      });
      const result = await tailwindFeature.detect(context);
      expect(result).toBe(true);
    });

    it('should return true when tailwindcss is in dependencies', async () => {
      const context = createContext({
        packageJson: {
          dependencies: { tailwindcss: '^4.0.0' },
        },
      });
      const result = await tailwindFeature.detect(context);
      expect(result).toBe(true);
    });
  });

  describe('apply', () => {
    it('should add tailwindcss devDependencies to package.json', async () => {
      await tailwindFeature.apply(createContext());

      const packageJson = await fs.readJson(
        path.join(tempDir, 'package.json'),
      );
      expect(packageJson.devDependencies.tailwindcss).toBe('^4.0.0');
      expect(packageJson.devDependencies['@tailwindcss/vite']).toBe('^4.0.0');
    });

    it('should create src/index.css with Tailwind import', async () => {
      await tailwindFeature.apply(createContext());

      const css = await fs.readFile(
        path.join(tempDir, 'src', 'index.css'),
        'utf-8',
      );
      expect(css).toContain('@import "tailwindcss"');
    });

    it('should prepend Tailwind import to existing index.css', async () => {
      await fs.ensureDir(path.join(tempDir, 'src'));
      await fs.writeFile(
        path.join(tempDir, 'src', 'index.css'),
        'body { margin: 0; }\n',
      );

      await tailwindFeature.apply(createContext());

      const css = await fs.readFile(
        path.join(tempDir, 'src', 'index.css'),
        'utf-8',
      );
      expect(css).toContain('@import "tailwindcss"');
      expect(css).toContain('body { margin: 0; }');
    });

    it('should not duplicate Tailwind import in existing index.css', async () => {
      await fs.ensureDir(path.join(tempDir, 'src'));
      await fs.writeFile(
        path.join(tempDir, 'src', 'index.css'),
        '@import "tailwindcss";\n\nbody { margin: 0; }\n',
      );

      await tailwindFeature.apply(createContext());

      const css = await fs.readFile(
        path.join(tempDir, 'src', 'index.css'),
        'utf-8',
      );
      const matches = css.match(/@import "tailwindcss"/g);
      expect(matches).toHaveLength(1);
    });

    it('should update vite.config.ts with Tailwind plugin', async () => {
      await fs.writeFile(
        path.join(tempDir, 'vite.config.ts'),
        `import { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [\n  ],\n});\n`,
      );

      await tailwindFeature.apply(createContext());

      const viteConfig = await fs.readFile(
        path.join(tempDir, 'vite.config.ts'),
        'utf-8',
      );
      expect(viteConfig).toContain("import tailwindcss from '@tailwindcss/vite'");
      expect(viteConfig).toContain('tailwindcss()');
    });
  });

  describe('monorepo support', () => {
    let webDir: string;

    beforeEach(async () => {
      webDir = path.join(tempDir, 'apps', 'web');
      await fs.ensureDir(webDir);
      await fs.writeJson(path.join(webDir, 'package.json'), {
        name: 'web',
        scripts: {},
        devDependencies: {},
      });
    });

    it('should apply to apps/web in a monorepo', async () => {
      await tailwindFeature.apply(createContext());

      // Should modify apps/web/package.json, not root
      const webPkg = await fs.readJson(path.join(webDir, 'package.json'));
      expect(webPkg.devDependencies.tailwindcss).toBe('^4.0.0');

      // Root package.json should NOT have tailwindcss
      const rootPkg = await fs.readJson(path.join(tempDir, 'package.json'));
      expect(rootPkg.devDependencies.tailwindcss).toBeUndefined();
    });

    it('should create index.css inside apps/web/src', async () => {
      await tailwindFeature.apply(createContext());

      const css = await fs.readFile(
        path.join(webDir, 'src', 'index.css'),
        'utf-8',
      );
      expect(css).toContain('@import "tailwindcss"');

      // Should NOT create src/index.css at root
      expect(
        await fs.pathExists(path.join(tempDir, 'src', 'index.css')),
      ).toBe(false);
    });

    it('should update vite.config.ts inside apps/web', async () => {
      await fs.writeFile(
        path.join(webDir, 'vite.config.ts'),
        `import { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [\n  ],\n});\n`,
      );

      await tailwindFeature.apply(createContext());

      const viteConfig = await fs.readFile(
        path.join(webDir, 'vite.config.ts'),
        'utf-8',
      );
      expect(viteConfig).toContain('tailwindcss()');
    });

    it('should detect tailwindcss in apps/web/package.json', async () => {
      await fs.writeJson(path.join(webDir, 'package.json'), {
        name: 'web',
        devDependencies: { tailwindcss: '^4.0.0' },
      });

      const result = await tailwindFeature.detect(createContext());
      expect(result).toBe(true);
    });

    it('should detect tailwind.config.ts in apps/web', async () => {
      await fs.writeFile(path.join(webDir, 'tailwind.config.ts'), '');

      const result = await tailwindFeature.detect(createContext());
      expect(result).toBe(true);
    });
  });
});
