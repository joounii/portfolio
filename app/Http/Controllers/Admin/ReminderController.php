<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\Relation;
use Carbon\Carbon;

class ReminderController extends Controller
{
    public function storeOrUpdate(Request $request, string $type, int $id)
    {
        $request->validate([
            'reminder_at' => 'nullable|string',
        ]);

        $modelClass = Relation::getMorphedModel($type) ?? $type;
        $parentModel = $modelClass::findOrFail($id);

        if (!$request->filled('reminder_at')) {
            $parentModel->reminders()->delete();
            return redirect()->back()->with('success', 'REMINDER_DELETED');
        }

        $utcTime = Carbon::parse($request->input('reminder_at'));

        if ($utcTime->isPast()) {
            return redirect()->back()->withErrors(['reminder_at' => 'The reminder must be a future date.']);
        }

        $parentModel->reminders()->updateOrCreate(
            [],
            ['reminder_at' => $utcTime, 'is_sent' => false]
        );

        return redirect()->back()->with('success', 'REMINDER_SCHEDULED');
    }
}
