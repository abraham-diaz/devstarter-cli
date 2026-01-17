const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>{{projectName}}</h1>
  <p>Edit <code>src/main.ts</code> and save to see HMR in action.</p>
`;
