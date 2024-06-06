<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'userName' => 'admin',
            'email' => 'admin@gmail.com',
            'adress' => '123 Street',
            'phone' => '1234567890',
            'password' => "admin",
            'role' => 2,
        ]);
    }
}
