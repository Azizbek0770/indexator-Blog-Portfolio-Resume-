import express from 'express';
import { body } from 'express-validator';

import { supabase } from '../database/supabase.js';
import {
  authenticateToken,
  isAdmin,
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all blog posts (public - only published)
router.get('/', async (req, res) => {
  try {
    const { category, published = 'true' } = req.query;
    
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .order('created_at', { ascending: false });

    if (published === 'true') {
      query = query.eq('published', true);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Blog posts retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve blog posts',
      data: null
    });
  }
});

// Get single blog post by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      throw error;
    }

    // Increment views
    await supabase
      .from('blog_posts')
      .update({ views: data.views + 1 })
      .eq('id', data.id);

    res.json({
      status: 'success',
      message: 'Blog post retrieved',
      data
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve blog post',
      data: null
    });
  }
});

// Get single blog post by ID (admin)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Blog post retrieved',
      data
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve blog post',
      data: null
    });
  }
});

// Create blog post (admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('title').notEmpty().trim(),
    body('slug').notEmpty().trim(),
    body('content').notEmpty()
  ],
  validate,
  async (req, res) => {
    try {
      const { title, slug, content, excerpt, category_id, image_url, published } = req.body;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title,
          slug,
          content,
          excerpt,
          category_id,
          image_url,
          published: published || false
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Blog post created',
        data
      });
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create blog post',
        data: null
      });
    }
  }
);

// Update blog post (admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, slug, content, excerpt, category_id, image_url, published } = req.body;

      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title,
          slug,
          content,
          excerpt,
          category_id,
          image_url,
          published,
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
        message: 'Blog post updated',
        data
      });
    } catch (error) {
      console.error('Update blog post error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update blog post',
        data: null
      });
    }
  }
);

// Delete blog post (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Blog post deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete blog post',
      data: null
    });
  }
});

// === BLOG CATEGORIES ===

// Get all categories (public)
router.get('/categories/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Categories retrieved',
      data: data || []
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve categories',
      data: null
    });
  }
});

// Create category (admin only)
router.post('/categories',
  authenticateToken,
  isAdmin,
  [
    body('name').notEmpty().trim(),
    body('slug').notEmpty().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { name, slug } = req.body;

      const { data, error } = await supabase
        .from('blog_categories')
        .insert([{ name, slug }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        status: 'success',
        message: 'Category created',
        data
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create category',
        data: null
      });
    }
  }
);

// Update category (admin only)
router.put('/categories/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;

      const { data, error } = await supabase
        .from('blog_categories')
        .update({ name, slug, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.json({
        status: 'success',
        message: 'Category updated',
        data
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update category',
        data: null
      });
    }
  }
);

// Delete category (admin only)
router.delete('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      message: 'Category deleted',
      data: null
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete category',
      data: null
    });
  }
});

export default router;