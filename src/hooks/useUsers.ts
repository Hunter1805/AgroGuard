import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/users.service';
import type { SystemUser, UserStatus } from '../types/users';

export function useUsers() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'todos'>('todos');

  // Paginação servida pelo backend (page/pageSize; max 100 por página).
  const PAGE_SIZE = 100;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await usersService.getUsersPaged({
      search: searchQuery,
      status: statusFilter,
      page,
      pageSize: PAGE_SIZE,
    });
    setUsers(result.items);
    setTotal(result.total);
    setLoading(false);
  }, [searchQuery, statusFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Ao mudar busca ou filtro, volta para a primeira página.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const blockUser = async (id: string, reason: string) => {
    await usersService.blockUser(id, reason);
    await fetchUsers();
  };

  const unblockUser = async (id: string) => {
    await usersService.unblockUser(id);
    await fetchUsers();
  };

  const setStatus = async (id: string, status: UserStatus, reason?: string) => {
    await usersService.setStatus(id, status, reason);
    await fetchUsers();
  };

  return {
    users,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    blockUser,
    unblockUser,
    setStatus,
    page,
    setPage,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
    refetchUsers: fetchUsers,
  };
}
