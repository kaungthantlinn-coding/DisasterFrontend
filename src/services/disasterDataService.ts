
import { RealWorldDisaster, USGSEarthquakeResponse, USGSEarthquake } from '../types';
import { mockReports } from '../data/mockData';
import { requestManager } from '../utils/requestManager';

// USGS Earthquake API endpoints
const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// Available USGS feeds
export const USGS_FEEDS = {
  SIGNIFICANT_DAY: `${USGS_BASE_URL}/significant_day.geojson`,
  SIGNIFICANT_WEEK: `${USGS_BASE_URL}/significant_week.geojson`,
  M4_5_DAY: `${USGS_BASE_URL}/4.5_day.geojson`,
  M4_5_WEEK: `${USGS_BASE_URL}/4.5_week.geojson`,
  M2_5_DAY: `${USGS_BASE_URL}/2.5_day.geojson`,
  M2_5_WEEK: `${USGS_BASE_URL}/2.5_week.geojson`,
  ALL_DAY: `${USGS_BASE_URL}/all_day.geojson`,
  ALL_WEEK: `${USGS_BASE_URL}/all_week.geojson`,
} as const;

// Severity mapping based on earthquake magnitude
const getMagnitudeSeverity = (magnitude: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (magnitude >= 7.0) return 'critical';
  if (magnitude >= 6.0) return 'high';
  if (magnitude >= 4.5) return 'medium';
  return 'low';
};

// Alert level to severity mapping
const getAlertSeverity = (alert?: string): 'low' | 'medium' | 'high' | 'critical' => {
  switch (alert) {
    case 'red': return 'critical';
    case 'orange': return 'high';
    case 'yellow': return 'medium';
    case 'green':
    default: return 'low';
  }
};

// Helper function to get the higher severity level
const getHigherSeverity = (severity1: 'low' | 'medium' | 'high' | 'critical', severity2: 'low' | 'medium' | 'high' | 'critical'): 'low' | 'medium' | 'high' | 'critical' => {
  const severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  return severityOrder[severity1] >= severityOrder[severity2] ? severity1 : severity2;
};

// Convert USGS earthquake data to our standard format
const convertUSGSToDisaster = (earthquake: USGSEarthquake): RealWorldDisaster => {
  const { properties, geometry, id } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  // Calculate severity based on both magnitude and alert level
  const magnitudeSeverity = getMagnitudeSeverity(properties.mag || 0);
  const alertSeverity = getAlertSeverity(properties.alert);
  const finalSeverity = getHigherSeverity(magnitudeSeverity, alertSeverity);



  return {
    id: id || `earthquake-${Date.now()}`,
    title: properties.title || 'Earthquake Event',
    description: `${(properties.magType || 'M').toUpperCase()} ${properties.mag || 'Unknown'} earthquake ${properties.place || 'Unknown location'}. ${
      properties.felt ? `Felt by ${properties.felt} people. ` : ''
    }${properties.tsunami ? 'Tsunami warning issued. ' : ''}`,
    location: {
      coordinates: { lat: latitude || 0, lng: longitude || 0 },
      place: properties.place || 'Unknown location',
    },
    disasterType: 'earthquake',
    severity: finalSeverity,
    magnitude: properties.mag || 0,
    time: new Date(properties.time || Date.now()),
    updatedAt: new Date(properties.updated || Date.now()),
    source: 'USGS',
    url: properties.url || '',
    alertLevel: properties.alert || 'green',
    depth: depth || 0,
    felt: properties.felt || 0,
    tsunami: properties.tsunami === 1,
    significance: properties.sig || 0,
  };
};

// Disaster Data Service
export class DisasterDataService {
  private static instance: DisasterDataService;
  private cache: Map<string, { data: RealWorldDisaster[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes - longer cache to reduce API calls

  static getInstance(): DisasterDataService {
    if (!DisasterDataService.instance) {
      DisasterDataService.instance = new DisasterDataService();
    }
    return DisasterDataService.instance;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Generate fallback earthquake data from mock reports when API is unavailable
   */
  private generateFallbackEarthquakeData(): RealWorldDisaster[] {
    const earthquakeReports = mockReports.filter(report => report.disasterType === 'earthquake');

    return earthquakeReports.map(report => ({
      id: `fallback-${report.id}`,
      title: report.title,
      description: report.description,
      location: {
        coordinates: report.location.coordinates,
        place: report.location.address,
      },
      magnitude: 4.2 + Math.random() * 2.8, // Random magnitude between 4.2 and 7.0
      depth: 10 + Math.random() * 40, // Random depth between 10-50 km
      time: report.createdAt,
      severity: report.severity as 'low' | 'medium' | 'high' | 'critical',
      type: 'earthquake',
      source: 'Mock Data (Offline)',
      url: '#',
      alert: null,
      tsunami: false,
      felt: Math.floor(Math.random() * 100),
      significance: Math.floor(Math.random() * 1000),
    }));
  }

  // Track ongoing requests to prevent duplicate calls
  private ongoingRequests: Map<string, Promise<RealWorldDisaster[]>> = new Map();

  /**
   * Fetch earthquake data from USGS
   */
  async fetchUSGSEarthquakes(feedType: keyof typeof USGS_FEEDS = 'M2_5_DAY'): Promise<RealWorldDisaster[]> {
    const cacheKey = `usgs_${feedType}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    // Use global request manager to prevent duplicate calls
    return requestManager.executeRequest(cacheKey, () => 
      this.performUSGSRequest(feedType, cacheKey, cached)
    );
  }

  private async performUSGSRequest(
    feedType: keyof typeof USGS_FEEDS, 
    cacheKey: string, 
    cached?: { data: RealWorldDisaster[]; timestamp: number }
  ): Promise<RealWorldDisaster[]> {
    try {
      console.log(`Fetching earthquake data from: ${USGS_FEEDS[feedType]}`);
      
      // Create abort controller for better timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(USGS_FEEDS[feedType], {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DisasterResponse-App/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: USGSEarthquakeResponse = await response.json();
      console.log(`✅ Received ${data.features.length} earthquakes from USGS`);

      const disasters = data.features.map(convertUSGSToDisaster);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: disasters,
        timestamp: Date.now(),
      });

      return disasters;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('⏱️ USGS earthquake data request timed out - using fallback data');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          console.warn('🌐 Network error: Unable to reach USGS earthquake service - using fallback data');
        } else {
          console.error('❌ Error fetching USGS earthquake data:', error.message);
        }
      } else {
        console.error('❌ Unknown error fetching USGS earthquake data:', error);
      }

      // Return cached data if available, even if expired
      if (cached) {
        console.warn('📦 Using expired cache data due to API error');
        return cached.data;
      }

      // If no cached data available, use fallback mock data
      console.warn('🔄 No cached data available, using fallback earthquake data from mock reports');
      const fallbackData = this.generateFallbackEarthquakeData();

      // Cache the fallback data for future use
      this.cache.set(cacheKey, {
        data: fallbackData,
        timestamp: Date.now(),
      });

      return fallbackData;
    }
  }

  /**
   * Fetch significant earthquakes (magnitude 4.5+ or felt reports)
   */
  async fetchSignificantEarthquakes(): Promise<RealWorldDisaster[]> {
    try {
      const [significantDay, m45Day] = await Promise.allSettled([
        this.fetchUSGSEarthquakes('SIGNIFICANT_DAY'),
        this.fetchUSGSEarthquakes('M4_5_DAY'),
      ]);

      const disasters: RealWorldDisaster[] = [];
      
      if (significantDay.status === 'fulfilled') {
        disasters.push(...significantDay.value);
      }
      
      if (m45Day.status === 'fulfilled') {
        // Filter out duplicates by ID
        const existingIds = new Set(disasters.map(d => d.id));
        const newDisasters = m45Day.value.filter(d => !existingIds.has(d.id));
        disasters.push(...newDisasters);
      }

      // Sort by time (most recent first) and limit to 50 events
      return disasters
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 50);
    } catch (error) {
      console.error('Error fetching significant earthquakes:', error);
      return [];
    }
  }

  /**
   * Fetch all recent disasters from multiple sources
   */
  async fetchAllRecentDisasters(): Promise<RealWorldDisaster[]> {
    try {
      // For now, we're only using USGS earthquake data
      // In the future, we can add more sources like GDACS, weather APIs, etc.
      const earthquakes = await this.fetchUSGSEarthquakes('M2_5_DAY');

      return earthquakes;
    } catch (error) {
      console.error('Error fetching disaster data:', error);
      return [];
    }
  }

  /**
   * Get disaster statistics
   */
  async getDisasterStatistics(): Promise<{
    totalActive: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    lastUpdated: Date;
  }> {
    try {
      const disasters = await this.fetchAllRecentDisasters();
      
      const stats = disasters.reduce(
        (acc, disaster) => {
          acc.totalActive++;
          acc[disaster.severity]++;
          return acc;
        },
        { totalActive: 0, critical: 0, high: 0, medium: 0, low: 0 }
      );

      return {
        ...stats,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error getting disaster statistics:', error);
      return {
        totalActive: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const disasterDataService = DisasterDataService.getInstance();
