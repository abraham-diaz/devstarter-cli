import { describe, it, expect } from 'vitest';
import { normalizeProjectName } from './normalize.js';
describe('normalizeProjectName', () => {
    it('should trim whitespace', () => {
        expect(normalizeProjectName('  my-app  ')).toBe('my-app');
    });
    it('should convert camelCase to kebab-case', () => {
        expect(normalizeProjectName('myApp')).toBe('my-app');
        expect(normalizeProjectName('myAwesomeApp')).toBe('my-awesome-app');
    });
    it('should convert PascalCase to kebab-case', () => {
        expect(normalizeProjectName('MyApp')).toBe('my-app');
        expect(normalizeProjectName('MyAwesomeApp')).toBe('my-awesome-app');
    });
    it('should replace spaces with dashes', () => {
        expect(normalizeProjectName('my app')).toBe('my-app');
        expect(normalizeProjectName('my  awesome  app')).toBe('my-awesome-app');
    });
    it('should replace underscores with dashes', () => {
        expect(normalizeProjectName('my_app')).toBe('my-app');
        expect(normalizeProjectName('my__app')).toBe('my-app');
    });
    it('should remove invalid characters', () => {
        expect(normalizeProjectName('my@app!')).toBe('myapp');
        expect(normalizeProjectName('my$app#name')).toBe('myappname');
    });
    it('should collapse multiple dashes', () => {
        expect(normalizeProjectName('my--app')).toBe('my-app');
        expect(normalizeProjectName('my---awesome---app')).toBe('my-awesome-app');
    });
    it('should convert to lowercase', () => {
        expect(normalizeProjectName('MY-APP')).toBe('my-app');
        expect(normalizeProjectName('MyApp')).toBe('my-app');
    });
    it('should handle complex cases', () => {
        expect(normalizeProjectName('  My_Awesome App! ')).toBe('my-awesome-app');
        expect(normalizeProjectName('myApp_v2')).toBe('my-app-v2');
    });
    it('should handle empty string', () => {
        expect(normalizeProjectName('')).toBe('');
    });
    it('should handle already normalized names', () => {
        expect(normalizeProjectName('my-app')).toBe('my-app');
        expect(normalizeProjectName('my-awesome-app')).toBe('my-awesome-app');
    });
});
