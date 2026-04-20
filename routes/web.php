<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ProjectPageController as AdminProjectPageController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return Inertia::render('Home'); });
Route::get('/home', function () { return Inertia::render('Home'); })->name('home');
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');
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

        Route::get('/projects', [AdminProjectController::class, 'index'])->name('admin.projects.index');
        Route::get('/projects/create', [AdminProjectController::class, 'create'])->name('admin.projects.create');
        Route::post('/projects', [AdminProjectController::class, 'store'])->name('admin.projects.store');
        Route::get('/projects/{project}', [AdminProjectController::class, 'show'])->name('admin.projects.show');
        Route::get('/projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('admin.projects.edit');
        Route::put('/projects/{project}', [AdminProjectController::class, 'update'])->name('admin.projects.update');
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy'])->name('admin.projects.destroy');
        Route::patch('/projects/{project}/pages/{page}/toggle', [AdminProjectController::class, 'toggleActivePage'])->name('admin.projects.page.toggle');

        Route::get('/projects/{project}/pages/create', [AdminProjectPageController::class, 'create'])->name('admin.projects.page.create');
        Route::post('/projects/{project}/pages', [AdminProjectPageController::class, 'store'])->name('admin.projects.page.store');
        Route::get('/projects/{project}/pages/{page}/edit', [AdminProjectPageController::class, 'edit'])->name('admin.projects.page.edit');
        Route::put('/projects/{project}/pages/{page}', [AdminProjectPageController::class, 'update'])->name('admin.projects.page.update');

        Route::get('/inbox', [ContactController::class, 'index'])->name('admin.inbox');
        Route::delete('/inbox/{message}', [ContactController::class, 'destroy'])->name('contact.destroy');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

require __DIR__.'/auth.php';
