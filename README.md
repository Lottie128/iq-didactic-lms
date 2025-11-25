# IQ Didactic LMS

🎓 Modern Learning Management System with AI Teacher Integration

## Features
- ✅ Authentication (JWT)
- 🔄 Course Management (Coming Soon)
- ✍️ Quiz System (Coming Soon)
- 🤖 AI Teacher with Gemini (Coming Soon)
- 🌍 Multi-language (English/French)

## Tech Stack
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **Frontend**: React, TypeScript, Vite
- **AI**: Google Gemini API

## Quick Start

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your values
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Edit with your values
npm run dev
```

## Development Workflow

### Branches
- `main` - Production ready code
- `feat/auth-setup` - ✅ Authentication & DB
- `feat/courses` - Course management
- `feat/quizzes` - Quiz system
- `feat/ai-teacher` - AI integration

### Current Branch: feat/auth-setup
This branch includes:
- User registration & login
- JWT authentication
- Database models & migrations
- Protected routes
- Auth context in React

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/iq_didactic
JWT_SECRET=your-secret-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

## API Documentation
Once running, visit: http://localhost:8000/docs

## License
MIT