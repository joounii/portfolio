<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\Relation;
use Carbon\Carbon;

class ReminderController extends Controller
{
    public function store(Request $request, string $type, int $id)
    {
        $request->validate([
            'reminder_at'    => 'required|string',
            'custom_message' => 'nullable|string|max:500',
        ]);

        $modelClass = Relation::getMorphedModel($type) ?? $type;
        $parentModel = $modelClass::findOrFail($id);

        $utcTime = Carbon::parse($request->input('reminder_at'));

        if ($utcTime->isPast()) {
            return redirect()->back()->withErrors(['reminder_at' => 'The reminder must be a future date.']);
        }

        $parentModel->reminders()->create([
            'reminder_at'    => $utcTime,
            'custom_message' => $request->input('custom_message'),
            'is_sent'        => false
        ]);

        return redirect()->back()->with('success', 'REMINDER_QUEUED');
    }

    public function destroy(Reminder $reminder)
    {
        $reminder->delete();
        return redirect()->back()->with('success', 'REMINDER_PURGED');
    }
}
