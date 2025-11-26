# 🔧 Upload Troubleshooting Guide

## ✅ FIXED: Token Issue

**Problem:** "Upload failed. Please try again." with no error  
**Cause:** Code was looking for `token` but it's stored as `access_token`  
**Fixed:** ✅ Updated ProfilePictureUpload.tsx to use correct key

---

## 🐛 Common Issues & Solutions

### 1. "Upload failed. Please try again."

#### Check Browser Console:
```
F12 → Console Tab
```

You'll now see detailed logs:
- File selected: name, type, size
- Token found: Yes/No
- API URL being called
- Full error details

#### Possible Causes:

**A. Backend not running:**
```bash
# Check if backend is running:
curl http://localhost:8000/health

# Should return: {"status":"healthy"}

# If not, start it:
cd backend
uvicorn app.main:app --reload
```

**B. CORS issue:**
```
Error in console: "CORS policy blocked"

Fix:
1. Check backend/.env has:
   CORS_ORIGINS=["http://localhost:5173"]

2. Restart backend
```

**C. Wrong API URL:**
```javascript
// Check frontend/.env:
VITE_API_BASE_URL=http://localhost:8000

// No trailing slash!
```

**D. Token expired:**
```javascript
// In browser console:
localStorage.getItem('access_token')

// If null, login again
// If exists but expired, login again
```

**E. Uploads directory missing:**
```bash
# Backend needs this:
cd backend
mkdir -p uploads/profile_pictures

# Check backend logs for:
# "[Errno 2] No such file or directory: 'uploads'"
```

---

### 2. "Not authenticated. Please login again."

**Cause:** No token in localStorage

**Fix:**
```javascript
// Check in browser console:
localStorage.getItem('access_token')

// If null:
1. Logout
2. Login again
3. Try upload
```

---

### 3. "File too large. Maximum size is 5MB"

**Cause:** Image > 5MB

**Fix:**
- Compress image before upload
- Use smaller image
- Or increase limit in backend/app/core/config.py:
```python
MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
```

---

### 4. "Please upload a valid image (JPG, PNG, WEBP, GIF)"

**Cause:** Wrong file type

**Allowed:**
- .jpg, .jpeg
- .png
- .webp
- .gif

**Not Allowed:**
- .bmp, .tiff, .svg, .pdf, etc.

---

### 5. "No response from server. Check if backend is running."

**Steps:**

1. **Check backend is running:**
```bash
ps aux | grep uvicorn
# Should show uvicorn process
```

2. **Check backend port:**
```bash
lsof -i :8000
# Should show uvicorn listening on port 8000
```

3. **Test backend directly:**
```bash
curl http://localhost:8000/
# Should return JSON with "status": "online"
```

4. **Check firewall:**
```bash
# Make sure port 8000 is not blocked
```

---

## 🔍 Debug Mode

### Frontend (Browser Console):

After selecting a file, you'll see:
```
File selected: profile.jpg image/jpeg 524288
Token found: Yes
API URL: http://localhost:8000/api/upload/profile-picture
```

If upload fails:
```
Upload error: [Error object]
Error response: [Response details]
Server error: 400 {"detail": "File type not allowed"}
```

### Backend (Terminal):

Watch for:
```
INFO:     127.0.0.1:xxxxx - "POST /api/upload/profile-picture HTTP/1.1" 200 OK
```

Or errors:
```
ERROR:    File validation failed
ERROR:    [Errno 2] No such file or directory: 'uploads/profile_pictures'
```

---

## ✅ Test Checklist

### Backend:
- [ ] Backend running on port 8000
- [ ] `/uploads/` directory exists
- [ ] `/uploads/profile_pictures/` exists
- [ ] CORS configured correctly
- [ ] `.env` has UPLOAD_STORAGE_TYPE=local
- [ ] Can access http://localhost:8000/docs
- [ ] Upload endpoint visible in Swagger

### Frontend:
- [ ] VITE_API_BASE_URL in `.env`
- [ ] Token in localStorage (access_token)
- [ ] File < 5MB
- [ ] File is JPG/PNG/WEBP/GIF
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows 200 OK response

---

## 🧪 Manual API Test

### Test with cURL:

```bash
# 1. Login first:
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"YourPassword"}'

# Copy the access_token from response

# 2. Test upload:
curl -X POST http://localhost:8000/api/upload/profile-picture \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg"

# Should return:
# {"url":"/uploads/profile_pictures/...","message":"Profile picture uploaded successfully"}
```

### Test with Swagger UI:

1. Go to http://localhost:8000/docs
2. Click "Authorize" button (top-right)
3. Enter: `Bearer YOUR_TOKEN`
4. Click "Authorize"
5. Find `POST /api/upload/profile-picture`
6. Click "Try it out"
7. Upload file
8. Check response

---

## 📊 Expected Flow

### Success:
```
1. Select file
   ✓ File selected: image.jpg image/jpeg 245760
   ✓ Token found: Yes
   ✓ API URL: http://localhost:8000/api/upload/profile-picture

2. Upload
   ✓ Request sent with Bearer token
   ✓ Server validates file
   ✓ Server saves to /uploads/profile_pictures/{user_id}/
   ✓ Server updates database
   ✓ Server returns URL

3. Success
   ✓ Upload successful: {"url":"/uploads/..."}
   ✓ Avatar updates
   ✓ Profile completion increases
```

### Failure:
```
1. Select file
   ✗ Token found: No
   → Shows: "Not authenticated. Please login again."

OR

2. Upload
   ✗ No response from server
   → Shows: "No response from server. Check if backend is running."
   → Check: Backend is running?

OR

3. Upload
   ✗ Server error: 400 {"detail":"File type not allowed"}
   → Shows: "File type not allowed"
   → Fix: Use JPG/PNG/WEBP/GIF
```

---

## 🚀 Quick Fix Steps

**If upload fails, do this in order:**

```bash
# 1. Check backend
cd backend
uvicorn app.main:app --reload

# 2. Check uploads directory
mkdir -p uploads/profile_pictures

# 3. Check .env
cat .env | grep UPLOAD
# Should show:
# UPLOAD_STORAGE_TYPE=local
# UPLOAD_DIR=uploads

# 4. Pull latest code
git pull origin feat/enhanced-ui

# 5. Restart frontend
cd frontend
npm run dev

# 6. Login again
# Go to http://localhost:5173/login
# Login

# 7. Try upload
# Open browser console (F12)
# Try uploading
# Check console logs
```

---

## 💡 Pro Tips

1. **Always check browser console first** - F12 → Console
2. **Check backend terminal** - Look for errors
3. **Test backend with Swagger** - http://localhost:8000/docs
4. **Clear localStorage if issues** - `localStorage.clear()` then login
5. **Restart both servers** - Sometimes helps!

---

## ✅ After This Fix

**What changed:**
- ✅ Now uses `access_token` (correct key)
- ✅ Shows "Not authenticated" if no token
- ✅ Detailed console logs for debugging
- ✅ Better error messages
- ✅ Shows "Check browser console for details"

**Pull latest code:**
```bash
git pull origin feat/enhanced-ui
npm run dev
```

**Try upload again - should work now!** 🎉
