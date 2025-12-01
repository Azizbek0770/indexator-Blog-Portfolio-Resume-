import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
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
      message: 'Projects retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve projects',
      data: null
    });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Project retrieved',
      data
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve project',
      data: null
    });
  }
});

// Create project (admin only)
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
      const { 
        title, 
        description, 
        detailed_description, 
        tech_stack, 
        image_url, 
        demo_url, 
        code_url, 
        featured, 
        sort_order 
      } = req.body;

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title,
          description,
          detailed_description,
          tech_stack,
          image_url,
          demo_url,
          code_url,
          featured: featured || false,
          sort_order: sort_order || 0
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Project created',
        data
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create project',
        data: null
      });
    }
  }
);

// Update project (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        detailed_description, 
        tech_stack, 
        image_url, 
        demo_url, 
        code_url, 
        featured, 
        sort_order 
      } = req.body;

      const { data, error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          detailed_description,
          tech_stack,
          image_url,
          demo_url,
          code_url,
          featured,
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
        message: 'Project updated',
        data
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update project',
        data: null
      });
    }
  }
);

// Delete project (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Project deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete project',
      data: null
    });
  }
});

export default router;