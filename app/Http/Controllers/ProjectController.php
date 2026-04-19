<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Project/Index', [
            'projects' => Project::latest()->get()
        ]);
    }

    public function show($slug)
    {
        $project = Project::where('slug', $slug)->with('activePage')->firstOrFail();
        return Inertia::render('Project/Show', ['project' => $project]);
    }
}
