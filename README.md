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

### Writing Tests

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: expect.any(String)
    });
  });
});
```

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

### Deployment Platforms

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📊 Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: WebP format and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker and HTTP caching

### Performance Monitoring

```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Bundle Analysis

```bash
npm run build
npx vite-bundle-analyzer dist
```

## 🔒 Security

### Security Features

- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: HttpOnly cookies for tokens
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error messages

### Security Best Practices

1. **Never expose sensitive data in client-side code**
2. **Use HTTPS in production**
3. **Implement proper CORS policies**
4. **Validate all user inputs**
5. **Use secure authentication flows**

## 🐛 Troubleshooting

### Common Issues

#### Google Login Not Working

```bash
# Check console for errors
# Verify client ID in .env
# Ensure domain is authorized in Google Console
```

#### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### API Connection Issues

```bash
# Verify API URL in .env
# Check CORS configuration
# Test API endpoints manually
```

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('debug', 'true');

// View React Query cache
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

## 📚 Documentation

### Additional Guides

- [Google Login Setup](./GOOGLE_LOGIN_SETUP.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)
- [Code Quality Guide](./CODE_QUALITY_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

### API Reference

#### Authentication Hooks

```typescript
// Login hook
const { mutate: login, isLoading, error } = useLogin();

// Google login hook
const { mutate: googleLogin } = useGoogleLogin();

// Auth state hook
const { user, isAuthenticated, logout } = useAuth();
```

#### Error Handling

```typescript
// Error handler hook
const { handleError, trackAction } = useErrorHandler();

// Error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test**: `npm test`
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **Conventional Commits**: Commit message format
- **Testing**: Minimum 80% coverage

### Pull Request Guidelines

- Include tests for new features
- Update documentation
- Follow existing code style
- Add changeset for releases
- Ensure CI passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check guides in `/docs`
- **Issues**: Create GitHub issue
- **Discussions**: GitHub discussions
- **Email**: support@yourdomain.com

### Reporting Bugs

When reporting bugs, please include:

1. **Environment details** (OS, Node version, browser)
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Error messages and logs**
5. **Screenshots if applicable**

## 🎯 Roadmap

### Upcoming Features

- [ ] Multi-factor authentication
- [ ] Real-time notifications
- [ ] Offline support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Internationalization (i18n)
- [ ] Dark mode theme

### Version History

- **v1.0.0**: Initial release with Google OAuth
- **v0.9.0**: Beta release with core features
- **v0.8.0**: Alpha release with basic authentication

---

**Built with ❤️ for disaster management and emergency response**

## Project Structure

```
DisasterApp/
├── DisasterApp.Application/     # Application layer (DTOs, Services, Interfaces)
├── DisasterApp.Infrastructure/   # Infrastructure layer (Data, Repositories, Migrations)
├── DisasterApp.WebApi/          # Web API layer (Controllers, Program.cs)
├── DisasterApp.Tests/           # Unit and integration tests
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code
- Google Cloud Console account (for OAuth setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DisasterApp
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   
   Edit `DisasterApp.WebApi/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DisasterAppDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Run database migrations**
   ```bash
   cd DisasterApp.WebApi
   dotnet ef database update
   ```

5. **Configure Google OAuth (see Google OAuth Setup section below)**

6. **Run the application**
   ```bash
   cd DisasterApp.WebApi
   dotnet run
   ```

   The API will be available at `http://localhost:5057`

## Google OAuth 2.0 Integration

### Backend Setup

The application includes complete Google OAuth 2.0 integration with the following components:

#### 1. NuGet Packages
- `Microsoft.AspNetCore.Authentication.Google` - ASP.NET Core Google authentication
- `Google.Apis.Auth` - Google ID token verification

#### 2. Configuration

Add Google OAuth credentials to `appsettings.json`:

```json
{
  "GoogleAuth": {
    "ClientId": "your-google-client-id.apps.googleusercontent.com",
    "ClientSecret": "your-google-client-secret"
  }
}
```

#### 3. API Endpoints

- `POST /api/auth/google-login` - Google OAuth login endpoint
- `GET /api/config/google-client-id` - Get Google Client ID for frontend

#### 4. Authentication Flow

1. Frontend receives Google ID token from Google Sign-In
2. Token is sent to `/api/auth/google-login` endpoint
3. Backend verifies token with Google
4. User is created/updated in database
5. JWT access and refresh tokens are returned

### Google Cloud Console Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:5057` (for development)
     - Your production domain
   - Add authorized redirect URIs (if needed)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `appsettings.json`

### Frontend Integration

#### Vanilla JavaScript (Included)

The project includes a complete vanilla JavaScript implementation:

- **Files**: `DisasterApp.WebApi/wwwroot/index.html`, `script.js`
- **Features**: Google Sign-In buttons, automatic token handling, UI updates
- **Setup**: No additional configuration needed

#### React TypeScript Integration

For React applications, use the following setup:

##### Dependencies

```bash
npm install @tanstack/react-query axios zustand
npm install -D @types/google-one-tap
```

##### Environment Variables

```env
# .env.local
REACT_APP_API_BASE_URL=http://localhost:5057/api
```

##### Key Components

1. **Axios Client with Interceptors**
   ```typescript
   // src/lib/api-client.ts
   import axios from 'axios';
   import { useAuthStore } from '../stores/auth-store';
   
   const apiClient = axios.create({
     baseURL: process.env.REACT_APP_API_BASE_URL,
   });
   
   // Request interceptor for auth token
   apiClient.interceptors.request.use((config) => {
     const token = useAuthStore.getState().accessToken;
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   
   // Response interceptor for token refresh
   apiClient.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         const { refreshToken, setTokens, logout } = useAuthStore.getState();
         if (refreshToken) {
           try {
             const response = await axios.post('/auth/refresh', { refreshToken });
             setTokens(response.data.accessToken, response.data.refreshToken);
             return apiClient.request(error.config);
           } catch {
             logout();
           }
         }
       }
       return Promise.reject(error);
     }
   );
   ```

2. **Zustand Auth Store**
   ```typescript
   // src/stores/auth-store.ts
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';
   
   interface AuthState {
     accessToken: string | null;
     refreshToken: string | null;
     user: User | null;
     isAuthenticated: boolean;
     setTokens: (accessToken: string, refreshToken: string) => void;
     setUser: (user: User) => void;
     logout: () => void;
   }
   
   export const useAuthStore = create<AuthState>()()
     persist(
       (set) => ({
         accessToken: null,
         refreshToken: null,
         user: null,
         isAuthenticated: false,
         setTokens: (accessToken, refreshToken) =>
           set({ accessToken, refreshToken, isAuthenticated: true }),
         setUser: (user) => set({ user }),
         logout: () =>
           set({
             accessToken: null,
             refreshToken: null,
             user: null,
             isAuthenticated: false,
           }),
       }),
       { name: 'auth-storage' }
     )
   );
   ```

3. **Google Login Hook**
   ```typescript
   // src/hooks/use-google-login.ts
   import { useMutation } from '@tanstack/react-query';
   import { googleLogin } from '../api/auth-api';
   import { useAuthStore } from '../stores/auth-store';
   
   export const useGoogleLogin = () => {
     const { setTokens, setUser } = useAuthStore();
   
     return useMutation({
       mutationFn: googleLogin,
       onSuccess: (data) => {
         setTokens(data.accessToken, data.refreshToken);
         setUser(data.user);
       },
     });
   };
   ```

4. **Google Login Component**
   ```typescript
   // src/components/GoogleLoginButton.tsx
   import { useEffect } from 'react';
   import { useGoogleLogin } from '../hooks/use-google-login';
   import { useGoogleClientId } from '../hooks/use-google-client-id';
   
   export const GoogleLoginButton = () => {
     const googleLoginMutation = useGoogleLogin();
     const { data: clientId } = useGoogleClientId();
   
     useEffect(() => {
       if (!clientId) return;
   
       window.google?.accounts.id.initialize({
         client_id: clientId,
         callback: (response) => {
           googleLoginMutation.mutate({
             idToken: response.credential,
             deviceInfo: navigator.userAgent,
           });
         },
       });
   
       window.google?.accounts.id.renderButton(
         document.getElementById('google-signin-button')!,
         {
           theme: 'outline',
           size: 'large',
           width: 300,
         }
       );
     }, [clientId]);
   
     return <div id="google-signin-button" />;
   };
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - Traditional email/password login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/google-login` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Configuration Endpoints

- `GET /api/config/google-client-id` - Get Google OAuth Client ID

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Google OAuth**: Secure third-party authentication
- **Password Hashing**: BCrypt password hashing
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Data annotation validation

## Development

### Running Tests

```bash
dotnet test
```

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Code Quality

- Follow Clean Architecture principles
- Use dependency injection
- Implement proper error handling
- Add comprehensive logging
- Write unit and integration tests

## Deployment

### Production Configuration

1. **Update connection strings** for production database
2. **Configure Google OAuth** with production domains
3. **Set environment variables** for sensitive data
4. **Enable HTTPS** and update CORS settings
5. **Configure logging** for production monitoring

### Environment Variables

```bash
# Production environment variables
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<production-db-connection>
GoogleAuth__ClientId=<google-client-id>
GoogleAuth__ClientSecret=<google-client-secret>
JwtSettings__SecretKey=<jwt-secret-key>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## Changelog

### v1.0.0
- Initial release
- Basic authentication system
- Google OAuth 2.0 integration
- Disaster reporting functionality
- Real-time chat system
- Location services
- Photo management
- Notification system