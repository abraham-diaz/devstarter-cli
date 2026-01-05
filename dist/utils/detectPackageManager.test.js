import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { detectPackageManager } from './detectPackageManager.js';
describe('detectPackageManager', () => {
    let tempDir;
    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'detect-pm-test-'));
    });
    afterEach(async () => {
        await fs.remove(tempDir);
    });
    it('should detect pnpm when pnpm-lock.yaml exists', async () => {
        await fs.writeFile(path.join(tempDir, 'pnpm-lock.yaml'), '');
        expect(detectPackageManager(tempDir)).toBe('pnpm');
    });
    it('should detect yarn when yarn.lock exists', async () => {
        await fs.writeFile(path.join(tempDir, 'yarn.lock'), '');
        expect(detectPackageManager(tempDir)).toBe('yarn');
    });
    it('should default to npm when no lock file exists', async () => {
        expect(detectPackageManager(tempDir)).toBe('npm');
    });
    it('should prioritize pnpm over yarn when both exist', async () => {
        await fs.writeFile(path.join(tempDir, 'pnpm-lock.yaml'), '');
        await fs.writeFile(path.join(tempDir, 'yarn.lock'), '');
        expect(detectPackageManager(tempDir)).toBe('pnpm');
    });
    it('should detect npm when only package-lock.json exists', async () => {
        await fs.writeFile(path.join(tempDir, 'package-lock.json'), '{}');
        expect(detectPackageManager(tempDir)).toBe('npm');
    });
});
