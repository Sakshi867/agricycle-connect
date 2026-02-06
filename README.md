# 🌾 Agricycle Connect

**Agricycle Connect** is a modern platform connecting farmers with buyers for agricultural waste management, powered by Grok AI image analysis.

## 🚀 Tech Stack

### Frontend
- React + Vite  
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- React Router v6
- Lucide React icons

### Backend
- Node.js + Express
- Grok AI API integration
- Multer for image uploads
- Sharp for image processing

## ✨ Features
- **Farmer Dashboard**: Create and manage waste listings
- **Buyer Dashboard**: Discover and purchase agricultural waste
- **AI-Powered Analysis**: Automatic waste type and quality detection using Grok AI
- **Mobile-First Design**: Optimized for agricultural workers on mobile devices
- **Real-time Messaging**: Communication between farmers and buyers
- **Smart Filtering**: Advanced search and filtering capabilities

## 🛠️ Getting Started

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:8081](http://localhost:8081)

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Configure your Grok API key in `backend/.env`

4. Start backend server:
```bash
npm run dev
```

5. Backend will run on [http://localhost:5000](http://localhost:5000)

### Testing the Setup
Run the backend test script to verify everything is working:
```bash
cd backend
node test.js
```
