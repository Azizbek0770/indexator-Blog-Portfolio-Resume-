# 🚀 Full-Stack Portfolio System

A modern, animated, and fully responsive portfolio system with a secure admin dashboard. Built with React, Express, and Supabase.

## ✨ Features

### Public Portfolio Website
- 🎨 Beautiful, modern design with smooth animations
- 🌓 Dark/Light mode support
- 📱 Fully responsive across all devices
- ⚡ Fast and optimized performance
- 🎯 9 comprehensive sections:
  - Hero with animated background
  - About Me with statistics
  - Resume with timeline
  - Portfolio/Projects showcase
  - Services offered
  - Client testimonials
  - Blog with categories
  - Contact form

### Admin Dashboard (`/curbadmin0270`)
- 🔐 Secure authentication
- 📊 Analytics dashboard
- ✏️ Full CRUD operations for all content
- 🖼️ Image upload to Supabase Storage
- 📝 Rich text editor for blog posts
- 🔄 Real-time updates via WebSocket
- 🎨 Customizable theme and colors
- 📱 Responsive admin interface

### Backend API
- 🛡️ RESTful API with Express
- 🗄️ Supabase PostgreSQL database
- 🔒 JWT authentication
- 📦 File uploads to Supabase Storage
- 🔌 WebSocket server for real-time updates
- ✅ Input validation
- 🧪 Comprehensive tests

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - Database & Storage
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works!)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Azizbek0770/indexator-Blog-Portfolio-Resume
cd indexator-Blog-Portfolio-Resume
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `server/database/schema.sql`
3. Go to **Storage** and create a bucket named `blog_media`
4. Set the bucket to **Public** for image access
5. Copy your project URL and keys

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Configure Backend Environment
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

JWT_SECRET=your_super_secret_jwt_key_change_this

STORAGE_BUCKET=blog_media

ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=changeme123
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start Backend Server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 7. Install Admin Dashboard Dependencies
```bash
cd ../admin_dashboard
npm install
```

### 8. Configure Admin Dashboard
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_APP_NAME=Portfolio Admin
VITE_ADMIN_ROUTE=/curbadmin0270
```

### 9. Start Admin Dashboard
```bash
npm run dev
```

Dashboard runs at `http://localhost:5173`

### 10. Install Public Site Dependencies
```bash
cd ../public_site
npm install
```

### 11. Configure Public Site
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_SITE_NAME=My Portfolio
```

### 12. Start Public Site
```bash
npm run dev
```

Public site runs at `http://localhost:5174`

## 🎯 Usage

### Access Points

- **Public Portfolio**: `http://localhost:5174`
- **Admin Dashboard**: `http://localhost:5173/curbadmin0270`
- **API**: `http://localhost:5000/api`

### Default Admin Credentials
```
Email: admin@portfolio.com
Password: changeme123
```

**⚠️ IMPORTANT: Change these credentials immediately after first login!**

## 📁 Project Structure
```
portfolio-system/
├── server/                 # Backend API
│   ├── database/          # Database config & schema
│   ├── middleware/        # Auth & validation
│   ├── routes/           # API endpoints
│   ├── websocket/        # WebSocket server
│   ├── tests/            # Backend tests
│   └── server.js         # Main server file
├── admin_dashboard/       # Admin dashboard (React)
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Admin pages
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   └── vite.config.js
├── public_site/          # Public portfolio (React)
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── sections/     # Homepage sections
│   │   ├── pages/        # Pages
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   └── vite.config.js
└── README.md
```

## 🧪 Running Tests
```bash
cd server
npm test
```

## 🏗️ Building for Production

### Backend
```bash
cd server
npm start
```

### Admin Dashboard
```bash
cd admin_dashboard
npm run build
npm run preview
```

### Public Site
```bash
cd public_site
npm run build
npm run preview
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting ready

## 🎨 Customization

### Change Theme Colors

Edit admin settings or modify `tailwind.config.js` in both dashboard and public site.

### Add New Sections

1. Create component in `public_site/src/sections/`
2. Add to `Home.jsx`
3. Create admin page in `admin_dashboard/src/pages/`
4. Add route in admin `App.jsx`
5. Create API endpoints in `server/routes/`

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/change-password` - Change password

### Content Endpoints (Public)
- `GET /api/hero` - Get hero section
- `GET /api/about` - Get about section
- `GET /api/skills` - Get all skills
- `GET /api/experience` - Get experience
- `GET /api/education` - Get education
- `GET /api/certificates` - Get certificates
- `GET /api/projects` - Get projects
- `GET /api/services` - Get services
- `GET /api/testimonials` - Get testimonials
- `GET /api/blog` - Get blog posts
- `GET /api/blog/slug/:slug` - Get single post
- `POST /api/messages` - Submit contact message

### Admin Endpoints (Protected)
- All content endpoints support POST, PUT, DELETE
- `POST /api/upload` - Upload images

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check if schema is properly created
- Ensure service role key is used in backend

### Image Upload Issues
- Verify storage bucket exists: `blog_media`
- Ensure bucket is set to public
- Check STORAGE_BUCKET in `.env`

### CORS Issues
- Update CORS_ORIGINS in server `.env`
- Include both frontend URLs

### Port Conflicts
- Change PORT in respective `.env` files
- Update API_URL references accordingly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💬 Support

For issues and questions:
- Check the documentation in `SETUP.md` and `DEPLOYMENT.md`
- Open an issue on GitHub
- Contact: your-email@example.com

## 🎉 Acknowledgments

- React & Vite teams
- Supabase team
- Tailwind CSS
- Framer Motion
- All open-source contributors

---

**Built with ❤️ by Azizbek for the developer community**
