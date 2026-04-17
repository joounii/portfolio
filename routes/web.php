<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return Inertia::render('Home'); });
Route::get('/home', function () { return Inertia::render('Home'); })->name('home');
Route::get('/projects', function () { return Inertia::render('Projects'); })->name('projects');
Route::get('/stack', function () { return Inertia::render('Stack'); })->name('stack');
Route::get('/contact', function () { return Inertia::render('Contact'); })->name('contact');
Route::get('/logs', function () { return Inertia::render('Logs'); })->name('logs');

Route::post('/api/handshake', [ContactController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::get('/projects', [ProjectController::class, 'index'])->name('admin.projects.index');

        Route::get('/inbox', [ContactController::class, 'index'])->name('admin.inbox');
        Route::delete('/inbox/{message}', [ContactController::class, 'destroy'])->name('contact.destroy');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

require __DIR__.'/auth.php';
