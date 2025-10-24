# SSH Wrapper Quick Guide

## 🚀 One-Click Installation

### Option 1: System-wide (Recommended)
```bash
sudo curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/install-ssh-wrapper.sh | sudo bash
```

### Option 2: User-only (No sudo required)
```bash
INSTALL_DIR=~/bin curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/install-ssh-wrapper.sh | bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Note**: Option 1 requires sudo permissions. Option 2 installs to user directory.

## ⚙️ Configuration

### 1. Set Your Name
```bash
echo "Your Name" > ~/.knight42
```

### 2. Set Environment Variables
```bash
export KNIGHT42_API_URL="http://your-server:4200/api/ssh-events"
export KNIGHT42_API_TOKEN="knight42-test-token-123"
```

### 3. Add to Shell Profile (Optional)
```bash
echo 'export KNIGHT42_API_URL="http://your-server:4200/api/ssh-events"' >> ~/.bashrc
echo 'export KNIGHT42_API_TOKEN="knight42-test-token-123"' >> ~/.bashrc
```

## 🎯 Usage

Just use SSH normally - all sessions are automatically tracked:

```bash
ssh root@192.168.1.10
ssh -t root@192.168.1.10
ssh -v root@192.168.1.10
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KNIGHT42_API_URL` | API endpoint URL | `http://localhost:3000/api/ssh-events` |
| `KNIGHT42_API_TOKEN` | Authentication token | `knight42-test-token-123` |
| `KNIGHT42_LOG_ONLY_ROOT` | Track only root users | `false` |

## 🛠️ Recovery

To restore original SSH command:
```bash
sudo rm /usr/local/bin/ssh
```

To reinstall the wrapper:
```bash
sudo curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/install-ssh-wrapper.sh | sudo bash
```

---

**GitHub**: https://github.com/ralf-boltshauser/knight-42
