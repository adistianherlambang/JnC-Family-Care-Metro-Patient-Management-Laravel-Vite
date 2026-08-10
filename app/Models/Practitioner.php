<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Practitioner extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor',
        'role',
        'image',
        'start_day',
        'end_day',
        'start_time',
        'end_time',
        'services',
    ];

    protected $casts = [
        'services' => 'array',
    ];
}
