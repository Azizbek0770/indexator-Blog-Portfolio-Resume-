import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all experience (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Experience retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve experience',
      data: null
    });
  }
});

// Get single experience (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Experience retrieved',
      data
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve experience',
      data: null
    });
  }
});

// Create experience (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('title').notEmpty().trim(),
    body('company').notEmpty().trim(),
    body('start_date').isISO8601()
  ],
  validate,
  async (req, res) => {
    try {
      const { title, company, start_date, end_date, current, description, location, sort_order } = req.body;

      const { data, error } = await supabase
        .from('experience')
        .insert([{
          title,
          company,
          start_date,
          end_date: current ? null : end_date,
          current,
          description,
          location,
          sort_order: sort_order || 0
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Experience created',
        data
      });
    } catch (error) {
      console.error('Create experience error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create experience',
        data: null
      });
    }
  }
);

// Update experience (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, company, start_date, end_date, current, description, location, sort_order } = req.body;

      const { data, error } = await supabase
        .from('experience')
        .update({
          title,
          company,
          start_date,
          end_date: current ? null : end_date,
          current,
          description,
          location,
          sort_order,
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
        message: 'Experience updated',
        data
      });
    } catch (error) {
      console.error('Update experience error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update experience',
        data: null
      });
    }
  }
);

// Delete experience (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Experience deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete experience',
      data: null
    });
  }
});

export default router;