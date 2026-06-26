<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GamesCatalogController extends Controller
{
    public function index()
    {
        $games = [
            [
                'routeName' => 'games.snake.index',
                'title' => 'Retro Snake',
                'description' => 'Classic canvas grid mechanics. Customize your grid speed, toggle wrapper-walls, and track your high scores.',
                'status' => 'playable'
            ],
            [
                'routeName' => 'games.index',
                'title' => 'Block Fall (Tetris)',
                'description' => 'Stack falling polyomino blocks, complete solid horizontal lines, and clear rows.',
                'status' => 'in_development'
            ]
        ];

        return Inertia::render('Games/Index', [
            'games' => $games
        ]);
    }
}
