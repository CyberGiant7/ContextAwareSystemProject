docker compose up -d db
docker compose build backend
docker compose up -d backend
docker exec -it backend npm run db:generate
docker exec -it backend npm run db:migrate
docker exec -it backend npm run db:seed
docker compose build frontend
docker compose up frontend