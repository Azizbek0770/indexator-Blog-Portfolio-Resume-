import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all education (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Education retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve education',
      data: null
    });
  }
});

// Create education (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('school').notEmpty().trim(),
    body('degree').notEmpty().trim(),
    body('start_date').isISO8601()
  ],
  validate,
  async (req, res) => {
    try {
      const { school, degree, field, start_date, end_date, current, description, gpa, sort_order } = req.body;

      const { data, error } = await supabase
        .from('education')
        .insert([{
          school,
          degree,
          field,
          start_date,
          end_date: current ? null : end_date,
          current,
          description,
          gpa,
          sort_order: sort_order || 0
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Education created',
        data
      });
    } catch (error) {
      console.error('Create education error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create education',
        data: null
      });
    }
  }
);

// Update education (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { school, degree, field, start_date, end_date, current, description, gpa, sort_order } = req.body;

      const { data, error } = await supabase
        .from('education')
        .update({
          school,
          degree,
          field,
          start_date,
          end_date: current ? null : end_date,
          current,
          description,
          gpa,
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
        message: 'Education updated',
        data
      });
    } catch (error) {
      console.error('Update education error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update education',
        data: null
      });
    }
  }
);

// Delete education (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Education deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete education',
      data: null
    });
  }
});

export default router;