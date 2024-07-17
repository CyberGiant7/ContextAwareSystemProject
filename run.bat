docker compose up -d db
docker compose build backend
docker compose build frontend
docker compose up -d backend
docker compose up frontend