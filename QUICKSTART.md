# 🚀 Quick Start Guide - IQ Didactic LMS

## 👨‍💻 Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Node.js 16+
- npm or yarn

## 🛠️ Backend Setup

### 1. Create PostgreSQL User & Database

```bash
# Create PostgreSQL user matching your system username
sudo -u postgres createuser -s $(whoami)

# Create database
createdb iq_didactic

# Verify database exists
psql -l | grep iq_didactic
```

### 2. Clone & Setup Backend

```bash
git clone https://github.com/Lottie128/iq-didactic-lms.git
cd iq-didactic-lms
git checkout feat/enhanced-ui

cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies (includes bcrypt 4.0.1 fix)
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql:///iq_didactic
JWT_SECRET=super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GEMINI_API_KEY=not-needed-for-auth
GEMINI_MODEL=gemini-1.5-pro
CORS_ORIGINS=["http://localhost:5173"]
EOF
```

### 4. Setup Database

**Option A: Fresh Install (Recommended)**
```bash
psql iq_didactic < migrations/create_fresh_db.sql
```

**Option B: Upgrade from feat/auth-setup**
```bash
psql iq_didactic < migrations/add_profile_fields.sql
```

### 5. Start Backend

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
# In a new terminal
cd frontend
npm install
```

### 2. Configure Environment

```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### 3. Start Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

## ✅ Test the Application

1. **Open browser:** http://localhost:5173
2. **You'll see:** Stunning animated preloader (2 seconds)
3. **Click Register** and create an account with:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: Test1234 (watch the strength meter!)
   - Phone: +1234567890 (optional)
   - Country: Select from dropdown (optional)
   - Occupation: Student (optional)

4. **Auto-login** to dashboard and see:
   - ✅ Your student ID (e.g., IQD-2025-12345)
   - ✅ Profile completion banner (if < 100%)
   - ✅ Stats cards
   - ✅ User information

## 🐛 Common Issues & Fixes

### Issue: "role 'jay' does not exist"
```bash
sudo -u postgres createuser -s $(whoami)
```

### Issue: "bcrypt version error"
```bash
pip install --upgrade bcrypt==4.0.1
```

### Issue: "CORS_ORIGINS error"
Make sure `.env` has:
```
CORS_ORIGINS=["http://localhost:5173"]
```
(Note the JSON array format!)

### Issue: "users table does not exist"
```bash
psql iq_didactic < migrations/create_fresh_db.sql
```

### Issue: "circular import" or "cannot import User"
Fixed in this branch! Just pull latest:
```bash
git pull origin feat/enhanced-ui
```

## 📚 API Documentation

Once running, visit: http://localhost:8000/docs

You'll see all available endpoints:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user

## 🎉 What's Working?

- ✅ Animated preloader
- ✅ User registration with all fields
- ✅ Auto-generated student IDs
- ✅ Password strength validation
- ✅ Phone number validation
- ✅ JWT authentication
- ✅ Profile completion tracking
- ✅ Language switching (EN/FR)
- ✅ Protected routes
- ✅ Modern glassmorphism UI
- ✅ Smooth animations throughout

## 🚀 Next Steps

Ready to add courses? Switch to the next branch:
```bash
git checkout feat/courses  # Coming soon!
```

## 👥 Need Help?

Check the detailed README:
- [ENHANCED_UI_README.md](./ENHANCED_UI_README.md)

Or check the database:
```bash
psql iq_didactic -c "SELECT student_id, email, full_name, profile_completion FROM users;"
```

Enjoy your stunning new LMS! 🎓✨
