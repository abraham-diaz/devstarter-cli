import { describe, it, expect } from 'vitest';
import { listTemplates } from './listTemplate.js';

describe('listTemplates', () => {
  it('should return array for frontend type', () => {
    const templates = listTemplates('frontend');

    expect(Array.isArray(templates)).toBe(true);
  });

  it('should return array for backend type', () => {
    const templates = listTemplates('backend');

    expect(Array.isArray(templates)).toBe(true);
  });

  it('should return sorted templates', () => {
    const templates = listTemplates('frontend');

    if (templates.length > 1) {
      const sorted = [...templates].sort();
      expect(templates).toEqual(sorted);
    }
  });

  it('should include basic template for frontend if exists', () => {
    const templates = listTemplates('frontend');

    // Si hay templates, verificar que sean strings válidos
    templates.forEach((template) => {
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
    });
  });

  it('should return empty array for non-existent project type directory', () => {
    // Forzamos el tipo para probar el caso edge
    const templates = listTemplates('nonexistent' as 'frontend');

    expect(templates).toEqual([]);
  });
});
