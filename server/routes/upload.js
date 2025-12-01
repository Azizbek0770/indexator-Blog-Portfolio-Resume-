import express from 'express';
import multer from 'multer';
import { supabase } from '../database/supabase.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Upload image to Supabase storage (admin only)
router.post('/',
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
        });
      }

      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(process.env.STORAGE_BUCKET || 'blog_media')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(process.env.STORAGE_BUCKET || 'blog_media')
        .getPublicUrl(filePath);

      res.status(201).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          filename: fileName,
          path: filePath,
          url: urlData.publicUrl
        }
      });
    } catch (error) {
      console.error('Upload file error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to upload file',
        data: null
      });
    }
  }
);

// Delete image from Supabase storage (admin only)
router.delete('/:filename',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = `uploads/${filename}`;

      const { error } = await supabase.storage
        .from(process.env.STORAGE_BUCKET || 'blog_media')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      res.json({
        status: 'success',
        message: 'File deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete file',
        data: null
      });
    }
  }
);

export default router;
