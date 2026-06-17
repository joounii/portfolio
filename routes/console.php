<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Spatie\Sitemap\Sitemap;
use Illuminate\Support\Facades\Route;
use Spatie\Sitemap\Tags\Url;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('sitemap:generate', function () {
    $prodUrl = 'https://joounii.ch';

    $this->info('Scanning routes for sitemap...');

    $sitemap = Sitemap::create();
    $routes = Route::getRoutes();

    foreach ($routes as $route) {
        if (!in_array('GET', $route->methods())) {
            continue;
        }

        $uri = $route->uri();

        if (
            str_starts_with($uri, 'admin') ||
            str_starts_with($uri, 'api') ||
            str_starts_with($uri, 'login') ||
            str_starts_with($uri, 'register') ||
            str_starts_with($uri, 'password') ||
            str_starts_with($uri, 'verify') ||
            str_starts_with($uri, 'sanctum') ||
            str_starts_with($uri, 'up') ||
            str_starts_with($uri, 'confirm-password') ||
            str_starts_with($uri, 'storage') ||
            str_starts_with($uri, '_') ||
            $uri === 'home'
        ) {
            continue;
        }

        $path = $uri === '/' ? $prodUrl : $prodUrl . '/' . ltrim($uri, '/');

        $sitemap->add(
            Url::create($path)
                ->setPriority($uri === '/' ? 1.0 : 0.8)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
        );

        $this->line("Added: {$path}");
    }

    $sitemap->writeToFile(public_path('sitemap.xml'));

    $this->info('Done! Sitemap generated successfully.');

})->purpose('Automatically generate sitemap by scanning non-admin routes');
