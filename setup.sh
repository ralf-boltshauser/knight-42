#! /bin/bash

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

npm install -g ts-node typescript pnpm prisma

### Setup
git clone https://github.com/ralf-boltshauser/knight-42.git
cd knight-42
pnpm install

bash start.sh