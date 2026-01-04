import fs from 'fs-extra';
import path from 'node:path';
export async function copyTemplate(templatePath, targetPath, vars) {
    await fs.ensureDir(targetPath);
    const entries = await fs.readdir(templatePath);
    for (const entry of entries) {
        const src = path.join(templatePath, entry);
        const dest = path.join(targetPath, entry.replace('.tpl', ''));
        const stat = await fs.stat(src);
        if (stat.isDirectory()) {
            await fs.ensureDir(dest);
            await copyTemplate(src, dest, vars);
        }
        else {
            let content = await fs.readFile(src, 'utf8');
            for (const [key, value] of Object.entries(vars)) {
                content = content.replaceAll(`{{${key}}}`, value);
            }
            await fs.writeFile(dest, content);
        }
    }
}
