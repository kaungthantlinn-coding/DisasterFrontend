import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';

interface UserStatsUpdate {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newJoins: number;
  timestamp: string;
}

interface ChartDataUpdate {
  monthlyData: Array<{
    month: string;
    activeUsers: number;
    suspendedUsers: number;
    newJoins: number;
  }>;
  roleDistribution: {
    admin: number;
    cj: number;
    user: number;
  };
  timestamp: string;
}

class SignalRService {
  private connection: HubConnection | null = null;
  public isConnected = false;
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts = 0;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  // Event listeners
  private chartDataListeners: Array<(data: ChartDataUpdate) => void> = [];
  private userStatsListeners: Array<(data: UserStatsUpdate) => void> = [];
  

  constructor() {
    // Don't initialize connection in constructor
  }

  async startConnection(getToken: () => string | null): Promise<void> {
    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Return immediately if already connected
    if (this.isConnected && this.connection?.state === 'Connected') {
      return Promise.resolve();
    }

    this.connectionPromise = this.createConnection(getToken);
    
    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  private async createConnection(getToken: () => string | null): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/userStatsHub`, {
          accessTokenFactory: () => token,
          transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling,
          skipNegotiation: false,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < 3) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
            }
            return null; // Stop retrying after 3 attempts
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      this.setupConnectionEvents();
      this.setupEventListeners();

      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('SignalR Connected successfully');
      
      await this.joinUserManagementGroup();
      this.startHeartbeat();
      
      // Request initial data after connection
      setTimeout(() => {
        this.requestDataRefresh();
      }, 1000);
      
    } catch (error) {
      console.error('SignalR connection failed:', error);
      this.isConnected = false;
      this.connection = null;
      throw error;
    }
  }

  private setupConnectionEvents(): void {
    if (!this.connection) return;

    this.connection.onclose((error) => {
      this.isConnected = false;
      this.stopHeartbeat();
      console.log('SignalR connection closed:', error);
    });

    this.connection.onreconnecting((error) => {
      this.isConnected = false;
      console.log('SignalR reconnecting:', error);
    });

    this.connection.onreconnected((connectionId) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('SignalR reconnected with ID:', connectionId);
      this.joinUserManagementGroup();
      this.requestDataRefresh();
      this.startHeartbeat();
    });
  }

  private setupEventListeners(): void {
    if (!this.connection) return;

    // Listen for chart data updates - immediate processing for better responsiveness
    this.connection.on('chartdataupdated', (data: ChartDataUpdate) => {
      console.log('SignalR: Chart data received:', data);
      this.chartDataListeners.forEach(listener => listener(data));
    });

    // Listen for user stats updates - immediate processing for better responsiveness
    this.connection.on('userstatsupdated', (data: UserStatsUpdate) => {
      console.log('SignalR: User stats received:', data);
      this.userStatsListeners.forEach(listener => listener(data));
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.connection?.state === 'Connected') {
        this.connection.invoke('Ping').catch((error) => {
          console.warn('Heartbeat ping failed:', error);
        });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async joinUserManagementGroup(): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        await this.connection.invoke('JoinUserManagementGroup');
        console.log('SignalR: Joined user management group');
      } catch (error) {
        console.error('SignalR: Failed to join group', error);
      }
    }
  }

  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }

  async requestDataRefresh(): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        await this.connection.invoke('RequestDataRefresh');
        console.log('SignalR: Requested data refresh');
      } catch (error) {
        console.error('SignalR: Failed to request data refresh', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection not available');
    }
  }

  async forceDataRefresh(): Promise<void> {
    console.log('Forcing immediate data refresh...');
    
    if (this.connection && this.isConnected) {
      try {
        // Request fresh data from server
        await this.connection.invoke('RequestDataRefresh');
        await this.connection.invoke('RequestUserStatsRefresh');
        console.log('Force refresh completed');
      } catch (error) {
        console.error('Failed to force data refresh:', error);
        throw error;
      }
    } else {
      console.warn('Cannot force refresh: SignalR not connected');
      throw new Error('SignalR connection not available');
    }
  }

  getConnectionStatus(): { isConnected: boolean; reconnectAttempts: number } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Event listener management
  onChartDataUpdated(listener: (data: ChartDataUpdate) => void): void {
    this.chartDataListeners.push(listener);
  }

  onUserStatsUpdated(listener: (data: UserStatsUpdate) => void): void {
    this.userStatsListeners.push(listener);
  }

  offChartDataUpdated(listener: (data: ChartDataUpdate) => void): void {
    const index = this.chartDataListeners.indexOf(listener);
    if (index > -1) {
      this.chartDataListeners.splice(index, 1);
    }
  }

  offUserStatsUpdated(listener: (data: UserStatsUpdate) => void): void {
    const index = this.userStatsListeners.indexOf(listener);
    if (index > -1) {
      this.userStatsListeners.splice(index, 1);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    this.stopHeartbeat();
    
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      } finally {
        this.connection = null;
        this.isConnected = false;
        this.connectionPromise = null;
        this.reconnectAttempts = 0;
      }
    }
  }
}

// Create singleton instance
const signalRService = new SignalRService();

export default signalRService;
export type { UserStatsUpdate, ChartDataUpdate };
