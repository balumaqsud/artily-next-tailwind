#!/bin/bash

echo "Pulling latest code..."

git reset --hard 
git checkout main 
git pull origin main
docker compose up -d