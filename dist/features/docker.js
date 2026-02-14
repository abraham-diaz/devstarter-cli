import fs from 'fs-extra';
import path from 'node:path';
import { getInstallCommand } from '../utils/detectPackageManager.js';
async function detect(context) {
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
function isFrontend(packageJson) {
    const deps = {
        ...(packageJson.dependencies ?? {}),
        ...(packageJson.devDependencies ?? {}),
    };
    return 'vite' in deps;
}
function generateDockerfile(context) {
    const installCmd = getInstallCommand(context.packageManager);
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
function generateDockerCompose(context) {
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
async function apply(context) {
    await fs.writeFile(path.join(context.root, 'Dockerfile'), generateDockerfile(context));
    await fs.writeFile(path.join(context.root, 'docker-compose.yml'), generateDockerCompose(context));
    await fs.writeFile(path.join(context.root, '.dockerignore'), DOCKERIGNORE);
}
export const dockerFeature = {
    id: 'docker',
    name: 'Docker',
    description: 'Dockerfile, docker-compose, and .dockerignore',
    detect,
    apply,
};
