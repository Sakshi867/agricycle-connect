# 🚀 Deployment Guide

## Prerequisites
- Node.js (v16 or higher)
- Git
- GitHub account

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd agricycle-connect
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
# Frontend will run on http://localhost:8081
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Grok API key

# Start backend development server
npm run dev
# Backend will run on http://localhost:5000
```

## Environment Variables

### Backend (.env file)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Grok AI API Configuration
GROK_API_KEY=your_grok_api_key_here
GROK_API_URL=https://api.x.ai/v1/chat/completions

# CORS Configuration
FRONTEND_URL=http://localhost:8081

# File Upload Configuration
MAX_FILE_SIZE=10485760
```

## Testing the Application

### 1. Verify Backend
```bash
# Test backend health endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/ai/health
```

### 2. Run Backend Tests
```bash
cd backend
node test.js
```

### 3. Test Complete Workflow
1. Open frontend at http://localhost:8081
2. Navigate to Farmer Dashboard
3. Create a new listing (upload image → AI analysis → publish)
4. Verify the listing appears in:
   - Farmer's listings page
   - Buyer dashboard
   - Buyer listings page

## GitHub Deployment Checklist

- [ ] All sensitive information (.env files) are in .gitignore
- [ ] README.md is updated with clear instructions
- [ ] Backend .gitignore is properly configured
- [ ] .env.example files are provided for both frontend and backend
- [ ] All dependencies are properly listed in package.json
- [ ] Code compiles without errors
- [ ] All tests pass

## Common Issues

### Port Conflicts
If you get "EADDRINUSE" errors:
```bash
# Kill processes using the ports
taskkill /f /im node.exe  # Windows
# or
pkill -f node  # Mac/Linux
```

### Environment Variables Not Loading
- Ensure .env file is in the backend directory
- Check that variable names match exactly
- Restart the server after .env changes

### CORS Issues
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check that both servers are running