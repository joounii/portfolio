<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectPageController extends Controller
{
    public function create(Project $project)
    {
        $defaultContent = [
            'type' => 'doc',
            'content' => [
                ['type' => 'paragraph']
            ]
        ];

        $page = $project->pages()->create([
            'version_name' => 'V1_DRAFT',
            'content' => $defaultContent,
        ]);

        return redirect()->route('admin.projects.page.edit', [$project->id, $page->id])
            ->with('message', 'Draft initialized.');
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'content' => 'required|array',
            'version_name' => 'required|string',
        ]);

        $page = $project->pages()->create([
            'content' => $validated['content'],
            'version_name' => $validated['version_name'],
        ]);

        return redirect()->route('admin.projects.show', $project->id)
            ->with('message', 'New version saved.');
    }

    public function edit(Project $project, ProjectPage $page)
    {
        return Inertia::render('Admin/Project/Page/Edit', [
            'project' => $project,
            'page' => $page
        ]);
    }

    public function update(Request $request, Project $project, ProjectPage $page)
    {
        $validated = $request->validate([
            'content' => 'required|array',
            'version_name' => 'required|string',
        ]);

        $page->update($validated);

        if ($request->has('stay') || $request->header('X-Quick-Save')) {
            return back()->with([
                'success' => 'Changes saved.',
                'page' => $page->fresh()
            ]);
        }

        return redirect()->route('admin.projects.show', $project->id)
            ->with('message', 'Version updated.');
    }
}
