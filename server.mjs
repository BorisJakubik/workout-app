import { createServer as createViteServer } from 'vite'
import { createServer } from 'node:http'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' })

const server = createServer((request, response) => {
  vite.middlewares(request, response)
})

server.listen(5173, '127.0.0.1', () => console.log('FitTrack beží na http://127.0.0.1:5173'))
