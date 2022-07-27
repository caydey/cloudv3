#!/usr/bin/sh
docker-compose --env-file ./config.env up -d --build --force-recreate
