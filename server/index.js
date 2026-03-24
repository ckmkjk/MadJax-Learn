import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000
const DIST = join(__dirname, '..', 'dist')
const DATA_FILE = join(__dirname, '..', 'data', 'profiles.json')

app.use(express.json())

// Serve the built React app
app.use(express.static(DIST))

// API: Save profiles (backup from localStorage)
app.post('/api/profiles', (req, res) => {
  try {
    const dir = dirname(DATA_FILE)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2))
    res.json({ ok: true })
  } catch (err) {
    console.error('Failed to save profiles:', err)
    res.status(500).json({ error: 'Failed to save' })
  }
})

// API: Load profiles (restore to localStorage)
app.get('/api/profiles', (req, res) => {
  try {
    if (existsSync(DATA_FILE)) {
      const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
      res.json(data)
    } else {
      res.json(null)
    }
  } catch (err) {
    console.error('Failed to load profiles:', err)
    res.status(500).json({ error: 'Failed to load' })
  }
})

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(DIST, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║        MadJax Learn is running!          ║
  ║                                          ║
  ║  Local:   http://localhost:${PORT}          ║
  ║  Network: http://<your-ip>:${PORT}         ║
  ║                                          ║
  ║  Kids can connect from any device        ║
  ║  on your WiFi network!                   ║
  ╚══════════════════════════════════════════╝
  `)
})
