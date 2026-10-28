# HireHub - Job Portal and Recruitment Management System

A comprehensive full-stack web application connecting job seekers, recruiters, and administrators. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Demo Accounts](#demo-accounts)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Known Limitations](#known-limitations)
- [Project Structure](#project-structure)

## 🎯 Project Overview

HireHub is a modern job portal designed to streamline the recruitment process. It provides three user roles:

- **Candidates**: Browse jobs, create profiles, upload resumes, apply for positions, and track applications
- **Recruiters**: Post job listings, manage vacancies, review candidates, and update application statuses
- **Administrators**: Manage users, moderate job postings, and view platform analytics

## ✨ Features

### For Candidates
- User registration and authentication
- Profile management with skills, education, and experience
- Resume upload and management
- Job search with filters (location, type, experience level)
- Apply for jobs with cover letters
- Track application status in real-time
- Save/bookmark jobs for later
- In-app notifications

### For Recruiters
- Company profile management
- Create, edit, and delete job listings
- View and manage job applications
- Update application status (Applied → Under Review → Shortlisted → Interview → Selected/Rejected)
- Add internal notes on candidates
- Recruitment analytics and statistics
- Dashboard with performance metrics

### For Administrators
- Protected admin dashboard
- User management (activate/deactivate accounts)
- Job moderation (approve/reject listings)
- Platform-wide analytics
- Audit log for security tracking
- View aggregate statistics

## 🛠 Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

## 📦 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or MongoDB Atlas)
- Git

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hirehub
```

2. Install root dependencies:
```bash
npm install
```

3. Install server dependencies:
```bash
cd server
npm install
cd ..
```

4. Install client dependencies:
```bash
cd client
npm install
cd ..
```

## ⚙️ Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hirehub
# For production with MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirehub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Setup

### Local MongoDB

1. Install MongoDB locally following the [official documentation](https://www.mongodb.com/docs/manual/installation/)

2. Start MongoDB service:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

3. The connection string in `.env` should be:
```
MONGODB_URI=mongodb://localhost:27017/hirehub
```

### MongoDB Atlas (Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster

3. Get your connection string and update `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirehub?retryWrites=true&w=majority
```

### Seed Database

Run the seed script to populate the database with demo data:

```bash
cd server
npm run seed
```

This will create:
- 1 admin account
- 3 candidate accounts
- 2 recruiter accounts
- 2 company profiles
- 5 job listings
- 4 sample applications

## 🏃 Running the Application

### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API Health Check: http://localhost:5000/health

### Production Build

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start the backend server:
```bash
cd server
npm start
```

## 👤 Demo Accounts

After running the seed script, use these accounts to test the application:

### Administrator
- Email: `admin@hirehub.com`
- Password: `Admin123!`

### Candidates
- Email: `john.doe@example.com`
- Password: `Candidate123!`
- Email: `jane.smith@example.com`
- Password: `Candidate123!`
- Email: `mike.johnson@example.com`
- Password: `Candidate123!`

### Recruiters
- Email: `sarah.williams@techcorp.com`
- Password: `Recruiter123!`
- Email: `david.brown@innovate.io`
- Password: `Recruiter123!`

**⚠️ Security Warning**: These demo accounts are for development only. Change all passwords and remove the seed script before deploying to production.

## 📚 API Documentation

### Authentication

#### POST /api/v1/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

#### POST /api/v1/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/v1/auth/logout
Logout the current user (requires authentication).

#### GET /api/v1/auth/me
Get current user information (requires authentication).

### Jobs

#### GET /api/v1/jobs
Get all jobs with optional filters.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search query
- `location` - Filter by location
- `employmentType` - Filter by employment type
- `experienceLevel` - Filter by experience level
- `skills` - Filter by skills (comma-separated)
- `sort` - Sort field (prefix with - for descending)

#### GET /api/v1/jobs/:id
Get a single job by ID.

#### POST /api/v1/jobs
Create a new job (recruiter only).

#### PATCH /api/v1/jobs/:id
Update a job (job owner only).

#### DELETE /api/v1/jobs/:id
Delete a job (job owner only).

### Applications

#### POST /api/v1/jobs/:id/applications
Apply for a job (candidate only).

#### GET /api/v1/applications/me
Get current user's applications (candidate only).

#### GET /api/v1/jobs/:id/applications
Get applications for a job (recruiter only).

#### PATCH /api/v1/applications/:id/status
Update application status (recruiter only).

#### POST /api/v1/applications/:id/withdraw
Withdraw an application (candidate only).

### Dashboards

#### GET /api/v1/dashboard/candidate
Get candidate dashboard statistics (candidate only).

#### GET /api/v1/dashboard/recruiter
Get recruiter dashboard statistics (recruiter only).

#### GET /api/v1/dashboard/admin
Get admin dashboard statistics (admin only).

### Users

#### PATCH /api/v1/users/me
Update user profile.

#### GET /api/v1/candidates/:id
Get candidate profile.

#### POST /api/v1/candidates/resume
Upload resume (candidate only).

#### GET /api/v1/candidates/:id/resume
Download resume (authorized only).

### Company

#### POST /api/v1/company
Create company profile (recruiter only).

#### GET /api/v1/company
Get company profile (recruiter only).

### Notifications

#### GET /api/v1/notifications
Get user notifications.

#### PATCH /api/v1/notifications/:id/read
Mark notification as read.

#### PATCH /api/v1/notifications/read-all
Mark all notifications as read.

### Admin

#### GET /api/v1/admin/users
Get all users (admin only).

#### PATCH /api/v1/admin/users/:id/status
Update user status (admin only).

#### GET /api/v1/admin/jobs
Get all jobs for moderation (admin only).

#### PATCH /api/v1/admin/jobs/:id/moderation
Moderate a job (admin only).

#### GET /api/v1/admin/audit-logs
Get audit logs (admin only).

#### GET /api/v1/admin/analytics
Get platform analytics (admin only).

## 🧪 Testing

### Backend Tests

Run backend tests:
```bash
cd server
npm test
```

Run tests in watch mode:
```bash
cd server
npm run test:watch
```

### Frontend Tests

Frontend tests are currently a work in progress.

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Build the frontend: `cd client && npm run build`
3. Deploy the server to a platform like:
   - Railway
   - Render
   - Heroku
   - AWS EC2
   - DigitalOcean

### Frontend Deployment

The frontend is built into the `client/dist` directory and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### MongoDB

For production, use MongoDB Atlas with:
- IP whitelisting
- Authentication enabled
- SSL/TLS connections
- Regular backups

## 🔒 Security Notes

- **Passwords**: Hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Stored in HTTP-only cookies, not localStorage
- **CORS**: Configured with explicit allowlist from environment variables
- **Rate Limiting**: Applied to sensitive endpoints
- **File Uploads**: Validated for MIME type and size
- **SQL Injection**: Not applicable (MongoDB), but queries use parameterized patterns
- **XSS Protection**: Helmet middleware sets security headers
- **CSRF**: Recommended to implement CSRF tokens for production (currently not implemented)
- **Input Validation**: Both frontend and backend validation using express-validator

### Production Security Checklist

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Enable HTTPS
- [ ] Implement CSRF protection
- [ ] Use MongoDB Atlas with authentication
- [ ] Set up IP whitelisting for database
- [ ] Enable security monitoring
- [ ] Remove or secure seed script
- [ ] Change all demo account passwords
- [ ] Set up regular database backups
- [ ] Configure proper CORS allowlist
- [ ] Enable logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)

## ⚠️ Known Limitations

1. **CSRF Protection**: Not yet implemented. Recommend adding CSRF tokens for production.
2. **Email Verification**: Users can register without email verification.
3. **Password Reset**: No password reset functionality implemented.
4. **File Storage**: Uses local filesystem. For production, use cloud storage (AWS S3, Cloudinary).
5. **Real-time Notifications**: No WebSocket implementation. Notifications are fetched on page load.
6. **Search**: Basic text search. Could be enhanced with Elasticsearch or Algolia.
7. **Analytics**: Basic dashboard statistics. Could be enhanced with more detailed metrics.
8. **Testing**: Limited test coverage. Unit and integration tests need expansion.

## 📁 Project Structure

```
hirehub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   │   ├── public/     # Public pages
│   │   │   ├── candidate/  # Candidate pages
│   │   │   ├── recruiter/  # Recruiter pages
│   │   │   └── admin/     # Admin pages
│   │   ├── services/      # API service layer
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Backend Express application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── validators/    # Input validators
│   │   ├── utils/         # Utility functions
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── tests/             # Backend tests
│   ├── scripts/           # Utility scripts
│   │   └── seed.js        # Database seed script
│   ├── uploads/           # File upload directory
│   └── package.json
├── docs/                  # Documentation
│   ├── PROJECT_REPORT.md
│   ├── 12_WEEK_DEVELOPMENT_PLAN.md
│   └── FINAL_PRESENTATION.md
├── .env.example           # Environment variables template
├── .gitignore
├── package.json           # Root package.json
└── README.md             # This file
```

## 📄 License

This project is created for educational and portfolio purposes.

## 👥 Contributing

This is a portfolio project. Contributions are not currently being accepted.

## 📞 Support

For questions or issues, please contact the project maintainer.

---

**Built with ❤️ for a 12-week full-stack development internship**
