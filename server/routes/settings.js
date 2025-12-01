import express from 'express';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Settings retrieved',
      data: data || null
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve settings',
      data: null
    });
  }
});

// Update settings (admin only)
router.put('/',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { 
        theme, 
        primary_color, 
        secondary_color, 
        font_family, 
        site_title, 
        site_description, 
        social_links 
      } = req.body;

      // Check if settings exist
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('settings')
          .update({
            theme,
            primary_color,
            secondary_color,
            font_family,
            site_title,
            site_description,
            social_links,
            updated_at: new Date()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Create new
        result = await supabase
          .from('settings')
          .insert([{
            theme,
            primary_color,
            secondary_color,
            font_family,
            site_title,
            site_description,
            social_links
          }])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      res.json({
        status: 'success',
        message: 'Settings updated',
        data: result.data
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update settings',
        data: null
      });
    }
  }
);

export default router;