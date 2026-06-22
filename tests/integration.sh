#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4620/api}"
PASSED=0
FAILED=0

test_endpoint() {
  local method="$1"
  local path="$2"
  local expected_status="$3"
  local description="$4"
  local data="$5"
  local token="$6"

  local headers="-H 'Content-Type: application/json'"
  if [ -n "$token" ]; then
    headers="$headers -H 'Authorization: Bearer $token'"
  fi

  local cmd="curl -s -o /tmp/response.json -w '%{http_code}' -X $method"
  if [ -n "$data" ]; then
    cmd="$cmd -d '$data'"
  fi
  cmd="$cmd $headers '$API_URL$path'"

  local status
  status=$(eval $cmd)

  if [ "$status" = "$expected_status" ]; then
    echo "✅ PASS: $description (HTTP $status)"
    PASSED=$((PASSED + 1))
  else
    echo "❌ FAIL: $description (expected $expected_status, got $status)"
    FAILED=$((FAILED + 1))
  fi
}

echo "🐟 TroutBasin Integration Tests"
echo "================================"
echo "API: $API_URL"
echo ""

test_endpoint GET "/health" "200" "Health check"

test_endpoint POST "/auth/register" "201" "Register new user" '{"email":"test@integration.com","password":"test123456","name":"Test User"}'

test_endpoint POST "/auth/login" "200" "Login with demo account" '{"email":"demo@alabalikcilik.com.tr","password":"demo123456"}'

TOKEN=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"demo@alabalikcilik.com.tr","password":"demo123456"}' "$API_URL/auth/login" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not get auth token, skipping authenticated tests"
  FAILED=$((FAILED + 1))
else
  test_endpoint GET "/auth/profile" "200" "Get profile" "" "$TOKEN"

  test_endpoint GET "/pools" "200" "List pools" "" "$TOKEN"
  test_endpoint GET "/pools/stats" "200" "Pool stats" "" "$TOKEN"

  test_endpoint GET "/stocks" "200" "List stocks" "" "$TOKEN"
  test_endpoint GET "/stocks/summary" "200" "Stock summary" "" "$TOKEN"

  test_endpoint GET "/feed/types" "200" "List feed types" "" "$TOKEN"
  test_endpoint GET "/feed/logs" "200" "List feed logs" "" "$TOKEN"
  test_endpoint GET "/feed/stats" "200" "Feed stats" "" "$TOKEN"

  test_endpoint GET "/health-records" "200" "List health records" "" "$TOKEN"
  test_endpoint GET "/health-records/stats" "200" "Health record stats" "" "$TOKEN"

  test_endpoint GET "/water-quality" "200" "List water quality" "" "$TOKEN"
  test_endpoint GET "/water-quality/latest" "200" "Latest water quality" "" "$TOKEN"
  test_endpoint GET "/water-quality/averages" "200" "Water quality averages" "" "$TOKEN"

  test_endpoint GET "/harvests" "200" "List harvests" "" "$TOKEN"
  test_endpoint GET "/harvests/stats" "200" "Harvest stats" "" "$TOKEN"

  test_endpoint GET "/customers" "200" "List customers" "" "$TOKEN"

  test_endpoint GET "/sales" "200" "List sales" "" "$TOKEN"
  test_endpoint GET "/sales/stats" "200" "Sale stats" "" "$TOKEN"

  test_endpoint GET "/pools" "401" "Unauthorized access without token"
fi

echo ""
echo "================================"
echo "Results: $PASSED passed, $FAILED failed"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
