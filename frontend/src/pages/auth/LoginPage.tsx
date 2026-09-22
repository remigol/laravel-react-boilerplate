import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      await login({ email, password });
      success('Welcome back! Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('secret');
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-900">Sign in to your account</h3>
        <p className="text-xs text-slate-500 mt-1">
          Or{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={fieldErrors['email']?.[0]}
        />

        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors['password']?.[0]}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      {/* Quick Demo Credentials for Developers */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span>Quick Demo Logins</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('superadmin@test.com')}
            className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">Super Admin</p>
            <p className="text-[10px] text-slate-400">All permissions</p>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('admin@test.com')}
            className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">Admin</p>
            <p className="text-[10px] text-slate-400">Management</p>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('user@test.com')}
            className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">User</p>
            <p className="text-[10px] text-slate-400">Standard</p>
          </button>
        </div>
      </div>
    </div>
  );
};
