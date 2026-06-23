<?php

namespace App\Services;

use App\Models\Reminder;
use Illuminate\Support\Str;

class DiscordReminderService
{
    /**
     * Build the entire standalone array payload for the Discord API webhook call.
     */
    public function makePayload(Reminder $reminder): array
    {
        $parent = $reminder->remindable;

        // 1. Fallback layout if the parent record was deleted in the meantime
        if (!$parent) {
            return [
                'content' => '⚠️ **Reminder Error!**',
                'embeds' => [[
                    'title' => 'Scheduled Reminder Orphaned',
                    'description' => 'The parent record for this reminder no longer exists.',
                    'color' => 15548997, // Red
                ]]
            ];
        }

        // 2. Format payload specifically for a Contact Message
        if ($reminder->remindable_type === \App\Models\ContactMessage::class) {
            return [
                'content' => '🔔 **Admin Reminder Alert!**',
                'embeds' => [[
                    'title' => '⏰ Reminder: Message from ' . $parent->identifier_name,
                    'description' => Str::limit($parent->payload_message, 200) .
                                     "\n\n[Open Message in Admin Dashboard](" . route('admin.contact.show', $parent->id) . ")",
                    'fields' => [
                        ['name' => 'Sender Email', 'value' => $parent->return_path_email, 'inline' => true],
                    ],
                    'color' => 15844367, // Yellow/Orange
                ]]
            ];
        }

        // FUTURE-PROOFING: Add other model payloads right here cleanly
        // if ($reminder->remindable_type === \App\Models\TodoItem::class) { ... }

        // 3. Fallback generic payload layout
        return [
            'content' => '🔔 **Admin Reminder Alert!**',
            'embeds' => [[
                'title' => '⏰ Scheduled Reminder',
                'description' => 'You have a pending reminder for a record in your system.',
                'color' => 5814783, // Purple
            ]]
        ];
    }
}
