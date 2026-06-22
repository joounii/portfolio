<?php

namespace App\Observers;

use App\Models\ContactMessage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ContactMessageObserver
{
    /**
     * Handle the ContactMessage "created" event.
     */
    public function created(ContactMessage $contactMessage)
    {
        $webhookUrl = config('services.discord.webhook_url');

        $messageUrl = route('admin.contact.show', $contactMessage->id);

        $truncatedMessage = Str::limit($contactMessage->payload_message, 200);

        Http::post($webhookUrl, [
            'content' => '**New Message Received!** @everyone',
            'embeds' => [[
                'title' => 'From: ' . $contactMessage->identifier_name,
                'description' => $truncatedMessage . "\n\n[Read full message here](" . $messageUrl . ")",
                'fields' => [
                    ['name' => 'Email', 'value' => $contactMessage->return_path_email, 'inline' => true],
                ],
                'color' => 5814783,
            ]]
        ]);
    }

    /**
     * Handle the ContactMessage "updated" event.
     */
    public function updated(ContactMessage $contactMessage): void
    {
        //
    }

    /**
     * Handle the ContactMessage "deleted" event.
     */
    public function deleted(ContactMessage $contactMessage): void
    {
        //
    }

    /**
     * Handle the ContactMessage "restored" event.
     */
    public function restored(ContactMessage $contactMessage): void
    {
        //
    }

    /**
     * Handle the ContactMessage "force deleted" event.
     */
    public function forceDeleted(ContactMessage $contactMessage): void
    {
        //
    }
}
