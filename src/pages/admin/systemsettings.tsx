import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Globe,
  Database,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  FileText,
  MapPin,
  Clock,
  Zap,
  Server,
  HardDrive,
  Wifi,
  Monitor
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface ToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const Toggle: React.FC<ToggleProps> = ({ label, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', value, onChange, placeholder, description }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className="py-3">
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <div className="relative">
        <input
          type={isPassword && !showPassword ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

const Settings: React.FC = () => {
  // General Settings
  const [siteName, setSiteName] = useState('DisasterWatch');
  const [siteDescription, setSiteDescription] = useState('Real-time disaster reporting and management platform');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [adminAlerts, setAdminAlerts] = useState(true);
  const [reportAlerts, setReportAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('24');
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [requireStrongPasswords, setRequireStrongPasswords] = useState(true);

  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [fromEmail, setFromEmail] = useState('noreply@disasterwatch.com');
  const [fromName, setFromName] = useState('DisasterWatch');

  // System Settings
  const [maxFileSize, setMaxFileSize] = useState('10');
  const [allowedFileTypes, setAllowedFileTypes] = useState('jpg,jpeg,png,pdf,doc,docx');
  const [dataRetentionDays, setDataRetentionDays] = useState('365');
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [logLevel, setLogLevel] = useState('info');

  // Map Settings
  const [defaultMapCenter, setDefaultMapCenter] = useState('37.7749,-122.4194');
  const [defaultZoomLevel, setDefaultZoomLevel] = useState('10');
  const [mapProvider, setMapProvider] = useState('openstreetmap');
  const [enableClustering, setEnableClustering] = useState(true);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        );
      case 'saved':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Saved!
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Error
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        );
    }
  };

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
                <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-500">Configure system preferences and security</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {getSaveButtonContent()}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* General Settings */}
        <SettingsSection
          title="General Settings"
          description="Basic site configuration and preferences"
          icon={<SettingsIcon className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <InputField
              label="Site Name"
              value={siteName}
              onChange={setSiteName}
              placeholder="Enter site name"
              description="The name displayed in the browser title and throughout the application"
            />
            <InputField
              label="Site Description"
              value={siteDescription}
              onChange={setSiteDescription}
              placeholder="Enter site description"
              description="Brief description of your disaster management platform"
            />
            <Toggle
              label="Maintenance Mode"
              description="Temporarily disable public access for maintenance"
              enabled={maintenanceMode}
              onChange={setMaintenanceMode}
            />
            <Toggle
              label="Public Registration"
              description="Allow new users to register accounts"
              enabled={publicRegistration}
              onChange={setPublicRegistration}
            />
            <Toggle
              label="Require Email Verification"
              description="Users must verify their email before accessing the platform"
              enabled={requireEmailVerification}
              onChange={setRequireEmailVerification}
            />
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notification Settings"
          description="Configure how and when notifications are sent"
          icon={<Bell className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <Toggle
              label="Email Notifications"
              description="Send notifications via email"
              enabled={emailNotifications}
              onChange={setEmailNotifications}
            />
            <Toggle
              label="SMS Notifications"
              description="Send critical alerts via SMS"
              enabled={smsNotifications}
              onChange={setSmsNotifications}
            />
            <Toggle
              label="Push Notifications"
              description="Send browser push notifications"
              enabled={pushNotifications}
              onChange={setPushNotifications}
            />
            <Toggle
              label="Admin Alerts"
              description="Notify admins of important system events"
              enabled={adminAlerts}
              onChange={setAdminAlerts}
            />
            <Toggle
              label="Report Alerts"
              description="Notify relevant users when reports are submitted"
              enabled={reportAlerts}
              onChange={setReportAlerts}
            />
            <Toggle
              label="System Alerts"
              description="Send alerts for system errors and maintenance"
              enabled={systemAlerts}
              onChange={setSystemAlerts}
            />
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Security Settings"
          description="Configure authentication and security policies"
          icon={<Lock className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <Toggle
              label="Two-Factor Authentication"
              description="Require 2FA for admin accounts"
              enabled={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
            <Toggle
              label="Require Strong Passwords"
              description="Enforce password complexity requirements"
              enabled={requireStrongPasswords}
              onChange={setRequireStrongPasswords}
            />
            <InputField
              label="Session Timeout (hours)"
              value={sessionTimeout}
              onChange={setSessionTimeout}
              placeholder="24"
              description="Automatically log out users after this period of inactivity"
            />
            <InputField
              label="Minimum Password Length"
              value={passwordMinLength}
              onChange={setPasswordMinLength}
              placeholder="8"
              description="Minimum number of characters required for passwords"
            />
            <InputField
              label="Max Login Attempts"
              value={maxLoginAttempts}
              onChange={setMaxLoginAttempts}
              placeholder="5"
              description="Number of failed login attempts before account lockout"
            />
          </div>
        </SettingsSection>

        {/* Email Configuration */}
        <SettingsSection
          title="Email Configuration"
          description="SMTP settings for sending emails"
          icon={<Mail className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <InputField
              label="SMTP Host"
              value={smtpHost}
              onChange={setSmtpHost}
              placeholder="smtp.gmail.com"
              description="Your email provider's SMTP server"
            />
            <InputField
              label="SMTP Port"
              value={smtpPort}
              onChange={setSmtpPort}
              placeholder="587"
              description="SMTP server port (usually 587 for TLS or 465 for SSL)"
            />
            <InputField
              label="SMTP Username"
              value={smtpUsername}
              onChange={setSmtpUsername}
              placeholder="your-email@domain.com"
              description="Email address for SMTP authentication"
            />
            <InputField
              label="SMTP Password"
              type="password"
              value={smtpPassword}
              onChange={setSmtpPassword}
              placeholder="Enter SMTP password"
              description="Password or app-specific password for SMTP authentication"
            />
            <InputField
              label="From Email"
              value={fromEmail}
              onChange={setFromEmail}
              placeholder="noreply@disasterwatch.com"
              description="Email address that appears as sender"
            />
            <InputField
              label="From Name"
              value={fromName}
              onChange={setFromName}
              placeholder="DisasterWatch"
              description="Name that appears as sender"
            />
          </div>
        </SettingsSection>

        {/* System Configuration */}
        <SettingsSection
          title="System Configuration"
          description="File handling, data retention, and system preferences"
          icon={<Server className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <InputField
              label="Max File Size (MB)"
              value={maxFileSize}
              onChange={setMaxFileSize}
              placeholder="10"
              description="Maximum file size for uploads"
            />
            <InputField
              label="Allowed File Types"
              value={allowedFileTypes}
              onChange={setAllowedFileTypes}
              placeholder="jpg,jpeg,png,pdf,doc,docx"
              description="Comma-separated list of allowed file extensions"
            />
            <InputField
              label="Data Retention (days)"
              value={dataRetentionDays}
              onChange={setDataRetentionDays}
              placeholder="365"
              description="How long to keep user data and reports"
            />
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Backup Frequency</label>
              <select
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">How often to create system backups</p>
            </div>
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Log Level</label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Minimum level for system logging</p>
            </div>
          </div>
        </SettingsSection>

        {/* Map Configuration */}
        <SettingsSection
          title="Map Configuration"
          description="Default map settings and preferences"
          icon={<MapPin className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <InputField
              label="Default Map Center (lat,lng)"
              value={defaultMapCenter}
              onChange={setDefaultMapCenter}
              placeholder="37.7749,-122.4194"
              description="Default latitude and longitude for map center"
            />
            <InputField
              label="Default Zoom Level"
              value={defaultZoomLevel}
              onChange={setDefaultZoomLevel}
              placeholder="10"
              description="Default zoom level (1-20)"
            />
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Map Provider</label>
              <select
                value={mapProvider}
                onChange={(e) => setMapProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="google">Google Maps</option>
                <option value="mapbox">Mapbox</option>
                <option value="esri">Esri</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Map tile provider for displaying maps</p>
            </div>
            <Toggle
              label="Enable Marker Clustering"
              description="Group nearby markers to improve map performance"
              enabled={enableClustering}
              onChange={setEnableClustering}
            />
          </div>
        </SettingsSection>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Monitor className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600">Current system health and performance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-600">Online</p>
              <p className="text-sm text-gray-600">Server Status</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-blue-600">78%</p>
              <p className="text-sm text-gray-600">Storage Used</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-lg font-semibold text-purple-600">99.9%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;