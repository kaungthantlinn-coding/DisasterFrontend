// import React, { useState, useEffect, useMemo, useCallback } from "react";
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
//   CheckCircle,
//   Clock,
//   TrendingUp,
//   Activity,
//   Globe,
//   UserCheck,
//   Database,
//   Bell,
//   Loader2,
//   Home,
//   Search,
//   Menu,
//   X,
//   LogOut,
//   ChevronRight,
//   Sparkles,
//   Zap,
//   Star,
//   RefreshCw,
//   Download,
//   Maximize2,
//   Minimize2,
//   Calendar,
//   Wifi,
//   WifiOff,
//   History,
//   Building2,
// } from "lucide-react";
// import { useAuth } from "../../hooks/useAuth";
// import { userManagementApi } from "../../apis/userManagement";
// import { ReportsAPI } from "../../apis/reports";
// import { NotificationAPI } from "../../services/Notification";
// import type { NotificationDTO } from "../../types/Notification";

// // Import admin pages
// import UserManagement from "./UserManagement";
// import Analytics from "./Analytics";
// import SystemSettings from "./systemsettings";
// import ReportManagement from "./ReportManagement";
// import AuditLogsPage from "./AuditLogsPage";
// import AdminSupportRequestManagement from "./AdminSupportRequestManagement";
// import OrganizationManagement from "./OrganizationManagement";
// import ModernDashboard from "../../admin/components/ModernDashboard";
// import ReportReview from "../../admin/pages/ReportReview";

// // Error Boundary Component
// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean; error?: Error }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("Admin Panel Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
//             <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold text-gray-900 mb-2">
//               Something went wrong
//             </h2>
//             <p className="text-gray-600 mb-4">
//               The admin panel encountered an unexpected error. Please refresh
//               the page or contact support.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
//   bgGradient: string;
//   iconBg: string;
//   onClick?: () => void;
//   isLoading?: boolean;
// }

// interface QuickActionProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   link: string;
//   color: string;
// }

// const AdminStatCard: React.FC<AdminStatCardProps> = ({
//   icon,
//   title,
//   value,
//   change,
//   changeType = "neutral",
//   bgGradient,
//   onClick,
//   isLoading = false,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const getChangeColor = () => {
//     switch (changeType) {
//       case "increase":
//         return "text-emerald-400";
//       case "decrease":
//         return "text-red-400";
//       default:
//         return "text-gray-400";
//     }
//   };

//   const getChangeIcon = () => {
//     switch (changeType) {
//       case "increase":
//         return <TrendingUp className="w-3 h-3" />;
//       case "decrease":
//         return <TrendingUp className="w-3 h-3 rotate-180" />;
//       default:
//         return <Activity className="w-3 h-3" />;
//     }
//   };

//   return (
//     <div
//       className={`group relative overflow-hidden rounded-3xl ${bgGradient} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
//         onClick ? "cursor-pointer" : ""
//       } border border-white/20`}
//       onClick={onClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//       <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
//       <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>

//       {/* Sparkle effects */}
//       <div
//         className={`absolute top-4 right-4 transition-all duration-500 ${
//           isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
//         }`}
//       >
//         <Sparkles className="w-4 h-4 text-white/60" />
//       </div>

//       <div className="relative z-10">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <p className="text-white/70 text-sm font-medium mb-3 tracking-wide uppercase">
//               {title}
//             </p>
//             {isLoading ? (
//               <div className="flex items-center space-x-2 mb-2">
//                 <Loader2 className="w-6 h-6 animate-spin text-white/60" />
//                 <span className="text-2xl font-black text-white/60">
//                   Loading...
//                 </span>
//               </div>
//             ) : (
//               <p className="text-4xl font-black mb-2 tracking-tight">{value}</p>
//             )}
//             {change && !isLoading && (
//               <div
//                 className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}
//               >
//                 {getChangeIcon()}
//                 <span className="font-medium">{change}</span>
//               </div>
//             )}
//           </div>
//           <div
//             className={`p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300`}
//           >
//             <div className="group-hover:rotate-12 transition-transform duration-300">
//               {icon}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const QuickActionCard: React.FC<QuickActionProps> = ({
//   icon,
//   title,
//   description,
//   link,
//   color,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(link)}
//       className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 border border-white/20`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
//             <div className="group-hover:rotate-12 transition-transform duration-300">
//               {icon}
//             </div>
//           </div>
//           <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
//         </div>
//         <h3 className="text-lg font-bold mb-2">{title}</h3>
//         <p className="text-white/80 text-sm leading-relaxed">{description}</p>
//       </div>
//     </div>
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
//   const [showNotifications, setShowNotifications] = useState(false);

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
//       // Mock data - replace with actual API calls
//       return {
//         totalUsers: 1247,
//         activeUsers: 892,
//         totalReports: 156,
//         pendingReports: 23,
//         verifiedReports: 133,
//         totalOrganizations: 45,
//         systemHealth: 98.5,
//         responseTime: 245,
//       };
//     },
//     refetchInterval: 30000, // Refresh every 30 seconds
//   });

//   // Admin notifications (polling with fallback)
//   const {
//     data: adminNotifications = [],
//     isLoading: notifLoading,
//     refetch: refetchNotifications,
//   } = useQuery<NotificationDTO[]>({
//     queryKey: ["admin-notifications"],
//     queryFn: async () => {
//       try {
//         return await NotificationAPI.getAdminNotifications();
//       } catch (e) {
//         console.warn(
//           "Admin notifications failed, falling back to user notifications:",
//           e
//         );
//         try {
//           return await NotificationAPI.getUserNotifications();
//         } catch (e2) {
//           console.error("Both admin and user notifications failed:", e2);
//           return [];
//         }
//       }
//     },
//     refetchInterval: 15000, // poll every 15s; consider SignalR later
//     initialData: [],
//   });

//   const unreadCount = useMemo(
//     () => adminNotifications.filter((n) => !n.isRead).length,
//     [adminNotifications]
//   );

//   // Refresh when opening the dropdown
//   useEffect(() => {
//     if (showNotifications) {
//       refetchNotifications();
//     }
//   }, [showNotifications, refetchNotifications]);

//   // Navigation items
//   const navigationItems = [
//     {
//       name: "Dashboard",
//       href: "/admin",
//       icon: Home,
//       current: location.pathname === "/admin",
//     },
//     {
//       name: "User Management",
//       href: "/admin/users",
//       icon: Users,
//       current: location.pathname === "/admin/users",
//     },
//     {
//       name: "Report Management",
//       href: "/admin/reports",
//       icon: FileText,
//       current: location.pathname === "/admin/reports",
//     },
//     {
//       name: "Analytics",
//       href: "/admin/analytics",
//       icon: BarChart3,
//       current: location.pathname === "/admin/analytics",
//     },
//     {
//       name: "Organizations",
//       href: "/admin/organizations",
//       icon: Building2,
//       current: location.pathname === "/admin/organizations",
//     },
//     {
//       name: "Support Requests",
//       href: "/admin/support-requests",
//       icon: Shield,
//       current: location.pathname === "/admin/support-requests",
//     },
//     {
//       name: "System Settings",
//       href: "/admin/settings",
//       icon: Settings,
//       current: location.pathname === "/admin/settings",
//     },
//     {
//       name: "Audit Logs",
//       href: "/admin/audit-logs",
//       icon: History,
//       current: location.pathname === "/admin/audit-logs",
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
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Welcome back,{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
//               {user?.name}
//             </span>
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Here's what's happening with your disaster response system today.
//           </p>
//         </div>
//         <div className="mt-6 lg:mt-0 flex items-center space-x-4">
//           <div
//             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
//               isOnline
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {isOnline ? (
//               <Wifi className="w-4 h-4 mr-2" />
//             ) : (
//               <WifiOff className="w-4 h-4 mr-2" />
//             )}
//             {isOnline ? "Online" : "Offline"}
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </button>
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
//           bgGradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
//           iconBg="bg-blue-500"
//           onClick={() => navigate("/admin/users")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<UserCheck className="w-6 h-6" />}
//           title="Active Users"
//           value={stats?.activeUsers || 0}
//           change="+8% from last week"
//           changeType="increase"
//           bgGradient="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700"
//           iconBg="bg-emerald-500"
//           onClick={() => navigate("/admin/users")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<FileText className="w-6 h-6" />}
//           title="Total Reports"
//           value={stats?.totalReports || 0}
//           change="+23 new today"
//           changeType="increase"
//           bgGradient="bg-gradient-to-br from-orange-500 via-orange-600 to-red-700"
//           iconBg="bg-orange-500"
//           onClick={() => navigate("/admin/reports")}
//           isLoading={statsLoading}
//         />
//         <AdminStatCard
//           icon={<AlertTriangle className="w-6 h-6" />}
//           title="Pending Reports"
//           value={stats?.pendingReports || 0}
//           change="Needs attention"
//           changeType="neutral"
//           bgGradient="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700"
//           iconBg="bg-purple-500"
//           onClick={() => navigate("/admin/reports")}
//           isLoading={statsLoading}
//         />
//       </div>

//       {/* Quick Actions */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <QuickActionCard
//             icon={<Users className="w-6 h-6" />}
//             title="Manage Users"
//             description="Add, edit, or remove user accounts and permissions"
//             link="/admin/users"
//             color="from-blue-500 to-blue-600"
//           />
//           <QuickActionCard
//             icon={<FileText className="w-6 h-6" />}
//             title="Review Reports"
//             description="Verify and manage disaster reports from the field"
//             link="/admin/reports"
//             color="from-emerald-500 to-emerald-600"
//           />
//           <QuickActionCard
//             icon={<BarChart3 className="w-6 h-6" />}
//             title="View Analytics"
//             description="Monitor system performance and user engagement"
//             link="/admin/analytics"
//             color="from-purple-500 to-purple-600"
//           />
//           <QuickActionCard
//             icon={<Building2 className="w-6 h-6" />}
//             title="Organizations"
//             description="Manage partner organizations and their access"
//             link="/admin/organizations"
//             color="from-orange-500 to-orange-600"
//           />
//           <QuickActionCard
//             icon={<Shield className="w-6 h-6" />}
//             title="Support Requests"
//             description="Handle user support tickets and issues"
//             link="/admin/support-requests"
//             color="from-red-500 to-red-600"
//           />
//           <QuickActionCard
//             icon={<Settings className="w-6 h-6" />}
//             title="System Settings"
//             description="Configure system parameters and preferences"
//             link="/admin/settings"
//             color="from-gray-500 to-gray-600"
//           />
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
//           <button className="text-blue-600 hover:text-blue-700 font-medium">
//             View All
//           </button>
//         </div>
//         <div className="space-y-4">
//           {[
//             {
//               action: "New user registered",
//               user: "John Doe",
//               time: "2 minutes ago",
//               type: "user",
//             },
//             {
//               action: "Report verified",
//               user: "Admin",
//               time: "5 minutes ago",
//               type: "report",
//             },
//             {
//               action: "System backup completed",
//               user: "System",
//               time: "1 hour ago",
//               type: "system",
//             },
//             {
//               action: "New organization added",
//               user: "Jane Smith",
//               time: "2 hours ago",
//               type: "org",
//             },
//           ].map((activity, index) => (
//             <div
//               key={index}
//               className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
//             >
//               <div
//                 className={`p-2 rounded-lg ${
//                   activity.type === "user"
//                     ? "bg-blue-100 text-blue-600"
//                     : activity.type === "report"
//                     ? "bg-green-100 text-green-600"
//                     : activity.type === "system"
//                     ? "bg-purple-100 text-purple-600"
//                     : "bg-orange-100 text-orange-600"
//                 }`}
//               >
//                 {activity.type === "user" ? (
//                   <Users className="w-4 h-4" />
//                 ) : activity.type === "report" ? (
//                   <FileText className="w-4 h-4" />
//                 ) : activity.type === "system" ? (
//                   <Settings className="w-4 h-4" />
//                 ) : (
//                   <Building2 className="w-4 h-4" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <p className="text-gray-900 font-medium">{activity.action}</p>
//                 <p className="text-gray-600 text-sm">by {activity.user}</p>
//               </div>
//               <div className="text-gray-500 text-sm">{activity.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-gray-50">
//         {/* Mobile menu overlay */}
//         {mobileMenuOpen && (
//           <div className="fixed inset-0 z-50 lg:hidden">
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50"
//               onClick={() => setMobileMenuOpen(false)}
//             />
//             <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
//               {/* Mobile sidebar content */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
//                 <button
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
//                         className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
//                           item.current
//                             ? "bg-blue-100 text-blue-700"
//                             : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//                         }`}
//                       >
//                         <Icon className="w-5 h-5 mr-3" />
//                         {item.name}
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
//           className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${
//             sidebarCollapsed ? "lg:w-20" : "lg:w-64"
//           }`}
//         >
//           <div className="flex flex-col flex-1 bg-white shadow-lg border-r border-gray-200">
//             {/* Sidebar header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               {!sidebarCollapsed && (
//                 <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
//               )}
//               <button
//                 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                 className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//               >
//                 <Menu className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 p-6">
//               <div className="space-y-2">
//                 {navigationItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
//                         item.current
//                           ? "bg-blue-100 text-blue-700"
//                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//                       }`}
//                       title={sidebarCollapsed ? item.name : undefined}
//                     >
//                       <Icon className="w-5 h-5 mr-3" />
//                       {!sidebarCollapsed && item.name}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </nav>

//             {/* User info */}
//             <div className="p-6 border-t border-gray-200">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {user?.name?.charAt(0) || "A"}
//                 </div>
//                 {!sidebarCollapsed && (
//                   <div className="ml-3 flex-1">
//                     <p className="text-sm font-medium text-gray-900">
//                       {user?.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {user?.roles?.join(", ")}
//                     </p>
//                   </div>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//                   title="Logout"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div
//           className={`lg:pl-64 transition-all duration-300 ${
//             sidebarCollapsed ? "lg:pl-20" : ""
//           }`}
//         >
//           {/* Top bar */}
//           <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
//             <div className="flex items-center justify-between px-6 py-4">
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setMobileMenuOpen(true)}
//                   className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
//                 >
//                   <Menu className="w-5 h-5" />
//                 </button>
//                 <div className="ml-4 lg:ml-0">
//                   <p className="text-sm text-gray-500">
//                     Last updated: {lastRefresh.toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div
//                   className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
//                     isOnline
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {isOnline ? (
//                     <Wifi className="w-4 h-4 mr-2" />
//                   ) : (
//                     <WifiOff className="w-4 h-4 mr-2" />
//                   )}
//                   {isOnline ? "Online" : "Offline"}
//                 </div>
//                 <div className="relative">
//                   <button
//                     className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//                     onClick={() => setShowNotifications((s) => !s)}
//                     aria-label="Notifications"
//                     title={
//                       unreadCount > 0
//                         ? `${unreadCount} unread notifications`
//                         : "Notifications"
//                     }
//                   >
//                     <Bell className="w-5 h-5" />
//                     {unreadCount > 0 && (
//                       <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center">
//                         {unreadCount > 99 ? "99+" : unreadCount}
//                       </span>
//                     )}
//                   </button>

//                   {showNotifications && (
//                     <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
//                       <div className="p-3 flex items-center justify-between border-b">
//                         <span className="text-sm font-semibold text-gray-900">
//                           Notifications
//                         </span>
//                         <button
//                           className="text-xs text-blue-600 hover:text-blue-700"
//                           onClick={async () => {
//                             try {
//                               await NotificationAPI.markAllAsRead();
//                               await refetchNotifications();
//                             } catch (e) {
//                               console.warn("Failed to mark all as read:", e);
//                             }
//                           }}
//                         >
//                           Mark all as read
//                         </button>
//                       </div>
//                       <div className="max-h-96 overflow-auto">
//                         {adminNotifications && adminNotifications.length > 0 ? (
//                           adminNotifications.map((n) => (
//                             <div
//                               key={n.id}
//                               className="p-3 hover:bg-gray-50 flex"
//                             >
//                               <div
//                                 className={`w-2 h-2 rounded-full mt-2 mr-3 ${
//                                   n.isRead ? "bg-gray-300" : "bg-red-500"
//                                 }`}
//                               />
//                               <div className="flex-1">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {n.title || "Notification"}
//                                 </div>
//                                 <div className="text-xs text-gray-600 mt-0.5">
//                                   {n.message}
//                                 </div>
//                                 <div className="text-[10px] text-gray-400 mt-1">
//                                   {new Date(n.createdAt).toLocaleString()}
//                                 </div>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="p-4 text-sm text-gray-500">
//                             No notifications
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Page content */}
//           <main className="p-6">
//             <Routes>
//               <Route path="/" element={<DashboardContent />} />
//               <Route path="/users" element={<UserManagement />} />
//               <Route path="/reports" element={<ReportManagement />} />
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
