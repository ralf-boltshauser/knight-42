# Knight 42
Knowledge Network for Incident Gathering, Hosts, and Tracking

## Todos
- [ ] add attack chains
- [ ] create a dashboard for an analyst showing all my machines, alerts, and response actions
- [ ] try to implement a few use cases that could occur in a SOC environment
- [ ] consider adding timeline as a model
- [ ] asset edit

## Usage
### Dependencies
- Node.js LTS
- Docker

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
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/windows-agent.ps1 -OutFile windows-agent.ps1; .\windows-agent.ps1 -TargetIP 192.168.0.113
```
