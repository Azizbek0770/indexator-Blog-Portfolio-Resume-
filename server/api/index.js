import express from 'express'
import aboutRoutes from '../routes/about.js'
import authRoutes from '../routes/auth.js'
import blogRoutes from '../routes/blog.js'
import certificatesRoutes from '../routes/certificates.js'
import educationRoutes from '../routes/education.js'
import experienceRoutes from '../routes/experiences.js'
import heroRoutes from '../routes/hero.js'
import messagesRoutes from '../routes/messages.js'
import projectsRoutes from '../routes/projects.js'
import servicesRoutes from '../routes/services.js'
import settingsRoutes from '../routes/settings.js'
import skillsRoutes from '../routes/skills.js'
import testimonialsRoutes from '../routes/testimonials.js'
import uploadRoutes from '../routes/upload.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', api: true })
})

router.use('/auth', authRoutes)
router.use('/hero', heroRoutes)
router.use('/about', aboutRoutes)
router.use('/skills', skillsRoutes)
router.use('/experience', experienceRoutes)
router.use('/education', educationRoutes)
router.use('/certificates', certificatesRoutes)
router.use('/projects', projectsRoutes)
router.use('/services', servicesRoutes)
router.use('/testimonials', testimonialsRoutes)
router.use('/blog', blogRoutes)
router.use('/messages', messagesRoutes)
router.use('/settings', settingsRoutes)
router.use('/upload', uploadRoutes)

export default router
