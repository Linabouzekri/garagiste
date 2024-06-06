<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userName', 
        'email',  
        'adress',
        'phone',
        'password', 
        'role'
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function vehicules()
    { 
        return $this->hasMany(Vehicule::class); 
    } 


    public function reparations()
    {
        return $this->belongsToMany(Vehicule::class , "reparations" , "user_id" , "vehicule_id")->withTimestamps()->withPivot(['description', 'status' , 'start_date', 'end_date', 'mechanic_note' , 'client_note' , 'id']); 
    
    }

    public function reparationsMecanique()
    {
        return $this->belongsToMany(Vehicule::class , "reparations" , "mecanique_id" , "vehicule_id")->withTimestamps()->withPivot(['description', 'status' , 'start_date', 'end_date', 'mechanic_note' , 'client_note' , 'id']); 
    
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


     // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

}
