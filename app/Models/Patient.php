<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'username',
        'password',
        'no_rm',
        'phone',
        'email',
        'no_bpjs',
        'address',
    ];
}
