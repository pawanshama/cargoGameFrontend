#!/bin/bash
set -e
sleep 0.1m
npm i 
npm run build
echo y | httpd -D FOREGROUND
#httpd -D FOREGROUND
