#!/bin/bash

# Knight-42 SSH Wrapper Installer
# One-click installation script for SSH session tracking

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_WRAPPER_URL="https://raw.githubusercontent.com/ralf-boltshauser/knight-42/main/ssh-wrapper.sh"
INSTALL_DIR="/usr/local/bin"
WRAPPER_NAME="ssh"
BACKUP_DIR="/tmp/ssh-wrapper-backup-$(date +%s)"

echo -e "${BLUE}🚀 Knight-42 SSH Wrapper Installer${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${YELLOW}⚠️  Warning: Running as root. This will override the system SSH command.${NC}"
   echo ""
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ Error: curl is required but not installed.${NC}"
    echo "Please install curl first:"
    echo "  Ubuntu/Debian: sudo apt install curl"
    echo "  CentOS/RHEL: sudo yum install curl"
    echo "  macOS: curl should be pre-installed"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if SSH wrapper already exists
if [[ -f "$INSTALL_DIR/$WRAPPER_NAME" ]]; then
    echo -e "${YELLOW}⚠️  SSH command already exists at $INSTALL_DIR/$WRAPPER_NAME${NC}"
    echo -e "${YELLOW}   Creating backup...${NC}"
    cp "$INSTALL_DIR/$WRAPPER_NAME" "$BACKUP_DIR/ssh.backup"
fi

# Download the SSH wrapper
echo -e "${BLUE}📥 Downloading SSH wrapper...${NC}"
if curl -sSL "$SSH_WRAPPER_URL" -o "$INSTALL_DIR/$WRAPPER_NAME"; then
    echo -e "${GREEN}✅ SSH wrapper downloaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to download SSH wrapper${NC}"
    echo "Please check your internet connection and try again."
    exit 1
fi

# Make it executable
echo -e "${BLUE}🔧 Setting permissions...${NC}"
chmod +x "$INSTALL_DIR/$WRAPPER_NAME"

# Verify installation
if [[ -x "$INSTALL_DIR/$WRAPPER_NAME" ]]; then
    echo -e "${GREEN}✅ SSH wrapper installed successfully${NC}"
else
    echo -e "${RED}❌ Installation failed - file is not executable${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Set up your analyst name:"
echo -e "   ${YELLOW}echo \"Your Name\" > ~/.knight42${NC}"
echo ""
echo "2. Configure environment variables:"
echo -e "   ${YELLOW}export KNIGHT42_API_URL=\"http://your-server:4200/api/ssh-events\"${NC}"
echo -e "   ${YELLOW}export KNIGHT42_API_TOKEN=\"your-api-token\"${NC}"
echo ""
echo "3. Add to your shell profile (optional):"
echo -e "   ${YELLOW}echo 'export KNIGHT42_API_URL=\"http://your-server:4200/api/ssh-events\"' >> ~/.bashrc${NC}"
echo -e "   ${YELLOW}echo 'export KNIGHT42_API_TOKEN=\"your-api-token\"' >> ~/.bashrc${NC}"
echo ""
echo "4. Test the wrapper:"
echo -e "   ${YELLOW}ssh root@your-server${NC}"
echo ""
echo -e "${BLUE}📖 Usage Examples:${NC}"
echo ""
echo "  # Basic SSH with tracking"
echo -e "  ${YELLOW}ssh root@192.168.1.10${NC}"
echo ""
echo "  # SSH with terminal allocation"
echo -e "  ${YELLOW}ssh -t root@192.168.1.10${NC}"
echo ""
echo "  # SSH with verbose output"
echo -e "  ${YELLOW}ssh -v root@192.168.1.10${NC}"
echo ""
echo -e "${BLUE}🔧 Configuration:${NC}"
echo ""
echo "  KNIGHT42_API_URL    - Your Knight-42 server API URL"
echo "  KNIGHT42_API_TOKEN  - API token for authentication"
echo "  KNIGHT42_LOG_ONLY_ROOT - Set to 'false' to track all users (default: true)"
echo ""
echo -e "${BLUE}📁 Files:${NC}"
echo "  SSH Command: $INSTALL_DIR/$WRAPPER_NAME (wrapper, original SSH kept at /usr/bin/ssh)"
echo "  Analyst Name: ~/.knight42"
echo "  Backup: $BACKUP_DIR/ (if backup was created)"
echo ""
echo -e "${GREEN}🚀 Ready to track SSH sessions!${NC}"
echo ""
echo -e "${BLUE}For more information, visit:${NC}"
echo -e "${BLUE}https://github.com/ralf-boltshauser/knight-42${NC}"
