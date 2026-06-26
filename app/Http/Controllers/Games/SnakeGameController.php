<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SnakeGameController extends Controller
{
    public function index()
    {
        $snakeConfigurationPresets = [
            'difficulties' => [
                ['level' => 'slug', 'label' => 'Lazy Worm (Easy)', 'speedMs' => 140],
                ['level' => 'classic', 'label' => 'Standard Retro (Medium)', 'speedMs' => 90],
                ['level' => 'viper', 'label' => 'Python Override (Hard)', 'speedMs' => 45],
            ],
            'mods' => [
                ['id' => 'walls', 'name' => 'Solid Borders', 'desc' => 'Crashing into bounds triggers instant game-over.'],
                ['id' => 'wrap', 'name' => 'Wrap-Around Matrix', 'desc' => 'Passing through edges spawns you on the inverted boundary side.']
            ]
        ];

        return Inertia::render('Games/Snake/Index', [
            'presets' => $snakeConfigurationPresets
        ]);
    }
}
