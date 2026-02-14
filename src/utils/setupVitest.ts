import fs from 'fs-extra';
import path from 'node:path';

const VITEST_CONFIG = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`;

export async function setupVitest(projectRoot: string): Promise<void> {
  const packageJsonPath = path.join(projectRoot, 'package.json');

  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    vitest: '^3.0.0',
  };

  packageJson.scripts = {
    ...packageJson.scripts,
    test: 'vitest',
    'test:run': 'vitest run',
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  await fs.writeFile(path.join(projectRoot, 'vitest.config.ts'), VITEST_CONFIG);
}
