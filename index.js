import express from 'express'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT
app.disable('x-powered-by')
app.use(cors())

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.OPENAI_API_KEY
})

app.use(express.json())

app.post('/api/openai', async (req, res) => {
  const { text, context, category, option } = req.body

  if (text.trim() === '') return res.json('')
  if (option === 'none') return res.json(text)

  const message = `
    Modifica el siguiente texto según las instrucciones dadas. El resultado debe ser el texto modificado sin explicaciones adicionales. Ten en cuenta el siguiente contexto adicional: ${context}

    Texto original:
    ${text}

    Categoría: ${category}
    Opción: ${option}

    Texto modificado:
  `

  try {
    const { text: result } = await generateText({
      model: groq('llama3-8b-8192'),
      prompt: message
    })

    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Error al generar el texto' })
  }
})

app.get('/api/openai', (req, res) => {
  res.json({ message: 'Que haces aquí amigo?' })
})

app.listen(PORT)
