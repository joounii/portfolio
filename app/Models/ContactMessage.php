<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Reminder;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ContactMessage extends Model
{
    protected $fillable = [
        'identifier_name',
        'return_path_email',
        'payload_message',
        'is_read',
        'is_starred',
        'admin_notes',
    ];

    public function reminders(): MorphMany
    {
        return $this->morphMany(Reminder::class, 'remindable');
    }
}
