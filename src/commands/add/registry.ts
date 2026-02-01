import type { FeatureDefinition } from '../../types/feature.js';
import { eslintFeature } from '../../features/eslint.js';

const features: FeatureDefinition[] = [eslintFeature];

const featureMap = new Map<string, FeatureDefinition>(
  features.map((f) => [f.id, f]),
);

export function getAvailableFeatureIds(): string[] {
  return features.map((f) => f.id);
}

export function getFeature(id: string): FeatureDefinition | undefined {
  return featureMap.get(id);
}

export function getAllFeatures(): FeatureDefinition[] {
  return features;
}
