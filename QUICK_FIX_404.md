# 🔴 URGENT FIX - 404 Error on Upload

## ❌ Error You're Seeing:
```
Request failed with status code 404
Server error: 404
```

## 🎯 The Problem:
The upload endpoint `/api/upload/profile-picture` is returning 404 (Not Found)

**This means:** Backend hasn't loaded the upload router properly

---

## ✅ QUICK FIX (Do This Now):

### Step 1: Stop Backend
```bash
# In your backend terminal:
Ctrl+C  (or Cmd+C on Mac)
```

### Step 2: Pull Latest Code
```bash
cd backend
git pull origin feat/enhanced-ui
```

### Step 3: Check Files Exist
```bash
# Make sure these files exist:
ls -la app/api/upload.py
ls -la app/services/upload_service.py

# Should see both files
```

### Step 4: Create Uploads Directory
```bash
# From backend/ directory:
mkdir -p uploads/profile_pictures
ls -la uploads/

# Should see profile_pictures folder
```

### Step 5: Check .env
```bash
cat .env | grep UPLOAD

# Should show:
# UPLOAD_STORAGE_TYPE=local
# UPLOAD_DIR=uploads

# If not, add them:
echo "UPLOAD_STORAGE_TYPE=local" >> .env
echo "UPLOAD_DIR=uploads" >> .env
echo "MAX_UPLOAD_SIZE=5242880" >> .env
```

### Step 6: Restart Backend
```bash
# Make sure you're in backend/ directory:
pwd
# Should show: /path/to/iq-didactic-lms/backend

# Start server:
uvicorn app.main:app --reload
```

### Step 7: Verify Endpoint Exists
```bash
# Open new terminal, test:
curl http://localhost:8000/docs

# Or visit in browser:
http://localhost:8000/docs

# Look for:
# - POST /api/upload/profile-picture
# - DELETE /api/upload/profile-picture

# Should see both endpoints in Swagger UI
```

### Step 8: Test Upload Endpoint
```bash
# Check if endpoint responds:
curl -X POST http://localhost:8000/api/upload/profile-picture

# Should return:
# {"detail":"Not authenticated"}
# (This is GOOD - means endpoint exists!)

# If you get:
# {"detail":"Not Found"}
# (This is BAD - endpoint not loaded)
```

---

## 🔍 If Still 404:

### Check Import Error:
```bash
# Look at backend terminal output when starting:
# Any errors like:
# ImportError: cannot import name 'upload'
# ModuleNotFoundError: No module named 'app.api.upload'
```

### Verify File Structure:
```bash
cd backend
tree app/api/

# Should show:
# app/api/
# ├── __init__.py
# ├── auth.py
# ├── deps.py
# └── upload.py  <-- This must exist!
```

### Check __init__.py:
```bash
cat app/api/__init__.py

# Should be empty or have imports
# If it has imports, make sure upload is included
```

---

## 🧪 Alternative: Test Without Frontend

### Get Your Token:
```bash
# 1. Login to get token:
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"YourPassword123"}'

# Copy the "access_token" from response
```

### Test Upload Directly:
```bash
# Replace YOUR_TOKEN with actual token:
curl -X POST http://localhost:8000/api/upload/profile-picture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/test-image.jpg"

# If this works, frontend will work too!
```

---

## 🚨 Common Mistakes:

### 1. Backend Not Restarted
**Problem:** Started backend before pulling new code  
**Fix:** Stop (Ctrl+C) and restart backend

### 2. Wrong Directory
**Problem:** Running uvicorn from wrong folder  
**Fix:** Must be in `backend/` directory:
```bash
cd backend
uvicorn app.main:app --reload
```

### 3. Import Error
**Problem:** upload.py has syntax errors  
**Fix:** Check backend terminal for error messages

### 4. Missing Files
**Problem:** upload.py or upload_service.py not pulled  
**Fix:** `git pull origin feat/enhanced-ui` again

### 5. Port Already in Use
**Problem:** Another process using port 8000  
**Fix:** 
```bash
# Kill process on port 8000:
lsof -ti:8000 | xargs kill -9

# Then restart backend
```

---

## ✅ Success Checklist:

- [ ] Backend shows: `Application startup complete`
- [ ] No import errors in terminal
- [ ] http://localhost:8000/docs shows upload endpoints
- [ ] `curl -X POST http://localhost:8000/api/upload/profile-picture` returns 401 (not 404)
- [ ] uploads/profile_pictures/ directory exists
- [ ] .env has UPLOAD_STORAGE_TYPE=local

---

## 🎯 Expected Output:

### When Backend Starts Successfully:
```
INFO:     Will watch for changes in these directories: [...]
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### When You Access Swagger:
http://localhost:8000/docs should show:
```
✅ Authentication
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me

✅ Upload  <-- Should see this!
  - POST /api/upload/profile-picture
  - DELETE /api/upload/profile-picture
```

---

## 🔄 If Nothing Works:

### Nuclear Option (Fresh Start):
```bash
# 1. Stop everything
Ctrl+C (both frontend and backend)

# 2. Clean pull
cd /path/to/iq-didactic-lms
git stash  # Save any local changes
git pull origin feat/enhanced-ui

# 3. Backend
cd backend
rm -rf uploads/  # Remove old uploads
mkdir -p uploads/profile_pictures
uvicorn app.main:app --reload

# 4. In new terminal, test:
curl http://localhost:8000/docs

# 5. Frontend
cd frontend
git pull origin feat/enhanced-ui
npm run dev

# 6. Try upload again
```

---

## 📞 Still Getting 404?

**Check backend terminal output and share:**
1. Any error messages when starting
2. Output of: `curl http://localhost:8000/docs`
3. Output of: `ls -la backend/app/api/`
4. Output of: `cat backend/app/main.py | grep upload`

**Most likely cause:** Backend not restarted after adding upload files

**Quick fix:** Stop backend (Ctrl+C) and start again!
