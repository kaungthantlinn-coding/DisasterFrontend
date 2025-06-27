# Disaster Management Frontend

A modern React application for disaster management with Google OAuth integration, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Email/Password Login**: Traditional authentication with form validation
- **Google OAuth 2.0**: Secure Google Sign-In integration
- **Protected Routes**: Role-based access control
- **Token Management**: Automatic token refresh and secure storage
- **Session Persistence**: Maintain login state across browser sessions

### User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages and recovery
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized with React Query and lazy loading

### Developer Experience
- **TypeScript**: Full type safety and IntelliSense
- **Testing**: Comprehensive test suite with Vitest
- **Error Tracking**: Advanced error monitoring and analytics
- **Code Quality**: ESLint, Prettier, and best practices
- **Documentation**: Extensive guides and examples

## 📋 Prerequisites

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher
- **Google Cloud Console**: For OAuth configuration
- **Backend API**: Compatible disaster management API

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DisasterFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_APP_NAME=Disaster Management
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── __tests__/      # Component tests
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useLogin.ts     # Login functionality
│   └── useGoogleLogin.ts # Google OAuth hook
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login page
│   └── Dashboard.tsx   # Dashboard page
├── services/           # API services
│   ├── api.ts          # Axios configuration
│   └── authService.ts  # Authentication API
├── store/              # State management
│   └── authStore.ts    # Authentication store
├── utils/              # Utility functions
│   └── errorHandler.ts # Error handling utilities
├── types/              # TypeScript definitions
└── test/               # Test configuration
```

## 🔧 Configuration

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API

2. **Configure OAuth Consent Screen**
   - Set application name and logo
   - Add authorized domains
   - Configure scopes (email, profile)

3. **Create OAuth 2.0 Credentials**
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized origins: `http://localhost:5173`
   - Copy Client ID to `.env` file

For detailed setup instructions, see [GOOGLE_LOGIN_SETUP.md](./GOOGLE_LOGIN_SETUP.md)

### Backend API Requirements

The frontend expects the following API endpoints:

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/google
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
GET  /api/auth/google/client-id

// Users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Structure

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing
- **API Tests**: Service layer testing

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Production environment variables:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your-production-client-id
VITE_APP_NAME=Disaster Management
VITE_APP_VERSION=1.0.0
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for disaster management and emergency response**
