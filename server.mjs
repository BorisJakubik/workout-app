import { createServer as createViteServer } from 'vite';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataFile = resolve(root, 'data/fitness-data.json');
const tempFile = resolve(root, 'data/fitness-data.tmp.json');
const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' });

const handleData = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    if (request.method === 'GET') {
      response.end(await readFile(dataFile, 'utf8'));
      return;
    }
    if (request.method === 'PUT') {
      let body = '';
      for await (const chunk of request) body += chunk;
      const data = JSON.parse(body);
      if (!Array.isArray(data.categories) || !Array.isArray(data.exercises) || !Array.isArray(data.workouts))
        throw new Error('Neplatný dátový formát');
      await mkdir(dirname(dataFile), { recursive: true });
      await writeFile(tempFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      await rename(tempFile, dataFile);
      response.end(JSON.stringify({ saved: true }));
      return;
    }
    response.statusCode = 405;
    response.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    response.statusCode = 500;
    response.end(JSON.stringify({ error: error.message }));
  }
};

const server = createServer((request, response) => {
  if (request.url?.split('?')[0] === '/api/data') {
    handleData(request, response);
    return;
  }
  vite.middlewares(request, response);
});

server.listen(5173, '127.0.0.1', () => console.log('FitTrack beží na http://127.0.0.1:5173'));
