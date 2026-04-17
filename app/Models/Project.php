<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $casts = ['tags' => 'array'];
    public function pages() {
        return $this->hasMany(ProjectPage::class);
    }

    public function activePage() {
        return $this->belongsTo(ProjectPage::class, 'active_page_id');
    }
}
