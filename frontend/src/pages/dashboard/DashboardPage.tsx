import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Shield, Users, Layers, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { userRoles, isSuperAdmin, isAdmin } = useRole();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Developer'}!`}
        description="Here is an overview of your authenticated session, active roles, and architecture status."
        actions={
          (isAdmin || isSuperAdmin) ? (
            <Link to="/users">
              <Button icon={<Users className="h-4 w-4" />}>
                Manage Users
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* User Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Your Identity</h3>
            </div>
            <Badge variant="primary">Active</Badge>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-900">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Assigned Roles:</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {userRoles.map((role) => (
                    <Badge key={role} variant="primary" size="sm">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Access Rights Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-slate-800">Access Level</h3>
            </div>
            <Badge variant={isSuperAdmin ? 'danger' : isAdmin ? 'warning' : 'neutral'}>
              {isSuperAdmin ? 'Full Access' : isAdmin ? 'Admin Access' : 'Standard'}
            </Badge>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Authentication via Laravel Sanctum Tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    isAdmin || isSuperAdmin ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                />
                <span className={isAdmin || isSuperAdmin ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>
                  Access User Management CRUD
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${isSuperAdmin ? 'text-emerald-500' : 'text-slate-300'}`}
                />
                <span className={isSuperAdmin ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                  System Super Admin Privileges
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* Tech Stack Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-800">Unified Stack</h3>
            </div>
            <Badge variant="success">Latest</Badge>
          </CardHeader>
          <CardBody>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Backend:</span>
                <span className="font-medium text-slate-800">Laravel 12 (Clean Architecture)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Frontend:</span>
                <span className="font-medium text-slate-800">React 19 + TypeScript</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Build Tool:</span>
                <span className="font-medium text-slate-800">Vite 7</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Styling:</span>
                <span className="font-medium text-slate-800">Tailwind CSS v4</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Architecture Highlights & Quick Guide */}
      <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-white">
        <CardBody className="p-8">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Clean Architecture Backend + Modular Frontend
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              This boilerplate follows strict separation of concerns on both sides: Controllers, Form Requests,
              Business Services, Repository Contracts, Eloquent Implementations, and API Resources on the Backend;
              native fetch API client, Context Providers, Custom Hooks, and Typed Views on the Frontend.
            </p>

            <div className="flex flex-wrap gap-4">
              {isAdmin || isSuperAdmin ? (
                <Link to="/users">
                  <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                    Open User Management
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
