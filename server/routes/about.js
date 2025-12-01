import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get about section (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'About section retrieved',
      data: data || null
    });
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve about section',
      data: null
    });
  }
});

// Update about section (admin only)
router.put('/',
  authenticateToken,
  isAdmin,
  [
    body('bio').notEmpty().trim(),
    body('mission').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { bio, mission, languages, years_experience, completed_projects, happy_clients } = req.body;

      // Check if about exists
      const { data: existing } = await supabase
        .from('about')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('about')
          .update({
            bio,
            mission,
            languages,
            years_experience,
            completed_projects,
            happy_clients,
            updated_at: new Date()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Create new
        result = await supabase
          .from('about')
          .insert([{
            bio,
            mission,
            languages,
            years_experience,
            completed_projects,
            happy_clients
          }])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      res.json({
        status: 'success',
        message: 'About section updated',
        data: result.data
      });
    } catch (error) {
      console.error('Update about error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update about section',
        data: null
      });
    }
  }
);

export default router;