import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  Shield,
  Activity,
  Globe,
  Zap,
  Target,
  PieChart,
  LineChart,
  Filter,
  Maximize2,
  Minimize2,
  Eye,
  Settings
} from 'lucide-react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
);

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  onFullscreen?: () => void;
  onExport?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color, onClick }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4" />;
      case 'decrease': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} transition-transform hover:scale-110`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  children, 
  onFullscreen, 
  onExport, 
  isFullscreen = false,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export chart"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('reports');
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Generate realistic time-series data
  const generateTimeSeriesData = (days: number, baseValue: number, variance: number = 0.3) => {
    const data = [];
    const labels = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      labels.push(format(date, 'MMM dd'));
      
      // Generate realistic data with trends and some randomness
      const trend = Math.sin((days - i) / days * Math.PI) * variance;
      const random = (Math.random() - 0.5) * variance;
      const value = Math.max(0, Math.round(baseValue + (baseValue * trend) + (baseValue * random)));
      
      data.push(value);
    }
    
    return { labels, data };
  };

  // Chart data based on time range
  const chartData = useMemo(() => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    
    return {
      reports: generateTimeSeriesData(days, 45, 0.4),
      users: generateTimeSeriesData(days, 120, 0.3),
      verifications: generateTimeSeriesData(days, 38, 0.5),
      responseTime: generateTimeSeriesData(days, 2.5, 0.2)
    };
  }, [timeRange]);

  // Chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Enhanced metrics with real-time calculations
  const metrics = useMemo(() => {
    const currentData = chartData.reports.data;
    const currentValue = currentData[currentData.length - 1] || 0;
    const previousValue = currentData[currentData.length - 2] || currentValue;
    const totalReports = currentData.reduce((sum, val) => sum + val, 0);
    
    return {
      totalReports: { 
        value: totalReports, 
        change: `${previousValue > 0 ? ((currentValue - previousValue) / previousValue * 100).toFixed(1) : '0'}%`, 
        changeType: currentValue >= previousValue ? 'increase' as const : 'decrease' as const 
      },
      verifiedReports: { 
        value: Math.round(totalReports * 0.93), 
        change: '+8.3%', 
        changeType: 'increase' as const 
      },
      pendingReports: { 
        value: Math.round(totalReports * 0.07), 
        change: '-5.2%', 
        changeType: 'decrease' as const 
      },
      totalUsers: { 
        value: chartData.users.data.reduce((sum, val) => sum + val, 0), 
        change: '+15.7%', 
        changeType: 'increase' as const 
      },
      activeUsers: { 
        value: chartData.users.data[chartData.users.data.length - 1] || 0, 
        change: '+3.1%', 
        changeType: 'increase' as const 
      },
      responseTime: { 
        value: `${(chartData.responseTime.data[chartData.responseTime.data.length - 1] || 2.5).toFixed(1)}h`, 
        change: '-12.5%', 
        changeType: 'decrease' as const 
      },
      systemUptime: { value: '99.9%', change: '+0.1%', changeType: 'increase' as const },
      userSatisfaction: { value: '4.8/5', change: '+0.2', changeType: 'increase' as const }
    };
  }, [chartData]);

  // Chart.js data configurations
  const reportsTimelineData = {
    labels: chartData.reports.labels,
    datasets: [
      {
        label: 'Reports',
        data: chartData.reports.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Verifications',
        data: chartData.verifications.data,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const userActivityData = {
    labels: chartData.users.labels,
    datasets: [
      {
        label: 'Active Users',
        data: chartData.users.data,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const reportsByTypeData = {
    labels: ['Earthquake', 'Flood', 'Fire', 'Cyclone', 'Landslide', 'Other'],
    datasets: [
      {
        data: [425, 312, 198, 156, 89, 68],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(147, 51, 234)',
          'rgb(234, 179, 8)',
          'rgb(107, 114, 128)'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const reportsByStatusData = {
    labels: ['Verified', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [metrics.verifiedReports.value, metrics.pendingReports.value, 23],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const responseTimeData = {
    labels: chartData.responseTime.labels,
    datasets: [
      {
        label: 'Response Time (hours)',
        data: chartData.responseTime.data,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const systemHealthData = {
    labels: ['CPU Usage', 'Memory', 'Storage', 'Network', 'Database', 'API Response'],
    datasets: [
      {
        label: 'Current',
        data: [65, 78, 45, 89, 92, 88],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Threshold',
        data: [80, 85, 90, 95, 95, 90],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
      }
    ]
  };

  const geographicData = {
    labels: ['California', 'Texas', 'Florida', 'New York', 'Washington', 'Others'],
    datasets: [
      {
        data: [234, 189, 156, 134, 98, 287],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenChart(null);
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            handleRefresh();
            break;
          case '1':
            e.preventDefault();
            setSelectedMetric('reports');
            break;
          case '2':
            e.preventDefault();
            setSelectedMetric('users');
            break;
          case '3':
            e.preventDefault();
            setSelectedMetric('verifications');
            break;
          case '4':
            e.preventDefault();
            setSelectedMetric('responseTime');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        handleRefresh();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                <Shield className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive insights and metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button 
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Filter data"
                >
                  <Filter className="w-5 h-5" />
                </button>
                
                <button 
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Chart settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{refreshing ? 'Updating...' : 'Live Data'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Reports"
              value={metrics.totalReports.value.toLocaleString()}
              change={metrics.totalReports.change}
              changeType={metrics.totalReports.changeType}
              icon={<FileText className="w-6 h-6 text-white" />}
              color="bg-blue-500"
              onClick={() => setSelectedMetric('reports')}
            />
            <MetricCard
              title="Verified Reports"
              value={metrics.verifiedReports.value.toLocaleString()}
              change={metrics.verifiedReports.change}
              changeType={metrics.verifiedReports.changeType}
              icon={<CheckCircle className="w-6 h-6 text-white" />}
              color="bg-green-500"
              onClick={() => setSelectedMetric('verifications')}
            />
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers.value.toLocaleString()}
              change={metrics.activeUsers.change}
              changeType={metrics.activeUsers.changeType}
              icon={<Users className="w-6 h-6 text-white" />}
              color="bg-purple-500"
              onClick={() => setSelectedMetric('users')}
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.responseTime.value}
              change={metrics.responseTime.change}
              changeType={metrics.responseTime.changeType}
              icon={<Clock className="w-6 h-6 text-white" />}
              color="bg-orange-500"
              onClick={() => setSelectedMetric('responseTime')}
            />
          </div>
        </div>

        {/* Main Timeline Chart */}
        <div className="mb-8">
          <ChartContainer
            title="Reports & Verifications Timeline"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'timeline' ? null : 'timeline')}
            onExport={() => console.log('Export timeline chart')}
            isFullscreen={fullscreenChart === 'timeline'}
            className={fullscreenChart === 'timeline' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-80">
              <Line data={reportsTimelineData} options={commonChartOptions} />
            </div>
          </ChartContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer
            title="User Activity"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'users' ? null : 'users')}
            onExport={() => console.log('Export user activity chart')}
            isFullscreen={fullscreenChart === 'users'}
            className={fullscreenChart === 'users' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <Bar data={userActivityData} options={commonChartOptions} />
            </div>
          </ChartContainer>

          <ChartContainer
            title="Reports by Disaster Type"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'disaster-types' ? null : 'disaster-types')}
            onExport={() => console.log('Export disaster types chart')}
            isFullscreen={fullscreenChart === 'disaster-types'}
            className={fullscreenChart === 'disaster-types' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <Pie data={reportsByTypeData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} />
            </div>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer
            title="Report Status Distribution"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'status' ? null : 'status')}
            onExport={() => console.log('Export status chart')}
            isFullscreen={fullscreenChart === 'status'}
            className={fullscreenChart === 'status' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <Doughnut data={reportsByStatusData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                      }
                    }
                  }
                },
                cutout: '60%'
              }} />
            </div>
          </ChartContainer>

          <ChartContainer
            title="Geographic Distribution"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'geographic' ? null : 'geographic')}
            onExport={() => console.log('Export geographic chart')}
            isFullscreen={fullscreenChart === 'geographic'}
            className={fullscreenChart === 'geographic' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <PolarArea data={geographicData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    pointLabels: {
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }} />
            </div>
          </ChartContainer>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer
            title="Response Time Trends"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'response-time' ? null : 'response-time')}
            onExport={() => console.log('Export response time chart')}
            isFullscreen={fullscreenChart === 'response-time'}
            className={fullscreenChart === 'response-time' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <Line data={responseTimeData} options={{
                ...commonChartOptions,
                scales: {
                  ...commonChartOptions.scales,
                  y: {
                    ...commonChartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Hours'
                    }
                  }
                }
              }} />
            </div>
          </ChartContainer>

          <ChartContainer
            title="System Health Radar"
            onFullscreen={() => setFullscreenChart(fullscreenChart === 'system-health' ? null : 'system-health')}
            onExport={() => console.log('Export system health chart')}
            isFullscreen={fullscreenChart === 'system-health'}
            className={fullscreenChart === 'system-health' ? 'fixed inset-4 z-50 h-auto' : ''}
          >
            <div className="h-64">
              <Radar data={systemHealthData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    pointLabels: {
                      font: {
                        size: 11
                      }
                    },
                    ticks: {
                      stepSize: 20,
                      callback: function(value: any) {
                        return value + '%';
                      }
                    }
                  }
                }
              }} />
            </div>
          </ChartContainer>
        </div>

        {/* System Health Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{metrics.systemUptime.value}</p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{metrics.userSatisfaction.value}</p>
              <p className="text-sm text-gray-600">User Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{metrics.responseTime.value}</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{metrics.activeUsers.value}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {fullscreenChart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setFullscreenChart(null)}
        />
      )}

      {/* Keyboard shortcuts info */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-xs text-gray-600 max-w-xs">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div>• Press ESC to close fullscreen</div>
          <div>• Click metrics to focus charts</div>
          <div>• Use time range selector for different periods</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;