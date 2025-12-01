import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Skills retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve skills',
      data: null
    });
  }
});

// Get skills by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Skills retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve skills',
      data: null
    });
  }
});

// Create skill (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('category').notEmpty().trim(),
    body('name').notEmpty().trim(),
    body('level').isInt({ min: 0, max: 100 })
  ],
  validate,
  async (req, res) => {
    try {
      const { category, name, level, icon } = req.body;

      const { data, error } = await supabase
        .from('skills')
        .insert([{ category, name, level, icon }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Skill created',
        data
      });
    } catch (error) {
      console.error('Create skill error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create skill',
        data: null
      });
    }
  }
);

// Update skill (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  [
    body('category').optional().trim(),
    body('name').optional().trim(),
    body('level').optional().isInt({ min: 0, max: 100 })
  ],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { category, name, level, icon } = req.body;

      const { data, error } = await supabase
        .from('skills')
        .update({ category, name, level, icon, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        status: 'success',
        message: 'Skill updated',
        data
      });
    } catch (error) {
      console.error('Update skill error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update skill',
        data: null
      });
    }
  }
);

// Delete skill (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Skill deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete skill',
      data: null
    });
  }
});

export default router;