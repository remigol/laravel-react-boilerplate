<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $superAdminRole = Role::where('slug', 'super-admin')->first();
        $adminRole = Role::where('slug', 'admin')->first();
        $userRole = Role::where('slug', 'user')->first();

        $superAdmin = User::updateOrCreate(['email' => 'superadmin@test.com'], [
            'name' => 'Super Admin',
            'email' => 'superadmin@test.com',
            'password' => Hash::make('secret'),
        ]);
        if ($superAdminRole) {
            $superAdmin->roles()->sync([$superAdminRole->id]);
        }

        $admin = User::updateOrCreate(['email' => 'admin@test.com'], [
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('secret'),
        ]);
        if ($adminRole) {
            $admin->roles()->sync([$adminRole->id]);
        }

        $user = User::updateOrCreate(['email' => 'user@test.com'], [
            'name' => 'User',
            'email' => 'user@test.com',
            'password' => Hash::make('secret'),
        ]);
        if ($userRole) {
            $user->roles()->sync([$userRole->id]);
        }

        $multiple = User::updateOrCreate(['email' => 'multiple@test.com'], [
            'name' => 'Multiple Roles User',
            'email' => 'multiple@test.com',
            'password' => Hash::make('secret'),
        ]);
        $roles = Role::whereIn('slug', ['admin', 'user'])->pluck('id')->toArray();
        $multiple->roles()->sync($roles);
    }
}
