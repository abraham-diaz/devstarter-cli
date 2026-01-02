/**
 * Valida y resuelve el flag --type a ProjectType
 */
export function resolveProjectType(optionType) {
    if (!optionType)
        return undefined;
    if (optionType === 'frontend' || optionType === 'backend') {
        return optionType;
    }
    throw new Error(`Invalid --type value "${optionType}". Use "frontend" or "backend".`);
}
/**
 * Valida el flag --template contra templates disponibles
 */
export function resolveTemplateFlag(optionTemplate, available) {
    if (!optionTemplate)
        return undefined;
    if (available.includes(optionTemplate))
        return optionTemplate;
    throw new Error(`Invalid --template "${optionTemplate}". Available: ${available.join(', ')}`);
}
/**
 * Resuelve el nombre del proyecto con fallbacks
 */
export function resolveProjectName(argName, promptName) {
    if (argName)
        return argName;
    if (promptName)
        return promptName;
    return process.cwd().split(/[\\/]/).pop() ?? 'my-app';
}
/**
 * Determina el template final basado en múltiples fuentes
 * Retorna undefined si necesita input del usuario
 */
export function resolveTemplateFinal(templateFlag, templates, useDefaults) {
    // Prioridad 1: Flag explícito
    if (templateFlag)
        return templateFlag;
    // Prioridad 2: Sin templates disponibles
    if (templates.length === 0)
        return 'basic';
    // Prioridad 3: Modo defaults o único template
    if (useDefaults || templates.length === 1)
        return templates[0];
    // Necesita input del usuario
    return undefined;
}
