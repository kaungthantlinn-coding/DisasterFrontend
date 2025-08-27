import { Statistics, Feature, Partner } from '../types';
import {
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Shield,
  MapPin,
  MessageSquare,
  Zap,
  Heart,
  Globe
} from 'lucide-react';

// Note: Mock reports have been removed. Use the ReportsAPI and useReports hook for real data.

export const mockStatistics: Statistics = {
  reportsSubmitted: 2847,
  livesHelped: 12450,
  verifiedReports: 2189,
  averageResponseTime: '< 2hrs'
};

export const organizationFeatures: Feature[] = [
  {
    id: '1',
    number: '01',
    title: 'Real-Time Disaster Reporting',
    description: 'Submit and track disaster reports instantly with our advanced reporting system. Include photos, location data, and detailed descriptions to help emergency responders act quickly.',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50'
  },
  {
    id: '2',
    number: '02',
    title: 'Community Response Network',
    description: 'Connect with local volunteers, emergency services, and community organizations. Coordinate relief efforts and share resources effectively during crisis situations.',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: '3',
    number: '03',
    title: 'Verified Information Hub',
    description: 'Access verified, up-to-date information about ongoing disasters. Our team works with official sources to ensure accuracy and prevent misinformation.',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
  {
    id: '4',
    number: '04',
    title: 'Emergency Communication',
    description: 'Stay connected when traditional communication fails. Our platform provides alternative communication channels during emergencies.',
    icon: MessageSquare,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50'
  }
];

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Red Cross',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1',
    website: 'https://redcross.org'
  },
  {
    id: '2',
    name: 'FEMA',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1',
    website: 'https://fema.gov'
  },
  {
    id: '3',
    name: 'Local Emergency Services',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1'
  },
  {
    id: '4',
    name: 'Salvation Army',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1',
    website: 'https://salvationarmy.org'
  },
  {
    id: '5',
    name: 'United Way',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1',
    website: 'https://unitedway.org'
  },
  {
    id: '6',
    name: 'Habitat for Humanity',
    logo: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&dpr=1',
    website: 'https://habitat.org'
  }
];
