import fs from 'fs-extra';
import path from 'node:path';
async function getWebAppDir(root) {
    const webDir = path.join(root, 'apps', 'web');
    if (await fs.pathExists(path.join(webDir, 'package.json'))) {
        return webDir;
    }
    return root;
}
async function detect(context) {
    const targetDir = await getWebAppDir(context.root);
    const configFiles = [
        'tailwind.config.js',
        'tailwind.config.ts',
        'tailwind.config.mjs',
        'tailwind.config.cjs',
    ];
    for (const file of configFiles) {
        if (await fs.pathExists(path.join(targetDir, file))) {
            return true;
        }
    }
    // Check deps in the target package.json
    const pkgJson = targetDir === context.root
        ? context.packageJson
        : await fs.readJson(path.join(targetDir, 'package.json'));
    const deps = {
        ...(pkgJson.dependencies ?? {}),
        ...(pkgJson.devDependencies ?? {}),
    };
    return 'tailwindcss' in deps;
}
async function apply(context) {
    const targetDir = await getWebAppDir(context.root);
    const packageJsonPath = path.join(targetDir, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.devDependencies = {
        ...packageJson.devDependencies,
        tailwindcss: '^4.0.0',
        '@tailwindcss/vite': '^4.0.0',
    };
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    // Update vite.config.ts to add Tailwind plugin if it exists
    const viteConfigPath = path.join(targetDir, 'vite.config.ts');
    if (await fs.pathExists(viteConfigPath)) {
        const viteConfig = await fs.readFile(viteConfigPath, 'utf-8');
        if (!viteConfig.includes('@tailwindcss/vite')) {
            const updated = `import tailwindcss from '@tailwindcss/vite';\n` +
                viteConfig.replace(/plugins:\s*\[/, 'plugins: [\n    tailwindcss(),');
            await fs.writeFile(viteConfigPath, updated);
        }
    }
    // Create/update src/index.css with Tailwind import
    const cssPath = path.join(targetDir, 'src', 'index.css');
    await fs.ensureDir(path.join(targetDir, 'src'));
    if (await fs.pathExists(cssPath)) {
        const existing = await fs.readFile(cssPath, 'utf-8');
        if (!existing.includes('@import "tailwindcss"')) {
            await fs.writeFile(cssPath, `@import "tailwindcss";\n\n${existing}`);
        }
    }
    else {
        await fs.writeFile(cssPath, '@import "tailwindcss";\n');
    }
}
export const tailwindFeature = {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    detect,
    apply,
};
