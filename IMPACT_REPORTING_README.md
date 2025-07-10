# Disaster Impact Reporting System

A comprehensive disaster impact reporting system built with React, TypeScript, and modern web technologies. This system allows users to report disaster impacts, track assistance needs, and coordinate emergency response efforts.

## 🚀 Features

### Core Functionality
- **Multi-step Report Creation**: Intuitive 4-step process for reporting disaster impacts
- **Real-time Location Services**: GPS integration with Google Maps for precise location reporting
- **Photo Upload**: Support for multiple photo uploads with size validation
- **Emergency Flagging**: Special handling for emergency situations
- **Comprehensive Disaster Types**: Support for Natural, Human-made, and Technological disasters

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Progressive Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Offline Support**: Basic offline functionality for critical operations

### Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **Modern React**: Hooks-based architecture with functional components
- **API Integration**: RESTful API with comprehensive error handling
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Performance**: Optimized bundle size and lazy loading

## 📋 Report Types Supported

### Natural Disasters
- Earthquake
- Flood
- Hurricane/Typhoon
- Tornado
- Wildfire
- Drought
- Landslide
- Tsunami
- Volcanic Eruption
- Severe Storm

### Human-made Disasters
- Chemical Spill
- Oil Spill
- Nuclear Incident
- Terrorism
- Civil Unrest
- Industrial Accident
- Transportation Accident
- Structural Failure

### Technological Disasters
- Power Grid Failure
- Communication System Failure
- Infrastructure Collapse
- Cyber Attack
- Data Center Outage

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Maps API key
- Backend API server (optional for development)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd DisasterFrontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=false

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880  # 5MB in bytes
VITE_MAX_FILES_PER_REPORT=10
```

## 📱 Usage Guide

### Reporting a Disaster Impact

1. **Authentication**: Users must be logged in to submit reports
2. **Step 1 - Disaster Information**:
   - Select disaster type (Natural/Human-made/Technological)
   - Choose specific disaster subtype
   - Provide detailed description
   - Set severity level
   - Mark as emergency if applicable

3. **Step 2 - Location & Impact**:
   - Enter location manually or use GPS
   - Select impact types (Property, Infrastructure, Environmental, etc.)
   - Estimate affected people and damage
   - Upload photos (optional)

4. **Step 3 - Assistance & Contact**:
   - Select needed assistance types
   - Set urgency level
   - Provide contact information
   - Add additional details

5. **Step 4 - Review & Submit**:
   - Review all information
   - Submit report
   - Receive confirmation with tracking ID

### Emergency Reports

Emergency reports receive special handling:
- 🚨 Visual emergency indicator
- Priority processing
- Immediate notifications to relevant authorities
- Expedited response coordination

## 🏗️ Architecture

### Component Structure

```
src/
├── pages/
│   ├── ReportImpact.tsx          # Main reporting component
│   └── __tests__/
│       └── ReportImpact.test.tsx  # Comprehensive test suite
├── apis/
│   ├── reports.ts                # Reports API service
│   ├── client.ts                 # HTTP client configuration
│   └── auth.ts                   # Authentication API
├── components/
│   ├── LocationPicker.tsx        # Enhanced location selection
│   ├── PhotoUpload.tsx           # File upload component
│   └── common/                   # Reusable UI components
├── types/
│   └── index.ts                  # TypeScript type definitions
├── data/
│   └── mockData.ts               # Mock data for development
└── utils/
    ├── validation.ts             # Form validation utilities
    ├── geolocation.ts            # Location services
    └── constants.ts              # Application constants
```

### API Endpoints

```typescript
// Report Management
POST   /api/reports              # Submit new report
GET    /api/reports              # List reports with filters
GET    /api/reports/:id          # Get specific report
PATCH  /api/reports/:id/status   # Update report status
DELETE /api/reports/:id          # Delete report (admin)

// Assistance & Coordination
POST   /api/reports/:id/assistance  # Add assistance log
GET    /api/reports/statistics     # Get system statistics
GET    /api/reports/nearby         # Get nearby reports
GET    /api/reports/search         # Search reports
GET    /api/reports/export         # Export reports data
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

# Run specific test file
npm test ReportImpact.test.tsx
```

### Test Coverage

The test suite covers:
- ✅ Component rendering and user interactions
- ✅ Form validation and error handling
- ✅ API integration and error scenarios
- ✅ Geolocation services
- ✅ Photo upload functionality
- ✅ Navigation between steps
- ✅ Emergency report handling
- ✅ Authentication flows

### Test Structure

```typescript
describe('ReportImpact Component', () => {
  describe('Authentication', () => {
    // Authentication-related tests
  });
  
  describe('Step 1: Disaster Information', () => {
    // Step 1 functionality tests
  });
  
  describe('Step 2: Location & Impact', () => {
    // Step 2 functionality tests
  });
  
  // ... additional test suites
});
```

## 🔧 Development

### Code Quality

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **TypeScript**: Strict mode enabled for type safety

### Performance Optimization

- **Code Splitting**: Lazy loading for non-critical components
- **Image Optimization**: Automatic image compression and resizing
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Intelligent caching strategies for API calls

### Accessibility

- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Proper focus handling throughout the application

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run analyze
```

### Environment-specific Builds

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Monitoring & Analytics

### Performance Metrics
- Page load times
- API response times
- Error rates
- User engagement metrics

### Error Tracking
- Automatic error reporting
- User feedback collection
- Performance monitoring
- Real-time alerts

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm test`
5. Commit changes: `git commit -m 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Maintain accessibility standards
- Document complex functionality
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Changelog

### Version 2.0.0 (Latest)
- ✨ Complete rewrite of impact reporting system
- 🎨 Modern UI/UX with improved accessibility
- 🔧 Enhanced TypeScript integration
- 📱 Mobile-first responsive design
- 🧪 Comprehensive test coverage
- 🚀 Performance optimizations
- 🔒 Enhanced security measures
- 📊 Advanced analytics integration

### Previous Versions
- Version 1.x: Legacy impact reporting system

---

**Built with ❤️ for disaster response and community safety**