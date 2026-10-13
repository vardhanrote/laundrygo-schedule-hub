#!/usr/bin/env bash
# Adds a swap file so builds do not run out of memory on a 1 GB free-tier instance.
# Usage: sudo bash deploy/add-swap.sh [size_in_GB]   (default 2)
# Uses only the instance's EBS volume (free tier includes up to 30 GB of EBS).
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Please run with sudo: sudo bash deploy/add-swap.sh" >&2
  exit 1
fi

SIZE_GB="${1:-2}"

if [[ -n "$(swapon --show --noheadings)" ]]; then
  echo "Swap is already active - nothing to do."
  swapon --show
  exit 0
fi

echo "Creating ${SIZE_GB} GB swap file at /swapfile ..."
dd if=/dev/zero of=/swapfile bs=1M count=$((SIZE_GB * 1024)) status=none
chmod 600 /swapfile
mkswap /swapfile >/dev/null
swapon /swapfile
grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab

echo "Swap enabled:"
swapon --show
