<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::updateOrCreate(['slug' => 'super-admin'], [
            'slug' => 'super-admin',
            'name' => 'Super Admin',
            'description' => 'Full system access',
            'is_default' => false,
        ]);

        Role::updateOrCreate(['slug' => 'admin'], [
            'slug' => 'admin',
            'name' => 'Admin',
            'description' => 'System administration access',
            'is_default' => false,
        ]);

        Role::updateOrCreate(['slug' => 'user'], [
            'slug' => 'user',
            'name' => 'User',
            'description' => 'Regular user access',
            'is_default' => true,
        ]);
    }
}
