import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Testimonials retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve testimonials',
      data: null
    });
  }
});

// Create testimonial (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('author').notEmpty().trim(),
    body('text').notEmpty().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { author, role, company, text, image_url, rating, featured } = req.body;

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          author,
          role,
          company,
          text,
          image_url,
          rating,
          featured: featured || false
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Testimonial created',
        data
      });
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create testimonial',
        data: null
      });
    }
  }
);

// Update testimonial (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { author, role, company, text, image_url, rating, featured } = req.body;

      const { data, error } = await supabase
        .from('testimonials')
        .update({
          author,
          role,
          company,
          text,
          image_url,
          rating,
          featured,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        status: 'success',
        message: 'Testimonial updated',
        data
      });
    } catch (error) {
      console.error('Update testimonial error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update testimonial',
        data: null
      });
    }
  }
);

// Delete testimonial (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Testimonial deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete testimonial',
      data: null
    });
  }
});

export default router;