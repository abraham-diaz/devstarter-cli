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

  // Leer package.json existente
  const packageJson = await fs.readJson(packageJsonPath);

  // Añadir devDependencies
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    vitest: '^3.0.0',
  };

  // Añadir scripts de test
  packageJson.scripts = {
    ...packageJson.scripts,
    test: 'vitest',
    'test:run': 'vitest run',
  };

  // Escribir package.json actualizado
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // Crear vitest.config.ts
  await fs.writeFile(path.join(projectRoot, 'vitest.config.ts'), VITEST_CONFIG);
}
