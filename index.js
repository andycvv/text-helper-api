import express from 'express'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 1234
app.disable('x-powered-by')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'https://text-helper-ai.vercel.app/'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.OPENAI_API_KEY
})

app.use(express.json())

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body

  try {
    const { text: result } = await generateText({
      model: groq('llama3-8b-8192'),
      prompt: prompt.trim()
    })

    return res.json(result)
  } catch {
    return res.status(500).json({ error: 'Error al procesar la solicitud' })
  }
})

app.get('/api/openai', (req, res) => {
  res.json({ message: 'Que haces aquí amigo?' })
})

app.listen(PORT)
