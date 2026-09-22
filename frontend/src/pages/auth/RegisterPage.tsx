import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, Lock } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      success('Account created successfully! Welcome aboard.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      error(err.message || 'Registration failed. Please check the fields.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-900">Create a new account</h3>
        <p className="text-xs text-slate-500 mt-1">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          error={fieldErrors['name']?.[0]}
        />

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors['password']?.[0]}
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Repeat password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors['password_confirmation']?.[0]}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Create Account
        </Button>
      </form>
    </div>
  );
};
