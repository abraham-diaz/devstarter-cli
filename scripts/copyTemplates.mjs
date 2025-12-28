import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcTemplates = path.resolve(__dirname, '../src/templates');
const distTemplates = path.resolve(__dirname, '../dist/templates');

async function copy() {
  try {
    await fs.remove(distTemplates);
    await fs.copy(srcTemplates, distTemplates);
    console.log('Templates copied to dist/');
  } catch (error) {
    console.error('Failed to copy templates');
    console.error(error);
    process.exit(1);
  }
}

copy();
