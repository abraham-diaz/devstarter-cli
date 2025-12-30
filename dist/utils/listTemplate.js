import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function listTemplates(projectType) {
    const base = path.resolve(__dirname, '../../dist/templates', projectType);
    if (!fs.existsSync(base))
        return [];
    return fs
        .readdirSync(base, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
}
