// // import React, { useState } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { ArrowLeft, MapPin, Calendar, User, Heart, MessageCircle, CheckCircle, Clock } from 'lucide-react';
// // import { format } from 'date-fns';
// // import ReportMap from '../components/Map/ReportMap';
// // import Header from '../components/Layout/Header';
// // import { showSuccessToast, showErrorToast } from '../utils/notifications';
// // import { useReport, useAddAssistanceLog } from '../hooks/useReports';

// // const ReportDetail: React.FC = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
// //   const [assistanceText, setAssistanceText] = useState('');
// //   const [showAssistanceForm, setShowAssistanceForm] = useState(false);

// //   // API calls
// //   const { data: report, isLoading, error } = useReport(id || '');
// //   const addAssistanceMutation = useAddAssistanceLog();

// //   const getDefaultImage = (type: string) => {
// //     const defaultImages = {
// //       flood: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
// //       fire: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
// //       earthquake: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
// //       storm: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
// //       default: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg'
// //     };
// //     return defaultImages[type as keyof typeof defaultImages] || defaultImages.default;
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading report...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error || !report) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <h1 className="text-2xl font-semibold text-gray-900 mb-4">
// //             {error ? 'Error Loading Report' : 'Report Not Found'}
// //           </h1>
// //           <p className="text-gray-600 mb-4">
// //             {error ? 'There was an error loading the report details.' : 'The requested report could not be found.'}
// //           </p>
// //           <Link to="/" className="text-red-600 hover:text-red-700">
// //             ← Back to Home
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const handleOfferAssistance = async () => {
// //     if (!assistanceText.trim()) {
// //       showErrorToast('Please enter your assistance offer before submitting.', 'Missing Information');
// //       return;
// //     }

// //     try {
// //       await addAssistanceMutation.mutateAsync({
// //         reportId: report.id,
// //         action: assistanceText,
// //         responder: 'Current User' // This should come from auth context
// //       });

// //       setAssistanceText('');
// //       setShowAssistanceForm(false);
// //       showSuccessToast(
// //         'Thank you for offering assistance! Your offer has been recorded and the reporter will be notified.',
// //         'Assistance Offer Submitted'
// //       );
// //     } catch (error) {
// //       showErrorToast('Failed to submit assistance offer. Please try again.', 'Submission Failed');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header />
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="flex items-center mb-8">
// //           <Link
// //             to="/"
// //             className="flex items-center text-red-600 hover:text-red-700 font-medium"
// //           >
// //             <ArrowLeft size={20} className="mr-2" />
// //             Back to Home
// //           </Link>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Main Content */}
// //           <div className="lg:col-span-2 space-y-8">
// //             {/* Basic Info */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <div className="flex items-start justify-between mb-4">
// //                 <div>
// //                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
// //                   <div className="flex items-center space-x-4 text-sm text-gray-600">
// //                     <div className="flex items-center">
// //                       <MapPin size={16} className="mr-1" />
// //                       {report.location.address}
// //                     </div>
// //                     <div className="flex items-center">
// //                       <Calendar size={16} className="mr-1" />
// //                       {format(report.createdAt, 'MMMM d, yyyy')}
// //                     </div>
// //                     <div className="flex items-center">
// //                       <User size={16} className="mr-1" />
// //                       {report.reporterName}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
// //                   report.status === 'verified' ? 'bg-green-100 text-green-800' :
// //                   report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
// //                   'bg-red-100 text-red-800'
// //                 }`}>
// //                   {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
// //                 </span>
// //               </div>

// //               <div className="flex flex-wrap gap-2 mb-6">
// //                 <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
// //                   {report.disasterDetail}
// //                 </span>
// //                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
// //                   {report.disasterType}
// //                 </span>
// //               </div>

// //               <p className="text-gray-700 leading-relaxed">{report.description}</p>
// //             </div>

// //             {/* Photos */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
// //               <div className="space-y-4">
// //                 <div className="aspect-video overflow-hidden rounded-lg">
// //                   <img
// //                     src={report.photos.length > 0 ? report.photos[selectedPhotoIndex] : getDefaultImage(report.disasterType)}
// //                     alt={`${report.title} - Photo ${selectedPhotoIndex + 1}`}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>
// //                 {report.photos.length > 1 && (
// //                   <div className="flex space-x-2 overflow-x-auto">
// //                     {report.photos.map((photo, index) => (
// //                       <button
// //                         key={index}
// //                         onClick={() => setSelectedPhotoIndex(index)}
// //                         className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
// //                           selectedPhotoIndex === index ? 'border-red-500' : 'border-gray-200'
// //                         }`}
// //                       >
// //                         <img
// //                           src={photo}
// //                           alt={`Thumbnail ${index + 1}`}
// //                           className="w-full h-full object-cover"
// //                         />
// //                       </button>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Location Map */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
// //               <ReportMap reports={[report]} height="300px" />
// //             </div>

// //             {/* Assistance Log */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-4">Assistance Provided</h2>
// //               {report.assistanceLog.length > 0 ? (
// //                 <div className="space-y-4">
// //                   {report.assistanceLog.map((entry) => (
// //                     <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
// //                       <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
// //                         <Heart size={20} />
// //                       </div>
// //                       <div className="flex-1">
// //                         <div className="flex items-center space-x-2 mb-2">
// //                           <span className="font-medium text-gray-900">{entry.providerName}</span>
// //                           <span className="text-sm text-gray-500">
// //                             {format(entry.createdAt, 'MMM d, yyyy')}
// //                           </span>
// //                           {entry.endorsed && (
// //                             <CheckCircle size={16} className="text-green-600" />
// //                           )}
// //                         </div>
// //                         <p className="text-gray-700">{entry.description}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div className="text-center py-8 text-gray-500">
// //                   <Heart size={48} className="mx-auto mb-4 text-gray-300" />
// //                   <p>No assistance has been provided yet.</p>
// //                   <p className="text-sm">Be the first to help this community!</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             {/* Assistance Needed */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-4">Assistance Needed</h3>
// //               <div className="space-y-2 mb-4">
// //                 {report.assistanceNeeded.map((need, index) => (
// //                   <div key={index} className="flex items-center text-sm">
// //                     <Clock size={16} className="mr-2 text-red-500" />
// //                     {need}
// //                   </div>
// //                 ))}
// //               </div>
// //               <p className="text-gray-700 text-sm leading-relaxed">
// //                 {report.assistanceDescription}
// //               </p>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
// //               <div className="space-y-3">
// //                 <button
// //                   onClick={() => setShowAssistanceForm(!showAssistanceForm)}
// //                   className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
// //                 >
// //                   <Heart size={20} className="mr-2" />
// //                   Offer Assistance
// //                 </button>
// //                 <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center font-medium">
// //                   <MessageCircle size={20} className="mr-2" />
// //                   Contact Reporter
// //                 </button>
// //               </div>

// //               {showAssistanceForm && (
// //                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Describe the assistance you can provide:
// //                   </label>
// //                   <textarea
// //                     value={assistanceText}
// //                     onChange={(e) => setAssistanceText(e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
// //                     rows={4}
// //                     placeholder="I can help with..."
// //                   />
// //                   <div className="flex space-x-2 mt-3">
// //                     <button
// //                       onClick={handleOfferAssistance}
// //                       className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
// //                     >
// //                       Submit Offer
// //                     </button>
// //                     <button
// //                       onClick={() => setShowAssistanceForm(false)}
// //                       className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
// //                     >
// //                       Cancel
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Help CTA for non-logged users */}
// //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
// //               <h3 className="text-lg font-semibold text-blue-900 mb-2">Want to Help?</h3>
// //               <p className="text-blue-700 text-sm mb-4">
// //                 Join our community to offer assistance and connect with those in need.
// //               </p>
// //               <Link
// //                 to="/login"
// //                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
// //               >
// //                 Join to Help
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ReportDetail;
// import React, { useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   MapPin,
//   CalendarDays,
//   User,
//   Tag,
//   ShieldAlert,
//   CheckCircle2,
//   ChevronLeft,
//   Phone,
//   HeartHandshake,
//   Images,
// } from "lucide-react";
// import clsx from "clsx";
// import {
//   DisasterReportDto,
//   ReportStatus,
//   SeverityLevel,
// } from "../types/DisasterReport";
// import { acceptDisasterReport } from "../services/disasterReportService";
// import { useAuthStore } from "../stores/authStore";

// const API_BASE = "http://localhost:5057/api/DisasterReport";

// const getAuthHeaders = () => {
//   const authState = useAuthStore.getState();
//   const token = authState.accessToken || localStorage.getItem("token");
//   if (!token) throw new Error("Token not found ,please login.");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // --- Data fetcher ---
// async function fetchReportById(id: string): Promise<DisasterReportDto> {
//   const { data } = await axios.get(`${API_BASE}/${id}`, getAuthHeaders());
//   return data as DisasterReportDto;
// }

// function StatusBadge({ status }: { status: ReportStatus }) {
//   const styles: Record<ReportStatus, string> = {
//     [ReportStatus.Pending]: "bg-amber-100 text-amber-800 border-amber-200",
//     [ReportStatus.Accepted]:
//       "bg-emerald-100 text-emerald-800 border-emerald-200",
//     [ReportStatus.Rejected]: "bg-rose-100 text-rose-800 border-rose-200",
//   };
//   return (
//     <span
//       className={clsx(
//         "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
//         styles[status]
//       )}
//     >
//       {status}
//     </span>
//   );
// }

// function SeverityPill({ severity }: { severity: SeverityLevel }) {
//   const label = ["Low", "Medium", "High", "Critical"][severity] ?? "unknown";
//   const color = [
//     "bg-sky-100 text-sky-800 border-sky-200",
//     "bg-yellow-100 text-yellow-800 border-yellow-200",
//     "bg-orange-100 text-orange-800 border-orange-200",
//     "bg-red-100 text-red-800 border-red-200",
//   ][severity];
//   return (
//     <span
//       className={clsx(
//         "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium",
//         color
//       )}
//     >
//       <ShieldAlert className="h-3 w-3" /> {label}
//     </span>
//   );
// }

// function Chip({
//   icon: Icon,
//   children,
// }: {
//   icon?: React.ElementType;
//   children: React.ReactNode;
// }) {
//   return (
//     <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/60 px-2 py-1 text-xs text-slate-600">
//       {Icon ? <Icon className="h-3 w-3" /> : null}
//       {children}
//     </span>
//   );
// }

// function Section({
//   title,
//   children,
//   right,
// }: {
//   title: string;
//   children: React.ReactNode;
//   right?: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
//         <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
//         {right}
//       </div>
//       <div className="p-5">{children}</div>
//     </div>
//   );
// }

// export default function ReportDetail({ id }: { id: string }) {
//   const qc = useQueryClient();

//   const reportQuery = useQuery({
//     queryKey: ["report", id],
//     queryFn: () => fetchReportById(id),
//   });

//   const acceptMutation = useMutation({
//     mutationFn: async () => acceptDisasterReport(id),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["report", id] }),
//   });
//   const report = reportQuery.data;
//   const assistanceNeeded = useMemo(() => {
//     const map = new Map<string, number>();
//     report?.impactDetails?.ForEach((d: any) => {
//       const names: string[] =
//         typeof d.impactTypeNames ||
//         (d.impactTypeName ? [d.impactTypeName] : []);
//       const sev: number =
//         typeof d.severity === "number" ? d.severity : SeverityLevel.Medium;
//       names.forEach((n) => map.set(n, Math.max(map.get(n) ?? 0, sev)));
//     });
//     return Array.from(map.entries()).map(([name, sev]) => ({ name, sev }));
//   }, [report]);
//   if (reportQuery.isLoading) {
//     return (
//       <div className="mx-auto max-w-6xl p-4">
//         <div className="animate-pulse space-y-4">
//           <div className="h-10 w-80 rounded bg-slate-200" />
//           <div className="h-40 rounded-2xl bg-slate-100" />
//         </div>
//       </div>
//     );
//   }

//   if (reportQuery.isError || !report) {
//     return (
//       <div className="mx-auto max-w-6xl p-4">
//         <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
//           Failed to load the report.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-6xl p-4">
//       <button
//         onClick={() => window.history.back()}
//         className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
//       >
//         <ChevronLeft className="h-4 w-4" /> Back to Home
//       </button>

//       <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//         {/* Left Column */}
//         <div className="md:col-span-2 space-y-5">
//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="mb-3 flex items-start justify-between gap-3">
//               <div>
//                 <h1 className="text-xl font-semibold text-slate-900">
//                   {report.title}
//                 </h1>
//                 <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
//                   <Chip icon={MapPin}>{report.location?.address}</Chip>
//                   <Chip icon={CalendarDays}>
//                     {new Date(report.timestamp).toLocaleDateString()}
//                   </Chip>
//                   <Chip icon={User}>{report.userId?.slice(0, 8)}</Chip>
//                   <Chip icon={Tag}>{report.disasterTypeName}</Chip>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end gap-2">
//                 <StatusBadge status={report.status} />
//                 <SeverityPill severity={report.severity} />
//               </div>
//             </div>
//             <p className="text-sm leading-6 text-slate-700">
//               {report.description}
//             </p>
//           </div>

//           <Section
//             title="Photos"
//             right={<Images className="h-4 w-4 text-slate-400" />}
//           >
//             {report.photoUrls?.length ? (
//               <div className="overflow-hidden rounded-xl border border-slate-200">
//                 {/* simple media strip */}
//                 <img
//                   src={report.photoUrls[0] || report.photoUrls[0].path || ""}
//                   alt={report.title}
//                   className="h-auto w-full object-cover"
//                 />
//               </div>
//             ) : (
//               <p className="text-sm text-slate-500">No photos attached.</p>
//             )}
//           </Section>

//           <Section title="Location">
//             <div className="flex items-start gap-3 text-sm text-slate-700">
//               <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
//               <div>
//                 <div>{report.location?.address}</div>
//                 <div className="text-xs text-slate-500">
//                   Lat {report.location?.lat}, Lng {report.location?.lng}
//                 </div>
//               </div>
//             </div>
//             {/* Map placeholder */}
//             <div className="mt-3 h-56 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50" />
//           </Section>

//           <Section title="Assistance Provided">
//             {report.impactDetails?.length ? (
//               <ul className="space-y-3">
//                 {report.impactDetails.map((d: any, idx: number) => (
//                   <li
//                     key={idx}
//                     className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
//                   >
//                     <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
//                     <div>
//                       <div className="text-sm font-medium text-slate-800">
//                         {d.impactTypeNames?.[0] || d.impactTypeName || "Impact"}
//                       </div>
//                       <div className="text-xs text-slate-600">
//                         {d.description}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-slate-500">
//                 No assistance recorded yet.
//               </p>
//             )}
//           </Section>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-5">
//           <Section title="Assistance Needed">
//             {assistanceNeeded.length ? (
//               <ul className="space-y-2">
//                 {assistanceNeeded.map((a) => (
//                   <li
//                     key={a.name}
//                     className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
//                   >
//                     <div className="flex items-center gap-2">
//                       <Tag className="h-4 w-4 text-slate-400" />
//                       <span className="text-slate-800">{a.name}</span>
//                     </div>
//                     <SeverityPill severity={a.sev as SeverityLevel} />
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-slate-500">
//                 Derived from impacts — none listed.
//               </p>
//             )}
//           </Section>

//           <Section title="Take Action">
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => alert("Offer Assistance flow TBD")}
//                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-600"
//               >
//                 <HeartHandshake className="h-4 w-4" /> Offer Assistance
//               </button>
//               <button
//                 onClick={() => alert("Contact reporter TBD")}
//                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//               >
//                 <Phone className="h-4 w-4" /> Contact Reporter
//               </button>
//               {report.status === ReportStatus.Pending && (
//                 <button
//                   disabled={acceptMutation.isPending}
//                   onClick={() => acceptMutation.mutate()}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60"
//                 >
//                   {acceptMutation.isPending ? "Accepting…" : "Mark as Accepted"}
//                 </button>
//               )}
//             </div>
//           </Section>

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
//             <div className="text-sm font-semibold text-slate-800">
//               Want to Help?
//             </div>
//             <p className="mt-2 text-xs text-slate-600">
//               Join our community to offer assistance and connect with those in
//               need.
//             </p>
//             <button className="mt-3 rounded-xl border border-indigo-200 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
//               Join to Help
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/ReportDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getById } from "../services/disasterReportService"; // adjust path
import { DisasterReportDto, SeverityLevel } from "../types/DisasterReport";
import ReportMap from "../components/ReportMap";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<DisasterReportDto | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSeverity = (value: number): SeverityLevel => {
    switch (value) {
      case 0:
        return SeverityLevel.Low;
      case 1:
        return SeverityLevel.Medium;
      case 2:
        return SeverityLevel.High;
      case 3:
        return SeverityLevel.Critical;
      default:
        return SeverityLevel.Low; // default value
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("Invalid report id:", id);
      return;
    }
    getById(id).then((data) => {
      console.log("Backend data:", data);
      const mappedReport: DisasterReportDto = {
        id: data.id,
        title: data.title,
        description: data.description,
        timestamp: data.timestamp,
        status: String(data.status),
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        userName: data.userName,

        photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls : [],
        severity: mapSeverity(data.severity),
        disasterTypeName: data.disasterTypeName || "Unknown",
        disasterTypeId: data.disasterTypeId || 0,
        userId: data.userId || "Unknown",

        impactDetails: data.impactDetails || [],
      } as DisasterReportDto;
      setReport(mappedReport);
      setLoading(false);
      console.log("Impact details from backend:", data.impactDetails);
    });
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!report) {
    return <div className="p-6 text-red-500">Report not found.</div>;
  }
  if (report) {
    console.log("UserName:", report.userName);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link to="/" className="flex items-center text-red-500 mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to Home
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className=" flex-1 lg:col-span-2 space-y-6">
          {/* Title + Meta */}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {report.title}
              <span
                className={`ml-3 px-2 py-0.5 rounded text-sm font-medium ${
                  report.status === "Accepted"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {report.status}
              </span>
            </h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              {/* <div className="flex items-center">
                <MapPin size={14} className="mr-1" /> {report.location.address}
              </div> */}
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" /> {report.timestamp}
              </div>
              <span className="text-gray-500">By {report.userName}</span>
            </div>
          </div>

          {/* Tags */}
          {/* <div className="flex gap-2 flex-wrap">
            {report.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div> */}

          {/* Description */}
          <p className="text-gray-700">{report.description}</p>

          {/* Photos */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Photos</h2>
            {report.photoUrls.length > 0 ? (
              <img
                src={report.photoUrls[0]}
                alt="Disaster"
                className="w-full rounded shadow"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
                No photos available
              </div>
            )}
          </div>

          {/* ImpactDetail */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Impact Details</h2>
            {report.impactDetails.length > 0 ? (
              report.impactDetails.map((detail) => (
                <div key={detail.id} className="p-3 border rounded mb-2">
                  <p className="font-medium text-gray-800">
                    {detail.description}
                  </p>
                  {detail.severity && (
                    <p className="text-sm text-gray-600">
                      Severity: {detail.severity}
                    </p>
                  )}
                  {detail.impactTypes.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Types: {detail.impactTypes.map((t) => t.name).join(", ")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No impact details available
              </p>
            )}
          </div>
          {/* Location */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            {report.latitude && report.longitude ? (
              <ReportMap
                lat={report.latitude}
                lng={report.longitude}
                address={report.address}
              />
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-gray-500">
                📍 No location available
              </div>
            )}
          </div>

          {/* Assistance Provided */}
          {/* <div>
            <h2 className="text-lg font-semibold mb-2">Assistance Provided</h2>
            <div className="space-y-3">
              {report.assistanceProvided.map((a, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border rounded shadow-sm flex items-start"
                >
                  <div className="flex-1">
                    <div className="font-medium text-blue-700">
                      {a.org}{" "}
                      <span className="text-sm text-gray-500">{a.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Assistance Needed */}
          {/* <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Assistance Needed</h2>
            <ul className="space-y-2">
              {report.assistanceNeeded.map((item, i) => (
                <li key={i} className="text-red-600 text-sm font-medium">
                  • {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              IMMEDIATE EVACUATION ASSISTANCE NEEDED. Fire suppression aircraft
              and ground crews required. Emergency shelter for 200+ families.
              Medical support for elderly and disabled residents.
            </p>
          </div> */}

          {/* Take Action */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h2 className="font-semibold text-gray-700">Take Action</h2>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Supported Request
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded">
              Contact Reporter
            </button>
          </div>

          {/* Join to Help */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Want to Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Join our community to offer assistance and connect with those in
              need.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Join to Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
