import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { DisasterDataService } from '../services/disasterDataService';

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
              coordinates: [-120.0, 35.0, 10.0],
            },
            id: 'test123',
          },
        ],
        bbox: [-120.0, 35.0, 10.0, -120.0, 35.0, 10.0],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.fetchUSGSEarthquakes('M2_5_DAY');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'test123',
      disasterType: 'earthquake',
      magnitude: 5.2,
      location: {
        place: 'Test Location',
        coordinates: { lat: 35.0, lng: -120.0 },
      },
      source: 'USGS',
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.fetchUSGSEarthquakes('M2_5_DAY')).rejects.toThrow('Failed to fetch earthquake data');
  });

  it('should cache results', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: { generated: Date.now(), url: '', title: '', status: 200, api: '', count: 0 },
        features: [],
        bbox: [0, 0, 0, 0, 0, 0],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // First call
    await service.fetchUSGSEarthquakes('M2_5_DAY');
    
    // Second call should use cache
    await service.fetchUSGSEarthquakes('M2_5_DAY');

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should get disaster statistics', async () => {
    const mockResponse = {
      data: {
        type: 'FeatureCollection',
        metadata: { generated: Date.now(), url: '', title: '', status: 200, api: '', count: 2 },
        features: [
          {
            type: 'Feature',
            properties: {
              mag: 6.0,
              place: 'High Severity Location',
              time: Date.now(),
              updated: Date.now(),
              url: '',
              detail: '',
              tsunami: 0,
              sig: 500,
              net: 'us',
              code: 'high1',
              ids: '',
              sources: '',
              types: '',
              magType: 'mb',
              type: 'earthquake',
              title: 'M 6.0 - High Severity Location',
              status: 'reviewed',
            },
            geometry: { type: 'Point', coordinates: [-120.0, 35.0, 10.0] },
            id: 'high1',
          },
          {
            type: 'Feature',
            properties: {
              mag: 4.0,
              place: 'Medium Severity Location',
              time: Date.now(),
              updated: Date.now(),
              url: '',
              detail: '',
              tsunami: 0,
              sig: 300,
              net: 'us',
              code: 'med1',
              ids: '',
              sources: '',
              types: '',
              magType: 'mb',
              type: 'earthquake',
              title: 'M 4.0 - Medium Severity Location',
              status: 'reviewed',
            },
            geometry: { type: 'Point', coordinates: [-121.0, 36.0, 15.0] },
            id: 'med1',
          },
        ],
        bbox: [-121.0, 35.0, 10.0, -120.0, 36.0, 15.0],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const stats = await service.getDisasterStatistics();

    expect(stats.totalActive).toBe(2);
    expect(stats.high).toBe(1);
    expect(stats.medium).toBe(1);
    expect(stats.critical).toBe(0);
    expect(stats.low).toBe(0);
  });
});
