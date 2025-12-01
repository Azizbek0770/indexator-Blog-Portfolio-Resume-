# 📚 Complete Setup Guide

This guide will walk you through setting up the entire portfolio system step-by-step.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Supabase Setup](#supabase-setup)
3. [Backend Setup](#backend-setup)
4. [Admin Dashboard Setup](#admin-dashboard-setup)
5. [Public Site Setup](#public-site-setup)
6. [Verification](#verification)
7. [Common Issues](#common-issues)

---

## 1️⃣ System Requirements

### Required Software

- **Node.js**: Version 18.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm**: Version 9.0.0 or higher (comes with Node.js)
  - Verify: `npm --version`

- **Git**: Latest version
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Operating System

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Debian, etc.)

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 2️⃣ Supabase Setup

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or Email
4. Verify your email address

### Step 2: Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Name**: `portfolio-system` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free (sufficient for development)
3. Click "Create new project"
4. Wait 2-3 minutes for project initialization

### Step 3: Get API Keys

1. Go to **Project Settings** (gear icon)
2. Navigate to **API** section
3. Copy and save these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API Key** (anon public): `eyJhbGc...`
   - **Service Role Key** (secret): `eyJhbGc...`

**⚠️ IMPORTANT**: Never commit Service Role Key to version control!

### Step 4: Create Database Schema

1. Go to **SQL Editor** in left sidebar
2. Click "New Query"
3. Open `server/database/schema.sql` from the project
4. Copy entire contents
5. Paste into Supabase SQL Editor
6. Click "Run" or press `Ctrl/Cmd + Enter`
7. Verify success message: "Success. No rows returned"

### Step 5: Create Storage Bucket

1. Go to **Storage** in left sidebar
2. Click "Create bucket"
3. Enter bucket name: `blog_media`
4. Set **Public bucket**: Toggle ON (important!)
5. Click "Create bucket"
6. Click on the bucket name
7. Go to **Policies** tab
8. Add this policy for public read access:
```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'blog_media' );
```

### Step 6: Verify Database Tables

1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - users
   - hero
   - about
   - skills
   - experience
   - education
   - certificates
   - projects
   - services
   - testimonials
   - blog_categories
   - blog_posts
   - messages
   - settings

If any tables are missing, re-run the schema.sql file.

---

## 3️⃣ Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

**Expected output**: Installation of ~30-40 packages (2-5 minutes)

### Step 3: Create Environment File
```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

### Step 4: Configure Environment Variables

Open `.env` file in your text editor and update:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (REPLACE WITH YOUR VALUES)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (GENERATE A STRONG RANDOM STRING)
JWT_SECRET=your_very_long_random_secret_key_here_min_32_chars

# Storage
STORAGE_BUCKET=blog_media

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=SecurePassword123!
```

**💡 Tips:**
- Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Use a strong admin password
- Keep the .env file secure

### Step 5: Seed Database with Sample Data
```bash
npm run seed
```

**Expected output:**
```
🌱 Starting database seeding...
✅ Admin user created
✅ Hero section seeded
✅ About section seeded
✅ Skills seeded
✅ Experience seeded
✅ Education seeded
✅ Certificates seeded
✅ Projects seeded
✅ Services seeded
✅ Testimonials seeded
✅ Blog categories seeded
✅ Blog posts seeded
✅ Sample messages seeded
🎉 Database seeding completed successfully!
```

### Step 6: Start Backend Server
```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📡 Environment: development
🔗 API: http://localhost:5000
💾 Database: Supabase
🔌 WebSocket: Enabled
```

### Step 7: Test Backend API

Open browser or use curl:
```bash
# Test health check
curl http://localhost:5000/health

# Expected response:
# {"status":"success","message":"Server is running","timestamp":"2024-..."}

# Test hero endpoint
curl http://localhost:5000/api/hero

# Should return hero data
```

**Keep this terminal window open** - server must run continuously.

---

## 4️⃣ Admin Dashboard Setup

### Step 1: Open New Terminal

Keep backend server running, open a new terminal window.

### Step 2: Navigate to Admin Directory
```bash
cd admin_dashboard
```

### Step 3: Install Dependencies
```bash
npm install
```

**Expected output**: Installation of ~200-250 packages (3-7 minutes)

### Step 4: Create Environment File
```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

### Step 5: Configure Environment

Open `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# App Configuration
VITE_APP_NAME=Portfolio Admin
VITE_ADMIN_ROUTE=/curbadmin0270
```

**💡 Note**: You can change `/curbadmin0270` to any custom route for security.

### Step 6: Start Admin Dashboard
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 7: Access Admin Dashboard

1. Open browser: `http://localhost:5173/curbadmin0270/login`
2. Login with credentials from server `.env`:
   - Email: `admin@portfolio.com`
   - Password: `SecurePassword123!` (or what you set)
3. You should see the dashboard

**Keep this terminal window open** - dashboard must run continuously.

---

## 5️⃣ Public Site Setup

### Step 1: Open Another New Terminal

Keep backend and admin running, open third terminal.

### Step 2: Navigate to Public Site Directory
```bash
cd public_site
```

### Step 3: Install Dependencies
```bash
npm install
```

**Expected output**: Installation of ~200-250 packages (3-7 minutes)

### Step 4: Create Environment File
```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

### Step 5: Configure Environment

Open `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# Site Configuration
VITE_SITE_NAME=My Portfolio
```

### Step 6: Start Public Site
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 7: Access Public Site

Open browser: `http://localhost:5174`

You should see the portfolio homepage with:
- Hero section
- About section
- Resume/Skills
- Portfolio projects
- Services
- Testimonials
- Blog
- Contact form

---

## 6️⃣ Verification

### ✅ Backend Verification

1. **Health Check**: `http://localhost:5000/health`
   - Should return: `{"status":"success",...}`

2. **API Endpoints**: Test these in browser:
   - `http://localhost:5000/api/hero`
   - `http://localhost:5000/api/skills`
   - `http://localhost:5000/api/projects`

3. **Database Connection**: 
   - Go to Supabase Table Editor
   - Check that tables have data

### ✅ Admin Dashboard Verification

1. **Login Page**: `http://localhost:5173/curbadmin0270/login`
2. **Can login successfully**
3. **Dashboard loads** with analytics widgets
4. **All menu items work**:
   - Hero, About, Skills, Experience, etc.
5. **Can edit content** and save changes
6. **Images upload** successfully

### ✅ Public Site Verification

1. **Homepage loads**: `http://localhost:5174`
2. **All sections visible**:
   - Hero with animated background
   - About with statistics
   - Resume with skills and timeline
   - Portfolio with project cards
   - Services grid
   - Testimonials carousel
   - Blog posts
   - Contact form
3. **Dark mode toggle works**
4. **Navigation smooth scrolls**
5. **Contact form submits**
6. **Blog post pages load**

### ✅ Real-time Updates Verification

1. Open public site: `http://localhost:5174`
2. Open admin in another tab: `http://localhost:5173/curbadmin0270`
3. Edit hero section in admin
4. Changes should appear on public site (may need refresh)

---

## 7️⃣ Common Issues

### Issue: "Cannot find module"

**Cause**: Dependencies not installed

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Port already in use"

**Cause**: Port is occupied by another process

**Solution**:

**Option 1 - Change Port**:
```env
# In .env file
PORT=5001  # Or any available port
```

**Option 2 - Kill Process**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Database connection failed"

**Cause**: Wrong Supabase credentials

**Solution**:
1. Verify `SUPABASE_URL` is correct
2. Check `SUPABASE_SERVICE_KEY` (not anon key!)
3. Ensure no extra spaces in `.env`
4. Restart backend server

### Issue: "401 Unauthorized" in Admin

**Cause**: Token expired or invalid

**Solution**:
1. Logout and login again
2. Clear browser localStorage
3. Check `JWT_SECRET` is same in backend `.env`

### Issue: Images not uploading

**Cause**: Storage bucket misconfigured

**Solution**:
1. Verify bucket name is `blog_media`
2. Check bucket is set to **Public**
3. Verify storage policies in Supabase
4. Check STORAGE_BUCKET in server `.env`

### Issue: "CORS error"

**Cause**: Frontend URL not in CORS whitelist

**Solution**:
```env
# In server/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

Restart backend server.

### Issue: Styles not loading

**Cause**: Tailwind CSS not processing

**Solution**:
```bash
# In admin_dashboard or public_site
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### Issue: "Too many re-renders"

**Cause**: React state update loop

**Solution**:
- Clear browser cache
- Delete `.vite` cache folder
- Restart dev server

---

## 🎯 Next Steps

After successful setup:

1. ✅ **Change Default Credentials**
   - Login to admin
   - Go to Settings
   - Change admin password

2. ✅ **Customize Content**
   - Update hero section with your info
   - Add your skills and experience
   - Upload your projects
   - Write blog posts

3. ✅ **Configure Settings**
   - Set theme colors
   - Add social links
   - Update site title and description

4. ✅ **Test Everything**
   - Submit test contact form
   - Check all admin pages
   - Verify image uploads
   - Test on mobile devices

5. ✅ **Prepare for Deployment**
   - Read `DEPLOYMENT.md`
   - Choose hosting platform
   - Set up production environment

---

## 📞 Getting Help

If you encounter issues not covered here:

1. Check the main `README.md`
2. Review `DEPLOYMENT.md` for production issues
3. Check Supabase documentation
4. Open an issue on GitHub
5. Check console errors in browser (F12)

---

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Database Migrations

When you modify the schema:

1. Update `server/database/schema.sql`
2. Create migration SQL file
3. Run in Supabase SQL Editor
4. Update seed file if needed

### Backup

Regular backups recommended:

1. **Database**: Use Supabase dashboard export
2. **Images**: Download from storage bucket
3. **Code**: Commit to Git regularly

---

**✨ Setup Complete! You're ready to build your portfolio!**