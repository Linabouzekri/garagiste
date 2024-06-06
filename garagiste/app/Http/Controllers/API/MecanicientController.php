<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MecanicientController extends Controller
{
    


    // reparations mecaniques 

    public function reparations($mecaniqueId){
        $reparations = Reparation::where([
            ['mecanique_id' , "=" , $mecaniqueId ],

        ])->with('vehicule')->get();

        return response()->json([
            "data" => $reparations
        ]);
       
    }

    // fin Reparation 

     public function finReparation(Request $request, $idReparation){
        $mecaniqueId = $request->mecanique_id;

        $data["status"] = "termine";
        $data['end_date'] = Carbon::now();

        $reparation = Reparation::where([
            ['mecanique_id' , "=" , $mecaniqueId ], 
            ['id' , "=" , $idReparation]

        ])->with('vehicule')->get()->first();
        $reparation->fill($data);
        $reparation->save();
        return response()->json([
            'data' => $reparation
        ]);
    }
}
