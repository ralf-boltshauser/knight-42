# SSH Session Tracking - Testing Guide

## Quick Test Setup

### 1. Start the Application
```bash
# Start infrastructure and application
./start.sh
```

This will:
- Start PostgreSQL and Jaeger containers
- Set up the database with SSH session tables
- Add `SSH_API_TOKEN=knight42-test-token-123` to your `.env` file
- Start the Next.js application on port 4200

### 2. Test the API
```bash
# Run the comprehensive test
./test-ssh-tracking.sh
```

This will test:
- ✅ SSH start event creation
- ✅ SSH stop event processing  
- ✅ Active sessions endpoint
- ✅ Session history endpoint

### 3. Test with Docker Container (Optional)
```bash
# Start the SSH test container
docker-compose up ssh-test -d

# Run tests inside the container
docker exec -it ssh-test /test-ssh-api.sh
```

## Manual Testing

### Test API Endpoints Directly

#### 1. Test SSH Start Event
```bash
curl -X POST "http://localhost:4200/api/ssh-events" \
  -H "Authorization: Bearer knight42-test-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_start",
    "analystName": "John Doe",
    "host": "mail-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'
```

#### 2. Test SSH Stop Event
```bash
curl -X POST "http://localhost:4200/api/ssh-events" \
  -H "Authorization: Bearer knight42-test-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ssh_stop",
    "analystName": "John Doe", 
    "host": "mail-server-01",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'
```

#### 3. Check Active Sessions
```bash
curl -H "Authorization: Bearer knight42-test-token-123" \
  "http://localhost:4200/api/ssh-sessions?type=active"
```

#### 4. Check Session History
```bash
curl -H "Authorization: Bearer knight42-test-token-123" \
  "http://localhost:4200/api/ssh-sessions?type=history&limit=10"
```

## Test SSH Wrapper Script

### 1. Install the Wrapper
```bash
# Copy wrapper script
sudo cp ssh-wrapper.sh /usr/local/bin/ssh

# Make executable
sudo chmod +x /usr/local/bin/ssh

# Verify installation
which ssh
# Should show: /usr/local/bin/ssh
```

### 2. Set Environment Variables
```bash
export KNIGHT42_API_TOKEN="knight42-test-token-123"
export KNIGHT42_API_URL="http://localhost:4200/api/ssh-events"
```

### 3. Test SSH Connection
```bash
# First time will prompt for your name
ssh root@localhost

# Subsequent connections will use saved name
ssh root@localhost
```

## Test Asset Matching

### 1. Create Test Asset
Add an asset to your database with metadata:

```json
{
  "hostname": "test-server-01",
  "IP": "127.0.0.1", 
  "fqdn": "test-server-01.local",
  "aliases": ["test", "localhost"]
}
```

### 2. Test SSH to Asset
```bash
# This should link to the asset
ssh root@test-server-01
ssh root@127.0.0.1
ssh root@test-server-01.local
ssh root@test
```

### 3. Verify Asset Linking
```bash
# Check if sessions are linked to assets
curl -H "Authorization: Bearer knight42-test-token-123" \
  "http://localhost:4200/api/ssh-sessions?type=history" | jq '.sessions[].asset'
```

## Troubleshooting

### API Not Responding
```bash
# Check if application is running
curl -I http://localhost:4200/api/ssh-events

# Check application logs
# Look for any errors in the console where you ran pnpm start
```

### SSH Wrapper Not Working
```bash
# Check if wrapper is in PATH
which ssh

# Check wrapper permissions
ls -la /usr/local/bin/ssh

# Test wrapper manually
/usr/local/bin/ssh --version
```

### Asset Not Found
```bash
# Check asset metadata format
# Ensure IP is uppercase: "IP" not "ip"
# Check hostname matches exactly
```

## Expected Results

### Successful API Test
```json
{
  "success": true,
  "sessionId": "sess_abc123",
  "assetId": "asset_xyz789",
  "assetName": "Mail Server 01"
}
```

### Successful SSH Wrapper Test
```
[Knight-42] Using analyst name: John Doe
[Knight-42] Sent ssh_start event for mail-server-01
[Knight-42] Sent ssh_stop event for mail-server-01
```

### Active Sessions Response
```json
{
  "sessions": [
    {
      "id": "sess_abc123",
      "analystName": "John Doe",
      "asset": {
        "id": "asset_xyz789",
        "name": "Mail Server 01",
        "identifier": "mail-server-01"
      },
      "startedAt": "2024-01-15T10:30:00Z",
      "duration": 300
    }
  ]
}
```

## Next Steps

1. **Production Setup**: Change API token to a secure value
2. **Asset Configuration**: Add proper metadata to all assets
3. **Monitoring**: Set up alerts for unusual SSH patterns
4. **Analytics**: Create dashboards for SSH session data
5. **Security**: Implement IP whitelisting and rate limiting
