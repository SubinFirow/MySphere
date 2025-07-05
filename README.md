# MySphere Monorepo

A modern full-stack monorepo application with Express.js backend and Next.js frontend.

## 🚀 Tech Stack

### Backend (`packages/backend`)
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Rate Limiting** - API protection

### Frontend (`packages/frontend`)
- **Next.js 15** - React framework with SSR
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **ESLint** - Code linting
- **Tailwind CSS** - Utility-first CSS

## 📁 Project Structure

```
MySphere/
├── packages/
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   │   ├── config/   # Database and app configuration
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── models/   # Mongoose models
│   │   │   ├── routes/   # API routes
│   │   │   ├── middleware/   # Custom middleware
│   │   │   ├── utils/    # Utility functions
│   │   │   └── server.js # Main server file
│   │   └── package.json
│   └── frontend/         # Next.js application
│       ├── src/
│       │   ├── app/      # App router pages
│       │   ├── components/   # React components
│       │   ├── lib/      # Utilities and API client
│       │   └── theme/    # MUI theme configuration
│       └── package.json
├── package.json          # Root package.json with workspaces
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MySphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Backend:
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```
   Edit `packages/backend/.env` with your MongoDB URI and other settings.
   
   Frontend:
   ```bash
   cp packages/frontend/.env.local.example packages/frontend/.env.local
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev
```

**Start individual services:**
```bash
# Backend only (runs on http://localhost:5000)
npm run dev:backend

# Frontend only (runs on http://localhost:3000)
npm run dev:frontend
```

### Production

**Build all packages:**
```bash
npm run build
```

**Start production servers:**
```bash
npm run start
```

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both packages for production
- `npm run start` - Start both packages in production mode
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all node_modules and build artifacts

### Backend Scripts
- `npm run dev:backend` - Start backend in development mode with nodemon
- `npm run build:backend` - Build backend for production
- `npm run start:backend` - Start backend in production mode
- `npm run test --workspace=packages/backend` - Run backend tests
- `npm run lint --workspace=packages/backend` - Lint backend code

### Frontend Scripts
- `npm run dev:frontend` - Start frontend in development mode
- `npm run build:frontend` - Build frontend for production
- `npm run start:frontend` - Start frontend in production mode
- `npm run test --workspace=packages/frontend` - Run frontend tests
- `npm run lint --workspace=packages/frontend` - Lint frontend code

## 🔧 Configuration

### Backend Configuration
The backend uses environment variables for configuration. Copy `.env.example` to `.env` and update:

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

### Frontend Configuration
The frontend uses Next.js environment variables. Copy `.env.local.example` to `.env.local` and update:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

## 🎨 Features

- **Monorepo Structure** - Organized codebase with npm workspaces
- **Type Safety** - Full TypeScript support
- **Modern UI** - Material-UI components with dark/light theme
- **API Integration** - Axios-based API client with interceptors
- **Security** - Helmet, CORS, rate limiting, and JWT authentication
- **Development Experience** - Hot reload, ESLint, and concurrent development
- **Production Ready** - Optimized builds and deployment scripts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
