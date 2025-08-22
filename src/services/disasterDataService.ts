import {
  RealWorldDisaster,
  USGSEarthquakeResponse,
  USGSEarthquake,
} from "../types";
import { DisasterReportDto } from "../types/DisasterReport";
import { requestManager } from "../utils/requestManager";

// USGS Earthquake API endpoints
const USGS_BASE_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

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
const getMagnitudeSeverity = (
  magnitude: number
): "low" | "medium" | "high" | "critical" => {
  if (magnitude >= 7.0) return "critical";
  if (magnitude >= 6.0) return "high";
  if (magnitude >= 4.5) return "medium";
  return "low";
};

// Alert level to severity mapping
const getAlertSeverity = (
  alert?: string
): "low" | "medium" | "high" | "critical" => {
  switch (alert) {
    case "red":
      return "critical";
    case "orange":
      return "high";
    case "yellow":
      return "medium";
    case "green":
    default:
      return "low";
  }
};

// Helper function to get the higher severity level
const getHigherSeverity = (
  severity1: "low" | "medium" | "high" | "critical",
  severity2: "low" | "medium" | "high" | "critical"
): "low" | "medium" | "high" | "critical" => {
  const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
  return severityOrder[severity1] >= severityOrder[severity2]
    ? severity1
    : severity2;
};

// Convert USGS earthquake data to our standard format
const convertUSGSToDisaster = (
  earthquake: USGSEarthquake
): DisasterReportDto => {
  const { properties, geometry, id } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  // Calculate severity based on both magnitude and alert level
  const magnitudeSeverity = getMagnitudeSeverity(properties.mag || 0);
  const alertSeverity = getAlertSeverity(properties.alert);
  const finalSeverity = getHigherSeverity(magnitudeSeverity, alertSeverity);

  // Convert string severity to SeverityLevel enum
  const severityMap = {
    'low': 0,
    'medium': 1,
    'high': 2,
    'critical': 3
  };

  return {
    id: id || `earthquake-${Date.now()}`,
    title: properties.title || "Earthquake Event",
    description: `${(properties.magType || "M").toUpperCase()} ${
      properties.mag || "Unknown"
    } earthquake ${properties.place || "Unknown location"}. ${
      properties.felt ? `Felt by ${properties.felt} people. ` : ""
    }${properties.tsunami ? "Tsunami warning issued. " : ""}`,
    timestamp: new Date(properties.time || Date.now()).toISOString(),
    severity: severityMap[finalSeverity] as any,
    status: 'Accepted' as any,
    disasterTypeName: "Earthquake",
    disasterTypeId: 1,
    userId: "usgs-system",
    userName: "USGS Monitoring System",
    impactDetails: [],
    photoUrls: [],
    latitude: latitude || 0,
    longitude: longitude || 0,
    address: properties.place || "Unknown location",
    coordinatePrecision: 1
  };
};

// Disaster Data Service
export class DisasterDataService {
  private static instance: DisasterDataService;
  private cache: Map<string, { data: DisasterReportDto[]; timestamp: number }> =
    new Map();
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

  private ongoingRequests: Map<string, Promise<DisasterReportDto[]>> =
    new Map();

  // Fetch USGS earthquake data
  async fetchUSGSEarthquakes(
    feedType: keyof typeof USGS_FEEDS = "M2_5_DAY"
  ): Promise<DisasterReportDto[]> {
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
    cached?: { data: DisasterReportDto[]; timestamp: number }
  ): Promise<DisasterReportDto[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(USGS_FEEDS[feedType], {
        headers: {
          Accept: "application/json",
          "User-Agent": "DisasterResponse-App/1.0",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: USGSEarthquakeResponse = await response.json();

      const disasters = data.features.map(convertUSGSToDisaster);

      // Cache the results
      this.cache.set(cacheKey, {
        data: disasters,
        timestamp: Date.now(),
      });

      return disasters;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          // Request timed out
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          // Network error
        }
      }

      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }

      // If no cached data available, return empty array
      return [];
    }
  }

  // Fetch significant earthquakes
  async fetchSignificantEarthquakes(): Promise<DisasterReportDto[]> {
    try {
      const [significantDay, m45Day] = await Promise.allSettled([
        this.fetchUSGSEarthquakes("SIGNIFICANT_DAY"),
        this.fetchUSGSEarthquakes("M4_5_DAY"),
      ]);

      const disasters: DisasterReportDto[] = [];

      if (significantDay.status === "fulfilled") {
        disasters.push(...significantDay.value);
      }

      if (m45Day.status === "fulfilled") {
        // Filter out duplicates by ID
        const existingIds = new Set(disasters.map((d) => d.id));
        const newDisasters = m45Day.value.filter((d) => !existingIds.has(d.id));
        disasters.push(...newDisasters);
      }

      // Sort by time (most recent first) and limit to 50 events
      return disasters
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 50);
    } catch (error) {
      return [];
    }
  }

  // Fetch all recent disasters
  async fetchAllRecentDisasters(): Promise<DisasterReportDto[]> {
    try {
      const earthquakes = await this.fetchUSGSEarthquakes("M2_5_DAY");

      return earthquakes;
    } catch (error) {
      return [];
    }
  }

  // Get disaster statistics
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

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const disasterDataService = DisasterDataService.getInstance();
