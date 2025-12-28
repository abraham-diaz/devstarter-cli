import prompts from 'prompts';
export async function askInitQuestions(options = {}) {
    const questions = [];
    if (!options.skipProjectName) {
        questions.push({
            type: 'text',
            name: 'projectName',
            message: 'Project name:',
            validate: (value) => value.length < 1 ? 'Project name is required' : true,
        });
    }
    questions.push({
        type: 'select',
        name: 'projectType',
        message: 'Project type:',
        choices: [
            { title: 'Frontend', value: 'frontend' },
            { title: 'Backend', value: 'backend' },
        ],
    }, {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize a git repository?',
        initial: true,
    });
    return prompts(questions);
}
