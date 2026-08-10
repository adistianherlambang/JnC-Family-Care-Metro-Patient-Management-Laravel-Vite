<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'queue_number',
        'patient_name',
        'doctor_name',
        'category_name',
        'service_name',
        'date',
        'time',
        'status',
    ];
}
