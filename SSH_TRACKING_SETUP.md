# SSH Session Tracking Setup Guide

This guide explains how to set up SSH session tracking for Knight-42, which automatically tracks when analysts connect to assets via SSH.

## Overview

The SSH tracking system consists of:
- **SSH Wrapper Script**: Replaces the system `ssh` command to track connections
- **API Endpoints**: Receive and store SSH session data
- **Asset Matching**: Links SSH sessions to assets in your inventory

## Prerequisites

- Knight-42 application running
- `curl` command available
- Write access to `/usr/local/bin` (for system-wide installation)

## Step 1: Configure Environment Variables

Set up the required environment variables for the SSH wrapper:

```bash
# Required: API token for authentication
export KNIGHT42_API_TOKEN="your-secret-api-token-here"

# Optional: API URL (defaults to http://localhost:3000)
export KNIGHT42_API_URL="https://your-knight42-domain.com"

# Optional: Only track root connections (default: true)
export KNIGHT42_LOG_ONLY_ROOT="true"
```

Add these to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
echo 'export KNIGHT42_API_TOKEN="your-secret-api-token-here"' >> ~/.zshrc
echo 'export KNIGHT42_API_URL="https://your-knight42-domain.com"' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Install SSH Wrapper Script

### Option A: System-wide Installation (Recommended)

```bash
# Copy the wrapper script to /usr/local/bin
sudo cp ssh-wrapper.sh /usr/local/bin/ssh

# Make it executable
sudo chmod +x /usr/local/bin/ssh

# Verify installation
which ssh
# Should show: /usr/local/bin/ssh
```

### Option B: User-specific Installation

```bash
# Create a local bin directory
mkdir -p ~/bin

# Copy the wrapper script
cp ssh-wrapper.sh ~/bin/ssh

# Make it executable
chmod +x ~/bin/ssh

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
which ssh
# Should show: ~/bin/ssh
```

## Step 3: Configure Analyst Name

The first time you use SSH, the script will prompt for your name:

```bash
ssh root@mail-server-01
# Output: What's your name: John Doe
# Output: [Knight-42] Saved analyst name to /Users/johndoe/.knight42
```

Your name is saved in `~/.knight42` and won't be prompted again.

## Step 4: Test the Installation

### Test Basic SSH Tracking

```bash
# This should prompt for your name (first time only)
ssh root@localhost

# Check if events are being sent (look for Knight-42 log messages)
ssh root@mail-server-01
```

### Test API Endpoints

```bash
# Check active sessions
curl -H "Authorization: Bearer $KNIGHT42_API_TOKEN" \
     "http://localhost:3000/api/ssh-sessions?type=active"

# Check session history
curl -H "Authorization: Bearer $KNIGHT42_API_TOKEN" \
     "http://localhost:3000/api/ssh-sessions?type=history&limit=10"
```

## Step 5: Configure Asset Metadata

For SSH sessions to be linked to assets, ensure your assets have proper metadata:

```json
{
  "hostname": "mail-server-01",
  "IP": "192.168.1.100",
  "fqdn": "mail-server-01.company.com",
  "aliases": ["mail", "exchange"]
}
```

The system will match SSH connections using:
1. Exact hostname match
2. IP address match (note: "IP" in caps)
3. FQDN match
4. Aliases array match

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KNIGHT42_API_TOKEN` | `your-api-token-here` | **Required** API authentication token |
| `KNIGHT42_API_URL` | `http://localhost:3000/api/ssh-events` | API endpoint URL |
| `KNIGHT42_LOG_ONLY_ROOT` | `true` | Only track root user connections |

### Config File

The analyst name is stored in `~/.knight42`:
```
John Doe
```

## Troubleshooting

### SSH Wrapper Not Working

1. **Check PATH**: Ensure the wrapper is in your PATH before the real SSH
   ```bash
   which ssh
   echo $PATH
   ```

2. **Check Permissions**: Ensure the script is executable
   ```bash
   ls -la /usr/local/bin/ssh
   # Should show: -rwxr-xr-x
   ```

3. **Check Environment Variables**: Verify API token is set
   ```bash
   echo $KNIGHT42_API_TOKEN
   ```

### API Connection Issues

1. **Check API URL**: Ensure the URL is correct and accessible
   ```bash
   curl -I $KNIGHT42_API_URL
   ```

2. **Check API Token**: Verify the token matches your server configuration
   ```bash
   curl -H "Authorization: Bearer $KNIGHT42_API_TOKEN" \
        "$KNIGHT42_API_URL" \
        -X POST -d '{"test": "connection"}'
   ```

3. **Check Server Logs**: Look for API errors in your Knight-42 server logs

### Asset Matching Issues

1. **Check Asset Metadata**: Ensure assets have proper hostname/IP metadata
2. **Check Asset Names**: Verify the hostname in SSH command matches asset metadata
3. **Check API Logs**: Look for asset lookup errors in server logs

## Security Considerations

### API Token Security

- Use a strong, random API token
- Store the token securely (environment variables, not in scripts)
- Rotate the token regularly
- Don't commit the token to version control

### Network Security

- Use HTTPS for production deployments
- Consider IP whitelisting for API access
- Monitor for unusual API usage patterns

### Data Privacy

- Only essential connection data is logged
- No passwords or sensitive data are transmitted
- Sessions can be anonymized or deleted as needed

## Uninstalling

To remove the SSH wrapper:

```bash
# Remove the wrapper
sudo rm /usr/local/bin/ssh

# Restore original SSH (if needed)
sudo ln -s /usr/bin/ssh /usr/local/bin/ssh

# Remove config file
rm ~/.knight42
```

## Advanced Usage

### Custom API Endpoints

The wrapper sends events to `/api/ssh-events`. You can customize the API URL:

```bash
export KNIGHT42_API_URL="https://api.company.com/v1/ssh-events"
```

### Batch Processing

For high-volume environments, consider implementing:
- Event batching
- Local caching
- Retry mechanisms
- Rate limiting

### Integration with Monitoring

The SSH tracking data can be integrated with:
- Asset monitoring dashboards
- Security incident detection
- Compliance reporting
- Team productivity metrics

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for API errors
3. Test with a simple SSH connection first
4. Verify environment variables are set correctly
