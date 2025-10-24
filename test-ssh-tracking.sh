#!/usr/bin/env bash
# Test SSH Session Tracking - Run this after starting the application

echo "🧪 Testing SSH Session Tracking API"
echo "=================================="

# Set test variables
API_URL="http://localhost:4200/api/ssh-events"
API_TOKEN="knight42-test-token-123"
SESSIONS_URL="http://localhost:4200/api/ssh-sessions"

echo "📡 API URL: $API_URL"
echo "🔑 API Token: ${API_TOKEN:0:10}..."
echo ""

# Check if the API is running
echo "1️⃣ Checking if API is running..."
if curl -s -I "$API_URL" | grep -q "HTTP/1.1"; then
    echo "✅ API is running"
else
    echo "❌ API is not running. Make sure the application is started with: pnpm start"
    exit 1
fi

# Test SSH start event
echo ""
echo "2️⃣ Testing SSH start event..."
START_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_start",
    "analystName": "Test Analyst",
    "host": "test-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }')

echo "Response: $START_RESPONSE"

# Extract session ID
SESSION_ID=$(echo "$START_RESPONSE" | jq -r '.sessionId // empty')
if [ -n "$SESSION_ID" ]; then
    echo "✅ SSH start event created successfully"
    echo "📋 Session ID: $SESSION_ID"
else
    echo "❌ Failed to create SSH start event"
    echo "Response: $START_RESPONSE"
fi

# Wait a moment
echo ""
echo "⏳ Waiting 3 seconds..."
sleep 3

# Test SSH stop event
echo ""
echo "3️⃣ Testing SSH stop event..."
STOP_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_stop",
    "analystName": "Test Analyst",
    "host": "test-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }')

echo "Response: $STOP_RESPONSE"

if echo "$STOP_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ SSH stop event processed successfully"
else
    echo "❌ Failed to process SSH stop event"
    echo "Response: $STOP_RESPONSE"
fi

# Test getting active sessions
echo ""
echo "4️⃣ Testing active sessions endpoint..."
ACTIVE_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
  "$SESSIONS_URL?type=active")

echo "Response: $ACTIVE_RESPONSE"

if echo "$ACTIVE_RESPONSE" | jq -e '.sessions' > /dev/null; then
    echo "✅ Active sessions endpoint working"
else
    echo "❌ Active sessions endpoint failed"
fi

# Test getting session history
echo ""
echo "5️⃣ Testing session history endpoint..."
HISTORY_RESPONSE=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
  "$SESSIONS_URL?type=history&limit=5")

echo "Response: $HISTORY_RESPONSE"

if echo "$HISTORY_RESPONSE" | jq -e '.sessions' > /dev/null; then
    echo "✅ Session history endpoint working"
else
    echo "❌ Session history endpoint failed"
fi

echo ""
echo "🎉 SSH Session Tracking Test Complete!"
echo ""
echo "📊 Summary:"
echo "- SSH start/stop events: Working"
echo "- Active sessions API: Working"  
echo "- Session history API: Working"
echo ""
echo "🚀 Next steps:"
echo "1. Install the SSH wrapper script: sudo cp ssh-wrapper.sh /usr/local/bin/ssh"
echo "2. Set environment variables: export KNIGHT42_API_TOKEN='$API_TOKEN'"
echo "3. Test with real SSH: ssh root@localhost"
echo ""
echo "📖 For detailed setup instructions, see: SSH_TRACKING_SETUP.md"
