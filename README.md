# Knight 42
Knowledge Network for Incident Gathering, Hosts, and Tracking

## Todos
## bugs
- [ ] can't remove ttps form thread actors
- [ ] deleting threat actors

### UX
- [ ] a history / log would be great
- [ ] add filter for assets etc if there are too many it gets shitty
  - [ ] os filter
  - [ ] 
- [ ] use proper prioritization everywhere everything should be mission critical etc we don't have time to do everything
  - [ ] dashboard should show criticality
- [ ] add proper loading states

### Testing
- [ ] try to implement a few use cases that could occur in a SOC environment
- [ ] try to overload it and add a shitload of entries etc to see how it looks if you actually use it a lot
- [ ] agents won't be working in exercise net

### Bigger Changes
- [ ] a network map
- [ ] mark alerts as reported
- [ ] attackers have clear ip ranges
- [ ] utc timeline
- [ ] consider adding timeline as a model
- [ ] automatically create misp entry based on alert and link to it
- [ ] wazuh integration

## Usage

One shot setup script for empty containers running on a fresh Ubuntu 22.04 server
```bash
apt update && apt install -y curl && curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/setup.sh | bash
```

### Dependencies
- Node.js LTS
- Docker

Installation on Ubuntu 22.04
```bash
sudo apt update
sudo apt install -y curl docker.io git 
# install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

source ~/.bashrc

# download and install Node.js (you may need to restart the terminal)
nvm install 22

# verifies the right Node.js version is in the environment
node -v # should print `v22.11.0`

# verifies the right npm version is in the environment
apt install npm -y
npm -v # should print `10.9.0`
```

### Setup
Clone the repo
```bash
git clone https://github.com/ralf-boltshauser/knight-42.git
cd knight-42
npm install -g pnpm
pnpm install
```

Start the services
```bash
bash start.sh
```
This will build the docker images and start the services.

## Agents
### Linux Agent
Adjust the IP address in the command below to your server's IP address.
```bash
curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/linux-agent.sh | bash -s -- -h 192.168.0.113
```
### Windows Agent
```powershell
Set-ExecutionPolicy Bypass
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/windows-agent.ps1 -OutFile windows-agent.ps1; .\windows-agent.ps1 -TargetIP 192.168.0.113
```

### Network Scan

Setup
```bash
cd network-scan
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Usage
-t -> target subnet
-s -> server IP address
```bash
python3 network-scan.py -t 192.168.0.1/24 -s 192.168.0.113
```