import type { AddCommandOptions, ResolvedAddContext } from '../../types/cli.js';
import { detectProjectContext } from '../../utils/detectProjectContext.js';
import { getAllFeatures } from './registry.js';
import { resolveFeatureArg } from './resolvers.js';
import { askFeatures } from '../../prompts/addPrompts.js';

export async function collectAddContext(
  featureArg: string | undefined,
  options: AddCommandOptions,
): Promise<ResolvedAddContext> {
  const projectContext = await detectProjectContext();

  if (featureArg) {
    const featureId = resolveFeatureArg(featureArg);
    return {
      projectRoot: projectContext.root,
      features: [featureId],
      isDryRun: Boolean(options.dryRun),
      packageManager: projectContext.packageManager,
    };
  }

  // Filter out already-detected features
  const allFeatures = getAllFeatures();
  const available: typeof allFeatures = [];

  for (const feature of allFeatures) {
    const detected = await feature.detect(projectContext);
    if (!detected) {
      available.push(feature);
    }
  }

  if (available.length === 0) {
    throw new Error('All available features are already configured.');
  }

  if (options.yes) {
    return {
      projectRoot: projectContext.root,
      features: available.map((f) => f.id),
      isDryRun: Boolean(options.dryRun),
      packageManager: projectContext.packageManager,
    };
  }

  const answer = await askFeatures(available);

  if (answer.features.length === 0) {
    throw new Error('No features selected.');
  }

  return {
    projectRoot: projectContext.root,
    features: answer.features,
    isDryRun: Boolean(options.dryRun),
    packageManager: projectContext.packageManager,
  };
}
