import { Report, Statistics, Feature, Partner } from '../types';
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

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Severe Flooding in Downtown Business District',
    description: 'Heavy rainfall over 6 hours caused severe flooding in the downtown business district. Water levels reached 3 feet in some areas, affecting multiple businesses and causing traffic disruptions. Storm drains were overwhelmed and several vehicles were stranded.',
    location: {
      address: 'Financial District, Lower Manhattan, New York, NY',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    disasterType: 'flood',
    disasterDetail: 'Flash Flood',
    severity: 'high',
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    reporterName: 'John Smith',
    photos: [],
    verified: false,
    assistanceNeeded: ['Emergency Pumping', 'Water Extraction', 'Temporary Shelter', 'Damage Assessment'],
    assistanceDescription: 'Urgent need for emergency pumping equipment, water extraction services, and temporary shelter for displaced residents. Several businesses require immediate water damage assessment.',
    assistanceLog: [
      {
        id: '1',
        createdAt: new Date('2024-01-15T11:00:00Z'),
        description: 'Emergency services dispatched, water rescue team deployed',
        providerName: 'City Emergency Services',
        endorsed: true
      },
      {
        id: '2',
        createdAt: new Date('2024-01-15T11:30:00Z'),
        description: 'Portable pumps deployed to critical areas',
        providerName: 'Public Works Department',
        endorsed: true
      }
    ]
  },
  {
    id: '2',
    title: 'Earthquake Structural Damage - Hillside Residential',
    description: 'Magnitude 5.2 earthquake at 8:15 AM caused significant structural damage to 12 homes in the Hillside residential area. Multiple foundation cracks, broken windows, and damaged chimneys reported. Roads have visible cracks and one gas line was damaged.',
    location: {
      address: 'Times Square Area, Midtown Manhattan, New York, NY',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    disasterType: 'earthquake',
    disasterDetail: 'Earthquake',
    severity: 'medium',
    status: 'verified',
    createdAt: new Date('2024-01-14T08:15:00Z'),
    updatedAt: new Date('2024-01-14T16:30:00Z'),
    reporterName: 'Maria Garcia',
    photos: [],
    verified: true,
    assistanceNeeded: ['Structural Assessment', 'Temporary Housing', 'Gas Line Repair', 'Building Safety Inspection'],
    assistanceDescription: 'Structural engineers needed for comprehensive building safety assessments. Temporary housing required for 3 families whose homes are unsafe. Gas line repair needed urgently.',
    assistanceLog: [
      {
        id: '3',
        createdAt: new Date('2024-01-14T09:00:00Z'),
        description: 'Structural assessment team deployed to affected area',
        providerName: 'County Engineering Department',
        endorsed: true
      },
      {
        id: '4',
        createdAt: new Date('2024-01-14T12:30:00Z'),
        description: 'Temporary shelter established at Hillside Community Center',
        providerName: 'American Red Cross',
        endorsed: true
      },
      {
        id: '5',
        createdAt: new Date('2024-01-14T16:30:00Z'),
        description: 'Gas line repairs completed, area declared safe',
        providerName: 'Metro Gas Company',
        endorsed: true
      }
    ]
  },
  {
    id: '3',
    title: 'Critical Wildfire Threat - Northern Hills Evacuation',
    description: 'Fast-moving wildfire covering 500 acres is rapidly approaching Northern Hills Subdivision. Wind speeds of 25 mph are pushing the fire toward residential areas. Immediate evacuation of 200+ homes may be necessary within the next 2 hours.',
    location: {
      address: 'Northern Manhattan, Washington Heights, New York, NY',
      coordinates: { lat: 40.8176, lng: -74.0431 }
    },
    disasterType: 'wildfire',
    disasterDetail: 'Wildfire',
    severity: 'critical',
    status: 'pending',
    createdAt: new Date('2024-01-16T14:45:00Z'),
    updatedAt: new Date('2024-01-16T15:15:00Z'),
    reporterName: 'David Wilson',
    photos: [],
    verified: true,
    assistanceNeeded: ['Evacuation Assistance', 'Fire Suppression', 'Emergency Shelter', 'Medical Support'],
    assistanceDescription: 'IMMEDIATE EVACUATION ASSISTANCE NEEDED. Fire suppression aircraft and ground crews required. Emergency shelter for 200+ families. Medical support for elderly and disabled residents.',
    assistanceLog: [
      {
        id: '6',
        createdAt: new Date('2024-01-16T15:00:00Z'),
        description: 'Evacuation order issued, emergency shelters opening',
        providerName: 'Emergency Management Office',
        endorsed: true
      },
      {
        id: '7',
        createdAt: new Date('2024-01-16T15:15:00Z'),
        description: 'Fire suppression aircraft dispatched',
        providerName: 'State Fire Department',
        endorsed: true
      }
    ]
  },
  {
    id: '4',
    title: 'Hurricane Maria Aftermath - Coastal District Recovery',
    description: 'Category 2 Hurricane Maria caused extensive damage throughout the coastal district. Widespread power outages affecting 15,000 residents, numerous downed trees blocking roads, damaged roofs, and flooding in low-lying areas. Recovery operations ongoing.',
    location: {
      address: 'Staten Island Waterfront, New York, NY',
      coordinates: { lat: 40.6892, lng: -74.0445 }
    },
    disasterType: 'hurricane',
    disasterDetail: 'Hurricane/Typhoon',
    severity: 'high',
    status: 'resolved',
    createdAt: new Date('2024-01-10T06:00:00Z'),
    updatedAt: new Date('2024-01-13T18:00:00Z'),
    reporterName: 'Sarah Johnson',
    photos: [],
    verified: true,
    assistanceNeeded: [],
    assistanceDescription: 'Power restoration completed. All debris removal finished. Infrastructure repairs completed.',
    assistanceLog: [
      {
        id: '8',
        createdAt: new Date('2024-01-10T08:00:00Z'),
        description: 'Emergency power restoration crews deployed',
        providerName: 'Metro Electric Company',
        endorsed: true
      },
      {
        id: '9',
        createdAt: new Date('2024-01-11T10:00:00Z'),
        description: 'Debris removal teams deployed to clear major roads',
        providerName: 'City Public Works',
        endorsed: true
      },
      {
        id: '10',
        createdAt: new Date('2024-01-12T14:00:00Z'),
        description: 'Emergency shelters established for displaced residents',
        providerName: 'Salvation Army',
        endorsed: true
      },
      {
        id: '11',
        createdAt: new Date('2024-01-13T18:00:00Z'),
        description: 'All services restored, area declared fully operational',
        providerName: 'Emergency Management Office',
        endorsed: true
      }
    ]
  },
  {
    id: '5',
    title: 'Industrial Chemical Spill - Hazmat Response',
    description: 'Chemical spill of approximately 500 gallons of industrial solvent at MetroChem facility. Hazmat team successfully contained the spill. No immediate threat to public safety, but environmental monitoring is ongoing. Facility evacuated as precaution.',
    location: {
      address: 'Industrial Area, Jersey City, NJ',
      coordinates: { lat: 40.7282, lng: -74.0776 }
    },
    disasterType: 'chemical_spill',
    disasterDetail: 'Chemical Spill',
    severity: 'medium',
    status: 'verified',
    createdAt: new Date('2024-01-12T13:20:00Z'),
    updatedAt: new Date('2024-01-12T18:45:00Z'),
    reporterName: 'Mike Chen',
    photos: [],
    verified: true,
    assistanceNeeded: [],
    assistanceDescription: 'Containment successful. Environmental cleanup completed. Air quality monitoring shows normal levels.',
    assistanceLog: [
      {
        id: '12',
        createdAt: new Date('2024-01-12T13:30:00Z'),
        description: 'Hazmat team arrived and established perimeter',
        providerName: 'County Hazmat Response Unit',
        endorsed: true
      },
      {
        id: '13',
        createdAt: new Date('2024-01-12T15:00:00Z'),
        description: 'Spill successfully contained, cleanup initiated',
        providerName: 'Environmental Services Inc.',
        endorsed: true
      },
      {
        id: '14',
        createdAt: new Date('2024-01-12T18:45:00Z'),
        description: 'Cleanup completed, air quality normal, facility cleared for reopening',
        providerName: 'Environmental Protection Agency',
        endorsed: true
      }
    ]
  },
  {
    id: '6',
    title: 'Severe Thunderstorm Damage - Westside Neighborhoods',
    description: 'Severe thunderstorm with 70 mph winds caused significant damage across Westside neighborhoods. Multiple trees down, power lines damaged, several homes with roof damage, and hail damage to vehicles. Storm lasted 45 minutes.',
    location: {
      address: 'West Village, Manhattan, New York, NY',
      coordinates: { lat: 40.7505, lng: -74.1157 }
    },
    disasterType: 'storm',
    disasterDetail: 'Hailstorm',
    severity: 'medium',
    status: 'verified',
    createdAt: new Date('2024-01-11T19:30:00Z'),
    updatedAt: new Date('2024-01-12T14:00:00Z'),
    reporterName: 'Jennifer Martinez',
    photos: [],
    verified: true,
    assistanceNeeded: ['Tree Removal', 'Roof Repair', 'Power Restoration'],
    assistanceDescription: 'Tree removal services needed for blocked roads. Roof repair assistance for 8 affected homes. Power restoration in progress.',
    assistanceLog: [
      {
        id: '15',
        createdAt: new Date('2024-01-11T20:00:00Z'),
        description: 'Emergency tree removal crews dispatched',
        providerName: 'City Tree Services',
        endorsed: true
      },
      {
        id: '16',
        createdAt: new Date('2024-01-12T09:00:00Z'),
        description: 'Power restoration 80% complete',
        providerName: 'Metro Electric Company',
        endorsed: true
      },
      {
        id: '17',
        createdAt: new Date('2024-01-12T14:00:00Z'),
        description: 'All major roads cleared, power fully restored',
        providerName: 'Emergency Coordination Center',
        endorsed: true
      }
    ]
  },
  {
    id: '7',
    title: 'Building Collapse - Construction Site Emergency',
    description: 'Partial building collapse at active construction site on 5th Avenue. Three workers injured and transported to hospital. Structural engineer on scene assessing stability of remaining structure. Adjacent buildings evacuated as precaution.',
    location: {
      address: '5th Avenue, Midtown Manhattan, New York, NY',
      coordinates: { lat: 40.7411, lng: -73.9897 }
    },
    disasterType: 'structural_failure',
    disasterDetail: 'Building Collapse',
    severity: 'high',
    status: 'pending',
    createdAt: new Date('2024-01-13T11:15:00Z'),
    updatedAt: new Date('2024-01-13T15:30:00Z'),
    reporterName: 'Robert Taylor',
    photos: [],
    verified: true,
    assistanceNeeded: ['Structural Assessment', 'Temporary Housing', 'Investigation'],
    assistanceDescription: 'Ongoing structural assessment required. Temporary housing for evacuated residents from adjacent buildings. Investigation into cause of collapse.',
    assistanceLog: [
      {
        id: '18',
        createdAt: new Date('2024-01-13T11:30:00Z'),
        description: 'Emergency medical services transported injured workers',
        providerName: 'City Emergency Medical Services',
        endorsed: true
      },
      {
        id: '19',
        createdAt: new Date('2024-01-13T12:00:00Z'),
        description: 'Structural engineer arrived for safety assessment',
        providerName: 'Metro Engineering Consultants',
        endorsed: true
      },
      {
        id: '20',
        createdAt: new Date('2024-01-13T15:30:00Z'),
        description: 'Adjacent buildings cleared for reoccupancy',
        providerName: 'Building Safety Department',
        endorsed: true
      }
    ]
  },
  {
    id: '8',
    title: 'Water Main Break - Central Business District',
    description: 'Major water main break on Central Avenue causing significant flooding and water service disruption to downtown businesses. Estimated 2 million gallons of water lost. Road closures in effect. Repair crews working to restore service.',
    location: {
      address: 'Lower Manhattan, New York, NY',
      coordinates: { lat: 40.7282, lng: -74.0021 }
    },
    disasterType: 'infrastructure_failure',
    disasterDetail: 'Water Main Break',
    severity: 'medium',
    status: 'pending',
    createdAt: new Date('2024-01-14T16:45:00Z'),
    updatedAt: new Date('2024-01-14T20:15:00Z'),
    reporterName: 'Lisa Wong',
    photos: [],
    verified: true,
    assistanceNeeded: ['Water Service Restoration', 'Traffic Management', 'Flood Cleanup'],
    assistanceDescription: 'Water service restoration for 500+ businesses. Traffic management for road closures. Cleanup of flood damage to affected storefronts.',
    assistanceLog: [
      {
        id: '21',
        createdAt: new Date('2024-01-14T17:00:00Z'),
        description: 'Water department emergency crews dispatched',
        providerName: 'Metro Water Authority',
        endorsed: true
      },
      {
        id: '22',
        createdAt: new Date('2024-01-14T18:30:00Z'),
        description: 'Traffic control established, alternate routes posted',
        providerName: 'Traffic Management Division',
        endorsed: true
      },
      {
        id: '23',
        createdAt: new Date('2024-01-14T20:15:00Z'),
        description: 'Temporary water service restored, permanent repairs ongoing',
        providerName: 'Metro Water Authority',
        endorsed: true
      }
    ]
  },
  {
    id: '9',
    title: 'Ice Storm Power Outages',
    description: 'Severe ice storm causing widespread power outages. Trees and power lines down across the region.',
    location: {
      address: 'Minneapolis, Minnesota',
      coordinates: { lat: 44.9778, lng: -93.2650 }
    },
    disasterType: 'storm',
    disasterDetail: 'Ice Storm',
    severity: 'high',
    status: 'verified',
    createdAt: new Date('2024-01-07T06:30:00Z'),
    updatedAt: new Date('2024-01-07T08:00:00Z'),
    reporterName: 'Power Company',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'
    ],
    assistanceNeeded: [
      'Power restoration',
      'Tree removal',
      'Warming centers',
      'Generator distribution'
    ],
    assistanceDescription: 'Widespread power outages affecting thousands of residents during freezing temperatures.',
    assistanceLog: [
      {
        id: '6',
        providerName: 'Utility Company',
        description: 'Mobilized emergency crews from neighboring states. Estimated 48-72 hours for full restoration.',
        createdAt: new Date('2024-01-07T09:00:00Z'),
        endorsed: true
      }
    ]
  },
  {
    id: '10',
    title: 'Coastal Erosion Emergency',
    description: 'Severe coastal erosion threatening beachfront properties. Emergency relocation may be necessary.',
    location: {
      address: 'Central Valley, California',
      coordinates: { lat: 36.7783, lng: -119.4179 }
    },
    disasterType: 'other',
    disasterDetail: 'Coastal Erosion',
    severity: 'medium',
    status: 'verified',
    createdAt: new Date('2024-01-06T14:45:00Z'),
    updatedAt: new Date('2024-01-06T15:30:00Z'),
    reporterName: 'Coastal Management',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/552789/pexels-photo-552789.jpeg'
    ],
    assistanceNeeded: [
      'Structural engineering',
      'Emergency relocation',
      'Coastal protection',
      'Property assessment'
    ],
    assistanceDescription: 'Coastal properties at risk due to accelerated erosion. Professional assessment needed.',
    assistanceLog: []
  },
  {
    id: '11',
    title: 'Drought Emergency Declaration',
    description: 'Severe drought conditions affecting agricultural areas. Water restrictions in effect.',
    location: {
      address: 'Nashville, Tennessee',
      coordinates: { lat: 36.1627, lng: -86.7816 }
    },
    disasterType: 'other',
    disasterDetail: 'Severe Drought',
    severity: 'high',
    status: 'verified',
    createdAt: new Date('2024-01-05T10:00:00Z'),
    updatedAt: new Date('2024-01-05T11:00:00Z'),
    reporterName: 'Agricultural Department',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg'
    ],
    assistanceNeeded: [
      'Water distribution',
      'Crop assistance',
      'Livestock support',
      'Emergency irrigation'
    ],
    assistanceDescription: 'Farmers need immediate assistance with water access and crop protection.',
    assistanceLog: []
  },
  {
    id: '12',
    title: 'Apartment Building Fire',
    description: 'Multi-story apartment fire with residents evacuated. Fire department on scene.',
    location: {
      address: 'Downtown Boston, Massachusetts',
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    disasterType: 'fire',
    disasterDetail: 'Apartment Fire',
    severity: 'critical',
    status: 'verified',
    createdAt: new Date('2024-01-04T18:20:00Z'),
    updatedAt: new Date('2024-01-04T19:00:00Z'),
    reporterName: 'Fire Department',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
      'https://images.pexels.com/photos/266487/pexels-photo-266487.jpeg'
    ],
    assistanceNeeded: [
      'Emergency housing',
      'Medical treatment',
      'Personal belongings recovery',
      'Insurance assistance'
    ],
    assistanceDescription: 'Displaced residents need immediate housing and support services.',
    assistanceLog: [
      {
        id: '7',
        providerName: 'Red Cross',
        description: 'Provided emergency shelter for 25 families. Distributed clothing and basic necessities.',
        createdAt: new Date('2024-01-04T20:00:00Z'),
        endorsed: true
      }
    ]
  },
  {
    id: '13',
    title: 'Sinkhole Formation',
    description: 'Large sinkhole opened on major roadway. Traffic diverted, structural damage to nearby buildings.',
    location: {
      address: 'Orlando, Florida',
      coordinates: { lat: 28.5383, lng: -81.3792 }
    },
    disasterType: 'other',
    disasterDetail: 'Sinkhole',
    severity: 'high',
    status: 'pending',
    createdAt: new Date('2024-01-03T13:15:00Z'),
    updatedAt: new Date('2024-01-03T13:15:00Z'),
    reporterName: 'City Engineering',
    verified: false,
    photos: [
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg'
    ],
    assistanceNeeded: [
      'Geological survey',
      'Traffic management',
      'Building inspection',
      'Utility assessment'
    ],
    assistanceDescription: 'Professional assessment needed for sinkhole stability and surrounding infrastructure.',
    assistanceLog: []
  },
  {
    id: '14',
    title: 'Blizzard Warning - Mountain Region',
    description: 'Heavy snowfall and high winds creating blizzard conditions. Travel extremely dangerous.',
    location: {
      address: 'Denver, Colorado',
      coordinates: { lat: 39.7391, lng: -105.0178 }
    },
    disasterType: 'storm',
    disasterDetail: 'Blizzard',
    severity: 'critical',
    status: 'verified',
    createdAt: new Date('2024-01-02T22:00:00Z'),
    updatedAt: new Date('2024-01-02T23:30:00Z'),
    reporterName: 'Weather Service',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg'
    ],
    assistanceNeeded: [
      'Snow removal',
      'Stranded motorist rescue',
      'Emergency supplies',
      'Heating assistance'
    ],
    assistanceDescription: 'Blizzard conditions trapping residents and travelers. Emergency rescue operations needed.',
    assistanceLog: [
      {
        id: '8',
        providerName: 'State Highway Patrol',
        description: 'Rescued 15 stranded motorists. Established emergency warming stations.',
        createdAt: new Date('2024-01-03T01:00:00Z'),
        endorsed: true
      }
    ]
  },
  {
    id: '15',
    title: 'Gas Leak Evacuation',
    description: 'Major gas leak requiring evacuation of 6-block radius. Utility crews working to stop leak.',
    location: {
      address: 'Downtown Cleveland, Ohio',
      coordinates: { lat: 41.4993, lng: -81.6944 }
    },
    disasterType: 'other',
    disasterDetail: 'Gas Leak',
    severity: 'critical',
    status: 'verified',
    createdAt: new Date('2024-01-01T11:30:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    reporterName: 'Gas Company',
    verified: true,
    photos: [
      'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg'
    ],
    assistanceNeeded: [
      'Evacuation assistance',
      'Air quality monitoring',
      'Temporary shelter',
      'Business closure support'
    ],
    assistanceDescription: 'Large-scale evacuation needed due to dangerous gas leak. Businesses and residents affected.',
    assistanceLog: []
  }
];

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
