import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ReportsAPI,
  ReportFilters,
  ReportSubmissionData,
} from "../apis/reports";
import { Report } from "../types";
import { DisasterReportDto } from "../types/DisasterReport";
import { getAll } from "../services/disasterReportService";

interface UseReportsOptions {
  page?: number;
  pageSize?: number;
  filters?: ReportFilters;
  enabled?: boolean;
}

export const useReports = (options: UseReportsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<DisasterReportDto[]>({
    queryKey: ["reports"],
    queryFn: () => getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useReport = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => ReportsAPI.getReportById(id),
    enabled: enabled && !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useReportsStatistics = () => {
  return useQuery({
    queryKey: ["reports-statistics"],
    queryFn: ReportsAPI.getReportsStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useNearbyReports = (
  lat: number,
  lng: number,
  radius: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["nearby-reports", lat, lng, radius],
    queryFn: () => ReportsAPI.getNearbyReports(lat, lng, radius),
    enabled: enabled && !!lat && !!lng,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useSearchReports = (
  query: string,
  page: number = 1,
  pageSize: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["search-reports", query, page, pageSize],
    queryFn: () => ReportsAPI.searchReports(query, page, pageSize),
    enabled: enabled && !!query.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReportSubmissionData) => ReportsAPI.submitReport(data),
    onSuccess: () => {
      // Invalidate and refetch reports
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-statistics"] });
    },
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: "pending" | "verified" | "resolved";
      notes?: string;
    }) => ReportsAPI.updateReportStatus(id, status, notes),
    onSuccess: (updatedReport) => {
      // Update the specific report in cache
      queryClient.setQueryData(["report", updatedReport.id], updatedReport);
      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-statistics"] });
    },
  });
};

export const useAddAssistanceLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      description,
      providerName,
    }: {
      reportId: string;
      description: string;
      providerName: string;
    }) => ReportsAPI.addAssistanceLog(reportId, description, providerName),
    onSuccess: (updatedReport) => {
      // Update the specific report in cache
      queryClient.setQueryData(["report", updatedReport.id], updatedReport);
      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReportsAPI.deleteReport(id),
    onSuccess: () => {
      // Invalidate and refetch reports
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-statistics"] });
    },
  });
};

export const useExportReports = () => {
  return useMutation({
    mutationFn: ({
      format,
      filters,
    }: {
      format?: "csv" | "excel" | "pdf";
      filters?: ReportFilters;
    }) => ReportsAPI.exportReports(format, filters),
  });
};

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   ReportsAPI,
//   ReportFilters,
//   ReportSubmissionData,
// } from "../apis/reports";
// import { Report } from "../types";
// import { DisasterReportDto } from "../types/DisasterReport";
// import {
//   acceptDisasterReport,
//   createDisasterReport,
//   getAll,
//   getById,
//   getPendingReports,
//   rejectDisasterReport,
//   remove,
//   update,
//   updateReportStatus,
// } from "../services/disasterReportService";

// interface UseReportsOptions {
//   enabled?: boolean;
//   token?: string;
// }

// export const useReports = (options: UseReportsOptions = {}) => {
//   const { token, enabled = true } = options;

//   return useQuery<DisasterReportDto[]>({
//     queryKey: ["reports"],
//     queryFn: () => getAll(token),
//     enabled,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     retry: 2,
//   });
// };

// export const useReport = (
//   id: string,
//   token?: string,
//   enabled: boolean = true
// ) => {
//   return useQuery({
//     queryKey: ["report", id],
//     queryFn: () => getById(id, token),
//     enabled: enabled && !!id,
//     staleTime: 1 * 60 * 1000, // 1 minute
//     retry: 2,
//   });
// };
// export const usePendingReports = (token?: string) => {
//   return useQuery<DisasterReportDto[]>({
//     queryKey: ["pending reports"],
//     queryFn: () => getPendingReports(token),
//     staleTime: 2 * 60 * 1000,
//     retry: 2,
//   });
// };

// export const useSubmitReport = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: FormData) => createDisasterReport(data, token),
//     onSuccess: () => {
//       // Invalidate and refetch reports
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };

// export const useUpdateReport = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: FormData) => createDisasterReport(data, token),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };

// export const useAddAssistanceLog = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       reportId,
//       description,
//       providerName,
//     }: {
//       reportId: string;
//       description: string;
//       providerName: string;
//     }) => ReportsAPI.addAssistanceLog(reportId, description, providerName),
//     onSuccess: (updatedReport) => {
//       // Update the specific report in cache
//       queryClient.setQueryData(["report", updatedReport.id], updatedReport);
//       // Invalidate reports list to refetch
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//     },
//   });
// };

// // export const useUpdateReport = (token?: string) => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ id, data }: { id: string; data: FormData }) =>
// //     update(id, data, token),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["reports"] });
// //       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
// //     },
// //   });
// // };

// export const useDeleteReport = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => remove(id, token),
//     onSuccess: () => {
//       // Invalidate and refetch reports
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };

// export const useAcceptReport = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => acceptDisasterReport(id, token),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };

// export const useRejectReport = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => rejectDisasterReport(id, token),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };

// export const useUpdateReportStatus = (token?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       status,
//     }: {
//       id: string;
//       status: "Accepted" | "Rejected";
//     }) => updateReportStatus(id, status, token),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reports"] });
//       queryClient.invalidateQueries({ queryKey: ["pending-reports"] });
//     },
//   });
// };
