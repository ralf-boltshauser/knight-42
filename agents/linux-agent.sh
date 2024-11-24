#!/bin/bash

# Function to show usage
usage() {
    echo "Usage: $0 [-h <IP>]"
    exit 1
}

# Parse named arguments
while getopts "h:" opt; do
    case "$opt" in
        h) TARGET_IP=$OPTARG ;;
        *) usage ;;
    esac
done

# Fetch hostname
HOSTNAME=$(hostname)

# Fetch operating system info (Linux-specific)
if [ -f /etc/os-release ]; then
    OS=$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"')
else
    OS=$(uname -s) # Fallback if /etc/os-release is missing
fi

# Fetch primary IP address (works on most Linux systems)
if [[ "$OS" == *"Darwin"* ]]; then
    # For macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
else
    # For Linux
    IP=$(ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -n 1)
fi

# Fetch location using an API (requires `curl` and `jq` installed)
LOCATION=$(curl -s http://ip-api.com/json/ | jq -r '.city')

# Generate JSON payload
JSON=$(cat <<EOF
{
  "name": "$HOSTNAME",
  "metadata": {
    "OS": "$OS",
    "IP": "$IP",
    "location": "$LOCATION"
  }
}
EOF
)

# Output JSON
echo "$JSON"

# Check if TARGET_IP is provided and make a POST request
if [ -n "$TARGET_IP" ]; then
    echo "Making POST request to http://$TARGET_IP:3000/api/assets..."
    RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$JSON" "http://$TARGET_IP:3000/api/assets")
    echo "Response from server: $RESPONSE"
fi

# Optionally, save JSON to a file
echo "$JSON" > server_info.json
