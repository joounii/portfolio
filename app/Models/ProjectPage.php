<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectPage extends Model
{
    protected $fillable = ['project_id', 'content', 'version_name'];
    protected $casts = ['content' => 'array'];

    public function project() {
        return $this->belongsTo(Project::class);
    }
}
