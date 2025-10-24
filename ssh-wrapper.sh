#!/usr/bin/env bash
# SSH wrapper script for Knight-42 SSH session tracking
# This script wraps the real SSH client to track analyst connections

# --- Configuration ---
API_URL="${KNIGHT42_API_URL:-http://localhost:3000/api/ssh-events}"
API_TOKEN="${KNIGHT42_API_TOKEN:-knight42-test-token-123}"
REAL_SSH="/usr/bin/ssh"
CONFIG_FILE="$HOME/.knight42"
LOG_ONLY_ROOT="${KNIGHT42_LOG_ONLY_ROOT:-false}"
# ---------------------

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[Knight-42]${NC} $1" >&2
}

error() {
    echo -e "${RED}[Knight-42 ERROR]${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[Knight-42 WARNING]${NC} $1" >&2
}

# Get analyst name from config file or prompt user
get_analyst_name() {
    if [ -f "$CONFIG_FILE" ]; then
        ANALYST_NAME=$(cat "$CONFIG_FILE" | head -n1 | tr -d '\n\r')
        if [ -n "$ANALYST_NAME" ]; then
            log "Using analyst name: $ANALYST_NAME"
            return 0
        fi
    fi
    
    echo -n "What's your name: "
    read -r ANALYST_NAME
    if [ -n "$ANALYST_NAME" ]; then
        echo "$ANALYST_NAME" > "$CONFIG_FILE"
        log "Saved analyst name to $CONFIG_FILE"
    else
        error "No analyst name provided"
        return 1
    fi
}

# Parse SSH arguments to extract destination
parse_ssh_destination() {
    local dest=""
    local skip_next=0
    
    for ((i=1; i<=$#; i++)); do
        local arg="${!i}"
        
        if [ $skip_next -eq 1 ]; then
            skip_next=0
            continue
        fi
        
        # SSH options that take a value
        case "$arg" in
            -o|-l|-p|-i|-c|-m|-F|-J|-L|-R|-D|-W|-w|-X|-Y|-x|-A|-a|-T|-N|-f|-n|-q|-V|-C|-F|-G|-K|-M|-O|-Q|-S|-W|-X|-Y|-x|-y|-z)
                skip_next=1
                continue
                ;;
        esac
        
        # SSH boolean flags (no value)
        case "$arg" in
            -t|-A|-a|-N|-f|-n|-q|-v|-V|-C|-X|-Y|-x|-y|-z)
                continue
                ;;
        esac
        
        # If it's not an option, it's likely the destination
        if [[ "$arg" != -* ]]; then
            dest="$arg"
            break
        fi
    done
    
    echo "$dest"
}

# Extract user and host from destination
parse_user_host() {
    local dest="$1"
    local user=""
    local host=""
    
    if [[ -n "$dest" && "$dest" == *@* ]]; then
        user="${dest%@*}"
        host="${dest#*@}"
    elif [[ -n "$dest" ]]; then
        # No user specified, assume current user
        user="$(whoami)"
        host="$dest"
    fi
    
    echo "$user|$host"
}

# Send event to API
send_event() {
    local event_type="$1"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    local payload
    payload=$(cat <<EOF
{
  "event": "$event_type",
  "analystName": "$ANALYST_NAME",
  "host": "$HOST",
  "timestamp": "$timestamp"
}
EOF
)
    
    # Send event non-blocking (don't fail SSH if API fails)
    curl -s -m 5 -X POST "$API_URL" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1 &
    
    if [ $? -eq 0 ]; then
        log "Sent $event_type event for $HOST"
    else
        warn "Failed to send $event_type event (API may be down)"
    fi
}

# Main script logic
main() {
    # Check if API token is configured
    if [ "$API_TOKEN" = "your-api-token-here" ]; then
        error "Please set KNIGHT42_API_TOKEN environment variable"
        error "Example: export KNIGHT42_API_TOKEN='your-secret-token'"
        # Continue with SSH anyway
    fi
    
    # Get analyst name
    if ! get_analyst_name; then
        error "Failed to get analyst name, continuing without tracking"
        exec "$REAL_SSH" "$@"
        exit $?
    fi
    
    # Parse destination from SSH arguments
    local destination
    destination=$(parse_ssh_destination "$@")
    
    if [ -z "$destination" ]; then
        warn "Could not parse SSH destination, continuing without tracking"
        exec "$REAL_SSH" "$@"
        exit $?
    fi
    
    # Extract user and host
    local user_host
    user_host=$(parse_user_host "$destination")
    local user="${user_host%|*}"
    local host="${user_host#*|}"
    
    # Check if we should track this connection
    local should_track=false
    if [ "$LOG_ONLY_ROOT" = "false" ]; then
        should_track=true
    elif [ "$user" = "root" ]; then
        should_track=true
    fi
    
    if [ "$should_track" = "false" ]; then
        log "Skipping tracking for $user@$host (not root user)"
        exec "$REAL_SSH" "$@"
        exit $?
    fi
    
    # Set global variables for event sending
    HOST="$host"
    
    # Send start event
    send_event "ssh_start"
    
    # Run SSH in foreground to preserve terminal connection
    # Use a subshell to catch the exit
    (
        "$REAL_SSH" "$@"
        local exit_code=$?
        send_event "ssh_stop"
        exit $exit_code
    )
}

# Run main function
main "$@"
