<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'identifier_name' => 'required|string|max:255',
            'return_path_email' => 'required|email',
            'payload_message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return redirect()->back()->with('success', 'PAYLOAD_RECEIVED');
    }

    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->query('filter') === 'unread') {
            $query->where('is_read', false);
        }

        return Inertia::render('Admin/Inbox', [
            'messages' => $query->latest()->get(),
            'currentFilter' => $request->query('filter')
        ]);
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
