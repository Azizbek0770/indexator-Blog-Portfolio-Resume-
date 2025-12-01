import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get hero section (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Hero section retrieved',
      data: data || null
    });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve hero section',
      data: null
    });
  }
});

// Update hero section (admin only)
router.put('/',
  authenticateToken,
  isAdmin,
  [
    body('title').notEmpty().trim(),
    body('slogan').notEmpty().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { title, slogan, avatar_url, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link } = req.body;

      // Check if hero exists
      const { data: existing } = await supabase
        .from('hero')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('hero')
          .update({
            title,
            slogan,
            avatar_url,
            cta_primary_text,
            cta_primary_link,
            cta_secondary_text,
            cta_secondary_link,
            updated_at: new Date()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Create new
        result = await supabase
          .from('hero')
          .insert([{
            title,
            slogan,
            avatar_url,
            cta_primary_text,
            cta_primary_link,
            cta_secondary_text,
            cta_secondary_link
          }])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      res.json({
        status: 'success',
        message: 'Hero section updated',
        data: result.data
      });
    } catch (error) {
      console.error('Update hero error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update hero section',
        data: null
      });
    }
  }
);

export default router;