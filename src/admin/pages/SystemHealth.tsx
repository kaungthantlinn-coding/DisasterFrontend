import React, { useState } from 'react';
import {
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: string;
  };
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  lastCheck: string;
  responseTime: string;
}

const SystemHealth: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const systemMetrics: SystemMetric[] = [
    {
      id: 'database',
      name: 'Database Performance',
      value: '99.9%',
      status: 'healthy',
      description: 'All database connections stable',
      icon: <Database className="w-6 h-6" />,
      trend: { direction: 'up', percentage: '2.1%' }
    },
    {
      id: 'api',
      name: 'API Response Time',
      value: '145ms',
      status: 'healthy',
      description: 'Average response time within limits',
      icon: <Server className="w-6 h-6" />,
      trend: { direction: 'down', percentage: '5.3%' }
    },
    {
      id: 'storage',
      name: 'Storage Usage',
      value: '78%',
      status: 'warning',
      description: 'Storage approaching capacity limit',
      icon: <HardDrive className="w-6 h-6" />,
      trend: { direction: 'up', percentage: '12.4%' }
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: '64%',
      status: 'healthy',
      description: 'Memory usage within normal range',
      icon: <MemoryStick className="w-6 h-6" />,
      trend: { direction: 'stable', percentage: '0.2%' }
    },
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: '42%',
      status: 'healthy',
      description: 'CPU performance optimal',
      icon: <Cpu className="w-6 h-6" />,
      trend: { direction: 'down', percentage: '8.1%' }
    },
    {
      id: 'network',
      name: 'Network Latency',
      value: '23ms',
      status: 'healthy',
      description: 'Network performance excellent',
      icon: <Wifi className="w-6 h-6" />,
      trend: { direction: 'stable', percentage: '0.5%' }
    }
  ];

  const services: ServiceStatus[] = [
    {
      id: 'auth',
      name: 'Authentication Service',
      status: 'online',
      uptime: '99.98%',
      lastCheck: '2 minutes ago',
      responseTime: '120ms'
    },
    {
      id: 'reports',
      name: 'Report Processing',
      status: 'online',
      uptime: '99.95%',
      lastCheck: '1 minute ago',
      responseTime: '180ms'
    },
    {
      id: 'notifications',
      name: 'Notification Service',
      status: 'online',
      uptime: '99.92%',
      lastCheck: '3 minutes ago',
      responseTime: '95ms'
    },
    {
      id: 'backup',
      name: 'Backup Service',
      status: 'maintenance',
      uptime: '99.88%',
      lastCheck: '15 minutes ago',
      responseTime: 'N/A'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">
            Monitor system performance and service status
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  {metric.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              </div>
              {getStatusIcon(metric.status)}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                {metric.trend && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(metric.trend.direction)}
                    <span className="text-sm text-gray-600">{metric.trend.percentage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
          <p className="text-sm text-gray-600 mt-1">
            Current status of all system services
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {services.map((service) => (
            <div key={service.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">Last check: {service.lastCheck}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{service.uptime}</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{service.responseTime}</div>
                    <div className="text-xs text-gray-500">Response Time</div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Storage Warning</h4>
              <p className="text-sm text-yellow-700">
                Storage usage is at 78%. Consider adding more storage capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;