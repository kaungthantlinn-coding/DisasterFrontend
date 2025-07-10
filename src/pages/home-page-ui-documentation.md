# DisasterWatch Home Page UI Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design System](#design-system)
3. [Layout and Responsive Design](#layout-and-responsive-design)
4. [Interactive Components](#interactive-components)
5. [Reusable Components](#reusable-components)
6. [Developer Guidelines](#developer-guidelines)

## Architecture Overview

### Component Hierarchy

The DisasterWatch home page follows a well-structured React component architecture:

```
App.tsx
├── Header (Layout/Header.tsx)
├── Home (pages/Home.tsx) - Main home page component
│   ├── Hero Section
│   ├── Statistics Section
│   ├── Features Section
│   ├── Interactive Map Section
│   ├── Recent Reports Section
│   ├── Partners Section
│   └── Call-to-Action Section
├── Footer (Layout/Footer.tsx)
└── ChatWidget (Chat/ChatWidget.tsx)
```

### File Organization

```
src/
├── pages/
│   └── Home.tsx                    # Main home page component
├── components/
│   ├── Layout/
│   │   ├── Header.tsx             # Global navigation header
│   │   └── Footer.tsx             # Global footer
│   ├── Common/
│   │   ├── ViewReportsButton.tsx  # Reusable CTA button
│   │   ├── LoadingSpinner.tsx     # Loading state component
│   │   └── AnimatedElements.tsx   # Animation utilities
│   ├── Map/
│   │   └── ReportMap.tsx          # Interactive map component
│   └── Chat/
│       └── ChatWidget.tsx         # Floating chat widget
├── data/
│   └── mockData.ts                # Sample data for development
└── types/
    └── index.ts                   # TypeScript type definitions
```

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React icon library
- **Routing**: React Router DOM
- **Maps**: Leaflet.js for interactive mapping
- **Date Handling**: date-fns library
- **Build Tool**: Vite

### Key Architectural Patterns

1. **Component Composition**: Heavy use of composition over inheritance
2. **Props-based Configuration**: Components accept configuration via props
3. **Responsive-First Design**: Mobile-first approach with progressive enhancement
4. **State Management**: Local state with React hooks, context for global state
5. **Type Safety**: Full TypeScript implementation with strict typing

## Design System

### Color Palette

The application uses a carefully crafted color system based on semantic meaning:

#### Primary Colors

- **Blue Gradient**: `from-blue-500 to-indigo-600` - Primary actions, trust, reliability
- **Red/Orange**: `from-red-500 to-orange-500` - Emergency actions, alerts
- **Green**: `text-green-600` - Success states, verified content
- **Purple**: `text-purple-600` - Secondary metrics, premium features

#### Neutral Colors

- **Gray Scale**: `gray-50` to `gray-900` - Text hierarchy, backgrounds, borders
- **White**: Primary background color for clean, accessible design

#### Semantic Colors

- **Success**: Green variants for positive states
- **Warning**: Orange/yellow for caution states
- **Error**: Red variants for error states
- **Info**: Blue variants for informational content

### Typography System

The design uses a systematic approach to typography:

#### Font Sizes

- **Hero Text**: `text-5xl md:text-7xl` (48px-72px) - Main headlines
- **Section Headers**: `text-4xl md:text-5xl` (36px-48px) - Section titles
- **Subsection Headers**: `text-3xl md:text-4xl` (30px-36px) - Feature titles
- **Body Large**: `text-xl` (20px) - Important descriptions
- **Body**: `text-base` (16px) - Standard text
- **Small**: `text-sm` (14px) - Secondary information
- **Extra Small**: `text-xs` (12px) - Labels, metadata

#### Font Weights

- **Bold**: `font-bold` (700) - Headlines, important text
- **Semibold**: `font-semibold` (600) - Subheadings, buttons
- **Medium**: `font-medium` (500) - Emphasized text
- **Normal**: `font-normal` (400) - Body text

### Spacing System

Consistent spacing using Tailwind's spacing scale:

- **Micro**: `space-x-1, space-x-2` (4px-8px) - Icon spacing
- **Small**: `space-x-3, space-x-4` (12px-16px) - Component internal spacing
- **Medium**: `space-x-6, space-x-8` (24px-32px) - Section spacing
- **Large**: `py-12, py-16` (48px-64px) - Major section padding
- **Extra Large**: `py-24` (96px) - Hero section spacing

### Border Radius System

- **Small**: `rounded-lg` (8px) - Buttons, small cards
- **Medium**: `rounded-xl` (12px) - Cards, form elements
- **Large**: `rounded-2xl` (16px) - Major containers
- **Extra Large**: `rounded-3xl` (24px) - Hero elements

### Shadow System

Layered shadow approach for depth:

- **Subtle**: `shadow-sm` - Minimal elevation
- **Default**: `shadow` - Standard card elevation
- **Medium**: `shadow-lg` - Hover states, modals
- **Large**: `shadow-xl` - Major interactive elements
- **Extra Large**: `shadow-2xl` - Hero elements, primary CTAs

## Layout and Responsive Design

### Grid System

The home page uses CSS Grid and Flexbox for layout:

#### Container System

```css
.max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

- **Mobile**: 16px padding
- **Small**: 24px padding
- **Large**: 32px padding
- **Max Width**: 1280px centered

#### Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Small**: `sm:` (≥ 640px)
- **Medium**: `md:` (≥ 768px)
- **Large**: `lg:` (≥ 1024px)
- **Extra Large**: `xl:` (≥ 1280px)

### Section Layout Patterns

#### Hero Section

```css
.relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900;
```

- Full-width gradient background
- Centered content with max-width container
- Responsive text sizing
- Floating decorative elements

#### Feature Sections

```css
.flex flex-col lg:flex-row items-center gap-12 lg:gap-16
```

- Alternating left/right layout on desktop
- Stacked layout on mobile
- Consistent spacing system

#### Statistics Grid

```css
.grid grid-cols-2 lg:grid-cols-4 gap-8
```

- 2 columns on mobile
- 4 columns on desktop
- Equal height cards

### Responsive Design Principles

1. **Mobile-First**: Base styles target mobile, enhanced for larger screens
2. **Progressive Enhancement**: Features added at larger breakpoints
3. **Flexible Images**: All images scale responsively
4. **Touch-Friendly**: Minimum 44px touch targets
5. **Readable Text**: Optimal line lengths and spacing

## Interactive Components

### Animation System

The application uses a sophisticated animation system built on Tailwind CSS:

#### Custom Animations (tailwind.config.js)

```javascript
animation: {
  'bounce-in': 'bounceIn 0.6s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
  'fade-in': 'fadeIn 0.3s ease-out',
  'slide-up': 'slideUp 0.3s ease-out',
}
```

#### Hover Effects

- **Transform**: `hover:-translate-y-1` - Lift effect on buttons
- **Scale**: `hover:scale-105` - Subtle growth on interactive elements
- **Shadow**: `hover:shadow-2xl` - Enhanced depth on hover
- **Color**: Gradient transitions on primary actions

#### Transition Classes

- **Standard**: `transition-all duration-300` - Smooth state changes
- **Fast**: `transition-colors duration-200` - Quick color changes
- **Transform**: `transition-transform` - Movement animations

### Interactive Elements

#### Primary Call-to-Action Buttons

```tsx
className =
  "group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl";
```

#### Secondary Buttons

```tsx
className =
  "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm";
```

#### Icon Animations

```tsx
<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
```

### User Experience Flows

1. **Landing Flow**: Hero → Features → Map → Reports → CTA
2. **Navigation**: Sticky header with role-based menu items
3. **Interaction Feedback**: Immediate visual feedback on all interactions
4. **Loading States**: Smooth transitions and loading indicators
5. **Error Handling**: Graceful degradation and error messages

## Reusable Components

### ViewReportsButton Component

A highly configurable button component with multiple variants:

#### Props Interface

```typescript
interface ViewReportsButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
}
```

#### Variants

- **Primary**: Blue gradient background
- **Secondary**: Gray gradient background
- **Outline**: Border-only with hover fill

#### Usage Examples

```tsx
// Primary large button
<ViewReportsButton size="lg" />

// Outline variant for dark backgrounds
<ViewReportsButton
  variant="outline"
  className="border-white/30 text-white"
/>
```

### ReportMap Component

Interactive map component using Leaflet.js:

#### Features

- Custom marker styling
- Popup information cards
- Responsive sizing
- Click-to-navigate functionality

#### Props

```typescript
interface ReportMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
  height?: string;
}
```

### LoadingSpinner Component

Simple, reusable loading indicator:

```tsx
<LoadingSpinner size={24} className="text-red-600" />
```

### ChatWidget Component

Floating chat interface with:

- Collapsible design
- Real-time messaging
- File upload support
- Emoji picker integration

## Developer Guidelines

### Code Organization Standards

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Import Order**: External libraries → Internal components → Types
3. **Component Structure**: Props interface → Component → Export
4. **Styling**: Tailwind classes in logical order (layout → spacing → colors → effects)

### Styling Best Practices

1. **Responsive Design**: Always start with mobile-first approach
2. **Color Usage**: Use semantic color classes, avoid arbitrary values
3. **Spacing**: Use consistent spacing scale from Tailwind
4. **Typography**: Follow established hierarchy and sizing
5. **Animations**: Keep animations subtle and purposeful

### Component Development Guidelines

1. **Props**: Always define TypeScript interfaces for props
2. **Default Values**: Provide sensible defaults for optional props
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Performance**: Use React.memo for expensive components
5. **Testing**: Write unit tests for complex logic

### Maintenance Recommendations

1. **Regular Audits**: Review component usage and consolidate duplicates
2. **Performance Monitoring**: Track bundle size and runtime performance
3. **Accessibility Testing**: Regular a11y audits and user testing
4. **Design System Updates**: Keep components aligned with design system
5. **Documentation**: Update documentation with any changes

### Extension Guidelines

When adding new features to the home page:

1. **Follow Existing Patterns**: Use established component patterns
2. **Maintain Consistency**: Align with existing design system
3. **Consider Performance**: Lazy load heavy components
4. **Test Responsiveness**: Verify on all supported breakpoints
5. **Update Documentation**: Document new components and patterns

## Detailed Component Analysis

### Hero Section Implementation

The hero section serves as the primary landing area and sets the visual tone for the entire application:

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
<section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black/10"></div>
  <div className="absolute inset-0">
    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
        Unite Communities in
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
          Times of Crisis
        </span>
      </h1>
    </div>
  </div>
</section>
```

</augment_code_snippet>

#### Design Elements:

- **Layered Backgrounds**: Multiple gradient layers create depth
- **Floating Orbs**: Blurred circular elements add visual interest
- **Gradient Text**: CSS gradient text for emphasis
- **Responsive Typography**: Scales from 48px to 72px

### Statistics Section

The statistics section builds credibility through data visualization:

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
const stats = [
  {
    label: "Reports Submitted",
    value: "2,847",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    label: "Lives Helped",
    value: "12,450",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Verified Reports",
    value: "2,189",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    label: "Response Time",
    value: "< 2hrs",
    icon: Clock,
    color: "text-purple-600",
  },
];
```

</augment_code_snippet>

#### Visual Hierarchy:

- **Large Numbers**: Primary focus on metrics
- **Semantic Colors**: Color-coded by meaning
- **Icon Support**: Visual reinforcement of concepts
- **Grid Layout**: Responsive 2x2 to 1x4 layout

### Interactive Map Section

The map section provides geographical context and real-time data:

<augment_code_snippet path="src/components/Map/ReportMap.tsx" mode="EXCERPT">

```tsx
const ReportMap: React.FC<ReportMapProps> = ({
  reports,
  selectedReport,
  onReportSelect,
  height = "400px",
}) => {
  // Map initialization with custom styling
  const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
};
```

</augment_code_snippet>

## Advanced Styling Patterns

### Gradient System

The application uses a sophisticated gradient system for visual hierarchy:

#### Primary Gradients

```css
/* Hero backgrounds */
bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900

/* Primary buttons */
bg-gradient-to-r from-blue-500 to-indigo-600

/* Emergency actions */
bg-gradient-to-r from-red-500 to-orange-500

/* Feature highlights */
bg-gradient-to-br from-blue-500 to-indigo-500
```

#### Text Gradients

```css
/* Hero text emphasis */
text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300

/* Call-to-action text */
text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300
```

### Glass Morphism Effects

Modern glass-like effects using backdrop blur:

```css
/* Floating elements */
bg-white/10 backdrop-blur-sm border border-white/20

/* Overlay elements */
bg-white/95 backdrop-blur-sm
```

### Advanced Animations

#### Micro-interactions

```css
/* Button hover lift */
transform hover:-translate-y-1

/* Icon slide animations */
group-hover:translate-x-1 transition-transform

/* Scale effects */
hover:scale-105 transition-transform duration-200
```

#### Loading States

```css
/* Fade-in animations */
transition-opacity duration-500

/* Smooth state changes */
transition-all duration-300
```

## Component Variants and Usage

### Button System

The application implements a comprehensive button system:

#### Primary Buttons

```tsx
// Large call-to-action
<Link className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl">
  Report an Impact
  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
</Link>

// Emergency action
<Link className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold">
  <AlertTriangle className="mr-2" />
  Report New Incident
</Link>
```

#### Secondary Buttons

```tsx
// Outline variant
<ViewReportsButton
  variant="outline"
  size="lg"
  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
/>
```

### Card Components

#### Feature Cards

```tsx
<div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    {/* Card content */}
  </div>
</div>
```

#### Statistics Cards

```tsx
<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
  <div className="flex items-center space-x-4">
    <div className={`p-4 rounded-2xl ${iconBgColor}`}>
      <Icon size={32} className={iconColor} />
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  </div>
</div>
```

## Accessibility Implementation

### Semantic HTML Structure

The home page follows semantic HTML principles:

```html
<main>
  <section aria-label="Hero">
  <section aria-label="Statistics">
  <section aria-label="Features">
  <section aria-label="Interactive Map">
  <section aria-label="Recent Reports">
</main>
```

### ARIA Labels and Roles

```tsx
// Interactive elements
<button aria-label="View all disaster reports">
<div role="button" tabIndex={0}>
<img alt="Organization logo" />

// Navigation
<nav aria-label="Main navigation">
<ul role="menubar">
```

### Keyboard Navigation

All interactive elements support keyboard navigation:

```tsx
// Focus management
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}

// Tab order optimization
tabIndex={0}
```

### Color Contrast

All text meets WCAG AA standards:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **Interactive elements**: Clear focus indicators

## Performance Optimizations

### Code Splitting

```tsx
// Lazy loading for heavy components
const ReportMap = React.lazy(() => import("../components/Map/ReportMap"));

// Conditional loading
{
  mapLoaded && (
    <Suspense fallback={<LoadingSpinner />}>
      <ReportMap reports={recentReports} height="500px" />
    </Suspense>
  );
}
```

### Image Optimization

```tsx
// Responsive images with proper sizing
<img
  src="https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1"
  alt="Partner organization"
  className="w-full h-auto object-cover"
  loading="lazy"
/>
```

### Bundle Optimization

- **Tree Shaking**: Only import used Lucide icons
- **CSS Purging**: Tailwind removes unused styles
- **Component Memoization**: React.memo for expensive renders

## Responsive Design Deep Dive

### Breakpoint Strategy

The application uses a mobile-first responsive design approach with strategic breakpoints:

```css
/* Tailwind CSS Breakpoints */
/* Default: 0px - 639px (Mobile) */
sm: 640px   /* Small tablets and large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Large laptops and desktops */
2xl: 1536px /* Large desktops */
```

### Layout Patterns by Section

#### Hero Section Responsive Behavior

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div className="text-center max-w-4xl mx-auto">
    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
      Unite Communities in
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
        Times of Crisis
      </span>
    </h1>
    <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
      Connect with your community during emergencies. Report incidents, offer
      help, and stay informed about local disasters and relief efforts.
    </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
      {/* Buttons stack on mobile, side-by-side on larger screens */}
    </div>
  </div>
</div>
```

</augment_code_snippet>

**Responsive Features:**

- **Typography**: `text-5xl md:text-7xl` scales from 48px to 72px
- **Spacing**: `px-4 sm:px-6 lg:px-8` increases padding with screen size
- **Button Layout**: `flex-col sm:flex-row` stacks on mobile, horizontal on tablet+
- **Content Width**: `max-w-4xl` constrains content width for readability

#### Statistics Grid Responsive Layout

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
  {stats.map((stat, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${getStatColor(
            stat.color
          )} text-white shadow-lg`}
        >
          <stat.icon size={32} />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      </div>
    </div>
  ))}
</div>
```

</augment_code_snippet>

**Grid Behavior:**

- **Mobile**: 2 columns (`grid-cols-2`)
- **Desktop**: 4 columns (`lg:grid-cols-4`)
- **Spacing**: Consistent `gap-8` (32px) between items
- **Cards**: Maintain aspect ratio across breakpoints

#### Features Section Alternating Layout

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
{
  organizationFeatures.map((feature, index) => (
    <div
      key={feature.id}
      className={`flex flex-col ${
        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center gap-12 lg:gap-16`}
    >
      {/* Content Side */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="text-6xl font-bold text-gray-200">
            {feature.number}
          </div>
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
          >
            <feature.icon size={32} />
          </div>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {feature.title}
        </h3>
      </div>

      {/* Visual Side */}
      <div className="flex-1">
        <div
          className={`${feature.bgColor} rounded-3xl p-8 border border-gray-100 shadow-sm`}
        >
          {/* Feature visualization */}
        </div>
      </div>
    </div>
  ));
}
```

</augment_code_snippet>

**Layout Strategy:**

- **Mobile**: Stacked layout (`flex-col`)
- **Desktop**: Alternating left/right layout (`lg:flex-row` / `lg:flex-row-reverse`)
- **Spacing**: Responsive gaps (`gap-12 lg:gap-16`)
- **Content**: Equal width columns on desktop (`flex-1`)

### Interactive Map Responsive Design

<augment_code_snippet path="src/components/Map/ReportMap.tsx" mode="EXCERPT">

```tsx
<div
  ref={mapRef}
  style={{ height, width: "100%" }}
  className="rounded-xl border border-gray-200"
/>
```

</augment_code_snippet>

**Map Responsiveness:**

- **Fluid Width**: Always 100% of container
- **Fixed Height**: Configurable via props (default 400px)
- **Touch Support**: Native Leaflet touch interactions
- **Zoom Controls**: Accessible on all devices

### Navigation Responsive Patterns

<augment_code_snippet path="src/components/Layout/Header.tsx" mode="EXCERPT">

```tsx
<header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-sm">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">DisasterWatch</h1>
          <p className="text-xs text-gray-500 -mt-1">Community Reporting</p>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {getNavItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${
              isActivePage(item.path) ? "text-blue-600" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>

  {/* Mobile Navigation Menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
      <div className="px-4 py-6 space-y-4">
        {getNavItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block text-lg font-medium transition-colors ${
              isActivePage(item.path)
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )}
</header>
```

</augment_code_snippet>

**Navigation Features:**

- **Desktop**: Horizontal navigation bar
- **Mobile**: Collapsible hamburger menu
- **Sticky**: Fixed position on scroll
- **Active States**: Visual indication of current page

### Footer Responsive Layout

<augment_code_snippet path="src/components/Layout/Footer.tsx" mode="EXCERPT">

```tsx
<footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Brand Section */}
      <div className="lg:col-span-1">
        <Link to="/" className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-600 text-white rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">DisasterWatch</h3>
            <p className="text-sm text-gray-400">Community Reporting</p>
          </div>
        </Link>
      </div>

      {/* Navigation columns */}
      {/* ... */}
    </div>

    <div className="border-t border-gray-800 mt-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">
          © 2024 DisasterWatch. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">{/* Legal links */}</div>
      </div>
    </div>
  </div>
</footer>
```

</augment_code_snippet>

**Footer Responsiveness:**

- **Mobile**: Single column layout
- **Tablet**: 2 columns (`md:grid-cols-2`)
- **Desktop**: 4 columns (`lg:grid-cols-4`)
- **Copyright**: Stacked on mobile, inline on desktop

## Advanced Responsive Techniques

### Container Queries Simulation

Using Tailwind's responsive utilities to simulate container queries:

```tsx
// Card that adapts to its container
<div className="w-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
      <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
          {item.title}
        </h3>
      </div>
    ))}
  </div>
</div>
```

### Responsive Typography Scale

```css
/* Fluid typography using clamp() equivalent */
.hero-title {
  @apply text-4xl sm:text-5xl md:text-6xl lg:text-7xl;
}

.section-title {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl;
}

.body-large {
  @apply text-lg sm:text-xl;
}
```

### Responsive Spacing System

```css
/* Consistent spacing that scales */
.section-padding {
  @apply py-12 sm:py-16 md:py-20 lg:py-24;
}

.container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

.element-gap {
  @apply gap-4 sm:gap-6 md:gap-8 lg:gap-12;
}
```

### Image Responsive Patterns

```tsx
// Hero background images
<div className="relative bg-cover bg-center bg-no-repeat min-h-screen">
  <img
    src="/hero-mobile.jpg"
    alt="Hero background"
    className="absolute inset-0 w-full h-full object-cover sm:hidden"
  />
  <img
    src="/hero-desktop.jpg"
    alt="Hero background"
    className="absolute inset-0 w-full h-full object-cover hidden sm:block"
  />
</div>

// Responsive aspect ratios
<div className="aspect-w-16 aspect-h-9 sm:aspect-w-4 sm:aspect-h-3">
  <img
    src={image.src}
    alt={image.alt}
    className="object-cover rounded-lg"
  />
</div>
```

### Performance Considerations

#### Responsive Images

```tsx
// Optimized image loading
<img
  src="image-mobile.jpg"
  srcSet="
    image-mobile.jpg 480w,
    image-tablet.jpg 768w,
    image-desktop.jpg 1200w
  "
  sizes="
    (max-width: 480px) 100vw,
    (max-width: 768px) 50vw,
    33vw
  "
  alt="Responsive image"
  loading="lazy"
/>
```

#### Conditional Component Loading

```tsx
// Load heavy components only on larger screens
const [isDesktop, setIsDesktop] = useState(false);

useEffect(() => {
  const checkScreenSize = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  return () => window.removeEventListener("resize", checkScreenSize);
}, []);

return (
  <div>
    {isDesktop ? <HeavyDesktopComponent /> : <LightweightMobileComponent />}
  </div>
);
```

## Interactive Components and UX Patterns

### Animation System Architecture

The DisasterWatch home page implements a sophisticated animation system that enhances user experience through subtle, purposeful motion:

#### Custom Animation Definitions

<augment_code_snippet path="tailwind.config.js" mode="EXCERPT">

```javascript
export default {
  theme: {
    extend: {
      animation: {
        "bounce-in": "bounceIn 0.6s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
};
```

</augment_code_snippet>

#### Animation Usage Patterns

**Entrance Animations:**

```tsx
// Bounce-in for important elements
<div className="animate-bounce-in">
  <AlertTriangle className="text-red-500" />
</div>

// Fade-in for content sections
<section className="animate-fade-in">
  {/* Section content */}
</section>

// Slide-up for cards and panels
<div className="animate-slide-up">
  {/* Card content */}
</div>
```

**Hover Animations:**

```tsx
// Lift effect on interactive elements
<button className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">

// Scale effect for emphasis
<div className="transition-transform duration-200 hover:scale-105">

// Icon slide animations
<ArrowRight className="transition-transform group-hover:translate-x-1" />
```

### Interactive Button System

#### Primary Call-to-Action Buttons

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
<Link
  to="/report/new"
  className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center border border-blue-400/20"
>
  Report an Impact
  <ArrowRight
    size={20}
    className="ml-2 group-hover:translate-x-1 transition-transform"
  />
</Link>
```

</augment_code_snippet>

**Interactive Features:**

- **Gradient Transition**: Color shifts on hover for visual feedback
- **Lift Animation**: `-translate-y-1` creates floating effect
- **Shadow Enhancement**: `hover:shadow-2xl` adds depth
- **Icon Animation**: Arrow slides right on hover using group utilities
- **Border Accent**: Subtle border for definition

#### Emergency Action Buttons

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
<Link
  to="/report/new"
  className="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
>
  <AlertTriangle size={20} className="mr-2" />
  Report New Incident
</Link>
```

</augment_code_snippet>

**Design Rationale:**

- **Red/Orange Gradient**: Conveys urgency and importance
- **Scale Animation**: `hover:scale-105` draws attention
- **Alert Icon**: Visual reinforcement of emergency context
- **Fast Transition**: `duration-200` for immediate feedback

### Scroll-Based Interactions

#### Scroll-to-Top Functionality

<augment_code_snippet path="src/pages/Home.tsx" mode="EXCERPT">

```tsx
const [showScrollTop, setShowScrollTop] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Scroll button implementation
{
  showScrollTop && (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
    >
      <ChevronUp size={20} />
    </button>
  );
}
```

</augment_code_snippet>

**UX Features:**

- **Conditional Display**: Only shows after scrolling 300px
- **Smooth Scrolling**: Native smooth scroll behavior
- **Fixed Positioning**: Always accessible in bottom-right
- **Scale Animation**: Grows on hover for feedback

#### Sticky Navigation

<augment_code_snippet path="src/components/Layout/Header.tsx" mode="EXCERPT">

```tsx
<header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Navigation content */}
    </div>
  </div>
</header>
```

</augment_code_snippet>

**Implementation Details:**

- **Sticky Positioning**: Remains at top during scroll
- **High Z-Index**: `z-50` ensures it stays above content
- **Subtle Shadow**: Provides visual separation from content
- **Consistent Height**: `h-16` maintains layout stability

### Map Interactions

#### Interactive Map Component

<augment_code_snippet path="src/components/Map/ReportMap.tsx" mode="EXCERPT">

```tsx
// Custom popup with interactive elements
const popupContent = `
  <div class="p-4 max-w-sm">
    <div class="flex items-start space-x-3 mb-3">
      <div class="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-1">${
          report.title
        }</h3>
        <p class="text-xs text-gray-600 mb-2">${report.location}</p>
        <p class="text-xs text-gray-700 line-clamp-3">${report.description}</p>
      </div>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <div class="text-xs text-gray-500">
        ${format(new Date(report.createdAt), "MMM d, yyyy")}
      </div>
      <button
        class="view-details-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        data-report-id="${report.id}"
      >
        View Details
      </button>
    </div>
  </div>
`;
```

</augment_code_snippet>

**Interactive Features:**

- **Custom Popups**: Rich content with styling and interactions
- **Click Navigation**: Buttons navigate to detailed views
- **Hover Effects**: Consistent with global button styling
- **Responsive Design**: Adapts to different screen sizes

#### Map Controls and Feedback

```tsx
// Location detection with user feedback
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        // Visual feedback
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 10);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        // Error handling with user notification
      }
    );
  }
};

// Current location indicator
{
  currentLocation && (
    <div className="absolute top-4 left-4 z-20 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
      <div className="flex items-center space-x-2">
        <Crosshair size={14} />
        <span>Your Location</span>
      </div>
    </div>
  );
}
```

### Chat Widget Interactions

#### Floating Chat Interface

<augment_code_snippet path="src/components/Chat/ChatWidget.tsx" mode="EXCERPT">

```tsx
const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {!isOpen ? (
        // Chat trigger button
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 group"
        >
          <MessageCircle
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      ) : (
        // Chat interface
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isMinimized ? "h-16" : "h-96 w-80"
          }`}
        >
          {/* Chat content */}
        </div>
      )}
    </div>
  );
};
```

</augment_code_snippet>

**Interaction Patterns:**

- **Floating Button**: Always accessible in corner
- **Smooth Transitions**: Animated open/close states
- **Scale Feedback**: Button grows on hover
- **Minimization**: Collapsible interface for space management

### Form Interactions and Validation

#### Real-time Validation Feedback

```tsx
// Input with validation states
<div className="relative">
  <input
    type="email"
    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
      validationState === "error"
        ? "border-red-500 bg-red-50 focus:ring-red-500"
        : validationState === "success"
        ? "border-green-500 bg-green-50 focus:ring-green-500"
        : "border-gray-300 focus:ring-blue-500"
    }`}
    placeholder="Enter your email"
  />

  {/* Validation icon */}
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    {validationState === "error" && (
      <X size={20} className="text-red-500 animate-scale-in" />
    )}
    {validationState === "success" && (
      <CheckCircle size={20} className="text-green-500 animate-scale-in" />
    )}
  </div>
</div>;

// Error message with slide animation
{
  errorMessage && (
    <div className="mt-2 text-sm text-red-600 animate-slide-up">
      {errorMessage}
    </div>
  );
}
```

### Loading States and Feedback

#### Progressive Loading Patterns

<augment_code_snippet path="src/components/Common/LoadingSpinner.tsx" mode="EXCERPT">

```tsx
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader size={size} className="animate-spin text-red-600" />
    </div>
  );
};
```

</augment_code_snippet>

#### Map Loading States

```tsx
// Map with loading transition
<div className="relative">
  {!mapLoaded && (
    <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
      <LoadingSpinner size={32} />
    </div>
  )}

  <div
    ref={mapRef}
    className="transition-opacity duration-500"
    style={{ opacity: mapLoaded ? 1 : 0 }}
  >
    <ReportMap reports={recentReports} height="500px" />
  </div>
</div>
```

### Micro-interactions and Feedback

#### Hover State Patterns

```tsx
// Card hover effects
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer">
  // Icon scaling on parent hover
  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
    <Icon size={24} className="text-white" />
  </div>
  // Text color change on hover
  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
    Card Title
  </h3>
</div>
```

#### Focus Management

```tsx
// Accessible focus indicators
<button className="px-6 py-3 bg-blue-600 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2">

// Skip links for accessibility
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
>
  Skip to main content
</a>
```

### User Experience Flow Patterns

#### Progressive Disclosure

```tsx
// Expandable content sections
const [isExpanded, setIsExpanded] = useState(false);

<div className="border border-gray-200 rounded-xl overflow-hidden">
  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">Section Title</h3>
      <ChevronDown
        className={`transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </div>
  </button>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <div className="px-6 pb-4">{/* Expandable content */}</div>
  </div>
</div>;
```

#### Contextual Actions

```tsx
// Actions that appear based on context
<div className="group relative">
  <img src={image.src} alt={image.alt} className="rounded-lg" />

  {/* Overlay actions on hover */}
  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-4">
    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
      <Eye size={16} className="mr-2" />
      View
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      <Share2 size={16} className="mr-2" />
      Share
    </button>
  </div>
</div>
```

## Reusable Components Library

### ViewReportsButton Component

The `ViewReportsButton` is a highly configurable, reusable button component that serves as a primary navigation element throughout the application.

#### Component Interface

<augment_code_snippet path="src/components/Common/ViewReportsButton.tsx" mode="EXCERPT">

```tsx
interface ViewReportsButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
}

const ViewReportsButton: React.FC<ViewReportsButtonProps> = ({
  className = "",
  variant = "primary",
  size = "md",
  showIcon = true,
  animated = true,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-lg";
      case "secondary":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-sm hover:shadow-lg";
      case "outline":
        return "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-lg";
    }
  };
};
```

</augment_code_snippet>

#### Variant System

**Primary Variant (Default):**

```tsx
<ViewReportsButton />
// Renders: Blue gradient background with white text
```

**Secondary Variant:**

```tsx
<ViewReportsButton variant="secondary" />
// Renders: Gray gradient background with white text
```

**Outline Variant:**

```tsx
<ViewReportsButton variant="outline" />
// Renders: Transparent background with blue border and text
```

#### Size System

**Small Size:**

```tsx
<ViewReportsButton size="sm" />
// Padding: px-4 py-2, Text: text-sm, Icon: 16px
```

**Medium Size (Default):**

```tsx
<ViewReportsButton size="md" />
// Padding: px-6 py-3, Text: text-base, Icon: 20px
```

**Large Size:**

```tsx
<ViewReportsButton size="lg" />
// Padding: px-8 py-4, Text: text-lg, Icon: 24px
```

#### Usage Examples

```tsx
// Hero section - outline variant for dark background
<ViewReportsButton
  variant="outline"
  size="lg"
  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
/>

// Map section - primary with scale animation
<ViewReportsButton
  size="lg"
  className="flex-1 sm:flex-none transform hover:scale-105 transition-transform duration-200"
/>

// Navigation - compact version without icon
<ViewReportsButton
  className="hidden md:flex"
  showIcon={false}
/>
```

### ViewReportsCard Component

An alternative card-style presentation of the view reports functionality:

<augment_code_snippet path="src/components/Common/ViewReportsButton.tsx" mode="EXCERPT">

```tsx
export const ViewReportsCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => navigate("/reports")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group
        ${className}
      `}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileText size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            View All Reports
          </h3>
          <p className="text-gray-600 text-sm">
            Browse disaster reports in your area
          </p>
        </div>
      </div>
    </div>
  );
};
```

</augment_code_snippet>

### ReportMap Component

Interactive map component built on Leaflet.js for displaying geographical data:

#### Component Interface

<augment_code_snippet path="src/components/Map/ReportMap.tsx" mode="EXCERPT">

```tsx
interface ReportMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
  height?: string;
}

const ReportMap: React.FC<ReportMapProps> = ({
  reports,
  selectedReport,
  onReportSelect,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
};
```

</augment_code_snippet>

#### Custom Styling

The map includes custom CSS for enhanced popup styling:

```css
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.4;
}

.custom-popup .leaflet-popup-tip {
  background: white;
}
```

#### Usage Examples

```tsx
// Basic map with reports
<ReportMap
  reports={recentReports}
  height="500px"
/>

// Interactive map with selection callback
<ReportMap
  reports={allReports}
  selectedReport={selectedReport}
  onReportSelect={handleReportSelect}
  height="600px"
/>

// Compact map for dashboard
<ReportMap
  reports={nearbyReports}
  height="300px"
/>
```

### LoadingSpinner Component

Simple, reusable loading indicator with configurable size and styling:

<augment_code_snippet path="src/components/Common/LoadingSpinner.tsx" mode="EXCERPT">

```tsx
interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader size={size} className="animate-spin text-red-600" />
    </div>
  );
};
```

</augment_code_snippet>

#### Usage Patterns

```tsx
// Default spinner
<LoadingSpinner />

// Large spinner for main loading states
<LoadingSpinner size={48} className="py-12" />

// Inline spinner with custom color
<LoadingSpinner size={16} className="text-blue-600" />

// Overlay spinner
<div className="absolute inset-0 bg-white/80 flex items-center justify-center">
  <LoadingSpinner size={32} />
</div>
```

### ChatWidget Component

Floating chat interface with comprehensive messaging functionality:

#### Component Architecture

<augment_code_snippet path="src/components/Chat/ChatWidget.tsx" mode="EXCERPT">

```tsx
interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat implementation */}
    </div>
  );
};
```

</augment_code_snippet>

#### Features

- **Real-time Messaging**: WebSocket integration for live chat
- **File Upload**: Support for images and documents
- **Emoji Picker**: Rich emoji selection interface
- **User List**: Online users and presence indicators
- **Message Reactions**: Like, love, and other reactions
- **Typing Indicators**: Real-time typing status
- **Message Editing**: Edit and delete message functionality

### Header Component

Global navigation header with responsive design and role-based menu items:

#### Component Structure

<augment_code_snippet path="src/components/Layout/Header.tsx" mode="EXCERPT">

```tsx
const Header: React.FC = () => {
  const { user, logout, isAdmin, isEditor, isUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getNavItems = () => {
    const baseItems = [
      { name: "Home", path: "/" },
      { name: "View Reports", path: "/reports" },
      { name: "Resources", path: "/resources" },
      { name: "Partners", path: "/partners" },
    ];

    if (user && isUser()) {
      return [
        ...baseItems,
        { name: "Report Impact", path: "/report/new" },
        { name: "My Dashboard", path: "/dashboard" },
      ];
    }

    return baseItems;
  };
};
```

</augment_code_snippet>

#### Responsive Features

- **Desktop Navigation**: Horizontal menu with hover effects
- **Mobile Navigation**: Collapsible hamburger menu
- **User Authentication**: Login/logout functionality
- **Role-based Menus**: Different navigation items based on user role
- **Sticky Positioning**: Remains visible during scroll

### Footer Component

Comprehensive footer with multiple sections and responsive layout:

<augment_code_snippet path="src/components/Layout/Footer.tsx" mode="EXCERPT">

```tsx
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-600 text-white rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">DisasterWatch</h3>
                <p className="text-sm text-gray-400">Community Reporting</p>
              </div>
            </Link>
          </div>

          {/* Navigation Sections */}
          {/* Quick Links, Resources, Legal */}
        </div>
      </div>
    </footer>
  );
};
```

</augment_code_snippet>

## Design Pattern Library

### Card Pattern System

#### Basic Card Structure

```tsx
// Standard card pattern
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
  <div className="flex items-center space-x-4 mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900">Card Title</h3>
      <p className="text-gray-600 text-sm">Card description</p>
    </div>
  </div>
  <div className="space-y-3">{/* Card content */}</div>
</div>
```

#### Interactive Card Pattern

```tsx
// Hoverable card with lift effect
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer">
  <div className="flex items-center space-x-4 mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        Interactive Card
      </h3>
      <p className="text-gray-600 text-sm">Hover for interaction</p>
    </div>
  </div>
</div>
```

#### Statistics Card Pattern

```tsx
// Statistics display card
<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
  <div className="flex items-center space-x-4">
    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
      <AlertTriangle size={32} />
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">2,847</div>
      <div className="text-gray-600">Reports Submitted</div>
    </div>
  </div>
</div>
```

### Button Pattern System

#### Primary Button Pattern

```tsx
// Primary action button
<button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
  Primary Action
</button>
```

#### Secondary Button Pattern

```tsx
// Secondary action button
<button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200">
  Secondary Action
</button>
```

#### Outline Button Pattern

```tsx
// Outline button
<button className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200">
  Outline Action
</button>
```

#### Icon Button Pattern

```tsx
// Icon button with text
<button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200">
  <Icon size={20} />
  <span>Action with Icon</span>
</button>
```

### Layout Pattern System

#### Section Container Pattern

```tsx
// Standard section layout
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Section Title
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Section description
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Section content */}
    </div>
  </div>
</section>
```

#### Hero Section Pattern

```tsx
// Hero section layout
<section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
        Hero Title
      </h1>
      <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
        Hero description
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        {/* Hero actions */}
      </div>
    </div>
  </div>
</section>
```

#### Feature Section Pattern

```tsx
// Alternating feature layout
<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
  <div className="flex-1 space-y-6">
    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
      Feature Title
    </h3>
    <p className="text-xl text-gray-600 leading-relaxed">Feature description</p>
  </div>

  <div className="flex-1">
    <div className="bg-blue-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
      {/* Feature visualization */}
    </div>
  </div>
</div>
```

## Developer Guidelines and Best Practices

### Code Organization Standards

#### File Structure Convention

```
src/
├── components/
│   ├── Common/           # Reusable UI components
│   │   ├── ViewReportsButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts      # Export barrel
│   ├── Layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── Map/              # Map-specific components
│   │   ├── ReportMap.tsx
│   │   └── index.ts
│   └── Chat/             # Chat functionality
│       ├── ChatWidget.tsx
│       └── index.ts
├── pages/                # Page components
│   ├── Home.tsx
│   └── index.ts
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Global styles and Tailwind config
```

#### Component Naming Conventions

```tsx
// ✅ Good: PascalCase for components
const ViewReportsButton: React.FC<ViewReportsButtonProps> = () => {};

// ✅ Good: Descriptive interface names
interface ViewReportsButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

// ✅ Good: Consistent export pattern
export default ViewReportsButton;
export type { ViewReportsButtonProps };
```

#### Import Organization

```tsx
// ✅ Good: Organized import structure
// 1. React and external libraries
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

// 2. Internal components and hooks
import { LoadingSpinner } from "../Common";
import { useAuth } from "../../hooks/useAuth";

// 3. Types and utilities
import type { Report } from "../../types/report";
import { formatDate } from "../../utils/dateUtils";
```

### Component Development Guidelines

#### Props Interface Design

```tsx
// ✅ Good: Comprehensive interface with defaults
interface ComponentProps {
  // Required props first
  title: string;
  data: Report[];

  // Optional props with clear types
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;

  // Event handlers
  onSelect?: (item: Report) => void;
  onError?: (error: Error) => void;

  // Boolean flags
  showIcon?: boolean;
  disabled?: boolean;
}

// ✅ Good: Default props pattern
const Component: React.FC<ComponentProps> = ({
  title,
  data,
  variant = "primary",
  size = "md",
  className = "",
  onSelect,
  onError,
  showIcon = true,
  disabled = false,
}) => {
  // Component implementation
};
```

#### State Management Patterns

```tsx
// ✅ Good: Descriptive state names
const [isLoading, setIsLoading] = useState(false);
const [selectedReport, setSelectedReport] = useState<Report | null>(null);
const [validationErrors, setValidationErrors] = useState<string[]>([]);

// ✅ Good: State update patterns
const handleReportSelect = useCallback(
  (report: Report) => {
    setSelectedReport(report);
    onSelect?.(report);
  },
  [onSelect]
);

// ✅ Good: Error handling
const handleError = useCallback(
  (error: Error) => {
    console.error("Component error:", error);
    onError?.(error);
  },
  [onError]
);
```

#### Event Handler Conventions

```tsx
// ✅ Good: Consistent naming pattern
const handleButtonClick = () => {};
const handleInputChange = (value: string) => {};
const handleFormSubmit = (data: FormData) => {};

// ✅ Good: Event handler with cleanup
useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### Styling Guidelines

#### Tailwind CSS Best Practices

```tsx
// ✅ Good: Logical class ordering
<div className="
  // Layout
  flex items-center justify-between
  // Spacing
  px-6 py-4 mb-4
  // Sizing
  w-full h-16
  // Colors
  bg-white text-gray-900
  // Borders
  border border-gray-200 rounded-xl
  // Effects
  shadow-sm hover:shadow-lg
  // Transitions
  transition-all duration-200
">

// ✅ Good: Responsive design patterns
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 sm:gap-6 lg:gap-8
  px-4 sm:px-6 lg:px-8
">

// ✅ Good: Conditional classes
<button className={`
  px-6 py-3 rounded-xl font-semibold transition-all duration-200
  ${variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}
`}>
```

#### Custom CSS Guidelines

```css
/* ✅ Good: Component-scoped styles */
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* ✅ Good: Utility class patterns */
.section-padding {
  @apply py-12 sm:py-16 md:py-20 lg:py-24;
}

.container-width {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Performance Optimization

#### Component Optimization

```tsx
// ✅ Good: Memoization for expensive components
const ExpensiveComponent = React.memo<ComponentProps>(({ data, onSelect }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: formatDate(item.createdAt),
    }));
  }, [data]);

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => onSelect(item)}>
          {item.title}
        </div>
      ))}
    </div>
  );
});

// ✅ Good: Callback memoization
const handleItemSelect = useCallback(
  (item: Report) => {
    setSelectedItem(item);
    onItemSelect?.(item);
  },
  [onItemSelect]
);
```

#### Image Optimization

```tsx
// ✅ Good: Responsive images with lazy loading
<img
  src={image.src}
  alt={image.alt}
  className="w-full h-auto object-cover rounded-lg"
  loading="lazy"
  srcSet={`
    ${image.small} 480w,
    ${image.medium} 768w,
    ${image.large} 1200w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Accessibility Guidelines

#### Semantic HTML

```tsx
// ✅ Good: Semantic structure
<main id="main-content">
  <section aria-labelledby="hero-title">
    <h1 id="hero-title">Page Title</h1>
    <p>Page description</p>
  </section>

  <section aria-labelledby="features-title">
    <h2 id="features-title">Features</h2>
    <ul role="list">
      <li>Feature item</li>
    </ul>
  </section>
</main>

// ✅ Good: Interactive elements
<button
  type="button"
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <X size={20} aria-hidden="true" />
</button>
```

#### Focus Management

```tsx
// ✅ Good: Focus indicators
<button className="
  px-6 py-3 bg-blue-600 text-white rounded-xl
  focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2
  transition-all duration-200
">

// ✅ Good: Skip links
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
>
  Skip to main content
</a>
```

### Testing Guidelines

#### Component Testing

```tsx
// ✅ Good: Comprehensive component tests
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewReportsButton } from "../ViewReportsButton";

describe("ViewReportsButton", () => {
  it("renders with default props", () => {
    render(<ViewReportsButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    render(<ViewReportsButton variant="outline" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-2", "border-blue-500");
  });

  it("handles click events", () => {
    const mockNavigate = jest.fn();
    render(<ViewReportsButton />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/reports");
  });
});
```

### Maintenance Guidelines

#### Code Review Checklist

- [ ] **Component Structure**: Follows established patterns
- [ ] **Props Interface**: Well-defined with appropriate types
- [ ] **Styling**: Uses Tailwind classes consistently
- [ ] **Accessibility**: Includes proper ARIA attributes
- [ ] **Performance**: Implements memoization where needed
- [ ] **Testing**: Includes comprehensive test coverage
- [ ] **Documentation**: JSDoc comments for complex logic

#### Refactoring Guidelines

```tsx
// ✅ Good: Extract reusable logic
const useButtonVariant = (variant: ButtonVariant) => {
  return useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700";
      case "secondary":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      case "outline":
        return "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700";
    }
  }, [variant]);
};

// ✅ Good: Extract complex components
const StatisticsCard = ({
  stat,
  index,
}: {
  stat: Statistic;
  index: number;
}) => (
  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <div
        className={`p-4 rounded-2xl bg-gradient-to-br ${getStatColor(
          stat.color
        )} text-white shadow-lg`}
      >
        <stat.icon size={32} />
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
        <div className="text-gray-600">{stat.label}</div>
      </div>
    </div>
  </div>
);
```

### Extension Guidelines

#### Adding New Components

1. **Create Component File**: Follow naming conventions
2. **Define Props Interface**: Include all necessary types
3. **Implement Component**: Use established patterns
4. **Add to Index**: Export from appropriate index file
5. **Write Tests**: Ensure comprehensive coverage
6. **Update Documentation**: Add usage examples

#### Modifying Existing Components

1. **Backward Compatibility**: Maintain existing prop interfaces
2. **Deprecation Strategy**: Mark old props as deprecated before removal
3. **Migration Guide**: Provide clear upgrade instructions
4. **Version Documentation**: Document changes in component comments

### Deployment Considerations

#### Build Optimization

```javascript
// vite.config.js optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react"],
          maps: ["leaflet"],
        },
      },
    },
  },
});
```

#### Performance Monitoring

```tsx
// ✅ Good: Performance monitoring
const ComponentWithMetrics = () => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`Component render time: ${endTime - startTime}ms`);
    };
  }, []);
};
```

This documentation provides a comprehensive guide to understanding, maintaining, and extending the DisasterWatch home page UI. The modular architecture and consistent design system make it easy to add new features while maintaining visual and functional coherence.
