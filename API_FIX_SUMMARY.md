# NaijaScout API Connection Fix Summary

## ✅ Issues Fixed

### 1. **Backend Route Structure**
- **Issue**: Auth routes were not mounted in the Express app
- **Fix**: Added auth route import and mounting in `/backend/src/app.js`
  ```javascript
  import authRoutes from '../routes/auth.js';
  app.use('/api/auth', authRoutes);
  ```

### 2. **CORS Configuration**
- **Issue**: Basic CORS setup, needed credentials and full method support
- **Fix**: Enhanced CORS middleware with:
  ```javascript
  cors({ 
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
  ```

### 3. **Frontend API Endpoints**
- **Issue**: Frontend was calling `/api/login` and `/api/register` directly
- **Fix**: Updated to use the correct `/api/auth/` prefix:
  - `Login.jsx`: `/api/auth/login` ✅
  - `Register.jsx`: `/api/auth/register` ✅
  - `PlayerPool.jsx`: `/api/players` ✅ (already correct)

## 📋 API Routes Available

### Authentication Routes (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Player Routes (`/api/players`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/players` | Get all players (supports sort, order, limit) |
| GET | `/api/players/:id` | Get single player by ID |
| POST | `/api/players` | Create new player |

### Scout Routes (`/api/scouts`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/scouts` | Get all scouts |
| Additional endpoints available |

### Shortlist Routes (`/api/shortlists`)
| Method | Route | Description |
|--------|-------|-------------|
| Available endpoints |

### Match Routes (`/api/matches`)
| Method | Route | Description |
|--------|-------|-------------|
| Available endpoints |

## 🚀 How to Run

### Backend
```bash
cd backend
npm install
npm run dev
```
- Server runs on: `http://localhost:5000`
- API base: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on: `http://localhost:5173`
- Automatically connects to backend via CORS

## 🔍 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="mysql://root:two%2Bthree%3D3A@localhost:3306/naijascout"
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (`.env` or `.env.local`)
```env
VITE_API_URL=http://localhost:5000
```

## ✨ Key Features

1. **Proper Route Isolation**: Auth routes are now under `/api/auth` prefix
2. **CORS Enabled**: Frontend at localhost:5173 can communicate with backend
3. **Authorization Header**: API supports JWT tokens via Authorization header
4. **Health Check**: `/api/health` endpoint available for monitoring

## 🧪 Testing the Connection

### Test Register Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "player"
  }'
```

### Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "role": "player"
  }'
```

### Test Players Endpoint
```bash
curl -X GET "http://localhost:5000/api/players?sort=scoutPoints&order=desc&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

## 📝 Files Modified

1. ✅ `/backend/src/app.js` - Added auth route mounting and improved CORS
2. ✅ `/frontend/src/pages/auth/Login.jsx` - Fixed login endpoint URL
3. ✅ `/frontend/src/pages/auth/Register.jsx` - Fixed register endpoint URL

## 🎯 Next Steps

1. **Database Setup**: Ensure MySQL is running and migrations are applied
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

2. **Start Services**:
   - Backend: `npm run dev` in `/backend`
   - Frontend: `npm run dev` in `/frontend`

3. **Verify Connection**: 
   - Open frontend at `http://localhost:5173`
   - Try registration/login flow
   - Check browser console for any errors

## 🆘 Troubleshooting

### "Cannot POST /api/login"
- ✅ Fixed: Routes now properly use `/api/auth/login`

### "CORS error: Access-Control-Allow-Origin"
- ✅ Fixed: CORS now allows `http://localhost:5173`

### "401 Unauthorized" on API calls
- Ensure token is stored in localStorage after login
- Check Authorization header is being sent

### "Can't reach the server"
- Verify backend is running on port 5000
- Check `npm run dev` output for errors
