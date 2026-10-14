import React, { useEffect, useState, useMemo } from 'react';
import { userApi } from '../../api/user.api';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { UserFormModal } from './UserFormModal';
import { useToast } from '../../hooks/useToast';
import { UserPlus, Search, Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../types';

export const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { success, error } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await userApi.getUsers();
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || 'Invalid user response.');
      }
      setUsers(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load users.';
      setUsers([]);
      setLoadError(message);
      error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    try {
      await userApi.deleteUser(user.id);
      success('User deleted successfully.');
      loadUsers();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to delete user.');
    }
  };

  const availableRoles = useMemo(() =>
    Array.from(new Set(users.flatMap((user) => user.role_names ?? []))).sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = selectedRole === 'all' || user.role_names?.includes(selectedRole);
      const matchesSearch = !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role_names?.some((role) => role.toLowerCase().includes(query));
      return matchesRole && matchesSearch;
    });
  }, [users, searchQuery, selectedRole]);

  const columns: Column<User>[] = [
    {
      header: 'User',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Roles',
      cell: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.role_names && user.role_names.length > 0 ? (
            user.role_names.map((role) => (
              <Badge
                key={role}
                variant={
                  role === 'super-admin'
                    ? 'danger'
                    : role === 'admin'
                    ? 'warning'
                    : 'primary'
                }
              >
                {role}
              </Badge>
            ))
          ) : (
            <Badge variant="neutral">none</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Created At',
      cell: (user) => (
        <span className="text-xs text-slate-500">
          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (user) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(user)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit User"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage system accounts, create new operators, and assign role privileges."
        actions={
          <Button onClick={handleOpenCreate} icon={<UserPlus className="h-4 w-4" />}>
            New User
          </Button>
        }
      />

      {/* Search and role filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="max-w-xs w-full">
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <label htmlFor="role-filter" className="sr-only">Filter by role</label>
        <select
          id="role-filter"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        >
          <option value="all">All roles</option>
          {availableRoles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <Button
          onClick={() => { setSearchQuery(''); setSelectedRole('all'); }}
          disabled={!searchQuery && selectedRole === 'all'}
        >
          Clear filters
        </Button>
        <span className="ml-auto text-xs text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>
      {loadError && (
        <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Failed to load users: {loadError}
          <button type="button" onClick={() => void loadUsers()} className="ml-3 font-semibold underline">Retry</button>
        </div>
      )}

      {/* Users table */}
      <Table
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No users found matching your search."
      />

      {/* User Create/Edit Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={loadUsers}
      />
    </div>
  );
};
