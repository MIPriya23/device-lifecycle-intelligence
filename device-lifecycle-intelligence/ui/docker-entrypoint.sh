#!/bin/sh
set -e

# Read the Kubernetes DNS nameserver from /etc/resolv.conf and inject it
# into nginx.conf so nginx can resolve service names at request time.
DNS=$(grep '^nameserver' /etc/resolv.conf | awk '{print $2}' | head -1)
if [ -z "$DNS" ]; then
  echo "WARNING: could not determine nameserver, defaulting to 10.96.0.10"
  DNS="10.96.0.10"
fi

# API_BACKEND is the internal URL nginx proxies /api/ to.
# Kubernetes default: http://dli-api (same namespace, port 80)
# Docker Compose: set API_BACKEND=http://api:80
# Must NOT use VITE_API_URL — that is a Vite build-time var that Vault may
# set to the public UI hostname, which would cause a proxy loop.
BACKEND="${API_BACKEND:-http://dli-api}"

sed -i "s|__KUBE_DNS__|$DNS|g" /etc/nginx/conf.d/default.conf
sed -i "s|__API_BACKEND__|$BACKEND|g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
