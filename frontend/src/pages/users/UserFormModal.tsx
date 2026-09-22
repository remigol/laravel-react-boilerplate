import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { userApi } from '../../api/user.api';
import { roleApi } from '../../api/role.api';
import { useToast } from '../../hooks/useToast';
import type { Role, User } from '../../types';

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { success, error } = useToast();
  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      // Load available roles
      roleApi
        .getRoles()
        .then((res) => {
          if (res.data) setAvailableRoles(res.data);
        })
        .catch(() => {});

      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPassword('');
        setSelectedRoles(user.roles?.map((r) => r.id) || []);
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setSelectedRoles([]);
      }
      setErrors({});
    }
  }, [isOpen, user]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isEditing && user) {
        const payload: any = {
          name,
          email,
          roles: selectedRoles,
        };
        if (password.trim()) {
          payload.password = password;
        }

        await userApi.updateUser(user.id, payload);
        success('User updated successfully.');
      } else {
        await userApi.createUser({
          name,
          email,
          password,
          roles: selectedRoles,
        });
        success('User created successfully.');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      }
      error(err.message || 'Failed to save user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit User: ${user?.name}` : 'Create New User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          error={errors['name']?.[0]}
        />

        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          error={errors['email']?.[0]}
        />

        <Input
          label={isEditing ? 'Password (leave blank to keep current)' : 'Password'}
          type="password"
          required={!isEditing}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors['password']?.[0]}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Assign Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => {
              const isChecked = selectedRoles.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {role.name}
                </button>
              );
            })}
          </div>
          {errors['roles'] && <p className="mt-1 text-xs text-rose-600">{errors['roles'][0]}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
