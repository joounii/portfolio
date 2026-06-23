<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reminder extends Model
{
    protected $fillable = ['reminder_at', 'is_sent', 'remindable_id', 'remindable_type'];

    protected $casts = [
        'reminder_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function remindable(): MorphTo
    {
        return $this->morphTo();
    }
}
