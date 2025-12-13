#!/usr/bin/env bash
# NaijaScout API Connection Test Script
# This script verifies that the frontend-backend connection is properly configured

echo "🧪 NaijaScout API Connection Tests"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if backend is running
echo -n "1️⃣  Testing backend health check... "
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Backend is running on port 5000"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Backend is not running. Start it with: npm run dev (in backend folder)"
fi
echo ""

# Test 2: Check if registration endpoint exists
echo -n "2️⃣  Testing /api/auth/register endpoint... "
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{}' 2>/dev/null)

if [[ "$RESPONSE" == "400" || "$RESPONSE" == "409" ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Register endpoint is available (returns $RESPONSE for empty request)"
elif [[ "$RESPONSE" == "404" ]]; then
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Register endpoint not found. Check /api/auth route mounting"
else
    echo -e "${YELLOW}⚠️  WARN${NC}"
    echo "   Unexpected response code: $RESPONSE"
fi
echo ""

# Test 3: Check CORS headers
echo -n "3️⃣  Testing CORS headers... "
CORS_HEADER=$(curl -s -X OPTIONS http://localhost:5000/api/players \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  2>/dev/null | grep -i "Access-Control-Allow-Origin" || echo "NOT_FOUND")

if [[ "$CORS_HEADER" != "NOT_FOUND" ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   CORS is properly configured"
else
    # Try with curl's -i flag
    CORS_CHECK=$(curl -s -i -X OPTIONS http://localhost:5000/api/players \
      -H "Origin: http://localhost:5173" 2>/dev/null | grep "Access-Control-Allow-Origin" || echo "NOT_FOUND")
    
    if [[ "$CORS_CHECK" != "NOT_FOUND" ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        echo "   CORS is properly configured"
    else
        echo -e "${YELLOW}⚠️  WARN${NC}"
        echo "   Could not verify CORS headers"
    fi
fi
echo ""

# Test 4: Check if players endpoint exists
echo -n "4️⃣  Testing /api/players endpoint... "
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X GET http://localhost:5000/api/players 2>/dev/null)

if [[ "$RESPONSE" == "200" || "$RESPONSE" == "401" || "$RESPONSE" == "500" ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Players endpoint is available (returns $RESPONSE)"
elif [[ "$RESPONSE" == "404" ]]; then
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Players endpoint not found"
else
    echo -e "${YELLOW}⚠️  WARN${NC}"
    echo "   Unexpected response code: $RESPONSE"
fi
echo ""

# Test 5: Check frontend is running
echo -n "5️⃣  Testing frontend server... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Frontend is running on port 5173"
else
    echo -e "${YELLOW}⚠️  WARN${NC}"
    echo "   Frontend is not running. Start it with: npm run dev (in frontend folder)"
fi
echo ""

echo "=================================="
echo "✅ API Connection Tests Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Make sure both backend and frontend are running"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Try to register or login"
echo "4. Check browser console for any errors"
