#!/bin/bash 
set -e
sleep 0.1m
npm i
npm run build
# npx prisma generate 
# npx prisma migrate 
# npx prisma db push 
PORT=4000 npm run dev
#apachectl -D FOREGROUND
