import { eslintFeature } from '../../features/eslint.js';
const features = [eslintFeature];
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
