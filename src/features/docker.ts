import fs from 'fs-extra';
import path from 'node:path';
import type { FeatureDefinition, ProjectContext } from '../types/feature.js';

async function detect(context: ProjectContext): Promise<boolean> {
  const configFiles = [
    'Dockerfile',
    'docker-compose.yml',
    'docker-compose.yaml',
    'compose.yml',
    'compose.yaml',
  ];

  for (const file of configFiles) {
    if (await fs.pathExists(path.join(context.root, file))) {
      return true;
    }
  }

  return false;
}

function isFrontend(packageJson: Record<string, unknown>): boolean {
  const deps = {
    ...((packageJson.dependencies as Record<string, string>) ?? {}),
    ...((packageJson.devDependencies as Record<string, string>) ?? {}),
  };
  return 'vite' in deps;
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

function generateDockerfile(context: ProjectContext): string {
  const installCmd = getInstallCommand(context);
  const frontend = isFrontend(context.packageJson);

  if (frontend) {
    return `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN ${installCmd}
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
  }

  return `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN ${installCmd}
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN ${installCmd} --omit=dev
EXPOSE 3000
CMD ["node", "dist/index.js"]
`;
}

function generateDockerCompose(context: ProjectContext): string {
  const frontend = isFrontend(context.packageJson);
  const port = frontend ? '8080:80' : '3000:3000';

  return `services:
  app:
    build: .
    ports:
      - "${port}"
    environment:
      - NODE_ENV=production
`;
}

const DOCKERIGNORE = `node_modules
dist
.git
*.log
.env
`;

async function apply(context: ProjectContext): Promise<void> {
  await fs.writeFile(
    path.join(context.root, 'Dockerfile'),
    generateDockerfile(context),
  );

  await fs.writeFile(
    path.join(context.root, 'docker-compose.yml'),
    generateDockerCompose(context),
  );

  await fs.writeFile(path.join(context.root, '.dockerignore'), DOCKERIGNORE);
}

export const dockerFeature: FeatureDefinition = {
  id: 'docker',
  name: 'Docker',
  description: 'Dockerfile, docker-compose, and .dockerignore',
  detect,
  apply,
};
