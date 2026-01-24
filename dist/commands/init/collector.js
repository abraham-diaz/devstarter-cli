import { DEFAULT_INIT_OPTIONS } from '../../types/project.js';
import { askProjectName, askProjectStructure, askInitQuestions, askTemplate, askInitGit, askUseVitest, } from '../../prompts/initPrompts.js';
import { normalizeProjectName } from '../../utils/normalize.js';
import { detectPackageManager } from '../../utils/detectPackageManager.js';
import { listTemplates } from '../../utils/listTemplate.js';
import { resolveProjectType, resolveTemplateFlag, resolveProjectName, resolveTemplateFinal, } from './resolvers.js';
/**
 * Recolecta todas las respuestas necesarias del usuario
 * combinando flags, argumentos, defaults y prompts interactivos
 */
export async function collectInitContext(projectNameArg, options) {
    const useDefaults = options.yes ?? false;
    // Paso 1: Obtener nombre del proyecto
    const projectName = await collectProjectName(projectNameArg, useDefaults);
    // Paso 2: Obtener estructura (basic/monorepo)
    const structure = await collectStructure(useDefaults);
    // Paso 3: Bifurcar según estructura
    if (structure === 'monorepo') {
        return collectMonorepoContext(projectName, useDefaults, options);
    }
    return collectBasicContext(projectName, options, useDefaults);
}
async function collectProjectName(projectNameArg, useDefaults) {
    if (projectNameArg) {
        return normalizeProjectName(projectNameArg);
    }
    if (useDefaults) {
        return normalizeProjectName(resolveProjectName(projectNameArg));
    }
    const answer = await askProjectName();
    return normalizeProjectName(answer.projectName);
}
async function collectStructure(useDefaults) {
    if (useDefaults) {
        return DEFAULT_INIT_OPTIONS.projectStructure;
    }
    const answer = await askProjectStructure();
    return answer.projectStructure;
}
async function collectBasicContext(projectName, options, useDefaults) {
    const typeFromFlag = resolveProjectType(options.type);
    const gitFlagProvided = options.git !== undefined;
    // Obtener tipo de proyecto e initGit
    let projectType;
    let initGit;
    if (useDefaults) {
        projectType = typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType;
        initGit = gitFlagProvided ? options.git : DEFAULT_INIT_OPTIONS.initGit;
    }
    else {
        const answers = await askInitQuestions({
            skipProjectName: true,
            skipProjectType: Boolean(typeFromFlag),
            skipInitGit: gitFlagProvided,
        });
        projectType = typeFromFlag ?? answers.projectType;
        initGit = gitFlagProvided ? options.git : answers.initGit;
    }
    // Obtener template
    const templates = listTemplates(projectType);
    const templateFromFlag = resolveTemplateFlag(options.template, templates);
    const template = await collectTemplate(templateFromFlag, templates, useDefaults);
    // Obtener useVitest
    const vitestFlagProvided = options.vitest !== undefined;
    let useVitest;
    if (vitestFlagProvided) {
        useVitest = options.vitest;
    }
    else if (useDefaults) {
        useVitest = DEFAULT_INIT_OPTIONS.useVitest;
    }
    else {
        useVitest = (await askUseVitest()).useVitest;
    }
    return {
        structure: 'basic',
        projectName,
        projectType,
        template,
        initGit,
        useVitest,
        packageManager: detectPackageManager(),
        isDryRun: Boolean(options.dryRun),
    };
}
async function collectMonorepoContext(projectName, useDefaults, options) {
    // Templates para web (frontend) y api (backend)
    const frontendTemplates = listTemplates('frontend');
    const backendTemplates = listTemplates('backend');
    const gitFlagProvided = options.git !== undefined;
    let webTemplate;
    let apiTemplate;
    let initGit;
    if (useDefaults) {
        webTemplate = frontendTemplates[0] ?? 'basic';
        apiTemplate = backendTemplates[0] ?? 'basic';
        initGit = gitFlagProvided ? options.git : DEFAULT_INIT_OPTIONS.initGit;
    }
    else {
        const webAnswer = await askTemplate({
            templates: frontendTemplates,
            message: 'Template for apps/web (frontend):',
        });
        webTemplate = webAnswer.template;
        const apiAnswer = await askTemplate({
            templates: backendTemplates,
            message: 'Template for apps/api (backend):',
        });
        apiTemplate = apiAnswer.template;
        if (gitFlagProvided) {
            initGit = options.git;
        }
        else {
            const gitAnswer = await askInitGit();
            initGit = gitAnswer.initGit;
        }
    }
    // Obtener useVitest
    const vitestFlagProvided = options.vitest !== undefined;
    let useVitest;
    if (vitestFlagProvided) {
        useVitest = options.vitest;
    }
    else if (useDefaults) {
        useVitest = DEFAULT_INIT_OPTIONS.useVitest;
    }
    else {
        useVitest = (await askUseVitest()).useVitest;
    }
    return {
        structure: 'monorepo',
        projectName,
        webTemplate,
        apiTemplate,
        initGit,
        useVitest,
        packageManager: 'pnpm', // Monorepo usa pnpm por defecto
        isDryRun: Boolean(options.dryRun),
    };
}
async function collectTemplate(templateFlag, templates, useDefaults) {
    const resolved = resolveTemplateFinal(templateFlag, templates, useDefaults);
    if (resolved)
        return resolved;
    const answer = await askTemplate({ templates });
    return answer.template;
}
