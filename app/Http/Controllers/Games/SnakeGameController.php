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
                ['level' => 'slow', 'label' => 'Lazy Worm (Slow)', 'speedMs' => 140],
                ['level' => 'medium', 'label' => 'Standard Retro (Medium)', 'speedMs' => 90],
                ['level' => 'fast', 'label' => 'Python Override (Fast)', 'speedMs' => 45],
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
