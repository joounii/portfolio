<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectPage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('activePage')->get();

        return Inertia::render('Admin/Project/Index', [
            'projects' => $projects
        ]);
    }

    public function show(Project $project)
    {
        $project->load(['activePage', 'pages' => function($query) {
            $query->latest();
        }]);

        return Inertia::render('Admin/Project/Show', [
            'project' => $project
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Project/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'custom_id' => 'required|string|unique:projects,custom_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'tags' => 'required|array|min:1',
            'status_color' => 'required|string',
        ]);

        $validated['slug'] = Str::slug($request->title);

        Project::create($validated);

        return redirect()->route('admin.projects.index')
            ->with('message', 'Project initialized successfully.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Project/Edit', [
            'project' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'custom_id' => 'required|string|unique:projects,custom_id,' . $project->id,
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'tags' => 'required|array|min:1',
            'status_color' => 'required|string',
        ]);

        $validated['slug'] = Str::slug($request->title);

        $project->update($validated);

        return redirect()->route('admin.projects.show', $project->id)
            ->with('message', 'System metadata updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('message', 'Project deleted successfully.');
    }

    public function toggleActivePage(Project $project, ProjectPage $page)
    {
        if ($project->active_page_id === $page->id) {
            $project->update(['active_page_id' => null]);
            $message = 'DOCUMENTATION_OFFLINE';
        } else {
            $project->update(['active_page_id' => $page->id]);
            $message = 'SYSTEM_LIVE_ON_NODE_' . $page->id;
        }

        return back()->with('message', $message);
    }
}
