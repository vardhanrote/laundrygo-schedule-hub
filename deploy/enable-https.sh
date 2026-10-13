#!/usr/bin/env bash
# =============================================================================
# OPTIONAL: free HTTPS (Let's Encrypt) for LaundryGo.
# Only works if you own a domain (or a free subdomain such as DuckDNS) whose
# DNS A-record already points at this instance's public IP, and port 443 is
# open in the EC2 security group.
#
# Usage:  sudo bash deploy/enable-https.sh your.domain.com you@example.com
# =============================================================================
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"
CONF="/etc/nginx/conf.d/laundrygo.conf"

[[ $EUID -eq 0 ]] || { echo "Run with sudo." >&2; exit 1; }
[[ -n "$DOMAIN" && -n "$EMAIL" ]] || { echo "Usage: sudo bash deploy/enable-https.sh <domain> <email>" >&2; exit 1; }
[[ -f "$CONF" ]] || { echo "Run deploy/setup-ec2.sh first." >&2; exit 1; }

. /etc/os-release
if [[ "$ID" == "ubuntu" || "$ID" == "debian" ]]; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y certbot python3-certbot-nginx
else
  dnf install -y certbot python3-certbot-nginx
fi

# certbot's nginx plugin matches on server_name
sed -i "s/server_name .*;/server_name ${DOMAIN};/" "$CONF"
nginx -t
systemctl reload nginx

certbot --nginx -d "$DOMAIN" -m "$EMAIL" --agree-tos --no-eff-email --redirect --non-interactive

echo
echo "HTTPS enabled: https://${DOMAIN}"
echo "Certificates renew automatically (certbot installs a timer). Test with: sudo certbot renew --dry-run"
echo "Remember to add https://${DOMAIN} and https://${DOMAIN}/** to Supabase -> Authentication -> URL Configuration."
