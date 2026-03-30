<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'identifier_name',
        'return_path_email',
        'payload_message',
    ];
}
