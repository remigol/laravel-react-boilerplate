# Laravel 12 + React 19 Unified Boilerplate

A modern, production-grade full-stack starter kit combining a **Clean Architecture Backend (Laravel 12 API)** with a **Modular Frontend (React 19 + TypeScript + Vite 7 + Tailwind CSS v4)**.

Built with strict separation of concerns, native browser `fetch` (zero Axios dependency), token-based Sanctum authentication, and extensible Role-Based Access Control (RBAC).

---

## Architecture Overview

```
laravel-react-boilerplate/
├── backend/                            # Laravel 12 API (Clean Architecture)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── AuthController.php      # Login, Register, Logout, Me
│   │   │   │   │   ├── UserController.php      # User CRUD management
│   │   │   │   │   └── RoleController.php      # Role listing
│   │   │   │   └── Controller.php              # Standardized API response helpers
│   │   │   ├── Middleware/
│   │   │   │   ├── CheckRoleMiddleware.php     # RBAC verification (role:super-admin,admin)
│   │   │   │   └── ForceJsonResponseMiddleware.php
│   │   │   ├── Requests/                       # Dedicated Form Requests (Validation)
│   │   │   │   ├── Auth/ (LoginRequest, RegisterRequest)
│   │   │   │   └── User/ (CreateUserRequest, UpdateUserRequest)
│   │   │   └── Resources/                      # API Resources (JSON serialization)
│   │   │       ├── UserResource.php
│   │   │       └── RoleResource.php
│   │   ├── Models/
│   │   │   ├── User.php                        # User model with RBAC helpers
│   │   │   └── Role.php                        # Role model (slug, name, is_default)
│   │   ├── Repositories/                       # Data access layer (Direct CRUD methods)
│   │   │   ├── BaseRepository.php              # Generic CRUD (all, find, create, update, delete)
│   │   │   ├── UserRepository.php              # User queries & role sync
│   │   │   └── RoleRepository.php              # Role queries
│   │   └── Services/                           # Business logic layer (directly injects Repositories)
│   │       ├── AuthService.php
│   │       ├── UserService.php
│   │       └── RoleService.php
│   ├── config/cors.php                         # CORS allowed for Vite dev server
│   ├── database/
│   │   ├── migrations/                         # Users, Roles, User_Roles, Sanctum
│   │   └── seeders/                            # Default roles & demo users
│   └── routes/
│       └── api.php                             # RESTful /api/v1 endpoints
│
├── frontend/                           # React 19 + TypeScript + Vite 7 + Tailwind v4
│   ├── src/
│   │   ├── api/                                # Native fetch HTTP client & endpoints
│   │   │   ├── client.ts                       # Native fetch wrapper with token injection
│   │   │   ├── auth.api.ts                     # Login, register, logout, getMe
│   │   │   ├── user.api.ts                     # User CRUD requests
│   │   │   └── role.api.ts                     # Role queries
│   │   ├── components/                         # Modular component library
│   │   │   ├── common/                         # Button, Input, Select, Modal, Table, Badge, Card, Spinner
│   │   │   ├── feedback/                       # Toast notification, Alert banner, EmptyState
│   │   │   └── navigation/                     # Navbar, Sidebar, PageHeader
│   │   ├── context/
│   │   │   ├── AuthContext.tsx                 # Global auth state & session recovery
│   │   │   └── ToastContext.tsx                # Toast message manager
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                      # Access auth context
│   │   │   ├── useRole.ts                      # RBAC helpers: hasRole, hasAnyRole, isSuperAdmin
│   │   │   └── useToast.ts                     # Notification triggers
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx                   # Authenticated layout with Navbar & Sidebar
│   │   │   └── AuthLayout.tsx                  # Clean centered card layout for login/register
│   │   ├── pages/
│   │   │   ├── auth/ (LoginPage, RegisterPage)
│   │   │   ├── dashboard/ (DashboardPage)
│   │   │   ├── users/ (UserListPage, UserFormModal)
│   │   │   └── errors/ (ForbiddenPage [403], NotFoundPage [404])
│   │   ├── router/
│   │   │   ├── index.tsx                       # Central React Router v7 routes
│   │   │   ├── ProtectedRoute.tsx              # Authentication guard
│   │   │   └── RoleRoute.tsx                   # Role-based route guard
│   │   ├── types/                              # Strict TypeScript definitions
│   │   ├── utils/                              # storage.ts, cn.ts
│   │   ├── App.tsx
│   │   └── index.css                           # Tailwind CSS v4 (@import "tailwindcss";)
│   ├── vite.config.ts                          # Vite with /api proxy to backend:8000
│   └── package.json
│
├── .gitignore
└── README.md                                   # Comprehensive Developer Tutorial
```

---

## Tech Stack & Versions

- **Backend**:
  - PHP: `^8.2` (PHP 8.4+ recommended)
  - Framework: `Laravel 12`
  - Authentication: `Laravel Sanctum 4.2`
  - Database: `SQLite` (Default out-of-the-box, zero configuration required) or `MySQL` / `PostgreSQL`
- **Frontend**:
  - Runtime: `Node.js 20+` (Node 25+ recommended)
  - Framework: `React 19`
  - Language: `TypeScript 5.9`
  - Build Tool: `Vite 7`
  - Styling: `Tailwind CSS v4` (`@tailwindcss/vite`)
  - Icons: `Lucide React`
  - Routing: `React Router v7`
  - HTTP Client: **Native browser `fetch` wrapper** (No Axios dependency)

---

## Quickstart & Running the System

### 1. Prerequisites
Ensure you have installed:
- PHP >= 8.2 & Composer
- Node.js >= 20 & npm

### 2. Initial Setup (One-Time)

Set up both applications in their respective directories:

```bash
# 1. Set up backend (installs composer, creates .env, sets app key, runs migrations & seeds)
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
cd ..

# 2. Set up frontend (installs npm dependencies)
cd frontend
npm install
cd ..
```

### 3. Running the Development Servers

Open two terminal tabs to run Backend and Frontend:

#### Terminal 1: Backend API (Laravel 12)
```bash
cd backend
php artisan serve
```
Runs at: **`http://localhost:8000`**

#### Terminal 2: Frontend SPA (React 19 + Vite 7)
```bash
cd frontend
npm run dev
```
Runs at: **`http://localhost:5173`**

Open **`http://localhost:5173`** in your browser. The Vite development server automatically proxies all `/api/*` network requests directly to the Laravel API running at `http://localhost:8000`.

---

## Pre-seeded Demo Accounts & Roles

The database is seeded with ready-to-use accounts for testing role behaviors:

| Email | Password | Assigned Role | Capabilities |
| :--- | :--- | :--- | :--- |
| `superadmin@test.com` | `secret` | `super-admin` | Full system access, User Management CRUD |
| `admin@test.com` | `secret` | `admin` | System admin access, User Management CRUD |
| `user@test.com` | `secret` | `user` | Regular standard access (Cannot access `/users`) |
| `multiple@test.com` | `secret` | `admin`, `user` | Multi-role user demonstrating combined permissions |

> **Tip**: On the login page (`/login`), click any of the **Quick Demo Logins** buttons to instantly populate the credentials.

---

## Tutorial 1: How to Build a New Feature (End-to-End)

Let's build a real feature from scratch: **Articles Management** (`Article` CRUD).
This demonstrates the complete lifecycle across both Backend Clean Architecture and Frontend Modular React.

```
Request Flow:
Browser UI ──> Native fetch (article.api.ts) ──> /api/v1/articles
    ──> CheckRoleMiddleware ──> ArticleController ──> CreateArticleRequest (Validation)
    ──> ArticleService (Business Logic) ──> ArticleRepository (Data Access)
    ──> Article Model (Eloquent) ──> ArticleResource (JSON Formatting)
    ──> JSON Response ──> React Component (State & UI)
```

### Step 1: Backend - Database Migration
Create a migration for the `articles` table:

```bash
cd backend
php artisan make:migration create_articles_table
```

In `database/migrations/xxxx_create_articles_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('articles');
    }
};
```

Run the migration:
```bash
php artisan migrate
```

---

### Step 2: Backend - Eloquent Model
Create `backend/app/Models/Article.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

---

### Step 3: Backend - Repository Layer
Create `backend/app/Repositories/ArticleRepository.php` extending `BaseRepository`:

```php
<?php

namespace App\Repositories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;

class ArticleRepository extends BaseRepository
{
    public function __construct(Article $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Article
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function allWithAuthor(): Collection
    {
        return $this->model->with('user')->latest()->get();
    }
}
```

---

### Step 4: Backend - Service Layer
Create `backend/app/Services/ArticleService.php` which directly injects `ArticleRepository`:

```php
<?php

namespace App\Services;

use App\Models\Article;
use App\Repositories\ArticleRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ArticleService
{
    public function __construct(
        private ArticleRepository $articleRepository
    ) {}

    public function getAllArticles(): Collection
    {
        return $this->articleRepository->allWithAuthor();
    }

    public function getArticleById(int $id): ?Article
    {
        return $this->articleRepository->find($id);
    }

    public function createArticle(int $userId, array $data): Article
    {
        $data['user_id'] = $userId;
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);

        /** @var Article $article */
        $article = $this->articleRepository->create($data);
        $article->load('user');

        return $article;
    }

    public function updateArticle(int $id, array $data): Article
    {
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }

        /** @var Article $article */
        $article = $this->articleRepository->update($id, $data);
        $article->load('user');

        return $article;
    }

    public function deleteArticle(int $id): bool
    {
        return $this->articleRepository->delete($id);
    }
}
```

---

### Step 5: Backend - Form Requests (Validation)
Create `backend/app/Http/Requests/Article/CreateArticleRequest.php`:

```php
<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;

class CreateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }
}
```

---

### Step 6: Backend - API Resource
Create `backend/app/Http/Resources/ArticleResource.php` for clean JSON formatting:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'is_published' => (bool) $this->is_published,
            'author' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
```

---

### Step 7: Backend - Controller & Routes

#### 1. Controller: `backend/app/Http/Controllers/Api/ArticleController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\CreateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(
        private ArticleService $articleService
    ) {}

    public function index(): JsonResponse
    {
        $articles = $this->articleService->getAllArticles();
        return $this->success(ArticleResource::collection($articles), 'Articles retrieved.');
    }

    public function store(CreateArticleRequest $request): JsonResponse
    {
        $article = $this->articleService->createArticle(
            $request->user()->id,
            $request->validated()
        );

        return $this->success(new ArticleResource($article), 'Article created.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $article = $this->articleService->getArticleById($id);
        if (!$article) {
            return $this->error(null, 'Article not found.', 404);
        }
        return $this->success(new ArticleResource($article), 'Article retrieved.');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->articleService->deleteArticle($id);
        return $this->success(null, 'Article deleted.');
    }
}
```

#### 2. Register Route in `backend/routes/api.php`
Add inside `Route::middleware('auth:sanctum')->group(...)`:
```php
Route::apiResource('articles', ArticleController::class);
```

---

### Step 8: Frontend - TypeScript Types
Create `frontend/src/types/article.ts`:

```typescript
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  is_published: boolean;
}
```

Export from `frontend/src/types/index.ts`:
```typescript
export * from './article';
```

---

### Step 9: Frontend - API Client Service
Create `frontend/src/api/article.api.ts` using the native `apiClient`:

```typescript
import apiClient from './client';
import type { ApiResponse, Article, ArticleFormData } from '../types';

export const articleApi = {
  getArticles(): Promise<ApiResponse<Article[]>> {
    return apiClient.get<Article[]>('/v1/articles');
  },

  createArticle(data: ArticleFormData): Promise<ApiResponse<Article>> {
    return apiClient.post<Article>('/v1/articles', data);
  },

  deleteArticle(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/v1/articles/${id}`);
  },
};
```

---

### Step 10: Frontend - Page Component & Routing
Create `frontend/src/pages/articles/ArticleListPage.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { articleApi } from '../../api/article.api';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import type { Article } from '../../types';

export const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    articleApi.getArticles()
      .then((res) => { if (res.data) setArticles(res.data); })
      .catch((err) => error(err.message || 'Failed to load articles.'))
      .finally(() => setIsLoading(false));
  }, [error]);

  const columns: Column<Article>[] = [
    { header: 'Title', accessorKey: 'title' },
    {
      header: 'Author',
      cell: (item) => item.author?.name || 'Unknown',
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.is_published ? 'success' : 'neutral'}>
          {item.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Articles" description="Manage platform publications." />
      <Table columns={columns} data={articles} isLoading={isLoading} />
    </div>
  );
};
```

Register the route in `frontend/src/router/index.tsx`:
```tsx
import { ArticleListPage } from '../pages/articles/ArticleListPage';

// Inside ProtectedRoute <AppLayout />:
<Route path="/articles" element={<ArticleListPage />} />
```

And add the link in `frontend/src/components/navigation/Sidebar.tsx`!

---

## Tutorial 2: How to Add & Enforce a New Role

Role-Based Access Control is enforced on **both layers**:
1. **Backend**: Middleware `role:role-slug-1,role-slug-2` checks that the authenticated user possesses at least one matching role.
2. **Frontend**: `<RoleRoute allowedRoles={['...']}>` protects pages, and `useRole()` conditionally renders buttons/links.

Let's walk through adding a new **`editor`** role.

### Step 1: Add Role in Database
In `backend/database/seeders/RoleSeeder.php`, append the role definition:

```php
Role::updateOrCreate(['slug' => 'editor'], [
    'slug' => 'editor',
    'name' => 'Content Editor',
    'description' => 'Can create, edit, and publish content',
    'is_default' => false,
]);
```

Run seeders:
```bash
cd backend
php artisan db:seed --class=RoleSeeder
```

---

### Step 2: Assign the Role to Users

#### Option A: In Database Seeder (`UserSeeder.php`)
```php
$editor = User::updateOrCreate(['email' => 'editor@test.com'], [
    'name' => 'Editor Person',
    'email' => 'editor@test.com',
    'password' => Hash::make('secret'),
]);
$editorRole = Role::where('slug', 'editor')->first();
$editor->roles()->sync([$editorRole->id]);
```

#### Option B: Via User Management UI
1. Login as `superadmin@test.com`.
2. Go to **User Management** (`/users`).
3. Click **New User** or edit an existing user.
4. Click the **Content Editor** role button. The role is immediately synced!

---

### Step 3: Protect Backend API Routes
In `backend/routes/api.php`, apply the `role:` middleware to any route group:

```php
// Only users with 'editor' or 'super-admin' role can access:
Route::middleware(['auth:sanctum', 'role:editor,super-admin'])->group(function () {
    Route::post('/v1/articles', [ArticleController::class, 'store']);
    Route::put('/v1/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/v1/articles/{id}', [ArticleController::class, 'destroy']);
});
```

If an unauthorized user attempts to call these endpoints, `CheckRoleMiddleware` automatically intercepts the request and responds with:
```json
{
  "success": false,
  "message": "Insufficient role permissions.",
  "status": 403
}
```

---

### Step 4: Protect Frontend Routes
In `frontend/src/router/index.tsx`, wrap the view in `<RoleRoute>`:

```tsx
<Route
  path="/editor/articles"
  element={
    <RoleRoute allowedRoles={['editor', 'super-admin']}>
      <ArticleListPage />
    </RoleRoute>
  }
/>
```

If a user without the `editor` role attempts to access `/editor/articles`, they will be redirected to `/403` (ForbiddenPage).

---

### Step 5: Conditional UI Rendering with `useRole()`
Use the `useRole()` hook inside any React component to show, hide, or disable elements based on permissions:

```tsx
import { useRole } from '../hooks/useRole';
import { Button } from '../components/common/Button';

export const MyComponent: React.FC = () => {
  const { hasRole, hasAnyRole, isSuperAdmin } = useRole();

  return (
    <div>
      <h3>Article Actions</h3>

      {/* Visible only to Editors or Super Admins */}
      {(hasRole('editor') || isSuperAdmin) && (
        <Button variant="primary">Publish Article</Button>
      )}

      {/* Visible to Admins and Super Admins */}
      {hasAnyRole(['admin', 'super-admin']) && (
        <Button variant="danger">Delete All Revisions</Button>
      )}
    </div>
  );
};
```

---

## Native `fetch` HTTP Client Reference

The frontend uses `apiClient` (`src/api/client.ts`), built entirely on native browser `window.fetch`:

```typescript
import apiClient from '@/api/client';

// GET request with query params
const users = await apiClient.get('/v1/users', { params: { search: 'john' } });

// POST request with JSON body
const created = await apiClient.post('/v1/articles', { title: 'Hello World' });

// PUT request
const updated = await apiClient.put('/v1/articles/1', { title: 'Updated Title' });

// DELETE request
await apiClient.delete('/v1/articles/1');
```

**Features built into `apiClient`**:
1. **Automatic Bearer Token**: Reads the active token from `storage` and adds `Authorization: Bearer <token>`.
2. **Default Headers**: Automatically specifies `Accept: application/json` and `Content-Type: application/json`.
3. **401 Interceptor**: On `401 Unauthorized`, clears local storage and dispatches `auth:unauthorized`, triggering automatic redirection to `/login`.
4. **Standardized Error Handling**: Rejects with a formatted error object `{ status, message, errors }`.

---

## Testing & Quality Assurance

### Run Backend Unit & Feature Tests
```bash
cd backend
php artisan test
```
The test suite validates:
- User registration & Sanctum token issuing
- User authentication & role retrieval
- RBAC authorization (403 forbidden vs 200 allowed)
- Response structures

### Run Frontend Type Check & Build
```bash
cd frontend
npm run build
```
Runs `tsc -b` and `vite build` to verify zero TypeScript errors and bundle production assets to `frontend/dist/`.

---

## Production Deployment Checklist

1. **Backend**:
   - Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`.
   - Run `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache`.
   - Run `php artisan migrate --force`.
2. **Frontend**:
   - Run `cd frontend && npm run build`.
   - Serve the static files from `frontend/dist` using Nginx, Cloudflare Pages, Vercel, or AWS S3/CloudFront.
   - Configure reverse proxy for `/api` to the Laravel server.
3. **CORS**:
   - Update `FRONTEND_URL` in `backend/.env` to match your production frontend domain.

---

## License

This boilerplate is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
