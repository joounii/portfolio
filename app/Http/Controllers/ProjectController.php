<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('activePage')->get();

        return Inertia::render('Admin/Project/Index', [
            'projects' => $projects
        ]);
    }
}
