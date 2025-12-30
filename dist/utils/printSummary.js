export function printSummary({ projectName, projectType, initGit, }) {
    console.log('\n✔ Project created successfully\n');
    console.log('Summary');
    console.log(`- Type: ${projectType}`);
    console.log(`- Directory: ./${projectName}`);
    console.log(`- Git: ${initGit ? 'initialized' : 'not initialized'}\n`);
    console.log('Next steps');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    if (projectType === 'backend') {
        console.log('  npm run dev');
    }
    else {
        console.log('  npm run dev');
    }
    console.log('');
}
