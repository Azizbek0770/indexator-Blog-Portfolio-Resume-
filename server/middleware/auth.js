import jwt from 'jsonwebtoken';

import { supabase } from '../database/supabase.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token required',
        data: null
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid or expired token',
          data: null
        });
      }

      // Verify user still exists
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return res.status(403).json({
          status: 'error',
          message: 'User not found',
          data: null
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error',
      data: null
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required',
      data: null
    });
  }
};