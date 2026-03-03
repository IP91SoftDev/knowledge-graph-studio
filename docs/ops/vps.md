# VPS Operations Guide

**Version:** 1.0
**Applies To:** Linux VPS deployments (Ubuntu 22.04+, Debian 12+)

---

## System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Disk | 20 GB | 40+ GB SSD |
| File Descriptors | 8192 | 65535 |

---

## Critical: File Descriptor Limits

Next.js + Turborepo + Vite watch modes require high file descriptor limits.

### Problem

Default `ulimit -n` is often 1024, causing:
```
Error: accept: Too many open files
```

### Quick Check

```bash
# Run the project's ulimit check
cd /path/to/knowledge-graph-studio
pnpm ops:check

# Or manual check
ulimit -n  # Should show >= 8192 (minimum), 65535 (recommended)
```

### Solution: Permanent System-Wide Fix

**1. Edit systemd user config:**
```bash
sudo mkdir -p /etc/systemd/user.conf.d/
sudo tee /etc/systemd/user.conf.d/limits.conf << 'EOF'
[Manager]
DefaultLimitNOFILE=65535
EOF
```

**2. Edit systemd system config:**
```bash
sudo mkdir -p /etc/systemd/system.conf.d/
sudo tee /etc/systemd/system.conf.d/limits.conf << 'EOF'
[Manager]
DefaultLimitNOFILE=65535
EOF
```

**3. Update PAM limits:**
```bash
sudo tee -a /etc/security/limits.conf << 'EOF'
* soft nofile 65535
* hard nofile 65535
root soft nofile 65535
root hard nofile 65535
EOF
```

**4. Apply changes:**
```bash
# Option A: Reboot (recommended)
sudo reboot

# Option B: Logout and login again (may not work for all sessions)
```

**5. Verify after reboot:**
```bash
ulimit -n  # Should show 65535
```

---

## For Running Processes (Without Reboot)

If you need to increase limits for an already-running process:

```bash
# Find PID of node process
pgrep -f "next dev"

# Increase limit for running process (requires root)
sudo prlimit --pid <PID> --nofile=65535:65535

# Note: This is temporary. Process will revert on restart.
# Use permanent fix above for production.
```

---

## Development Mode on VPS

### Option A: Turbo Watch (Default)

```bash
pnpm dev
```

**Requirements:**
- ulimit -n >= 65535
- At least 4 GB RAM
- SSD storage recommended

**If watch fails:**
```bash
# Check file descriptor usage
lsof -p $(pgrep -f "next dev") | wc -l

# If near limit, increase ulimit
ulimit -n 65535
```

### Option B: Reduced Watch Mode

Disable some watchers to reduce file handles:

```bash
# In next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.git', '**/.next']
    };
    return config;
  },
};
```

### Option C: Build + Preview (Production-Like)

```bash
pnpm -C apps/web build
pnpm -C apps/web start
```

Lower resource usage, no watch overhead.

---

## Production Deployment

### Systemd Service

```bash
sudo tee /etc/systemd/system/knowledge-graph-studio.service << 'EOF'
[Unit]
Description=Knowledge Graph Studio
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/knowledge-graph-studio
Environment=NODE_ENV=production
EnvironmentFile=/opt/knowledge-graph-studio/.env.production
ExecStart=/usr/bin/pnpm -C apps/web start
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable knowledge-graph-studio
sudo systemctl start knowledge-graph-studio
```

### Environment File

```bash
# /opt/knowledge-graph-studio/.env.production
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DAILY_AI_BUDGET=5.00
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Monitoring

### Check Service Status
```bash
systemctl status knowledge-graph-studio
journalctl -u knowledge-graph-studio -f
```

### Check File Descriptors
```bash
# System-wide
cat /proc/sys/fs/file-nr

# Per process
cat /proc/$(pgrep -f "next start")/limits | grep "open files"
```

### Check Memory
```bash
free -h
ps aux --sort=-%mem | head -10
```

---

## Troubleshooting

### "Too many open files"

**Immediate fix:**
```bash
ulimit -n 65535
```

**Permanent fix:**
```bash
# Follow "Solution: Permanent System-Wide Fix" above
# Then reboot
sudo reboot
```

**Verify fix applied:**
```bash
ulimit -n  # Should show 65535
```

### "Cannot find module"
```bash
# Clean and reinstall
rm -rf node_modules apps/web/node_modules packages/*/node_modules
pnpm install
```

### "Port already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

### High Memory Usage
```bash
# Reduce Next.js workers
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=2048"

# Or use build + start instead of dev
pnpm -C apps/web build
pnpm -C apps/web start
```

---

## Security Hardening

### Firewall (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### SSL (Caddy - Auto HTTPS)
```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Caddyfile
sudo tee /etc/caddy/Caddyfile << 'EOF'
your-domain.com {
    reverse_proxy localhost:3000
}
EOF

sudo systemctl reload caddy
```

---

## Version Compatibility

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | >= 20.0.0 | LTS recommended (20.x, 22.x) |
| pnpm | >= 9.0.0 | Package manager |
| Turbo | 2.0.6 | Pinned (v2+ uses `tasks` not `pipeline`) |
| Next.js | 14.1.0 | Compatible with Node 20+ |
| ESLint | 8.57.0 | Compatible with Next.js 14 |

**Note:** ESLint 9.x may have compatibility issues with Next.js 14. Use ESLint 8.x until Next.js 15.

---

**Last Updated:** 2026-03-02
**Next Review:** After first production deployment
