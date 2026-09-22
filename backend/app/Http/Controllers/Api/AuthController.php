<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return $this->success(
            data: [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
                'roles' => $result['roles'],
            ],
            message: 'User registration successful.',
            status: 201
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->validated('email'),
                $request->validated('password')
            );

            return $this->success(
                data: [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                    'roles' => $result['roles'],
                ],
                message: 'Login successful.'
            );
        } catch (ValidationException $e) {
            return $this->error(
                errors: $e->errors(),
                message: 'Invalid credentials.',
                status: 401
            );
        }
    }

    public function me(Request $request): JsonResponse
    {
        $result = $this->authService->getMe($request->user());

        return $this->success(
            data: [
                'user' => new UserResource($result['user']),
                'roles' => $result['roles'],
            ],
            message: 'Current user profile retrieved.'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(
            message: 'Successfully logged out.'
        );
    }
}
