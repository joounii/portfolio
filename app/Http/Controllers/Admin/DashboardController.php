<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Project;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_projects' => Project::count(),
                'total_messages' => ContactMessage::count(),
                'unread_messages' => ContactMessage::where('is_read', false)->count(),
            ]
        ]);
    }
}
