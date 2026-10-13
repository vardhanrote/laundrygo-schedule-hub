# Deploying LaundryGo on AWS EC2 (Free Tier)

LaundryGo is a static React (Vite) single-page app. All data and login are handled by **Supabase**, so the
EC2 server only has to serve files. That keeps it tiny: **one `t3.micro`/`t2.micro` + nginx, no database, no
load balancer, nothing that costs money.**

This zip already contains a **pre-built `dist/` folder**, so the server does not need Node.js or much RAM.

---

## 0. Know your free-tier type (30 seconds)

AWS changed the Free Tier on 15 July 2025. Which one you have depends on when your account was created:

| Account created | What you get | Eligible EC2 types |
|---|---|---|
| **Before 15 Jul 2025** | Usage limits for 12 months | `t2.micro`, `t3.micro` |
| **On/after 15 Jul 2025** | $100 sign-up credit + up to $100 more, valid 6 months or until used | `t3.micro`, `t3.small`, `t4g.micro`, `t4g.small`, `c7i-flex.large`, `m7i-flex.large` |

Source: [AWS EC2 Free Tier docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html).
**Rule of thumb:** in the launch wizard, only pick an instance type and AMI that carry the **"Free tier eligible"** label.
Check your own account under **Billing and Cost Management -> Free Tier**.

---

## 1. Launch the instance (AWS Console -> EC2 -> Launch instance)

| Setting | Value |
|---|---|
| Name | `laundrygo` |
| AMI | **Ubuntu Server 24.04 LTS** (marked *Free tier eligible*) |
| Instance type | **`t3.micro`** (or `t2.micro` on older accounts) - *Free tier eligible* label must show |
| Key pair | Create new -> RSA, `.pem` -> download and keep safe |
| Network / Security group | Create new with the rules below |
| Storage | **8 GiB gp3** (default). Free tier covers up to 30 GB - do not go above that |
| Instances | **1** |

**Security group rules**

| Type | Port | Source |
|---|---|---|
| SSH | 22 | **My IP** (not 0.0.0.0/0) |
| HTTP | 80 | Anywhere (0.0.0.0/0) |
| HTTPS | 443 | Anywhere (only needed if you enable HTTPS later) |

Click **Launch instance** and wait until the status is *Running*. Copy the **Public IPv4 address**.

---

## 2. Upload the project

From your own computer (Windows PowerShell / macOS / Linux terminal), in the folder containing the zip and your `.pem` key:

```bash
scp -i your-key.pem laundrygo-schedule-hub-ec2.zip ubuntu@<PUBLIC_IP>:~
ssh -i your-key.pem ubuntu@<PUBLIC_IP>
```

(On Windows you can also use the EC2 Console's **Connect -> EC2 Instance Connect** button for the shell, and upload with WinSCP.)

---

## 3. Run the one-command setup (on the server)

```bash
sudo apt-get update && sudo apt-get install -y unzip
unzip laundrygo-schedule-hub-ec2.zip
cd laundrygo-schedule-hub
sudo bash deploy/setup-ec2.sh
```

The script installs nginx, publishes `dist/` to `/var/www/laundrygo`, sets up page-refresh routing for
`/track`, `/book`, etc., enables nginx on reboot, tests the site and prints your URL.

Open **`http://<PUBLIC_IP>`** in the browser.

---

## 4. Allow your new URL in Supabase (important for login)

Sign-up confirmation links use the site's own address, so Supabase must trust it:

1. Supabase dashboard -> your project -> **Authentication -> URL Configuration**
2. Set **Site URL** to `http://<PUBLIC_IP>` (or keep your Vercel/Lovable URL if you still use it)
3. Under **Redirect URLs** add `http://<PUBLIC_IP>` and `http://<PUBLIC_IP>/**`

Without this, e-mail sign-in links may send people to the old site.

---

## 5. Updating the site later

**Option A - rebuild on your computer (fastest):**
```bash
npm ci && npm run build            # on your PC
scp -i your-key.pem -r dist ubuntu@<PUBLIC_IP>:~/laundrygo-schedule-hub/
ssh -i your-key.pem ubuntu@<PUBLIC_IP> "cd laundrygo-schedule-hub && sudo bash deploy/setup-ec2.sh"
```

**Option B - build on the server** (after replacing the source files): 
```bash
sudo bash deploy/setup-ec2.sh --build
```
This automatically adds 2 GB of swap and installs Node 20 so a 1 GB instance can build. Requires the `.env` file (copy `.env.example`).

---

## 6. Optional: free HTTPS

You need a domain (or a free subdomain, e.g. from DuckDNS) pointing to the instance IP, and port 443 open:

```bash
sudo bash deploy/enable-https.sh your.domain.com you@example.com
```

Let's Encrypt certificates are free and renew automatically. (Avoid Route 53 hosted zones - they cost ~$0.50/month.)

---

## 7. Optional: Docker instead of host nginx

```bash
sudo bash deploy/add-swap.sh                 # needed to build on 1 GB RAM
# install Docker (Ubuntu): sudo apt-get install -y docker.io docker-compose-v2 && sudo usermod -aG docker $USER  (re-login)
docker compose up -d --build
```

The host-nginx path in step 3 is simpler and lighter; use Docker only if you prefer containers.

---

## 8. Staying at $0 - checklist

- [ ] Only **one** instance, and it is a *Free tier eligible* type
- [ ] EBS volume **<= 30 GB**; delete unused volumes and snapshots
- [ ] **Do not** add: NAT Gateway, Load Balancer, RDS, Elastic IP you don't attach, extra instances
- [ ] Create a **Zero-spend budget**: Billing -> Budgets -> Create budget -> *Zero spend budget* (e-mails you the moment any charge appears)
- [ ] Check **Billing -> Free Tier** page now and then for usage vs. limits
- [ ] The instance's public IP changes if you **stop/start** it (that's fine - just update the Supabase URLs). An Elastic IP avoids this but is a billable resource if left unattached, so skip it unless you need it
- [ ] When finished: **Terminate** the instance (stopping still keeps the EBS volume allocated)
- [ ] Outbound data: the site is ~1 MB per visit (gzip enabled), far below the monthly allowance for a demo/college project

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| Browser times out | Security group is missing the **HTTP 80** rule (Step 1) |
| 403 / 404 on every page | `sudo bash deploy/setup-ec2.sh` again; check `ls /var/www/laundrygo` shows `index.html` |
| Works on `/` but 404 on refresh of `/track` | Re-run setup script (installs the SPA fallback) |
| Login / sign-up e-mail goes to the wrong site | Step 4 - fix Supabase URL Configuration |
| App loads but data/login fails | Check `.env` Supabase values were correct when `dist/` was built; rebuild (Step 5) |
| `--build` fails with out-of-memory | `sudo bash deploy/add-swap.sh 3` then retry |
| Anything else | `sudo nginx -t` and `sudo tail -n 50 /var/log/nginx/error.log` |

---

## What was added to the project

| File | Purpose |
|---|---|
| `dist/` | Production build, ready to serve |
| `deploy/setup-ec2.sh` | One-command server setup (nginx + publish + verify) |
| `deploy/nginx-main.conf`, `deploy/nginx-site.conf` | nginx configuration (SPA routing, gzip, caching, security headers) |
| `deploy/add-swap.sh` | Swap file so 1 GB instances can build |
| `deploy/enable-https.sh` | Optional free HTTPS via Let's Encrypt |
| `Dockerfile`, `docker-compose.yml`, `deploy/nginx-docker.conf`, `.dockerignore` | Optional container deployment |
| `.env.example` | Template for the three Supabase variables |
| `DEPLOY_EC2.md` | This guide |
