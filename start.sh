#!/bin/bash
echo "Starting Manga Vibe Checker..."

if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install it from https://nodejs.org/"
    exit
fi

echo "Installing dependencies (this may take a minute)..."
npm install

echo "Starting the application..."
npm run dev
