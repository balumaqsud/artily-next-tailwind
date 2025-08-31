#!/bin/bash

echo "Pulling latest code..."

git reset --hard 
git checkout main 
git pull origin main


docker compose down
docker compose up -d
docker compose logs --tail 200 -f