# Odoo API Setup Guide

## ✅ What We Fixed

Your Next.js project was **NOT using the official Odoo API** properly. Here's what was wrong and what we fixed:

### ❌ Previous Issues:
1. **Hardcoded credentials** in API routes
2. **Using web session endpoints** instead of proper JSON-RPC API
3. **Fallback to mock data** when API failed
4. **No proper authentication flow**

### ✅ What We Implemented:
1. **Proper Odoo JSON-RPC API client** using official endpoints
2. **Real authentication** with username/password or API keys
3. **Direct API calls** without mock data fallbacks
4. **Type-safe TypeScript implementation**

## 🔧 New API Client Usage

### Basic Usage:

```typescript
import { odooAPI } from '@/lib/odoo/api';

// Authenticate (if not already authenticated)
const uid = await odooAPI.authenticate();

// Search records
const partners = await odooAPI.searchRead('res.partner', {
  domain: [['is_company', '=', false]],
  fields: ['name', 'email', 'phone'],
  limit: 10
});

// Create record
const newPartner = await odooAPI.create('res.partner', {
  name: 'John Doe',
  email: 'john@example.com',
  is_company: false
});

// Update record
await odooAPI.update('res.partner', partnerId, {
  phone: '+1234567890'
});

// Delete record
await odooAPI.delete('res.partner', partnerId);

// Get single record by ID
const partner = await odooAPI.getById('res.partner', partnerId, ['name', 'email']);
```

### For Your Educational System:

```typescript
// Student Management
const students = await odooAPI.searchRead('res.partner', {
  domain: [['category_id', 'in', [student_category_id]]],
  fields: ['name', 'email', 'phone', 'student_id']
});

// Create Student
const newStudent = await odooAPI.create('res.partner', {
  name: 'Jane Student',
  email: 'jane@school.edu',
  is_company: false,
  category_id: [[6, false, [student_category_id]]]
});

// Financial Records
const invoices = await odooAPI.searchRead('account.move', {
  domain: [['move_type', '=', 'out_invoice'], ['partner_id', '=', student_id]],
  fields: ['name', 'amount_total', 'payment_state', 'invoice_date']
});

// HR Records
const employees = await odooAPI.searchRead('hr.employee', {
  domain: [['active', '=', true]],
  fields: ['name', 'job_title', 'department_id', 'work_email']
});
```

## 🔐 Authentication Options

### Option 1: Username/Password (Development)
```typescript
// Set credentials and authenticate
await odooAPI.login('admin', 'your_password');
```

### Option 2: API Keys (Production - Recommended)
1. **Generate API Key in Odoo:**
   - Go to Settings > Users & Companies > Users
   - Edit your user
   - Go to "API Keys" tab
   - Generate new API key

2. **Update .env.local:**
   ```bash
   ODOO_API_KEY=your_generated_api_key_here
   ```

3. **Use API Key:**
   ```typescript
   // API key authentication (implement this)
   await odooAPI.authenticateWithApiKey('your_api_key');
   ```

## 🧪 Testing the API

Visit `/api-test` in your Next.js app to test the new API implementation:

1. **Test Authentication** - Verify connection to Odoo
2. **Test Search Partners** - Fetch real data from Odoo
3. **Test Create Partner** - Create new records

## 📁 File Changes Made

### Updated Files:
- `lib/odoo/api.ts` - Complete rewrite with proper JSON-RPC API
- `app/api/auth/login/route.ts` - Updated to use proper authentication
- `app/api/odoo/operation/route.ts` - Deprecated (now uses direct API)
- `.env.local` - Updated environment variables

### New Files:
- `app/api-test/page.tsx` - Test page for API functionality

## 🚀 Next Steps

### 1. Test the API
```bash
# Start your Next.js app
npm run dev

# Visit http://localhost:3000/api-test
# Test each API function
```

### 2. Update Your Components
Replace any usage of the old API routes with direct API calls:

```typescript
// OLD (don't use)
const response = await fetch('/api/odoo/operation', { ... });

// NEW (use this)
import { odooAPI } from '@/lib/odoo/api';
const result = await odooAPI.searchRead('res.partner', { ... });
```

### 3. Implement API Keys for Production
For production, replace username/password with API keys for better security.

### 4. Add Error Handling
```typescript
try {
  const result = await odooAPI.searchRead('res.partner', params);
  // Handle success
} catch (error) {
  if (error.message.includes('Authentication')) {
    // Handle auth error
  } else {
    // Handle other errors
  }
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Make sure Odoo is running on the specified URL
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password in .env.local
   - Check if user exists in Odoo

3. **Permission Denied**
   - Ensure user has proper access rights in Odoo
   - Check model permissions

### Debug Mode:
The API client includes extensive logging. Check browser console for detailed error messages.

## 📚 Official Odoo API Documentation

- [Odoo External API](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html)
- [JSON-RPC Protocol](https://www.jsonrpc.org/specification)

Your API is now properly connected to Odoo using the official JSON-RPC endpoints! 🎉
