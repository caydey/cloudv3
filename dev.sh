#!/usr/bin/sh
tmux new -c "./server/app" "npm run dev" ';' split -c "../../client/app" "npm run serve"
