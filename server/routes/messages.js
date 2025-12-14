import express from 'express';
import { body, param } from 'express-validator';

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

      let emailSent = false;
      const adminEmail = process.env.ADMIN_EMAIL;
      const resendKey = process.env.RESEND_API_KEY;
      const resendFrom = process.env.RESEND_FROM || `Portfolio <${adminEmail || 'no-reply@example.com'}>`;

      if (resendKey && adminEmail) {
        try {
          const resp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: resendFrom,
              to: [adminEmail],
              subject: `New contact message: ${subject || '(no subject)'}`,
              text: `Name: ${name}\nEmail: ${email}\n\n${message}`
            })
          });
          emailSent = resp.ok;
        } catch (e) {
          console.error('Email send error:', e);
        }
      }

      res.status(201).json({
        status: 'success',
        message: 'Message sent successfully',
        data: { ...data, emailSent }
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
router.patch('/:id/read',
  authenticateToken,
  isAdmin,
  [param('id').isUUID().withMessage('Invalid message id')],
  validate,
  async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Message not found',
          data: null
        });
      }
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('invalid input syntax') || msg.includes('uuid')) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid message id',
          data: null
        });
      }
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
router.delete('/:id',
  authenticateToken,
  isAdmin,
  [param('id').isUUID().withMessage('Invalid message id')],
  validate,
  async (req, res) => {
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
