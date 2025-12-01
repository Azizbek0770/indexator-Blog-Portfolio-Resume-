import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all certificates (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Certificates retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve certificates',
      data: null
    });
  }
});

// Create certificate (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('name').notEmpty().trim(),
    body('issuer').notEmpty().trim(),
    body('issue_date').isISO8601()
  ],
  validate,
  async (req, res) => {
    try {
      const { name, issuer, issue_date, credential_id, credential_url, image_url } = req.body;

      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          name,
          issuer,
          issue_date,
          credential_id,
          credential_url,
          image_url
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Certificate created',
        data
      });
    } catch (error) {
      console.error('Create certificate error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create certificate',
        data: null
      });
    }
  }
);

// Update certificate (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, issuer, issue_date, credential_id, credential_url, image_url } = req.body;

      const { data, error } = await supabase
        .from('certificates')
        .update({
          name,
          issuer,
          issue_date,
          credential_id,
          credential_url,
          image_url,
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
        message: 'Certificate updated',
        data
      });
    } catch (error) {
      console.error('Update certificate error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update certificate',
        data: null
      });
    }
  }
);

// Delete certificate (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Certificate deleted',
      data: null
    });
    } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete certificate',
      data: null
    });
  }
});

export default router;