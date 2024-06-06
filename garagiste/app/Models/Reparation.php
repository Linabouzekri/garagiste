<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $fillable = [ 
        'description',
        'status' ,
        'start_date',
        'end_date',
        'mechanic_note' ,
        'client_note',
        'vehicule_id',
        'user_id',
        'mecanique_id'
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'vehicule_id');
    }

    public function mecanicien(){
        return $this->belongsTo(User::class , 'mecanique_id');
    }

}
