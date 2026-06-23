<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use App\Rules\Turnstile;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'identifier_name' => 'required|string|max:255',
            'return_path_email' => 'required|email',
            'payload_message' => 'required|string',
            'turnstile_token' => ['required', new Turnstile],
        ]);

        ContactMessage::create($validated);

        return redirect()->back()->with('success', 'PAYLOAD_RECEIVED');
    }

    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->query('filter') === 'unread') {
            $query->where('is_read', false);
        } elseif ($request->query('filter') === 'read') {
            $query->where('is_read', true);
        }

        $starFilter = $request->query('star_filter', 'all');
        if ($starFilter === 'only') {
            $query->where('is_starred', true);
        } elseif ($starFilter === 'exclude') {
            $query->where('is_starred', false);
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('identifier_name', 'like', "%{$search}%")
                  ->orWhere('return_path_email', 'like', "%{$search}%")
                  ->orWhere('payload_message', 'like', "%{$search}%");
            });
        }

        $allowedSortFields = [
            'received' => 'created_at',
            'sender'   => 'identifier_name',
            'email'    => 'return_path_email'
        ];

        $sortByParam = $request->query('sort_by', 'received');
        $sortField = $allowedSortFields[$sortByParam] ?? 'created_at';
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        if ($sortField === 'created_at') {
            $query->orderBy($sortField, $sortDir);
        } else {
            $query->orderBy($sortField, $sortDir)->orderBy('created_at', 'desc');
        }

        return Inertia::render('Admin/Inbox', [
            'messages'          => $query->get(),
            'currentFilter'     => $request->query('filter'),
            'currentStarFilter' => $starFilter,
            'currentSearch'     => $request->query('search', ''),
            'currentSortBy'     => $sortByParam,
            'currentSortDir'    => $sortDir
        ]);
    }

    public function toggleStar(ContactMessage $message)
    {
        $message->update([
            'is_starred' => !$message->is_starred
        ]);

        return redirect()->back()->with('success', 'STAR_STATUS_MUTATED');
    }

    public function show(ContactMessage $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('Admin/ShowMessage', [
            'message' => $message
        ]);
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();
        return redirect()->back()->with('success', 'PACKET_PURGED');
    }
}
