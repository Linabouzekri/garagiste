<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function totalStat(){

        $nbReparation = Reparation::get()->count();
        $nbClient = User::where("role" , 0)->get()->count();
        $nbMequanicien = User::where("role" , 1)->get()->count();
        $nbVehicule = Vehicule::get()->count();
       
        return response()->json([
            "data" => [
                "nbReparation" => $nbReparation,
                "nbClient" => $nbClient,
                "nbMequanicien" => $nbMequanicien,
                "nbVehicule" => $nbVehicule,
            ] 
         ] , 200);

    }

    public function reparations(){
        
        $reparationMecanique = DB::select(
            'SELECT U.userName as label, COUNT(Rep.mecanique_id) as value
            FROM reparations as Rep
            JOIN users U ON Rep.mecanique_id = U.id
            GROUP BY  U.userName'
        );

        $reparationPerStatus = Reparation::select('status as label', DB::raw('count(*) as value'))
        ->groupBy('status')
        ->get();

        $reparations_en_cours = DB::select(
            'SELECT U.userName as label, COUNT(*) as value
            FROM reparations JOIN users U on U.id = reparations.mecanique_id
            WHERE status = "en cours"
            GROUP BY U.userName;'
        );

        $reparations_termine = DB::select(
            'SELECT U.userName as label, COUNT(*) as value
            FROM reparations JOIN users U on U.id = reparations.mecanique_id
            WHERE status = "termine"
            GROUP BY U.userName;'
        );
        $reparations_clients = DB::select(
            'SELECT U.userName as label, COUNT(*) as value
            FROM reparations JOIN users U on U.id = reparations.user_id
            GROUP BY U.userName;'
        );


        return response()->json([
            "data" => [
                "reparationPerMecanique" => $reparationMecanique , 
                "reparationPerStatus" => $reparationPerStatus,
                "reparations_en_cours"=>$reparations_en_cours,
                "reparations_termine" =>$reparations_termine,
                "reparations_clients" =>$reparations_clients,
            ]
         ] , 200);

        
    }

    public function statistiqueClient(User $user){
        $reparationClient = DB::select(
            'SELECT V.immatricule as label, COUNT(V.immatricule) as value
            FROM reparations as Rep
            JOIN vehicules V ON Rep.vehicule_id = V.id
            WHERE V.user_id = ?
            GROUP BY V.immatricule;',
            [$user->id]
        );

        $totalRepartionEnAttente = Reparation::where([
            ["user_id" , $user->id] , 
            ["status" , "en attente"]])->count();

        $totalRepartionEncours = Reparation::where([
            ["user_id" , $user->id] , 
            ["status" , "en cours"]])->count();

        $totalRepartionTermine = Reparation::where([
            ["user_id" , $user->id] , 
            ["status" , "termine"]])->count();

        $totalReparationClient = [
            "en_attente" => $totalRepartionEnAttente, 
            "en_cours" => $totalRepartionEncours,
            "termine" => $totalRepartionTermine
        ];

        return response()->json([
            "data" => [
                "totatReparation" => $totalReparationClient , 
                "reparationClient"=> $reparationClient
            ]
         ] , 200);


    

      
        
    }


    public function statistiqueMecanicien(User $user){
        $reparationMecanicien = DB::select(
            'SELECT V.immatricule as label, COUNT(V.immatricule) as value
            FROM reparations as Rep
            JOIN vehicules V ON Rep.vehicule_id = V.id
            WHERE rep.mecanique_id = ?
            GROUP BY V.immatricule;',
            [$user->id]
        );


        $totalRepartionEncours = Reparation::where([
            ["mecanique_id" , $user->id] , 
            ["status" , "en cours"]])->count();

        $totalRepartionTermine = Reparation::where([
            ["mecanique_id" , $user->id] , 
            ["status" , "termine"]])->count();

        $totalReparationClient = [
            "en_cours" => $totalRepartionEncours,
            "termine" => $totalRepartionTermine
        ];

        return response()->json([
            "data" => [
                "totatReparation" => $totalReparationClient , 
                "reparationMecanicien"=> $reparationMecanicien
            ]
         ] , 200);


    

      
        
    }
}
