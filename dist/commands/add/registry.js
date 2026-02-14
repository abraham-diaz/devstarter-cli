import { eslintFeature } from '../../features/eslint.js';
import { vitestFeature } from '../../features/vitest.js';
import { prettierFeature } from '../../features/prettier.js';
import { ciFeature } from '../../features/ci.js';
import { dockerFeature } from '../../features/docker.js';
import { tailwindFeature } from '../../features/tailwind.js';
const features = [
    eslintFeature,
    vitestFeature,
    prettierFeature,
    ciFeature,
    dockerFeature,
    tailwindFeature,
];
const featureMap = new Map(features.map((f) => [f.id, f]));
export function getAvailableFeatureIds() {
    return features.map((f) => f.id);
}
export function getFeature(id) {
    return featureMap.get(id);
}
export function getAllFeatures() {
    return features;
}
