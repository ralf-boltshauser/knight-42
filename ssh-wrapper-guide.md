# SSH Wrapper Quick Guide

## 🚀 One-Click Installation

```bash
curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/install-ssh-wrapper.sh | bash
```

## ⚙️ Configuration

### 1. Set Your Name
```bash
echo "Your Name" > ~/.knight42
```

### 2. Set Environment Variables
```bash
export KNIGHT42_API_URL="http://your-server:4200/api/ssh-events"
export KNIGHT42_API_TOKEN="your-api-token"
```

### 3. Add to Shell Profile (Optional)
```bash
echo 'export KNIGHT42_API_URL="http://your-server:4200/api/ssh-events"' >> ~/.bashrc
echo 'export KNIGHT42_API_TOKEN="knight-42-api-token"' >> ~/.bashrc
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
| `KNIGHT42_API_TOKEN` | Authentication token | `your-api-token-here` |
| `KNIGHT42_LOG_ONLY_ROOT` | Track only root users | `false` |

## 🛠️ Recovery

To restore original SSH command:
```bash
sudo rm /usr/local/bin/ssh
```

---

**GitHub**: https://github.com/ralf-boltshauser/knight-42
