import path from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';

import app from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Upload API', () => {
  let authToken;

  beforeAll(async () => {
    // Login to get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'changeme123'
      });

    authToken = response.body.data.token;
  });

  describe('POST /api/upload', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(401);
    });

    it('should fail without file', async () => {
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No file uploaded');
    });

    // Note: Actual file upload tests would require a real image file
    // and proper Supabase configuration
  });
});