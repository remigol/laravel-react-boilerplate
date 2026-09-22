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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { success, error } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load users.');
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
    } catch (err: any) {
      error(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role_names?.some((r) => r.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

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

      {/* Search toolbar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="max-w-xs w-full">
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

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
