import { getAvailableFeatureIds } from './registry.js';
export function resolveFeatureArg(arg) {
    const available = getAvailableFeatureIds();
    if (!available.includes(arg)) {
        throw new Error(`Unknown feature "${arg}". Available: ${available.join(', ')}`);
    }
    return arg;
}
