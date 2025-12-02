import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

import aboutRoutes from '../server/routes/about.js'
import authRoutes from '../server/routes/auth.js'
import blogRoutes from '../server/routes/blog.js'
import certificatesRoutes from '../server/routes/certificates.js'
import educationRoutes from '../server/routes/education.js'
import experienceRoutes from '../server/routes/experiences.js'
import heroRoutes from '../server/routes/hero.js'
import messagesRoutes from '../server/routes/messages.js'
import projectsRoutes from '../server/routes/projects.js'
import servicesRoutes from '../server/routes/services.js'
import settingsRoutes from '../server/routes/settings.js'
import skillsRoutes from '../server/routes/skills.js'
import testimonialsRoutes from '../server/routes/testimonials.js'
import uploadRoutes from '../server/routes/upload.js'

const app = express()

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors(corsOptions))

app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serverless API is running',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/hero', heroRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/certificates', certificatesRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/upload', uploadRoutes)

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found', data: null })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal server error', data: null })
})

import serverless from 'serverless-http'
export const handler = serverless(app)
export { app }
export default handler
