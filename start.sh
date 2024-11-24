NETWORK_NAME="knight-42-network"

# Check if the network exists
if ! docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
  # Create the network
  docker network create "${NETWORK_NAME}"
  echo "Network '${NETWORK_NAME}' created."
else
  echo "Network '${NETWORK_NAME}' already exists."
fi

docker compose up --build --wait



pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed

pnpm build
pnpm start
