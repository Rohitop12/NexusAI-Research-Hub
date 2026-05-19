<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class DocumentChunk extends Model
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'document_id',
        'content',
        'embedding'
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
