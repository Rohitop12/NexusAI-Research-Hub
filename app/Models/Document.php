<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Document extends Model
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'user_id',
        'title',
        'filename',
        'file_path',
        'mime_type',
        'size',
        'status',
        'extracted_text',
        'ai_analysis'
    ];

    protected $casts = [
        'ai_analysis' => 'array',
    ];

    public function chunks()
    {
        return $this->hasMany(DocumentChunk::class);
    }
}
