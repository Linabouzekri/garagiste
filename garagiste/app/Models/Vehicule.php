<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [ 
        'marque', 
        'model',  
        'typeCarburant', 
        'immatricule',
        'photo',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

   


    public function reparations() {
        return $this->belongsToMany(User::class, 'reparations', 'vehicule_id', 'user_id')
                    ->withTimestamps()->withPivot(['description', 'status', 'start_date', 'end_date', 'mechanic_note', 'client_note']);
    }

    
    


}
