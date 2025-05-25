# Next.js Odoo Headless Demo

A demo application showing how to use Next.js as a frontend for Odoo Community Edition running as a headless ERP backend.

## 🚀 Features

- **Headless Odoo Integration**: Connect to Odoo via REST API
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Login/logout with Odoo user credentials
- **Student Management**: CRUD operations for students
- **Partner Management**: Manage customers and suppliers
- **Real-time Data**: Live connection to Odoo database
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Prerequisites

1. **Running Odoo Instance**: You need Odoo Community Edition running (see docker-compose setup)
2. **Node.js**: Version 18 or higher
3. **npm/yarn**: Package manager

## 📋 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/rcdelacruz/nextjs-odoo-headless-demo.git
cd nextjs-odoo-headless-demo
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Odoo configuration:
```env
ODOO_BASE_URL=http://localhost:8069
ODOO_DATABASE=your_school_db
ODOO_USERNAME=admin@yourschool.com
ODOO_PASSWORD=your_admin_password
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Project Structure

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

## 🔌 Odoo API Integration

The app connects to Odoo using:
- **REST API**: For standard CRUD operations
- **JSON-RPC**: For authentication and complex queries
- **XML-RPC**: For legacy operations (optional)

### Key API Services:
- `OdooAuthService`: Handle login/logout
- `OdooAPIService`: CRUD operations
- `StudentService`: Student-specific operations
- `PartnerService`: Customer/supplier management

## 📱 Demo Features

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

## 🔧 Configuration

### Odoo Setup
Make sure your Odoo instance has:
1. **REST API enabled**
2. **CORS configured** for localhost:3000
3. **Database created** with demo data
4. **User credentials** for API access

### Development Settings
```typescript
// lib/odoo/config.ts
export const ODOO_CONFIG = {
  baseURL: process.env.ODOO_BASE_URL,
  database: process.env.ODOO_DATABASE,
  timeout: 10000,
}
```

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
vercel deploy
```

### Docker Deployment
```bash
docker build -t nextjs-odoo-demo .
docker run -p 3000:3000 nextjs-odoo-demo
```

## 🛡️ Security Considerations

- **Environment Variables**: Never expose Odoo credentials in client-side code
- **API Routes**: Use Next.js API routes to proxy Odoo requests
- **Authentication**: Implement proper session management
- **CORS**: Configure Odoo CORS settings properly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

For questions and support:
- Open an issue on GitHub
- Check the Odoo documentation
- Review the Next.js guides

---

**Built with ❤️ for the Odoo and Next.js communities**
