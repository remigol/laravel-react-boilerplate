<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthService
{
    public function __construct(
        private UserRepository $userRepository,
        private RoleRepository $roleRepository
    ) {}

    public function register(array $data): array
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ];

        /** @var User $user */
        $user = $this->userRepository->create($userData);

        // Assign default role (e.g. 'user')
        $defaultRoles = $this->roleRepository->getDefaultRoles();
        if ($defaultRoles->isNotEmpty()) {
            $this->userRepository->syncRoles($user, $defaultRoles->pluck('id')->toArray());
        }

        $user->load('roles');

        $token = $user->createToken(
            'auth_token',
            ['*'],
            Carbon::now()->addDays(7)
        )->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'roles' => $user->getRoleNames(),
        ];
    }

    public function login(string $email, string $password): array
    {
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        /** @var User $user */
        $user = $this->userRepository->findByEmail($email);
        $user->load('roles');

        $token = $user->createToken(
            'auth_token',
            ['*'],
            Carbon::now()->addDays(7)
        )->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'roles' => $user->getRoleNames(),
        ];
    }

    public function logout(User $user): void
    {
        /** @var PersonalAccessToken|null $token */
        $token = $user->currentAccessToken();
        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }
    }

    public function getMe(User $user): array
    {
        $user->load('roles');

        return [
            'user' => $user,
            'roles' => $user->getRoleNames(),
        ];
    }
}
