<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function syncRoles(User $user, array $roleIds): void
    {
        $user->roles()->sync($roleIds);
    }

    public function attachRole(User $user, int $roleId): void
    {
        $user->roles()->syncWithoutDetaching([$roleId]);
    }

    public function detachRole(User $user, int $roleId): void
    {
        $user->roles()->detach($roleId);
    }

    public function allWithRoles(): Collection
    {
        return $this->model->with('roles')->get();
    }
}
