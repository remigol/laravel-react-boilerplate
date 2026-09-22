<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function syncRoles(User $user, array $roleIds): void;

    public function attachRole(User $user, int $roleId): void;

    public function detachRole(User $user, int $roleId): void;

    public function allWithRoles(): Collection;
}
