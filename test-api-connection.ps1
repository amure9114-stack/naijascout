# NaijaScout API Connection Test Script (Windows PowerShell)
# This script verifies that the frontend-backend connection is properly configured

Write-Host "🧪 NaijaScout API Connection Tests" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host -NoNewline "1️⃣  Testing backend health check... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ PASS" -ForegroundColor Green
    Write-Host "   Backend is running on port 5000"
}
catch {
    Write-Host "❌ FAIL" -ForegroundColor Red
    Write-Host "   Backend is not running. Start it with: npm run dev (in backend folder)"
}
Write-Host ""

# Test 2: Check if registration endpoint exists
Write-Host -NoNewline "2️⃣  Testing /api/auth/register endpoint... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body '{}' `
        -TimeoutSec 2 `
        -ErrorAction Stop
    Write-Host "✅ PASS" -ForegroundColor Green
    Write-Host "   Register endpoint is available"
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.Value
    if ($statusCode -eq 400 -or $statusCode -eq 409) {
        Write-Host "✅ PASS" -ForegroundColor Green
        Write-Host "   Register endpoint is available (returns $statusCode for empty request)"
    }
    elseif ($statusCode -eq 404) {
        Write-Host "❌ FAIL" -ForegroundColor Red
        Write-Host "   Register endpoint not found. Check /api/auth route mounting"
    }
    else {
        Write-Host "⚠️  WARN" -ForegroundColor Yellow
        Write-Host "   Response code: $statusCode"
    }
}
Write-Host ""

# Test 3: Check CORS headers
Write-Host -NoNewline "3️⃣  Testing CORS headers... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/players" `
        -Method Options `
        -Headers @{"Origin" = "http://localhost:5173"; "Access-Control-Request-Method" = "GET" } `
        -TimeoutSec 2 `
        -ErrorAction Stop
    
    $corsHeader = $response.Headers['Access-Control-Allow-Origin']
    if ($corsHeader) {
        Write-Host "✅ PASS" -ForegroundColor Green
        Write-Host "   CORS is properly configured"
    }
    else {
        Write-Host "⚠️  WARN" -ForegroundColor Yellow
        Write-Host "   Could not verify CORS headers"
    }
}
catch {
    Write-Host "⚠️  WARN" -ForegroundColor Yellow
    Write-Host "   Could not verify CORS headers"
}
Write-Host ""

# Test 4: Check if players endpoint exists
Write-Host -NoNewline "4️⃣  Testing /api/players endpoint... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/players" `
        -Method Get `
        -TimeoutSec 2 `
        -ErrorAction Stop
    Write-Host "✅ PASS" -ForegroundColor Green
    Write-Host "   Players endpoint is available (returns 200)"
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.Value
    if ($statusCode -eq 401 -or $statusCode -eq 500) {
        Write-Host "✅ PASS" -ForegroundColor Green
        Write-Host "   Players endpoint is available (returns $statusCode)"
    }
    elseif ($statusCode -eq 404) {
        Write-Host "❌ FAIL" -ForegroundColor Red
        Write-Host "   Players endpoint not found"
    }
    else {
        Write-Host "⚠️  WARN" -ForegroundColor Yellow
        Write-Host "   Response code: $statusCode"
    }
}
Write-Host ""

# Test 5: Check frontend is running
Write-Host -NoNewline "5️⃣  Testing frontend server... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ PASS" -ForegroundColor Green
    Write-Host "   Frontend is running on port 5173"
}
catch {
    Write-Host "⚠️  WARN" -ForegroundColor Yellow
    Write-Host "   Frontend is not running. Start it with: npm run dev (in frontend folder)"
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ API Connection Tests Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure both backend and frontend are running"
Write-Host "2. Open http://localhost:5173 in your browser"
Write-Host "3. Try to register or login"
Write-Host "4. Check browser console for any errors"
