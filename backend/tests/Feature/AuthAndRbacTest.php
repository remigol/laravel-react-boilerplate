<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthAndRbacTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles
        Role::create(['slug' => 'super-admin', 'name' => 'Super Admin', 'is_default' => false]);
        Role::create(['slug' => 'admin', 'name' => 'Admin', 'is_default' => false]);
        Role::create(['slug' => 'user', 'name' => 'User', 'is_default' => true]);
    }

    public function test_user_can_register_and_receives_token_and_default_role(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'status',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role_names'],
                    'token',
                    'roles',
                ],
            ]);

        $this->assertTrue($response->json('success'));
        $this->assertContains('user', $response->json('data.roles'));
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'name' => 'Admin Person',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);
        $adminRole = Role::where('slug', 'admin')->first();
        $user->roles()->attach($adminRole);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertNotEmpty($response->json('data.token'));
        $this->assertContains('admin', $response->json('data.roles'));
    }

    public function test_standard_user_cannot_access_user_management_crud(): void
    {
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'regular@example.com',
            'password' => Hash::make('password123'),
        ]);
        $userRole = Role::where('slug', 'user')->first();
        $user->roles()->attach($userRole);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/users');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Insufficient role permissions.',
            ]);
    }

    public function test_admin_can_access_user_management_crud(): void
    {
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.com',
            'password' => Hash::make('password123'),
        ]);
        $adminRole = Role::where('slug', 'super-admin')->first();
        $admin->roles()->attach($adminRole);

        $token = $admin->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/users');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}
