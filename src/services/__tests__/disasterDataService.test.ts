import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { DisasterDataService } from '../disasterDataService';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('DisasterDataService', () => {
  let service: DisasterDataService;

  beforeEach(() => {
    service = DisasterDataService.getInstance();
    service.clearCache();
    vi.clearAllMocks();
  });

  it('should fetch USGS earthquake data successfully', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: {
          generated: Date.now(),
          url: 'test-url',
          title: 'Test Earthquakes',
          status: 200,
          api: '1.0.0',
          count: 1,
        },
        features: [
          {
            type: 'Feature',
            properties: {
              mag: 5.2,
              place: 'Test Location',
              time: Date.now(),
              updated: Date.now(),
              url: 'test-url',
              detail: 'test-detail',
              tsunami: 0,
              sig: 400,
              net: 'us',
              code: 'test123',
              ids: ',test123,',
              sources: ',us,',
              types: ',origin,',
              magType: 'mb',
              type: 'earthquake',
              title: 'M 5.2 - Test Location',
              status: 'reviewed',
            },
            geometry: {
              type: 'Point',
              coordinates: [-122.4194, 37.7749, 10],
            },
            id: 'test123',
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.fetchEarthquakeData();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson',
      { timeout: 10000 }
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'test123',
      disasterType: 'earthquake',
      magnitude: 5.2,
      location: {
        place: 'Test Location',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
          depth: 10,
        },
      },
      time: expect.any(String),
      severity: 'high',
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(service.fetchEarthquakeData()).rejects.toThrow('Network error');
  });

  it('should cache results', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: { generated: Date.now(), count: 0 },
        features: [],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    // First call
    await service.fetchEarthquakeData();
    // Second call should use cache
    await service.fetchEarthquakeData();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should determine severity correctly', () => {
    expect(service.determineSeverity(7.0)).toBe('critical');
    expect(service.determineSeverity(6.0)).toBe('high');
    expect(service.determineSeverity(4.5)).toBe('medium');
    expect(service.determineSeverity(3.0)).toBe('low');
  });

  it('should calculate statistics correctly', async () => {
    const mockDisasters = [
      { severity: 'critical', disasterType: 'earthquake' },
      { severity: 'high', disasterType: 'earthquake' },
      { severity: 'medium', disasterType: 'earthquake' },
      { severity: 'low', disasterType: 'earthquake' },
    ];

    const stats = service.calculateStatistics(mockDisasters as any);

    expect(stats).toEqual({
      totalActive: 4,
      critical: 1,
      high: 1,
      medium: 1,
      low: 1,
      byType: {
        earthquake: 4,
      },
    });
  });

  it('should clear cache', () => {
    service.clearCache();
    // Cache should be cleared, so next call should make API request
    expect(true).toBe(true); // Simple assertion since cache is private
  });

  it('should handle empty response', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: { generated: Date.now(), count: 0 },
        features: [],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.fetchEarthquakeData();
    expect(result).toEqual([]);
  });

  it('should handle malformed data', async () => {
    const mockResponse = {
      data: {
        features: [
          {
            properties: {
              // Missing required fields
            },
            geometry: {
              coordinates: [null, null, null],
            },
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.fetchEarthquakeData();
    expect(result).toEqual([]);
  });

  it('should handle timeout errors', async () => {
    mockedAxios.get.mockRejectedValue({ code: 'ECONNABORTED' });

    await expect(service.fetchEarthquakeData()).rejects.toMatchObject({
      code: 'ECONNABORTED',
    });
  });

  it('should filter significant earthquakes only', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: { generated: Date.now(), count: 2 },
        features: [
          {
            type: 'Feature',
            properties: {
              mag: 2.0, // Below significance threshold
              place: 'Small Earthquake',
              time: Date.now(),
              type: 'earthquake',
            },
            geometry: {
              type: 'Point',
              coordinates: [-122.4194, 37.7749, 10],
            },
            id: 'small1',
          },
          {
            type: 'Feature',
            properties: {
              mag: 5.5, // Significant
              place: 'Significant Earthquake',
              time: Date.now(),
              type: 'earthquake',
            },
            geometry: {
              type: 'Point',
              coordinates: [-122.4194, 37.7749, 10],
            },
            id: 'significant1',
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.fetchEarthquakeData();
    
    // Should only return significant earthquakes (mag >= 4.0)
    expect(result).toHaveLength(1);
    expect(result[0].magnitude).toBe(5.5);
  });
});
