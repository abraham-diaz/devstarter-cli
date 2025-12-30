import fs from 'node:fs';
import path from 'node:path';

export function listTemplateFiles(
  templateDir: string,
  baseDir = '',
): string[] {
  const entries = fs.readdirSync(templateDir, { withFileTypes: true });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(templateDir, entry.name);
    const relativePath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      files.push(
        ...listTemplateFiles(fullPath, relativePath),
      );
    } else {
      files.push(relativePath);
    }
  }

  return files;
}
