import fs from 'fs-extra';
import path from 'node:path';
import prompts from 'prompts';
import type { FeatureDefinition, ProjectContext } from '../types/feature.js';

type CIProvider = 'github' | 'gitlab';

async function detect(context: ProjectContext): Promise<boolean> {
  // Check for GitLab CI
  if (await fs.pathExists(path.join(context.root, '.gitlab-ci.yml'))) {
    return true;
  }

  // Check for GitHub Actions (directory must exist and contain at least one .yml)
  const workflowsDir = path.join(context.root, '.github', 'workflows');
  if (await fs.pathExists(workflowsDir)) {
    const files = await fs.readdir(workflowsDir);
    if (files.some((f) => f.endsWith('.yml') || f.endsWith('.yaml'))) {
      return true;
    }
  }

  return false;
}

function getInstallCommand(context: ProjectContext): string {
  switch (context.packageManager) {
    case 'pnpm':
      return 'pnpm install --frozen-lockfile';
    case 'yarn':
      return 'yarn install --frozen-lockfile';
    default:
      return 'npm ci';
  }
}

function getRunCommand(context: ProjectContext, script: string): string {
  switch (context.packageManager) {
    case 'pnpm':
      return `pnpm run ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    default:
      return `npm run ${script}`;
  }
}

function getScripts(packageJson: Record<string, unknown>): Record<string, string> {
  return (packageJson.scripts as Record<string, string>) ?? {};
}

function generateGitHubWorkflow(context: ProjectContext): string {
  const scripts = getScripts(context.packageJson);
  const installCmd = getInstallCommand(context);

  const steps = [
    '      - uses: actions/checkout@v4',
    '      - uses: actions/setup-node@v4',
    '        with:',
    '          node-version: 20',
    `      - run: ${installCmd}`,
  ];

  if (scripts.lint) {
    steps.push(`      - run: ${getRunCommand(context, 'lint')}`);
  }
  if (scripts.test) {
    steps.push(`      - run: ${getRunCommand(context, 'test')}`);
  }
  if (scripts.build) {
    steps.push(`      - run: ${getRunCommand(context, 'build')}`);
  }

  return `name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
${steps.join('\n')}
`;
}

function generateGitLabCI(context: ProjectContext): string {
  const scripts = getScripts(context.packageJson);
  const installCmd = getInstallCommand(context);

  let config = `stages:
  - install
  - lint
  - test
  - build

install:
  stage: install
  image: node:20-alpine
  script:
    - ${installCmd}
  cache:
    paths:
      - node_modules/
`;

  if (scripts.lint) {
    config += `
lint:
  stage: lint
  image: node:20-alpine
  script:
    - ${getRunCommand(context, 'lint')}
  cache:
    paths:
      - node_modules/
`;
  }

  if (scripts.test) {
    config += `
test:
  stage: test
  image: node:20-alpine
  script:
    - ${getRunCommand(context, 'test')}
  cache:
    paths:
      - node_modules/
`;
  }

  if (scripts.build) {
    config += `
build:
  stage: build
  image: node:20-alpine
  script:
    - ${getRunCommand(context, 'build')}
  cache:
    paths:
      - node_modules/
`;
  }

  return config;
}

async function apply(context: ProjectContext): Promise<void> {
  const { provider } = await prompts({
    type: 'select',
    name: 'provider',
    message: 'Which CI provider?',
    choices: [
      { title: 'GitHub Actions', value: 'github' },
      { title: 'GitLab CI', value: 'gitlab' },
    ],
  });

  if (!provider) {
    throw new Error('CI provider selection cancelled');
  }

  if ((provider as CIProvider) === 'github') {
    const workflowDir = path.join(context.root, '.github', 'workflows');
    await fs.ensureDir(workflowDir);
    await fs.writeFile(
      path.join(workflowDir, 'ci.yml'),
      generateGitHubWorkflow(context),
    );
  } else {
    await fs.writeFile(
      path.join(context.root, '.gitlab-ci.yml'),
      generateGitLabCI(context),
    );
  }
}

export const ciFeature: FeatureDefinition = {
  id: 'ci',
  name: 'CI',
  description: 'Continuous integration with GitHub Actions or GitLab CI',
  detect,
  apply,
};
