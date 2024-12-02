# Knight 42
Knowledge Network for Incident Gathering, Hosts, and Tracking

## Todos

## bugs

### Bigger Changes
- [ ] wazuh integration

### UX
- [ ] empty screens with smth like rough.js or smth react-rough-fiber

### Testing
- [ ] do some smart caching or smth

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

Prepare the Env file
- [ ] add the right MISP API URL
- [ ] add MISP API Key

Start the services
```bash
bash start.sh
```
This will build the docker images and start the services.

## Agents
### Uptime checker
There is an uptime checker that will fetch all assets ping them and set their status in the API. To use it follow these steps: 

```bash
cd network-scan
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Usage
-s -> server IP address
```bash
python3 uptime-checker.py -s 192.168.0.113
```


### Linux Agent
Adjust the IP address in the command below to your server's IP address.
```bash
curl -sSL https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/linux-agent.sh | bash -s -- -h 192.168.0.113
```
### Windows Agent
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
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

# Credits
- Nicolas Caluori has created a uptime checker.
- Bamuel Saumgartner and Simon Schmandt has created the mittre attack techniques seed.