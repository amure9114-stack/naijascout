# Feature Implementation Guide

## ✅ Backend APIs Created

All backend APIs have been created and are ready to use:

### 1. **Trials API** (`/api/trials`)
- ✅ `GET /api/trials` - List all trials (with filters: date, location, ageGroup)
- ✅ `GET /api/trials/:id` - Get trial details
- ✅ `POST /api/trials/:trialId/apply` - Apply for a trial
- ✅ `GET /api/trials/player/:playerId/applications` - Get player's applications
- ✅ Migrated to Prisma

### 2. **Injuries API** (`/api/injuries`)
- ✅ `GET /api/injuries` - List injuries (with playerId filter)
- ✅ `GET /api/injuries/player/:playerId` - Get player injuries with stats
- ✅ `GET /api/injuries/:id` - Get injury details
- ✅ `POST /api/injuries` - Create injury (authenticated)
- ✅ `PUT /api/injuries/:id` - Update injury (authenticated)
- ✅ `DELETE /api/injuries/:id` - Delete injury (authenticated)

### 3. **Sponsorships API** (`/api/sponsorships`)
- ✅ `GET /api/sponsorships` - List sponsorships (with filters: type, location, isActive)
- ✅ `GET /api/sponsorships/:id` - Get sponsorship details
- ✅ `POST /api/sponsorships/:sponsorshipId/apply` - Apply for sponsorship
- ✅ `GET /api/sponsorships/player/:playerId/applications` - Get player's applications

### 4. **Tournaments API** (`/api/tournaments`)
- ✅ `GET /api/tournaments` - List tournaments (with filters: category, isActive, playerId)
- ✅ `GET /api/tournaments/:id` - Get tournament details
- ✅ `POST /api/tournaments/:tournamentId/register` - Register for tournament
- ✅ `GET /api/tournaments/player/:playerId` - Get player's tournaments

### 5. **Analytics API** (`/api/analytics`)
- ✅ `GET /api/analytics/player/:playerId` - Get player performance overview
- ✅ `GET /api/analytics/player/:playerId/metrics` - Get performance metrics (with filters)

### 6. **Matches API** (Enhanced)
- ✅ `GET /api/matches/me` - Get current player's matches (authenticated)
- ✅ `GET /api/matches/player/:playerId` - Get matches by player ID
- ✅ `POST /api/matches` - Create match (authenticated)

## 📋 Next Steps: Frontend Integration

### Step 1: Generate Prisma Client
```bash
cd Naijascout/backend
npx prisma generate
npx prisma db push
```

### Step 2: Update Frontend Components

#### A. FindTrials.jsx
Replace mock data with API calls:

```javascript
// Add state for loading and error
const [allTrials, setAllTrials] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch trials on mount
useEffect(() => {
  const fetchTrials = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/trials`);
      const data = await res.json();
      if (data.success) {
        // Transform API data to match component format
        const transformed = data.data.map(trial => ({
          id: trial.id,
          name: trial.title,
          date: new Date(trial.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          location: trial.location,
          eligibility: trial.description ? [trial.description] : [],
          category: trial.ageGroup || 'all',
          position: 'all'
        }));
        setAllTrials(transformed);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchTrials();
}, []);

// Update handleRegisterTrial
const handleRegisterTrial = async (trialId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to apply');
      return;
    }
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const username = localStorage.getItem('username');
    
    // Get player ID from username first
    const playerRes = await fetch(`${API_URL}/api/players/username/${username}`);
    const playerData = await playerRes.json();
    
    if (!playerData.success) {
      alert('Player profile not found');
      return;
    }
    
    const res = await fetch(`${API_URL}/api/trials/${trialId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        playerId: playerData.data.id
      })
    });
    
    const data = await res.json();
    if (data.success) {
      alert('Successfully applied for trial!');
    } else {
      alert('Failed to apply: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    alert('Error applying: ' + err.message);
  }
};
```

#### B. PerformanceAnalytics.jsx
Replace mock data with real API:

```javascript
const [performanceData, setPerformanceData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const username = localStorage.getItem('username');
      
      // Get player ID
      const playerRes = await fetch(`${API_URL}/api/players/username/${username}`);
      const playerData = await playerRes.json();
      
      if (!playerData.success) return;
      
      // Get performance metrics
      const res = await fetch(
        `${API_URL}/api/analytics/player/${playerData.data.id}/metrics?metricType=${selectedMetricType}&dateRange=${selectedDateRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setPerformanceData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch performance:', err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchPerformance();
}, [selectedMetricType, selectedDateRange]);
```

#### C. InjuryManagement.jsx
Replace mock data with API:

```javascript
// Replace useState with API fetch
useEffect(() => {
  const fetchInjuries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const username = localStorage.getItem('username');
      
      // Get player ID
      const playerRes = await fetch(`${API_URL}/api/players/username/${username}`);
      const playerData = await playerRes.json();
      
      if (!playerData.success) return;
      
      const res = await fetch(`${API_URL}/api/injuries/player/${playerData.data.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setInjuries(data.data);
        // Stats are in data.stats
      }
    } catch (err) {
      console.error('Failed to fetch injuries:', err);
    }
  };
  
  fetchInjuries();
}, []);

// Update handleAddInjury to use API
const handleAddInjury = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const username = localStorage.getItem('username');
    
    // Get player ID
    const playerRes = await fetch(`${API_URL}/api/players/username/${username}`);
    const playerData = await playerRes.json();
    
    const res = await fetch(`${API_URL}/api/injuries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        playerId: playerData.data.id
      })
    });
    
    const data = await res.json();
    if (data.success) {
      setInjuries(prev => [data.data, ...prev]);
      setShowAddModal(false);
      // Reset form
    }
  } catch (err) {
    alert('Failed to add injury: ' + err.message);
  }
};
```

#### D. Sponsorships.jsx
Add API integration:

```javascript
// Fetch sponsorships
useEffect(() => {
  const fetchSponsorships = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/sponsorships?isActive=true`);
      const data = await res.json();
      if (data.success) {
        // Transform to match component format
        setAvailableSponsors(data.data.map(sp => ({
          name: sp.name,
          type: sp.type,
          amount: sp.amount,
          period: sp.period,
          location: sp.location,
          focus: sp.focus,
          requirements: sp.requirements ? JSON.parse(sp.requirements) : [],
          benefits: sp.benefits ? JSON.parse(sp.benefits) : []
        })));
      }
    } catch (err) {
      console.error('Failed to fetch sponsorships:', err);
    }
  };
  fetchSponsorships();
}, []);

// Update form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  // Get form data and submit to API
  // POST /api/sponsorships/:sponsorshipId/apply
};
```

#### E. MatchesTournaments.jsx
This file is empty - needs full implementation. Create it with:
- Match listing from `/api/matches/me`
- Tournament listing from `/api/tournaments`
- Registration functionality
- Match creation form

## 🗄️ Database Migration

After updating Prisma schema, run:

```bash
cd Naijascout/backend
npx prisma generate
npx prisma db push
```

This will create all the new tables in your database.

## 🧪 Testing

Test each endpoint:

1. **Trials**: `GET http://localhost:5000/api/trials`
2. **Injuries**: `GET http://localhost:5000/api/injuries`
3. **Sponsorships**: `GET http://localhost:5000/api/sponsorships`
4. **Tournaments**: `GET http://localhost:5000/api/tournaments`
5. **Analytics**: `GET http://localhost:5000/api/analytics/player/1` (with auth token)

## 📝 Notes

- All authenticated endpoints require JWT token in `Authorization: Bearer <token>` header
- Player ID can be obtained from `/api/players/me` or `/api/players/username/:username`
- Error handling should be added to all frontend API calls
- Loading states should be shown during API calls
- Success/error messages should be displayed to users


