import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { copyTemplate } from './copyTemplate.js';

describe('copyTemplate', () => {
  let tempDir: string;
  let templateDir: string;
  let targetDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'copy-template-test-'));
    templateDir = path.join(tempDir, 'template');
    targetDir = path.join(tempDir, 'target');

    await fs.ensureDir(templateDir);
    await fs.ensureDir(targetDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should copy a simple file', async () => {
    await fs.writeFile(path.join(templateDir, 'file.txt'), 'Hello World');

    await copyTemplate(templateDir, targetDir, {});

    const content = await fs.readFile(path.join(targetDir, 'file.txt'), 'utf8');
    expect(content).toBe('Hello World');
  });

  it('should replace template variables', async () => {
    await fs.writeFile(
      path.join(templateDir, 'package.json'),
      '{ "name": "{{projectName}}" }',
    );

    await copyTemplate(templateDir, targetDir, { projectName: 'my-app' });

    const content = await fs.readFile(
      path.join(targetDir, 'package.json'),
      'utf8',
    );
    expect(content).toBe('{ "name": "my-app" }');
  });

  it('should replace multiple occurrences of same variable', async () => {
    await fs.writeFile(
      path.join(templateDir, 'readme.md'),
      '# {{projectName}}\n\nWelcome to {{projectName}}!',
    );

    await copyTemplate(templateDir, targetDir, { projectName: 'awesome-app' });

    const content = await fs.readFile(
      path.join(targetDir, 'readme.md'),
      'utf8',
    );
    expect(content).toBe('# awesome-app\n\nWelcome to awesome-app!');
  });

  it('should replace multiple different variables', async () => {
    await fs.writeFile(
      path.join(templateDir, 'config.json'),
      '{ "name": "{{projectName}}", "author": "{{author}}" }',
    );

    await copyTemplate(templateDir, targetDir, {
      projectName: 'my-app',
      author: 'John Doe',
    });

    const content = await fs.readFile(
      path.join(targetDir, 'config.json'),
      'utf8',
    );
    expect(content).toBe('{ "name": "my-app", "author": "John Doe" }');
  });

  it('should remove .tpl extension from files', async () => {
    await fs.writeFile(path.join(templateDir, 'gitignore.tpl'), 'node_modules');

    await copyTemplate(templateDir, targetDir, {});

    expect(await fs.pathExists(path.join(targetDir, 'gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'gitignore.tpl'))).toBe(
      false,
    );
  });

  it('should copy directories recursively', async () => {
    const subDir = path.join(templateDir, 'src');
    await fs.ensureDir(subDir);
    await fs.writeFile(path.join(subDir, 'index.ts'), 'export default {}');

    await copyTemplate(templateDir, targetDir, {});

    const content = await fs.readFile(
      path.join(targetDir, 'src', 'index.ts'),
      'utf8',
    );
    expect(content).toBe('export default {}');
  });

  it('should handle nested directories with variables', async () => {
    const nestedDir = path.join(templateDir, 'src', 'components');
    await fs.ensureDir(nestedDir);
    await fs.writeFile(
      path.join(nestedDir, 'App.tsx'),
      'const App = () => <div>{{projectName}}</div>',
    );

    await copyTemplate(templateDir, targetDir, { projectName: 'my-react-app' });

    const content = await fs.readFile(
      path.join(targetDir, 'src', 'components', 'App.tsx'),
      'utf8',
    );
    expect(content).toBe('const App = () => <div>my-react-app</div>');
  });

  it('should handle empty directories', async () => {
    await fs.ensureDir(path.join(templateDir, 'empty-folder'));

    await copyTemplate(templateDir, targetDir, {});

    expect(
      await fs.pathExists(path.join(targetDir, 'empty-folder')),
    ).toBe(true);
  });
});
