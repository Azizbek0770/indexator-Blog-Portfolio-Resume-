import dotenv from 'dotenv'
dotenv.config()

const { app } = await import('../api/index.js')

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Local development server running on http://localhost:${PORT}`)
})

export default app
