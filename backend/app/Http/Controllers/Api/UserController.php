<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        return $this->success(
            data: UserResource::collection($users),
            message: 'Users retrieved successfully.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error(
                message: 'User not found.',
                status: 404
            );
        }

        return $this->success(
            data: new UserResource($user),
            message: 'User retrieved successfully.'
        );
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return $this->success(
            data: new UserResource($user),
            message: 'User created successfully.',
            status: 201
        );
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error(
                message: 'User not found.',
                status: 404
            );
        }

        $updated = $this->userService->updateUser($id, $request->validated());

        return $this->success(
            data: new UserResource($updated),
            message: 'User updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error(
                message: 'User not found.',
                status: 404
            );
        }

        $this->userService->deleteUser($id);

        return $this->success(
            message: 'User deleted successfully.'
        );
    }
}
