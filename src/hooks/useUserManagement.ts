import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  userManagementApi,
  UserFilterParams,
  CreateUserDto,
  UpdateUserDto
} from '../apis/userManagement';

export interface UseUserManagementOptions {
  initialPageSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useUserManagement = (options: UseUserManagementOptions = {}) => {
  const {
    initialPageSize = 10,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const queryClient = useQueryClient();
  
  // Filter and pagination state
  const [filters, setFilters] = useState<UserFilterParams>({
    pageNumber: 1,
    pageSize: initialPageSize,
    searchTerm: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm || '');
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Create filters for API calls - only debounce search term
  const apiFilters = {
    ...filters,
    searchTerm: debouncedSearchTerm
  };



  // Query for users list
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users', apiFilters],
    queryFn: () => userManagementApi.getUsers(apiFilters),
    staleTime: autoRefresh ? 0 : 5 * 60 * 1000, // 5 minutes if not auto-refreshing
    refetchInterval: autoRefresh ? refreshInterval : false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for dashboard stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ['userManagementStats'],
    queryFn: userManagementApi.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });

  // Query for available roles
  const {
    data: availableRoles,
    isLoading: isLoadingRoles,
    error: rolesError
  } = useQuery({
    queryKey: ['availableRoles'],
    queryFn: userManagementApi.getAvailableRoles,
    staleTime: 10 * 60 * 1000, // 10 minutes (roles don't change often)
    retry: 2,
  });

  // Mutations for user operations
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserDto) => userManagementApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserDto }) =>
      userManagementApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userManagementApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const blacklistUserMutation = useMutation({
    mutationFn: (userId: string) => userManagementApi.blacklistUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });
      toast.success('User blacklisted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to blacklist user');
    },
  });

  const unblacklistUserMutation = useMutation({
    mutationFn: (userId: string) => userManagementApi.unblacklistUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });
      toast.success('User unblacklisted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unblacklist user');
    },
  });

  // Helper functions
  const updateFilters = useCallback((newFilters: Partial<UserFilterParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to first page when changing filters (except pagination)
      pageNumber: newFilters.pageNumber !== undefined ? newFilters.pageNumber : 1
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setFilters(prev => ({ ...prev, pageSize: size, pageNumber: 1 }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    updateFilters({ searchTerm: term, pageNumber: 1 });
  }, [updateFilters]);

  const setRoleFilter = useCallback((role: string) => {
    updateFilters({ role: role, pageNumber: 1 });
  }, [updateFilters]);

  const setStatusFilter = useCallback((status: string) => {
    updateFilters({ status: status, pageNumber: 1 });
  }, [updateFilters]);

  const setSorting = useCallback((sortBy: string, sortDirection: 'asc' | 'desc' = 'desc') => {
    updateFilters({ sortBy, sortDirection });
  }, [updateFilters]);

  // Action handlers
  const handleCreateUser = useCallback((userData: CreateUserDto) => {
    return createUserMutation.mutateAsync(userData);
  }, [createUserMutation]);

  const handleUpdateUser = useCallback((userId: string, userData: UpdateUserDto) => {
    return updateUserMutation.mutateAsync({ userId, userData });
  }, [updateUserMutation]);

  const handleDeleteUser = useCallback((userId: string) => {
    return deleteUserMutation.mutateAsync(userId);
  }, [deleteUserMutation]);

  const handleBlacklistUser = useCallback((userId: string) => {
    return blacklistUserMutation.mutateAsync(userId);
  }, [blacklistUserMutation]);

  const handleUnblacklistUser = useCallback((userId: string) => {
    return unblacklistUserMutation.mutateAsync(userId);
  }, [unblacklistUserMutation]);

  const refresh = useCallback(() => {
    refetchUsers();
    queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });
  }, [refetchUsers, queryClient]);

  return {
    // Data
    users: usersData?.users || [],
    totalCount: usersData?.totalCount || 0,
    totalPages: usersData?.totalPages || 1,
    currentPage: usersData?.pageNumber || 1,
    pageSize: usersData?.pageSize || initialPageSize,
    hasNextPage: usersData?.hasNextPage || false,
    hasPreviousPage: usersData?.hasPreviousPage || false,
    stats: stats || {
      totalUsers: 0,
      activeUsers: 0,
      suspendedUsers: 0,
      adminUsers: 0
    },
    availableRoles: availableRoles || [],

    // Loading states
    isLoading: isLoadingUsers,
    isLoadingStats,
    isLoadingRoles,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isBlacklisting: blacklistUserMutation.isPending,
    
    // Error states
    error: usersError,
    statsError,
    
    // Filter state
    filters: {
      ...filters,
      searchTerm: filters.searchTerm || '',
      role: filters.role || 'all',
      status: filters.status || 'all'
    },
    
    // Actions
    setPage,
    setPageSize,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setSorting,
    updateFilters,
    refresh,
    
    // CRUD operations
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    blacklistUser: handleBlacklistUser,
    unblacklistUser: handleUnblacklistUser,
  };
};
