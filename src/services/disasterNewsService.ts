import { api } from './api';

export interface DisasterNewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: Date;
  location?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type: 'earthquake' | 'wildfire' | 'flood' | 'storm' | 'cyclone' | 'volcano' | 'other';
  magnitude?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  url?: string;
}

class DisasterNewsService {
  private static instance: DisasterNewsService;
  private cache: Map<string, { data: DisasterNewsItem[]; timestamp: number }> = new Map();
  private cacheTimeout = 2 * 60 * 1000; // 2 minutes for real-time data

  public static getInstance(): DisasterNewsService {
    if (!DisasterNewsService.instance) {
      DisasterNewsService.instance = new DisasterNewsService();
    }
    return DisasterNewsService.instance;
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // USGS Earthquake data
  async getEarthquakeData(): Promise<DisasterNewsItem[]> {
    const cacheKey = 'earthquakes';
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      const data = await response.json();
      
      const earthquakes: DisasterNewsItem[] = data.features?.map((feature: any) => ({
        id: feature.id,
        title: `M${feature.properties.mag} Earthquake - ${feature.properties.place}`,
        source: 'USGS',
        timestamp: new Date(feature.properties.time),
        location: feature.properties.place,
        severity: this.getMagnitudeSeverity(feature.properties.mag),
        type: 'earthquake' as const,
        magnitude: feature.properties.mag,
        coordinates: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        },
        url: feature.properties.url
      })).filter((eq: any) => eq.magnitude >= 2.0) || []; // Include magnitude 2.0+ for comprehensive monitoring

      this.cache.set(cacheKey, { data: earthquakes, timestamp: Date.now() });
      return earthquakes;
    } catch (error) {
      console.error('Failed to fetch earthquake data:', error);
      return [];
    }
  }

  // NASA EONET Events
  async getNASAEvents(): Promise<DisasterNewsItem[]> {
    const cacheKey = 'nasa_events';
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=30&status=open');
      const data = await response.json();
      
      const events: DisasterNewsItem[] = data.events?.map((event: any) => {
        const latestGeometry = event.geometry?.[event.geometry.length - 1];
        return {
          id: event.id,
          title: `${event.title}`,
          source: 'NASA EONET',
          timestamp: new Date(event.geometry?.[0]?.date || Date.now()),
          location: this.getLocationFromCoordinates(latestGeometry?.coordinates),
          severity: this.getCategorySeverity(event.categories),
          type: this.mapNASACategory(event.categories),
          coordinates: latestGeometry ? {
            lat: latestGeometry.coordinates[1],
            lng: latestGeometry.coordinates[0]
          } : undefined,
          url: event.sources?.[0]?.url
        };
      }) || [];

      this.cache.set(cacheKey, { data: events, timestamp: Date.now() });
      return events;
    } catch (error) {
      console.error('Failed to fetch NASA EONET data:', error);
      return [];
    }
  }

  // ReliefWeb API
  async getReliefWebDisasters(): Promise<DisasterNewsItem[]> {
    const cacheKey = 'reliefweb';
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://api.reliefweb.int/v1/disasters?appname=DisasterWatch&profile=list&preset=latest&limit=30');
      const data = await response.json();
      
      const disasters: DisasterNewsItem[] = data.data?.map((item: any) => ({
        id: item.id,
        title: `${item.fields.name} - ${item.fields.country?.[0]?.name || 'Unknown Location'}`,
        source: 'ReliefWeb',
        timestamp: new Date(item.fields.date?.created || Date.now()),
        location: item.fields.country?.[0]?.name,
        severity: this.getReliefWebSeverity(item.fields.status),
        type: this.mapReliefWebType(item.fields.type?.[0]?.name),
        url: item.fields.url_alias ? `https://reliefweb.int${item.fields.url_alias}` : undefined
      })) || [];

      this.cache.set(cacheKey, { data: disasters, timestamp: Date.now() });
      return disasters;
    } catch (error) {
      console.error('Failed to fetch ReliefWeb data:', error);
      return [];
    }
  }

  // Get all disaster news
  async getAllDisasterNews(): Promise<DisasterNewsItem[]> {
    try {
      const [earthquakes, nasaEvents, reliefWebEvents] = await Promise.allSettled([
        this.getEarthquakeData(),
        this.getNASAEvents(),
        this.getReliefWebDisasters()
      ]);

      const allEvents: DisasterNewsItem[] = [];
      
      if (earthquakes.status === 'fulfilled') {
        allEvents.push(...earthquakes.value);
      }
      if (nasaEvents.status === 'fulfilled') {
        allEvents.push(...nasaEvents.value);
      }
      if (reliefWebEvents.status === 'fulfilled') {
        allEvents.push(...reliefWebEvents.value);
      }

      // Sort by timestamp (newest first) and limit to 100 items for comprehensive coverage
      return allEvents
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 100);
    } catch (error) {
      console.error('Failed to fetch disaster news:', error);
      return [];
    }
  }

  // Helper methods
  private getMagnitudeSeverity(magnitude: number): 'low' | 'medium' | 'high' | 'critical' {
    if (magnitude >= 7) return 'critical';
    if (magnitude >= 6) return 'high';
    if (magnitude >= 4) return 'medium';
    return 'low';
  }

  private getCategorySeverity(categories: any[]): 'low' | 'medium' | 'high' | 'critical' {
    if (!categories || categories.length === 0) return 'medium';
    
    const category = categories[0]?.title?.toLowerCase() || '';
    if (category.includes('severe') || category.includes('major')) return 'critical';
    if (category.includes('wildfire') || category.includes('volcano')) return 'high';
    return 'medium';
  }

  private getReliefWebSeverity(status: string): 'low' | 'medium' | 'high' | 'critical' {
    if (!status) return 'medium';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('severe') || statusLower.includes('emergency')) return 'critical';
    if (statusLower.includes('alert') || statusLower.includes('warning')) return 'high';
    return 'medium';
  }

  private mapNASACategory(categories: any[]): DisasterNewsItem['type'] {
    if (!categories || categories.length === 0) return 'other';
    
    const category = categories[0]?.title?.toLowerCase() || '';
    if (category.includes('wildfire')) return 'wildfire';
    if (category.includes('storm') || category.includes('severe')) return 'storm';
    if (category.includes('flood')) return 'flood';
    if (category.includes('volcano')) return 'volcano';
    if (category.includes('cyclone') || category.includes('hurricane') || category.includes('typhoon')) return 'cyclone';
    return 'other';
  }

  private mapReliefWebType(type: string): DisasterNewsItem['type'] {
    if (!type) return 'other';
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('earthquake')) return 'earthquake';
    if (typeLower.includes('flood')) return 'flood';
    if (typeLower.includes('storm') || typeLower.includes('cyclone') || typeLower.includes('hurricane') || typeLower.includes('typhoon')) return 'cyclone';
    if (typeLower.includes('wildfire') || typeLower.includes('fire')) return 'wildfire';
    if (typeLower.includes('volcano')) return 'volcano';
    return 'other';
  }

  private getLocationFromCoordinates(coordinates: number[]): string {
    if (!coordinates || coordinates.length < 2) return 'Unknown Location';
    // This is a simplified location mapping - in a real app, you'd use a reverse geocoding service
    const lat = coordinates[1];
    const lng = coordinates[0];
    
    // Basic region mapping based on coordinates
    if (lat > 23.5 && lat < 71 && lng > -180 && lng < -30) return 'North America';
    if (lat > -60 && lat < 15 && lng > -90 && lng < -30) return 'South America';
    if (lat > 35 && lat < 75 && lng > -15 && lng < 180) return 'Europe/Asia';
    if (lat > -40 && lat < 40 && lng > -20 && lng < 60) return 'Africa';
    if (lat > -50 && lat < -10 && lng > 110 && lng < 180) return 'Australia';
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  }

  // Generate fallback URL based on event type and source
  private generateFallbackUrl(item: DisasterNewsItem): string {
    // Source-specific URLs
    if (item.source === 'USGS' && item.type === 'earthquake') {
      if (item.id) {
        return `https://earthquake.usgs.gov/earthquakes/eventpage/${item.id}`;
      }
      return 'https://earthquake.usgs.gov/earthquakes/map/';
    }
    
    if (item.source === 'NASA EONET') {
      if (item.id) {
        return `https://eonet.gsfc.nasa.gov/api/v3/events/${item.id}`;
      }
      return 'https://eonet.gsfc.nasa.gov/';
    }
    
    if (item.source === 'ReliefWeb') {
      return 'https://reliefweb.int/disasters';
    }
    
    // Disaster type-specific official sources
    const baseUrls: Record<DisasterNewsItem['type'], string> = {
      earthquake: 'https://earthquake.usgs.gov/earthquakes/map/',
      wildfire: 'https://inciweb.nwcg.gov/',
      flood: 'https://water.weather.gov/ahps/',
      storm: 'https://www.nhc.noaa.gov/',
      cyclone: 'https://www.nhc.noaa.gov/',
      volcano: 'https://volcanoes.usgs.gov/',
      other: 'https://www.gdacs.org/'
    };
    
    return baseUrls[item.type] || baseUrls.other;
  }

  // Get URL with fallback
  getItemUrl(item: DisasterNewsItem): string {
    return item.url || this.generateFallbackUrl(item);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export const disasterNewsService = DisasterNewsService.getInstance();