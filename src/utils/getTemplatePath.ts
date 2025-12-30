import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ProjectType } from '../types/project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTemplatePath(
  projectType: ProjectType,
): string {
  return path.resolve(
    __dirname,
    '../../dist/templates',
    projectType,
    'basic',
  );
}
