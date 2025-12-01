import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Submit contact message (public)
router.post('/',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('message').notEmpty().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name,
          email,
          subject,
          message
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Message sent successfully',
        data
      });
    } catch (error) {
      console.error('Submit message error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message',
        data: null
      });
    }
  }
);

// Get all messages (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { read } = req.query;
    
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (read === 'true') {
      query = query.eq('read', true);
    } else if (read === 'false') {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Messages retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve messages',
      data: null
    });
  }
});

// Mark message as read (admin only)
router.patch('/:id/read', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Message marked as read',
      data
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark message as read',
      data: null
    });
  }
});

// Delete message (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Message deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message',
      data: null
    });
  }
});

// Get message count (admin only)
router.get('/stats/count', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { data: allMessages, error: allError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true });

    const { data: unreadMessages, error: unreadError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('read', false);

    if (allError || unreadError) {
      throw allError || unreadError;
    }

    res.json({
      status: 'success',
      message: 'Message stats retrieved',
      data: {
        total: allMessages || 0,
        unread: unreadMessages || 0
      }
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve message stats',
      data: null
    });
  }
});

export default router;