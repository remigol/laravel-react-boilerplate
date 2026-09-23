<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private RoleRepository $roleRepository
    ) {}

    public function getAllUsers(): Collection
    {
        return $this->userRepository->allWithRoles();
    }

    public function getUserById(int $id): ?User
    {
        /** @var User|null $user */
        $user = $this->userRepository->find($id);
        $user?->load('roles');
        return $user;
    }

    public function createUser(array $data): User
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ];

        /** @var User $user */
        $user = $this->userRepository->create($userData);

        if (!empty($data['roles'])) {
            $this->userRepository->syncRoles($user, $data['roles']);
        } else {
            $defaultRoles = $this->roleRepository->getDefaultRoles();
            if ($defaultRoles->isNotEmpty()) {
                $this->userRepository->syncRoles($user, $defaultRoles->pluck('id')->toArray());
            }
        }

        $user->load('roles');
        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        $userData = [];
        if (isset($data['name'])) {
            $userData['name'] = $data['name'];
        }
        if (isset($data['email'])) {
            $userData['email'] = $data['email'];
        }
        if (!empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }

        /** @var User $user */
        $user = $this->userRepository->update($id, $userData);

        if (isset($data['roles'])) {
            $this->userRepository->syncRoles($user, $data['roles']);
        }

        $user->load('roles');
        return $user;
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }
}
