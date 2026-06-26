<?php

namespace App\Services;

use App\Models\Reminder;
use Illuminate\Support\Str;

class DiscordReminderService
{
    public function makePayload(Reminder $reminder): array
    {
        $parent = $reminder->remindable;

        if (!$parent) {
            return [
                'content' => '**Reminder Error!**',
                'embeds' => [['title' => 'Scheduled Reminder Orphaned', 'color' => 15548997]]
            ];
        }

        if ($reminder->remindable_type === \App\Models\ContactMessage::class) {

            $description = "**From:** {$parent->identifier_name} ({$parent->return_path_email})\n\n";

            if (!empty($reminder->custom_message)) {
                $description .= "**Note:** " . $reminder->custom_message . "\n\n";
            }

            $description .= "**Message:** " . Str::limit($parent->payload_message, 200);

            $description .= "\n\n[Open full message in your admin dashboard](" . route('admin.contact.show', $parent->id) . ")";

            return [
                'content' => '**Admin Reminder Alert!** @everyone',
                'embeds' => [[
                    'title'       => 'Scheduled Reminder',
                    'description' => $description,
                    'color'       => 15844367,
                ]]
            ];
        }

        return [
            'content' => '**Admin Reminder Alert!**',
            'embeds' => [[
                'title' => 'Scheduled Reminder',
                'description' => 'Pending item reminder logs execution.',
                'color' => 5814783,
            ]]
        ];
    }
}
