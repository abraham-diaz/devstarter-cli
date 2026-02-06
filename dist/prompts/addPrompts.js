import prompts from 'prompts';
import { PromptCancelledError } from './initPrompts.js';
const onCancel = () => {
    throw new PromptCancelledError();
};
export async function askFeatures(available) {
    return prompts({
        type: 'multiselect',
        name: 'features',
        message: 'Select features to add:',
        choices: available.map((f) => ({
            title: f.name,
            value: f.id,
            description: f.description,
        })),
        instructions: false,
        hint: '- Space to select. Return to submit',
        min: 1,
    }, { onCancel });
}
