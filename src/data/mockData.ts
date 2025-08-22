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


