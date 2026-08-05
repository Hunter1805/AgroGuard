import { useState, useEffect } from 'react';
import { usersService } from '../services/users.service';
import type { SystemUser, UserStatus } from '../types/users';

export function useUsers() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'todos'>('todos');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await usersService.getUsers(searchQuery, { status: statusFilter });
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
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
    refetchUsers: fetchUsers,
  };
}
