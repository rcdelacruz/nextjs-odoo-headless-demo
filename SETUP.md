# Setup Guide for Next.js Odoo Headless Demo

This guide will help you set up the complete demo environment with both Odoo backend and Next.js frontend.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Start with Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/rcdelacruz/nextjs-odoo-headless-demo.git
cd nextjs-odoo-headless-demo
```

### 2. Start the Complete Stack
```bash
# Start Odoo + NextJS with Docker Compose
docker-compose -f docker-compose.demo.yml up -d
```

This will start:
- PostgreSQL database (port 5432)
- Odoo Community Edition (port 8069)
- Next.js frontend (port 3000)

### 3. Initialize Odoo Database

1. Wait for containers to start (check with `docker-compose -f docker-compose.demo.yml logs`)
2. Open http://localhost:8069
3. Create a new database:
   - Master Password: `admin`
   - Database Name: `odoo`
   - Email: `admin@demo.com`
   - Password: `admin`
   - Language: English
   - Country: Philippines
   - Load demonstration data: ✅ **Yes**

### 4. Access the Next.js Demo

1. Open http://localhost:3000
2. Login with:
   - Username: `admin@demo.com`
   - Password: `admin`

## Manual Setup (Development)

If you want to run each component separately for development:

### 1. Start Odoo Backend

```bash
# Create odoo directory
mkdir odoo-backend && cd odoo-backend

# Create docker-compose.yml for Odoo only
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=odoo
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo_password
      - POSTGRES_HOST_AUTH_METHOD=md5
    volumes:
      - odoo_db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  odoo:
    image: odoo:17.0
    depends_on:
      - db
    ports:
      - "8069:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo_password
    volumes:
      - odoo_web_data:/var/lib/odoo

volumes:
  odoo_db_data:
  odoo_web_data:
EOF

# Start Odoo
docker-compose up -d
```

### 2. Setup Next.js Frontend

```bash
# In the project root
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your Odoo settings
nano .env.local
```

Update `.env.local`:
```env
ODOO_BASE_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin@demo.com
ODOO_PASSWORD=admin
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Troubleshooting

### Odoo Database Issues

```bash
# Check Odoo logs
docker-compose -f docker-compose.demo.yml logs odoo

# Reset Odoo database
docker-compose -f docker-compose.demo.yml down -v
docker-compose -f docker-compose.demo.yml up -d
```

### Next.js Connection Issues

1. **CORS Errors**: Make sure Odoo is accessible from your Next.js app
2. **Authentication Errors**: Verify credentials in `.env.local`
3. **Network Issues**: Check if containers can communicate

```bash
# Test Odoo API
curl -X POST http://localhost:8069/web/session/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "db": "odoo",
      "login": "admin@demo.com",
      "password": "admin"
    }
  }'
```

### Common Issues

1. **Port Conflicts**: Change ports in docker-compose files if needed
2. **Memory Issues**: Ensure Docker has enough memory allocated
3. **Database Connection**: Wait for PostgreSQL to fully start before Odoo

## Production Deployment

### Environment Variables

For production, set these environment variables:

```env
# Odoo Configuration
ODOO_BASE_URL=https://your-odoo-domain.com
ODOO_DATABASE=your_production_db
ODOO_USERNAME=your_odoo_user
ODOO_PASSWORD=your_secure_password

# Next.js Configuration
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-nextjs-domain.com
```

### Docker Production Build

```bash
# Build production image
docker build -t nextjs-odoo-demo .

# Run production container
docker run -p 3000:3000 \
  -e ODOO_BASE_URL=https://your-odoo.com \
  -e ODOO_DATABASE=production_db \
  -e ODOO_USERNAME=api_user \
  -e ODOO_PASSWORD=secure_password \
  nextjs-odoo-demo
```

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Next Steps

1. **Add Custom Odoo Modules**: Create school-specific addons
2. **Extend Frontend Features**: Add more CRUD operations
3. **Implement Real-time Updates**: Use WebSockets or polling
4. **Add Authentication**: Implement proper session management
5. **Performance Optimization**: Add caching and optimization

## Support

For issues and questions:
- Check the [GitHub Issues](https://github.com/rcdelacruz/nextjs-odoo-headless-demo/issues)
- Review Odoo documentation
- Check Next.js documentation