import bcrypt from 'bcryptjs';
import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          data: null
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          data: null
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Login failed',
        data: null
      });
    }
  }
);

// Register (protected - only admins can create users)
router.post('/register',
  authenticateToken,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, role = 'admin' } = req.body;

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists',
          data: null
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ email, password_hash, role }])
        .select('id, email, role')
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Registration failed',
        data: null
      });
    }
  }
);

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    message: 'Token is valid',
    data: req.user
  });
});

// Change password
router.post('/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 })
  ],
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          data: null
        });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Current password is incorrect',
          data: null
        });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash, updated_at: new Date() })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      res.json({
        status: 'success',
        message: 'Password changed successfully',
        data: null
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to change password',
        data: null
      });
    }
  }
);

export default router;