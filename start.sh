NETWORK_NAME="knight-42-network"

# Check if the network exists
if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
  # Create the network
  docker network create "${NETWORK_NAME}"
  echo "Network '${NETWORK_NAME}' created."
else
  echo "Network '${NETWORK_NAME}' already exists."
fi

# Setup infra
docker-compose up --build -d && sleep 60

# Setup db
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed

# Remove existing NEXTAUTH_URL from .env if it exists
sed -i '' '/^NEXTAUTH_URL=/d' .env


# Get IP address (works on Linux, macOS)
IP_ADDR=$(ip route get 1 | awk '{print $7;exit}' 2>/dev/null || ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n1)

# Add new NEXTAUTH_URL with IP to .env
echo "NEXTAUTH_URL=http://${IP_ADDR}:3000" >> .env


# Display live URL
echo "Will be available at: http://${IP_ADDR}:3000" 
sleep 10

# Setup app
pnpm install
pnpm build
pnpm start