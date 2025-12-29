import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from {{projectName}} backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
