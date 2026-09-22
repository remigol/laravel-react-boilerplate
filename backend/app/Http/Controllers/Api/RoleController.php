<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function __construct(
        private RoleService $roleService
    ) {}

    public function index(): JsonResponse
    {
        $roles = $this->roleService->getAllRoles();

        return $this->success(
            data: RoleResource::collection($roles),
            message: 'Roles retrieved successfully.'
        );
    }
}
