# Domain Setup Guide for naijascout.app

## ✅ Configuration Complete

Your application has been configured for **naijascout.app**. Follow these steps to deploy:

---

## 1. DNS Configuration

Point your domain to your server:

### At your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):

**A Records:**
```
Type: A
Host: @
Value: YOUR_SERVER_IP
TTL: Automatic

Type: A
Host: www
Value: YOUR_SERVER_IP
TTL: Automatic
```

**Verify DNS propagation:**
```bash
nslookup naijascout.app
```

---

## 2. Server Setup

### Initial deployment (without SSL):

```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps
```

### Access your app:
- Frontend: http://naijascout.app
- Backend API: http://naijascout.app/api

---

## 3. SSL Certificate Setup (HTTPS)

### Option A: Using Certbot with Docker (Recommended)

1. **First, get the SSL certificate:**
```bash
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d naijascout.app \
  -d www.naijascout.app
```

2. **Switch to production config with SSL:**
```bash
# Stop current containers
docker-compose down

# Start with SSL-enabled config
docker-compose -f docker-compose.prod.yml up -d --build
```

3. **Certificate auto-renewal is configured** - Certbot will renew automatically every 12 hours.

### Option B: Using Cloudflare (Easiest)

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Enable "Proxied" status (orange cloud) for DNS records
4. In Cloudflare SSL/TLS settings:
   - Set to "Flexible" or "Full"
   - Enable "Always Use HTTPS"

---

## 4. Production Checklist

### Security:
- [ ] Change `JWT_SECRET` in docker-compose files
- [ ] Set strong MongoDB password in `docker-compose.prod.yml`
- [ ] Enable firewall (allow ports 80, 443, 22 only)
- [ ] Set up regular backups for MongoDB data

### Environment Variables:
```bash
# Backend (.env or docker-compose)
NODE_ENV=production
MONGODB_URI=mongodb://admin:secure-password@mongo:27017/naijascout?authSource=admin
JWT_SECRET=your-very-long-random-secret-key-here
CORS_ORIGIN=https://naijascout.app

# Frontend (.env)
VITE_API_URL=https://naijascout.app/api
```

### Testing:
```bash
# Test API health
curl https://naijascout.app/api/health

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 5. Deployment Commands

### Build and deploy:
```bash
# Without SSL (initial setup)
docker-compose up -d --build

# With SSL (after certificate)
docker-compose -f docker-compose.prod.yml up -d --build
```

### Update application:
```bash
git pull
docker-compose down
docker-compose up -d --build
```

### View logs:
```bash
docker-compose logs -f
```

### Backup database:
```bash
docker exec -it <mongo-container-id> mongodump --out /data/backup
```

---

## Files Updated:

1. ✅ `docker-compose.yml` - Set CORS_ORIGIN to https://naijascout.app
2. ✅ `docker/nginx.conf` - Set server_name to naijascout.app
3. ✅ `.env` - Set VITE_API_URL to https://naijascout.app/api
4. ✅ `docker/nginx-ssl.conf` - SSL-enabled nginx config (NEW)
5. ✅ `docker-compose.prod.yml` - Production docker-compose with SSL (NEW)

---

## Quick Start

### If you have a server with Docker installed:

1. **Set DNS records** to point to your server IP
2. **Wait for DNS propagation** (5-30 minutes)
3. **Deploy without SSL first:**
   ```bash
   docker-compose up -d --build
   ```
4. **Test**: http://naijascout.app
5. **Add SSL certificate** (see Option A above)
6. **Redeploy with SSL:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

---

## Troubleshooting

### DNS not resolving:
```bash
# Check DNS
nslookup naijascout.app

# Wait for propagation (can take up to 24 hours)
```

### SSL certificate fails:
- Ensure DNS is pointing to your server
- Port 80 must be open and accessible
- Domain must be publicly accessible

### CORS errors:
- Verify CORS_ORIGIN matches your domain exactly
- No trailing slashes in CORS_ORIGIN
- Restart backend after changes

### Can't access API:
```bash
# Check backend logs
docker-compose logs backend

# Verify backend is running
docker-compose ps

# Test backend directly
curl http://localhost:5000/api/health
```

---

## Need Help?

- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Clean rebuild: `docker-compose down && docker-compose up -d --build`
