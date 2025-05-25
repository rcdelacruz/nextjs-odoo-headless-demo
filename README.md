# Next.js Odoo Headless Demo

A professional demonstration application showing how to use Next.js as a frontend for Odoo Community Edition running as a headless ERP backend.

## Features

- **Headless Odoo Integration**: Connect to Odoo via REST API
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Login/logout with Odoo user credentials
- **Student Management**: CRUD operations for students
- **Partner Management**: Manage customers and suppliers
- **Real-time Data**: Live connection to Odoo database
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

1. **Running Odoo Instance**: You need Odoo Community Edition running
2. **Node.js**: Version 18 or higher
3. **npm/yarn**: Package manager

## Quick Start

### Method 1: Use Your Existing Odoo (Recommended)

If you already have Odoo running:

```bash
# 1. Clone the repository
git clone https://github.com/rcdelacruz/nextjs-odoo-headless-demo.git
cd nextjs-odoo-headless-demo

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local

# 4. Edit .env.local with your Odoo settings
nano .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_ODOO_BASE_URL=http://localhost:8069
NEXT_PUBLIC_ODOO_DATABASE=test
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

```bash
# 5. Start the Next.js app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with your Odoo credentials.

### Method 2: Complete Stack with Docker

If you want to start everything from scratch:

```bash
# 1. Clone the repository
git clone https://github.com/rcdelacruz/nextjs-odoo-headless-demo.git
cd nextjs-odoo-headless-demo

# 2. Start Odoo with Docker
mkdir odoo-demo && cd odoo-demo

# 3. Create docker-compose for Odoo
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=odoo
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo123
      - POSTGRES_HOST_AUTH_METHOD=md5
    volumes:
      - odoo_db_data:/var/lib/postgresql/data

  odoo:
    image: odoo:17.0
    depends_on:
      - db
    ports:
      - "8069:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo123
    volumes:
      - odoo_web_data:/var/lib/odoo

volumes:
  odoo_db_data:
  odoo_web_data:
EOF

# 4. Start Odoo
docker-compose up -d

# 5. Setup Next.js
cd ..
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_ODOO_BASE_URL=http://localhost:8069
NEXT_PUBLIC_ODOO_DATABASE=odoo_demo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

```bash
npm run dev
```

### Setting Up Odoo Database

1. Open http://localhost:8069
2. Create database:
   - Master Password: `admin`
   - Database Name: Match your .env.local setting
   - Email: `admin@demo.com`
   - Password: `admin`
   - Load demo data: **Yes**

3. Open http://localhost:3000 and login with your Odoo credentials

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI components
│   └── forms/           # Form components
├── lib/                 # Utilities and services
│   ├── odoo/           # Odoo API service
│   ├── store/          # Zustand store
│   └── utils/          # Helper functions
└── types/              # TypeScript types
```

## API Integration

The app connects to Odoo using:
- **REST API**: For standard CRUD operations
- **JSON-RPC**: For authentication and complex queries

### Key API Services:
- `OdooAuthService`: Handle login/logout
- `OdooAPIService`: CRUD operations
- `StudentService`: Student-specific operations
- `PartnerService`: Customer/supplier management

## Demo Features

### 1. Authentication
- Login with Odoo credentials
- Session management
- Logout functionality

### 2. Dashboard
- Overview of key metrics
- Recent activities
- Quick actions

### 3. Student Management
- List all students
- Add new students
- Edit student information
- View student details

### 4. Partner Management
- Customer/supplier listing
- Contact information
- Business details

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t nextjs-odoo-demo .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ODOO_BASE_URL=http://your-odoo.com \
  -e NEXT_PUBLIC_ODOO_DATABASE=your_db \
  -e ODOO_USERNAME=your_user \
  -e ODOO_PASSWORD=your_password \
  nextjs-odoo-demo
```

## Security Considerations

- **Environment Variables**: Never expose Odoo credentials in client-side code
- **API Routes**: Use Next.js API routes to proxy Odoo requests
- **Authentication**: Implement proper session management
- **CORS**: Configure Odoo CORS settings properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions and support:
- Open an issue on GitHub
- Check the [SETUP.md](SETUP.md) for detailed setup instructions
- Review the [FEATURES.md](FEATURES.md) for feature documentation

---

**Built for professional ERP integration demonstrations**
