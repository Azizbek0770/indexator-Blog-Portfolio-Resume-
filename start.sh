#!/usr/bin/env bash
set -euo pipefail

cd server
npm ci --omit=dev || npm ci
node server.js
