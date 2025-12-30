import type { ProjectType } from '../types/project.js';


type PrintSummaryOptions = {
  projectName: string;
  projectType: ProjectType;
  initGit: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn';
};

export function printSummary({
  projectName,
  projectType,
  initGit,
  packageManager,
}: PrintSummaryOptions): void {
  console.log('\n✔ Project created successfully\n');

  console.log('Summary');
  console.log(`- Type: ${projectType}`);
  console.log(`- Directory: ./${projectName}`);
  console.log(`- Git: ${initGit ? 'initialized' : 'not initialized'}\n`);

  console.log('Next steps');
  console.log(`  cd ${projectName}`);
console.log(`  ${packageManager} install`);

  if (projectType === 'backend') {
    console.log(`  ${packageManager} run dev`);
  } else {
    console.log(`  ${packageManager} run dev`);
  }

  console.log('');
}
