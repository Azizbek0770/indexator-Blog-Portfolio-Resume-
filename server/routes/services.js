import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Services retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve services',
      data: null
    });
  }
});

// Create service (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { title, description, icon, sort_order } = req.body;

      const { data, error } = await supabase
        .from('services')
        .insert([{
          title,
          description,
          icon,
          sort_order: sort_order || 0
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Service created',
        data
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create service',
        data: null
      });
    }
  }
);

// Update service (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, icon, sort_order } = req.body;

      const { data, error } = await supabase
        .from('services')
        .update({
          title,
          description,
          icon,
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
        message: 'Service updated',
        data
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update service',
        data: null
      });
    }
  }
);

// Delete service (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Service deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete service',
      data: null
    });
  }
});

export default router;