import type { AddCommandOptions } from '../types/cli.js';
import { PromptCancelledError } from '../prompts/initPrompts.js';
import { styles } from '../utils/styles.js';
import { detectProjectContext } from '../utils/detectProjectContext.js';
import { installDependencies } from '../utils/installDependencies.js';
import { getAllFeatures, getFeature } from './add/registry.js';
import { collectAddContext } from './add/collector.js';

export async function addCommand(
  featureArg: string | undefined,
  options: AddCommandOptions,
): Promise<void> {
  try {
    if (options.list) {
      printFeatureList();
      return;
    }

    const context = await collectAddContext(featureArg, options);

    if (context.isDryRun) {
      printDryRun(context.features);
      return;
    }

    const projectContext = await detectProjectContext(context.projectRoot);

    for (const featureId of context.features) {
      const feature = getFeature(featureId)!;
      console.log(`${styles.info('Adding')} ${feature.name}...`);
      await feature.apply(projectContext);
      console.log(`${styles.success('Added')} ${feature.name}`);
    }

    console.log(`\n${styles.info('Installing dependencies...')}`);
    installDependencies(context.projectRoot, context.packageManager);

    printAddSummary(context.features);
  } catch (error) {
    handleError(error);
  }
}

function printFeatureList(): void {
  const features = getAllFeatures();

  console.log(`\n${styles.title('Available features')}\n`);

  for (const feature of features) {
    console.log(`  ${styles.highlight(feature.id)} - ${feature.description}`);
  }

  console.log('');
}

function printDryRun(featureIds: string[]): void {
  console.log(`\n${styles.warning('Dry run – no changes will be made')}\n`);
  console.log(styles.title('Features to add'));

  for (const id of featureIds) {
    const feature = getFeature(id)!;
    console.log(`  ${styles.info('-')} ${feature.name}: ${feature.description}`);
  }

  console.log('');
}

function printAddSummary(featureIds: string[]): void {
  console.log(`\n${styles.success('Done!')}\n`);
  console.log(styles.title('Added features'));

  for (const id of featureIds) {
    const feature = getFeature(id)!;
    console.log(`  ${styles.success('-')} ${feature.name}`);
  }

  console.log('');
}

function handleError(error: unknown): void {
  if (error instanceof PromptCancelledError) {
    console.log(`\n${styles.muted('Operation cancelled')}`);
    return;
  }
  console.error(`\n${styles.error('Error:')} ${(error as Error).message}`);
}
