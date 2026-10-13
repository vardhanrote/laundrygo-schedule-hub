#!/usr/bin/env bash
# =============================================================================
# LaundryGo - one-command setup for a fresh AWS EC2 instance
# Supported: Ubuntu 22.04 / 24.04, Debian 12, Amazon Linux 2023
#
# Usage (run from the project folder on the EC2 instance):
#   sudo bash deploy/setup-ec2.sh            # serve the pre-built ./dist  (recommended, lowest RAM)
#   sudo bash deploy/setup-ec2.sh --build    # rebuild from source on the server first
#
# What it does: installs nginx, publishes the site to /var/www/laundrygo,
# configures single-page-app routing, and starts nginx on every reboot.
# Everything it installs is free software; no paid AWS service is touched.
# =============================================================================
set -euo pipefail

APP_NAME="laundrygo"
WEB_ROOT="/var/www/${APP_NAME}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD=0

for arg in "$@"; do
  case "$arg" in
    --build) BUILD=1 ;;
    -h|--help) sed -n '2,13p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
fail() { printf '\n\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "Please run with sudo:  sudo bash deploy/setup-ec2.sh"

# ---- Detect OS --------------------------------------------------------------
. /etc/os-release
case "${ID}" in
  ubuntu|debian)  PKG="apt";  NGINX_USER="www-data" ;;
  amzn|rhel|centos|rocky|almalinux|fedora) PKG="dnf"; NGINX_USER="nginx" ;;
  *) fail "Unsupported OS '${ID}'. Use Ubuntu Server 24.04 LTS or Amazon Linux 2023." ;;
esac
log "Detected ${PRETTY_NAME:-$ID} (package manager: ${PKG})"

# ---- Install nginx ----------------------------------------------------------
log "Installing nginx"
if [[ "$PKG" == "apt" ]]; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y nginx
else
  dnf install -y nginx
fi

# ---- Optional: build on the server -----------------------------------------
if [[ $BUILD -eq 1 ]]; then
  log "Preparing to build on the server"

  # 1 GB instances need swap for the Vite build
  total_mem_mb=$(awk '/MemTotal/ {printf "%d", $2/1024}' /proc/meminfo)
  if [[ $total_mem_mb -lt 1800 ]]; then
    bash "${SCRIPT_DIR}/add-swap.sh" 2
  fi

  # Node.js 20 (Vite 5 needs Node 18+)
  need_node=1
  if command -v node >/dev/null 2>&1; then
    node_major=$(node -v | sed -E 's/^v([0-9]+).*/\1/')
    [[ "$node_major" -ge 18 ]] && need_node=0
  fi
  if [[ $need_node -eq 1 ]]; then
    log "Installing Node.js 20"
    if [[ "$PKG" == "apt" ]]; then
      apt-get install -y curl ca-certificates
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    else
      curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
      dnf install -y nodejs
    fi
  fi

  [[ -f "${PROJECT_DIR}/.env" ]] || fail "Missing ${PROJECT_DIR}/.env - copy .env.example to .env and fill in your Supabase values first."

  log "Installing dependencies and building (takes a few minutes on a micro instance)"
  # Build as the normal login user so node_modules is not owned by root
  RUN_AS=()
  if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
    RUN_AS=(sudo -u "${SUDO_USER}" -H)
  fi
  (cd "${PROJECT_DIR}" && "${RUN_AS[@]}" env NODE_OPTIONS="--max-old-space-size=768" npm ci --no-audit --no-fund)
  (cd "${PROJECT_DIR}" && "${RUN_AS[@]}" env NODE_OPTIONS="--max-old-space-size=768" npm run build)
fi

[[ -f "${PROJECT_DIR}/dist/index.html" ]] || fail "No dist/index.html found. Either use the zip as provided (it ships a pre-built dist/) or run with --build."

# ---- Publish site files -----------------------------------------------------
log "Publishing site to ${WEB_ROOT}"
mkdir -p "${WEB_ROOT}"
find "${WEB_ROOT}" -mindepth 1 -delete
cp -r "${PROJECT_DIR}/dist/." "${WEB_ROOT}/"
chown -R "${NGINX_USER}:${NGINX_USER}" "${WEB_ROOT}" 2>/dev/null || chown -R root:root "${WEB_ROOT}"
find "${WEB_ROOT}" -type d -exec chmod 755 {} +
find "${WEB_ROOT}" -type f -exec chmod 644 {} +

# ---- Configure nginx --------------------------------------------------------
log "Configuring nginx"
if [[ -f /etc/nginx/nginx.conf && ! -f /etc/nginx/nginx.conf.original ]]; then
  cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.original
fi
sed "s/__NGINX_USER__/${NGINX_USER}/" "${SCRIPT_DIR}/nginx-main.conf" > /etc/nginx/nginx.conf
mkdir -p /etc/nginx/conf.d
cp "${SCRIPT_DIR}/nginx-site.conf" "/etc/nginx/conf.d/${APP_NAME}.conf"

nginx -t
systemctl enable nginx
systemctl restart nginx

# ---- Verify -----------------------------------------------------------------
log "Verifying"
status=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ || true)
spa_status=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/track || true)
echo "  GET /       -> HTTP ${status}"
echo "  GET /track  -> HTTP ${spa_status}  (single-page-app fallback)"
[[ "$status" == "200" && "$spa_status" == "200" ]] || fail "Site did not respond correctly. Check: sudo tail -n 50 /var/log/nginx/error.log"

# ---- Print public URL (IMDSv2) ---------------------------------------------
TOKEN=$(curl -s -m 2 -X PUT "http://169.254.169.254/latest/api/token" \
        -H "X-aws-ec2-metadata-token-ttl-seconds: 60" || true)
PUBLIC_IP=""
if [[ -n "$TOKEN" ]]; then
  PUBLIC_IP=$(curl -s -m 2 -H "X-aws-ec2-metadata-token: ${TOKEN}" \
              http://169.254.169.254/latest/meta-data/public-ipv4 || true)
fi

printf '\n\033[1;32mDone!\033[0m  LaundryGo is live.\n'
if [[ -n "$PUBLIC_IP" ]]; then
  echo "  Open:  http://${PUBLIC_IP}"
  echo
  echo "  Next: add  http://${PUBLIC_IP}  and  http://${PUBLIC_IP}/**  to Supabase"
  echo "        (Authentication -> URL Configuration) so login e-mail links work."
else
  echo "  Open:  http://<your-instance-public-IP>"
fi
