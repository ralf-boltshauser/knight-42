#!/usr/bin/env bash
# Test script for SSH session tracking API

API_URL="${KNIGHT42_API_URL:-http://localhost:4200/api/ssh-events}"
API_TOKEN="${KNIGHT42_API_TOKEN:-knight42-test-token-123}"

echo "Testing SSH Session Tracking API..."
echo "API URL: $API_URL"
echo "API Token: ${API_TOKEN:0:10}..."

# Test SSH start event
echo -e "\n1. Testing SSH start event..."
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_start",
    "analystName": "Test User",
    "host": "test-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }' | jq '.'

# Wait a moment
sleep 2

# Test SSH stop event
echo -e "\n2. Testing SSH stop event..."
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_stop",
    "analystName": "Test User",
    "host": "test-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }' | jq '.'

# Test getting active sessions
echo -e "\n3. Testing active sessions endpoint..."
curl -s -H "Authorization: Bearer $API_TOKEN" \
  "http://localhost:3000/api/ssh-sessions?type=active" | jq '.'

# Test getting session history
echo -e "\n4. Testing session history endpoint..."
curl -s -H "Authorization: Bearer $API_TOKEN" \
  "http://localhost:3000/api/ssh-sessions?type=history&limit=5" | jq '.'

echo -e "\nTest completed!"
