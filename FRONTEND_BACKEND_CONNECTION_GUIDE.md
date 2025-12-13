# 🎯 NaijaScout Frontend-Backend Connection Guide

## ✅ All Issues Resolved

### Problem 1: Missing Auth Routes ❌ → ✅
**Before**: Frontend called `/api/login` but it wasn't mounted
**After**: Auth routes now mounted at `/api/auth` prefix

**Files Changed**:
- `backend/src/app.js` - Added: `app.use('/api/auth', authRoutes);`

### Problem 2: Incomplete CORS Configuration ❌ → ✅
**Before**: Basic CORS setup
**After**: Full CORS with credentials, all methods, and Authorization header

**Configuration**:
```javascript
cors({ 
  origin: 'http://localhost:5173',      // ✅ Frontend URL
  credentials: true,                     // ✅ Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // ✅ All methods
  allowedHeaders: ['Content-Type', 'Authorization']      // ✅ Auth header
})
```

### Problem 3: Mismatched API Paths ❌ → ✅
**Before**: 
- Frontend: `/api/login`, `/api/register`
- Backend: `/api/auth/login`, `/api/auth/register`

**After**: All synchronized ✅
- Frontend: `/api/auth/login` ✅
- Frontend: `/api/auth/register` ✅
- Backend: `/api/auth/login` ✅
- Backend: `/api/auth/register` ✅

**Files Changed**:
- `frontend/src/pages/auth/Login.jsx`
- `frontend/src/pages/auth/Register.jsx`

---

## 📊 Complete API Map

```
Backend (Port 5000)
├── /api/health                    GET   → Health check
├── /api/auth                      
│   ├── /register                  POST  → User registration
│   └── /login                     POST  → User login
├── /api/players                   
│   ├── /                          GET   → List players
│   ├── /:id                       GET   → Get player by ID
│   └── /                          POST  → Create player
├── /api/scouts                    
│   └── ... (routes available)
├── /api/shortlists                
│   └── ... (routes available)
└── /api/matches                   
    └── ... (routes available)

Frontend (Port 5173)
├── /                              → Home page
├── /auth/login                    → Login page (calls /api/auth/login)
├── /auth/register                 → Register page (calls /api/auth/register)
├── /player/dashboard              → Player dashboard (calls /api/players)
├── /scout/profile                 → Scout profile
└── ... (other pages)
```

---

## 🧪 Request/Response Examples

### 1️⃣ Registration Flow
```
Frontend (Register.jsx)
         ↓
POST /api/auth/register
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass",
  "role": "player"
}
         ↓
Backend (routes/auth.js)
         ↓
Response 201 Created
{
  "id": "user_id",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "player"
}
         ↓
Frontend redirects to /auth/login
```

### 2️⃣ Login Flow
```
Frontend (Login.jsx)
         ↓
POST /api/auth/login
{
  "username": "johndoe",
  "password": "securepass",
  "role": "player"
}
         ↓
Backend (routes/auth.js)
         ↓
Response 200 OK
{
  "token": "eyJhbGc...",  ← JWT Token
  "user": { ... }
}
         ↓
Frontend stores token in localStorage
localStorage.setItem("token", token)
         ↓
Frontend redirects to /player/dashboard
```

### 3️⃣ Authenticated Request Flow
```
Frontend (PlayerPool.jsx)
         ↓
GET /api/players?sort=scoutPoints&order=desc&limit=10
Headers: {
  "Authorization": "Bearer eyJhbGc..."  ← Token from localStorage
}
         ↓
Backend (src/routes/player.routes.js)
         ↓
Response 200 OK
{
  "data": [
    { id: "...", name: "...", ... },
    ...
  ]
}
         ↓
Frontend renders players list
```

---

## 🚀 Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```
✅ Output: `🚀 Server running on port 5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Output: `Local: http://localhost:5173/`

### Terminal 3 - Browser
Open: `http://localhost:5173`

---

## 🔐 Environment Setup

### Backend `.env`
```env
DATABASE_URL="mysql://root:two%2Bthree%3D3A@localhost:3306/naijascout"
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env` (optional, defaults to localhost:5000)
```env
VITE_API_URL=http://localhost:5000
```

---

## ✨ Files Modified (Summary)

| File | Change | Status |
|------|--------|--------|
| `backend/src/app.js` | Added auth route + improved CORS | ✅ |
| `frontend/src/pages/auth/Login.jsx` | Changed `/api/login` → `/api/auth/login` | ✅ |
| `frontend/src/pages/auth/Register.jsx` | Changed `/api/register` → `/api/auth/register` | ✅ |

---

## 🎓 How It Works

1. **User Registration**
   - Frontend sends credentials to `/api/auth/register`
   - Backend creates user in database
   - Frontend redirects to login

2. **User Login**
   - Frontend sends credentials to `/api/auth/login`
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage
   - Frontend uses token for authenticated requests

3. **Authenticated Requests**
   - Frontend sends requests with `Authorization: Bearer {token}` header
   - Backend validates token
   - Request proceeds or returns 401 Unauthorized

4. **CORS Handling**
   - Browser allows requests to `http://localhost:5000` from `http://localhost:5173`
   - Credentials (cookies) are allowed
   - Authorization header is allowed

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot POST /api/login" | Routes not mounted | ✅ Fixed: Routes now use `/api/auth` |
| CORS error | Origin not allowed | ✅ Fixed: Added `http://localhost:5173` to CORS |
| 401 Unauthorized | Missing token | Make sure to call `/api/auth/login` first |
| "Can't reach server" | Backend not running | Run `npm run dev` in backend folder |
| Database error | Connection failed | Check MySQL is running, DATABASE_URL is correct |

---

## ✅ Verification Checklist

- [x] Auth routes mounted at `/api/auth`
- [x] CORS configured for `http://localhost:5173`
- [x] Frontend URLs updated to use `/api/auth/` prefix
- [x] Authorization header supported
- [x] Health check endpoint available at `/api/health`
- [x] All API endpoints properly configured

**Status**: ✅ **READY FOR TESTING**
