import express from 'express'
import multer from 'multer'
import { supabase } from '../database/supabase.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// ✅ Multer: memory storage (Vercel-safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  }
})

// ✅ Upload image (admin only)
router.post(
  '/',
  authenticateToken,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded',
          data: null
        })
      }

      const { originalname, mimetype, buffer } = req.file

      const fileExt = originalname.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // ✅ Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog_media')
        .upload(filePath, buffer, {
          contentType: mimetype,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // ✅ Get public URL
      const { data } = supabase.storage
        .from('blog_media')
        .getPublicUrl(filePath)

      return res.status(201).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          filename: fileName,
          path: filePath,
          url: data.publicUrl
        }
      })
    } catch (err) {
      console.error('Upload error:', err)
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Upload failed',
        data: null
      })
    }
  }
)

// ✅ Delete image (admin only)
router.delete(
  '/:filename',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { filename } = req.params
      const filePath = `uploads/${filename}`

      const { error } = await supabase.storage
        .from('blog_media')
        .remove([filePath])

      if (error) throw error

      return res.json({
        status: 'success',
        message: 'File deleted successfully',
        data: null
      })
    } catch (err) {
      console.error('Delete error:', err)
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Delete failed',
        data: null
      })
    }
  }
)

export default router
