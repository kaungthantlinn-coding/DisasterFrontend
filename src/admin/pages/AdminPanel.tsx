// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Shield,
//   AlertTriangle,
//   UserCheck,
//   Bell,
//   Loader2,
//   Home,
//   Menu,
//   X,
//   LogOut,
//   ChevronRight,
//   Sparkles,
//   RefreshCw,
//   Wifi,
//   WifiOff,
//   History,
//   Building2,
//   Sun,
//   Moon,
//   Filter,
//   MoreHorizontal,
//   ArrowUpRight,
//   ArrowDownRight,
//   Minus,
// } from "lucide-react";
// import { useAuth } from "../../hooks/useAuth";
// import { userManagementApi } from "../../apis/userManagement";
// import { ReportsAPI } from "../../apis/reports";

// // Import admin pages
// import UserManagement from "./UserManagement";
// import Analytics from "./Analytics";
// import SystemSettings from "./systemsettings";
// import ReportManagement from "./ReportManagement";
// import AuditLogsPage from "./AuditLogsPage";
// import AdminSupportRequestManagement from "./AdminSupportRequestManagement";
// import OrganizationManagement from "./OrganizationManagement";
// import ModernAdminLayout from "../components/ModernAdminLayout";
// import ReportReview from "./ReportReview";

// // Error Boundary Component
// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("Admin Panel Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="text-center">
//             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               Something went wrong
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Please refresh the page or contact support if the problem
//               persists.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Refresh Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// interface AdminStatCardProps {
//   icon: React.ReactNode;
//   title: string;
//   value: string | number;
//   change?: string;
//   changeType?: "increase" | "decrease" | "neutral";
//   trend?: number[];
//   onClick?: () => void;
//   isLoading?: boolean;
// }

// interface QuickActionProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   link: string;
//   color: string;
//   badge?: string;
// }

// const AdminStatCard: React.FC<AdminStatCardProps> = ({
//   icon,
//   title,
//   value,
//   change,
//   changeType = "neutral",
//   trend,
//   onClick,
//   isLoading = false,
// }) => {
//   const getChangeIcon = () => {
//     switch (changeType) {
//       case "increase":
//         return <ArrowUpRight className="w-3 h-3" />;
//       case "decrease":
//         return <ArrowDownRight className="w-3 h-3" />;
//       default:
//         return <Minus className="w-3 h-3" />;
//     }
//   };

//   const getChangeColor = () => {
//     switch (changeType) {
//       case "increase":
//         return "text-emerald-700 bg-emerald-50 border-emerald-100";
//       case "decrease":
//         return "text-red-700 bg-red-50 border-red-100";
//       default:
//         return "text-slate-700 bg-slate-50 border-slate-100";
//     }
//   };

//   return (
//     <div
//       className="group bg-white rounded-xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
//       onClick={onClick}
//     >
//       <div className="flex items-start justify-between mb-6">
//         <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
//           {icon}
//         </div>
//         {change && (
//           <div
//             className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border ${getChangeColor()}`}
//           >
//             {getChangeIcon()}
//             <span>{change}</span>
//           </div>
//         )}
//       </div>

//       <div className="space-y-1">
//         <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
//           {title}
//         </p>
//         {isLoading ? (
//           <div className="flex items-center space-x-2">
//             <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
//             <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
//           </div>
//         ) : (
//           <p className="text-2xl font-bold text-slate-900">
//             {value.toLocaleString()}
//           </p>
//         )}
//       </div>

//       {trend && (
//         <div className="mt-4 h-6 flex items-end space-x-0.5">
//           {trend.map((value, index) => (
//             <div
//               key={index}
//               className="bg-slate-200 rounded-sm flex-1 group-hover:bg-blue-200 transition-colors duration-200"
//               style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const QuickActionCard: React.FC<QuickActionProps> = ({
//   icon,
//   title,
//   description,
//   link,
//   color,
//   badge,
// }) => {
//   return (
//     <Link
//       to={link}
//       className="group block bg-white rounded-xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div
//           className={`p-2.5 bg-gradient-to-br ${color} rounded-lg text-white group-hover:scale-105 transition-transform duration-200`}
//         >
//           {icon}
//         </div>
//         {badge && (
//           <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-md border border-red-100">
//             {badge}
//           </span>
//         )}
//       </div>

//       <div className="space-y-2 mb-4">
//         <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
//           {title}
//         </h3>
//         <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
//           {description}
//         </p>
//       </div>

//       <div className="flex items-center text-blue-600 text-sm font-medium">
//         <span>Open</span>
//         <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
//       </div>
//     </Link>
//   );
// };

// const AdminPanel: React.FC = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [lastRefresh, setLastRefresh] = useState(new Date());
//   const [darkMode, setDarkMode] = useState(false);

//   // Monitor online status
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   // Fetch admin statistics
//   const {
//     data: stats,
//     isLoading: statsLoading,
//     refetch: refetchStats,
//   } = useQuery({
//     queryKey: ["admin-stats"],
//     queryFn: async () => {
//       return {
//         totalUsers: 1247,
//         activeUsers: 892,
//         totalReports: 156,
//         pendingReports: 23,
//         verifiedReports: 133,
//         totalOrganizations: 45,
//         systemHealth: 98.5,
//         responseTime: 245,
//         trends: {
//           users: [45, 52, 48, 61, 55, 67, 73],
//           reports: [12, 19, 15, 23, 18, 25, 31],
//           organizations: [2, 3, 2, 4, 3, 5, 6],
//         },
//       };
//     },
//     refetchInterval: 30000,
//   });

//   // Navigation items
//   const navigationItems = [
//     {
//       name: "Overview",
//       href: "/admin",
//       icon: Home,
//       current: location.pathname === "/admin",
//       badge: null,
//     },
//     {
//       name: "Users",
//       href: "/admin/users",
//       icon: Users,
//       current: location.pathname === "/admin/users",
//       badge: stats?.activeUsers && stats.activeUsers > 900 ? "High" : null,
//     },
//     {
//       name: "Reports",
//       href: "/admin/reports",
//       icon: FileText,
//       current: location.pathname === "/admin/reports",
//       badge:
//         stats?.pendingReports && stats.pendingReports > 20
//           ? stats.pendingReports.toString()
//           : null,
//     },
//     {
//       name: "Analytics",
//       href: "/admin/analytics",
//       icon: BarChart3,
//       current: location.pathname === "/admin/analytics",
//       badge: null,
//     },
//     {
//       name: "Organizations",
//       href: "/admin/organizations",
//       icon: Building2,
//       current: location.pathname === "/admin/organizations",
//       badge: null,
//     },
//     {
//       name: "Support",
//       href: "/admin/support-requests",
//       icon: Shield,
//       current: location.pathname === "/admin/support-requests",
//       badge: null,
//     },
//     {
//       name: "Settings",
//       href: "/admin/settings",
//       icon: Settings,
//       current: location.pathname === "/admin/settings",
//       badge: null,
//     },
//     {
//       name: "Audit Logs",
//       href: "/admin/audit-logs",
//       icon: History,
//       current: location.pathname === "/admin/audit-logs",
//       badge: null,
//     },
//   ];

//   const handleRefresh = useCallback(() => {
//     setLastRefresh(new Date());
//     queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
//     refetchStats();
//   }, [queryClient, refetchStats]);

//   const handleLogout = useCallback(() => {
//     logout();
//     navigate("/login");
//   }, [logout, navigate]);

//   // Dashboard content
//   const DashboardContent = () => (
//     <div className="space-y-8">
//       {/* Welcome Header */}
//       <div className="bg-white rounded-xl border border-slate-100 p-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//           <div className="mb-6 lg:mb-0">
//             <div className="flex items-center space-x-3 mb-3">
//               <div className="p-2 bg-blue-50 rounded-lg">
//                 <Sparkles className="w-5 h-5 text-blue-600" />
//               </div>
//               <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
//                 Welcome back, {user?.name}!
//               </h1>
//             </div>
//             <p className="text-slate-600 leading-relaxed max-w-2xl">
//               Your disaster response system is running smoothly. Here's your
//               comprehensive overview of today's activities and system
//               performance.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
//             <div
//               className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${
//                 isOnline
//                   ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                   : "bg-red-50 text-red-700 border-red-200"
//               }`}
//             >
//               {isOnline ? (
//                 <Wifi className="w-4 h-4 mr-2" />
//               ) : (
//                 <WifiOff className="w-4 h-4 mr-2" />
//               )}
//               {isOnline ? "System Online" : "System Offline"}
//             </div>

//             <button
//               onClick={handleRefresh}
//               className="flex items-center px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium text-sm"
//             >
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <AdminStatCard
//           icon={<Users className="w-6 h-6" />}
//           title="Total Users"
//           value={stats?.totalUsers || 0}
//           change="+12% from last month"
//           changeType="increase"
//           trend={stats?.trends?.users}
//           onClick={() => navigate("/admin/users")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<UserCheck className="w-6 h-6" />}
//           title="Active Users"
//           value={stats?.activeUsers || 0}
//           change="+8% from last week"
//           changeType="increase"
//           trend={stats?.trends?.users?.map((v) => v * 0.7)}
//           onClick={() => navigate("/admin/users")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<FileText className="w-6 h-6" />}
//           title="Total Reports"
//           value={stats?.totalReports || 0}
//           change="+23 new today"
//           changeType="increase"
//           trend={stats?.trends?.reports}
//           onClick={() => navigate("/admin/reports")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<AlertTriangle className="w-6 h-6" />}
//           title="Pending Reports"
//           value={stats?.pendingReports || 0}
//           change="Needs attention"
//           changeType="neutral"
//           onClick={() => navigate("/admin/reports")}
//           isLoading={statsLoading}
//         />
//       </div>

//       {/* Quick Actions */}
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
//           <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
//             View all
//             <ChevronRight className="w-4 h-4 ml-1" />
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <QuickActionCard
//             icon={<Users className="w-6 h-6" />}
//             title="Manage Users"
//             description="Add, edit, or remove user accounts and manage permissions with advanced role-based access control."
//             link="/admin/users"
//             color="from-blue-500 to-blue-600"
//           />
//           <QuickActionCard
//             icon={<FileText className="w-6 h-6" />}
//             title="Review Reports"
//             description="Verify and manage disaster reports from the field with comprehensive validation tools."
//             link="/admin/reports"
//             color="from-emerald-500 to-emerald-600"
//             badge={
//               stats?.pendingReports && stats.pendingReports > 20
//                 ? "Urgent"
//                 : undefined
//             }
//           />
//           <QuickActionCard
//             icon={<BarChart3 className="w-6 h-6" />}
//             title="View Analytics"
//             description="Monitor system performance, user engagement, and generate detailed insights and reports."
//             link="/admin/analytics"
//             color="from-purple-500 to-purple-600"
//           />
//           <QuickActionCard
//             icon={<Building2 className="w-6 h-6" />}
//             title="Organizations"
//             description="Manage partner organizations, their access levels, and collaboration settings."
//             link="/admin/organizations"
//             color="from-orange-500 to-orange-600"
//           />
//           <QuickActionCard
//             icon={<Shield className="w-6 h-6" />}
//             title="Support Requests"
//             description="Handle user support tickets, resolve issues, and maintain customer satisfaction."
//             link="/admin/support-requests"
//             color="from-red-500 to-red-600"
//           />
//           <QuickActionCard
//             icon={<Settings className="w-6 h-6" />}
//             title="System Settings"
//             description="Configure system parameters, security settings, and platform preferences."
//             link="/admin/settings"
//             color="from-slate-500 to-slate-600"
//           />
//         </div>
//       </div>

//       {/* Recent Activity & System Health */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl border border-slate-100 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-slate-900">
//               Recent Activity
//             </h2>
//             <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
//               View All
//             </button>
//           </div>

//           <div className="space-y-3">
//             {[
//               {
//                 action: "New user registered",
//                 user: "John Doe",
//                 time: "2m ago",
//                 type: "user",
//                 status: "success",
//               },
//               {
//                 action: "Report verified",
//                 user: "Admin",
//                 time: "5m ago",
//                 type: "report",
//                 status: "success",
//               },
//               {
//                 action: "System backup completed",
//                 user: "System",
//                 time: "1h ago",
//                 type: "system",
//                 status: "success",
//               },
//               {
//                 action: "New organization added",
//                 user: "Jane Smith",
//                 time: "2h ago",
//                 type: "org",
//                 status: "success",
//               },
//               {
//                 action: "Failed login attempt",
//                 user: "Unknown",
//                 time: "3h ago",
//                 type: "security",
//                 status: "warning",
//               },
//             ].map((activity, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
//               >
//                 <div
//                   className={`p-1.5 rounded-md ${
//                     activity.type === "user"
//                       ? "bg-blue-50 text-blue-600"
//                       : activity.type === "report"
//                       ? "bg-emerald-50 text-emerald-600"
//                       : activity.type === "system"
//                       ? "bg-purple-50 text-purple-600"
//                       : activity.type === "security"
//                       ? "bg-red-50 text-red-600"
//                       : "bg-orange-50 text-orange-600"
//                   }`}
//                 >
//                   {activity.type === "user" ? (
//                     <Users className="w-3.5 h-3.5" />
//                   ) : activity.type === "report" ? (
//                     <FileText className="w-3.5 h-3.5" />
//                   ) : activity.type === "system" ? (
//                     <Settings className="w-3.5 h-3.5" />
//                   ) : activity.type === "security" ? (
//                     <Shield className="w-3.5 h-3.5" />
//                   ) : (
//                     <Building2 className="w-3.5 h-3.5" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-slate-900 truncate">
//                     {activity.action}
//                   </p>
//                   <p className="text-xs text-slate-500 truncate">
//                     by {activity.user}
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div
//                     className={`w-1.5 h-1.5 rounded-full ${
//                       activity.status === "success"
//                         ? "bg-emerald-500"
//                         : activity.status === "warning"
//                         ? "bg-yellow-500"
//                         : "bg-red-500"
//                     }`}
//                   />
//                   <span className="text-xs text-slate-400 whitespace-nowrap">
//                     {activity.time}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* System Health */}
//         <div className="bg-white rounded-xl border border-slate-100 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-slate-900">
//               System Health
//             </h2>
//             <div className="flex items-center space-x-2">
//               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
//               <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
//                 Operational
//               </span>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {[
//               { name: "Server Status", value: 99.9, status: "excellent" },
//               {
//                 name: "Database Performance",
//                 value: 98.5,
//                 status: "excellent",
//               },
//               {
//                 name: "API Response Time",
//                 value: 245,
//                 unit: "ms",
//                 status: "good",
//               },
//               { name: "Memory Usage", value: 67, unit: "%", status: "good" },
//               {
//                 name: "Storage Usage",
//                 value: 45,
//                 unit: "%",
//                 status: "excellent",
//               },
//             ].map((metric, index) => (
//               <div key={index} className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-slate-700">
//                     {metric.name}
//                   </span>
//                   <span className="text-sm font-mono text-slate-600">
//                     {metric.value}
//                     {metric.unit || "%"}
//                   </span>
//                 </div>
//                 <div className="w-full bg-slate-100 rounded-full h-1.5">
//                   <div
//                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                       metric.status === "excellent"
//                         ? "bg-emerald-500"
//                         : metric.status === "good"
//                         ? "bg-blue-500"
//                         : "bg-yellow-500"
//                     }`}
//                     style={{
//                       width: `${
//                         metric.unit === "ms"
//                           ? Math.min((1000 - metric.value) / 10, 100)
//                           : metric.unit === "%"
//                           ? 100 - metric.value
//                           : metric.value
//                       }%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//         {/* Mobile menu overlay */}
//         {mobileMenuOpen && (
//           <div className="fixed inset-0 z-50 lg:hidden">
//             <div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm"
//               onClick={() => setMobileMenuOpen(false)}
//             />
//             <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl">
//               {/* Mobile sidebar content */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
//                     <Shield className="w-6 h-6 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Admin Panel
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <nav className="p-6">
//                 <div className="space-y-2">
//                   {navigationItems.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                       <Link
//                         key={item.name}
//                         to={item.href}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
//                           item.current
//                             ? "bg-blue-50 text-blue-700 border border-blue-200"
//                             : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <Icon className="w-5 h-5 mr-3" />
//                           {item.name}
//                         </div>
//                         {item.badge && (
//                           <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
//                             {item.badge}
//                           </span>
//                         )}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </nav>
//             </div>
//           </div>
//         )}

//         {/* Desktop sidebar */}
//         <div
//           className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-40 ${
//             sidebarCollapsed ? "lg:w-16" : "lg:w-64"
//           }`}
//         >
//           <div className="flex flex-col flex-1 bg-white border-r border-slate-100">
//             {/* Sidebar header */}
//             <div
//               className={`flex items-center ${
//                 sidebarCollapsed ? "justify-center" : "justify-between"
//               } p-4 border-b border-slate-100`}
//             >
//               {!sidebarCollapsed && (
//                 <div className="flex items-center space-x-2">
//                   <div className="p-1.5 bg-blue-50 rounded-lg">
//                     <Shield className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Admin
//                   </h2>
//                 </div>
//               )}
//               <button
//                 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                 className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
//               >
//                 <Menu className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 p-3">
//               <div className="space-y-1">
//                 {navigationItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       className={`flex items-center ${
//                         sidebarCollapsed
//                           ? "justify-center px-3"
//                           : "justify-between px-3"
//                       } py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
//                         item.current
//                           ? "bg-blue-50 text-blue-700"
//                           : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
//                       }`}
//                       title={sidebarCollapsed ? item.name : undefined}
//                     >
//                       <div className="flex items-center">
//                         <Icon
//                           className={`w-4 h-4 ${
//                             sidebarCollapsed ? "" : "mr-3"
//                           } transition-colors`}
//                         />
//                         {!sidebarCollapsed && item.name}
//                       </div>
//                       {!sidebarCollapsed && item.badge && (
//                         <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
//                           {item.badge}
//                         </span>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </nav>

//             {/* User info */}
//             <div className="p-3 border-t border-slate-100">
//               <div
//                 className={`flex items-center ${
//                   sidebarCollapsed ? "justify-center" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
//                     {user?.name?.charAt(0) || "A"}
//                   </div>
//                   <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
//                 </div>

//                 {!sidebarCollapsed && (
//                   <div className="ml-3 flex-1 min-w-0">
//                     <p className="text-sm font-medium text-slate-900 truncate">
//                       {user?.name}
//                     </p>
//                     <p className="text-xs text-slate-500 truncate">
//                       {user?.roles?.join(", ")}
//                     </p>
//                   </div>
//                 )}

//                 {!sidebarCollapsed && (
//                   <button
//                     onClick={handleLogout}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                     title="Logout"
//                   >
//                     <LogOut className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div
//           className={`transition-all duration-300 ${
//             sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
//           }`}
//         >
//           {/* Top bar */}
//           <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200">
//             <div className="flex items-center justify-between px-6 py-4">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setMobileMenuOpen(true)}
//                   className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
//                 >
//                   <Menu className="w-5 h-5" />
//                 </button>

//                 <div className="hidden sm:block">
//                   <p className="text-sm text-slate-500">
//                     Last updated: {lastRefresh.toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <div
//                   className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
//                     isOnline
//                       ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                       : "bg-red-50 text-red-700 border border-red-200"
//                   }`}
//                 >
//                   {isOnline ? (
//                     <Wifi className="w-4 h-4 mr-2" />
//                   ) : (
//                     <WifiOff className="w-4 h-4 mr-2" />
//                   )}
//                   {isOnline ? "Online" : "Offline"}
//                 </div>

//                 <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
//                   <Bell className="w-5 h-5" />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
//                 </button>

//                 <button
//                   onClick={() => setDarkMode(!darkMode)}
//                   className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//                 >
//                   {darkMode ? (
//                     <Sun className="w-5 h-5" />
//                   ) : (
//                     <Moon className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Page content */}
//           <main className="p-6">
//             <Routes>
//               <Route path="/" element={<DashboardContent />} />
//               <Route path="/users" element={<UserManagement />} />
//               <Route path="/reports" element={<ReportManagement />} />
//               <Route path="reports/review/:id" element={<ReportReview />} />
//               <Route path="/analytics" element={<Analytics />} />
//               <Route
//                 path="/organizations"
//                 element={<OrganizationManagement />}
//               />
//               <Route
//                 path="/support-requests"
//                 element={<AdminSupportRequestManagement />}
//               />
//               <Route path="/settings" element={<SystemSettings />} />
//               <Route path="/audit-logs" element={<AuditLogsPage />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default AdminPanel;
