<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUpdateRequest;
use App\Http\Requests\VehiculeRequest;
use App\Models\Reparation;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    

    public function vehicules($user){
       
        $vehicules = Vehicule::with(['user' => function ($query) {
            $query->select('id', 'userName', 'email' , 'adress' , 'phone');
        } , 'reparations'])->latest()->where("user_id" , "=" , $user)->get();


        return response()->json([
            "data" => $vehicules
        ]);
        
    }

    // delete vehicule 
    public function deleteVehicule ($id){
        $vehicule = Vehicule::find($id);
        DB::beginTransaction();
        try {       
            if ($vehicule) {
                $vehicule->delete();     
            } else {
                return response()->json(['error' => "Vehicule Not Found"], 500);
            }
            DB::commit();
        } catch(\Exception $e) {
            DB::rollback();
            // Log or handle the exception as needed
            return response()->json(['error' => "impossible de supprimer Vehicule"], 500);
        }
        return response()->json(['id' => $vehicule->id], 200);
    }

    //update vehicule 

    public function storeModifierVehicule(VehiculeRequest $request , Vehicule $vehicule )
    {
        try {
            $formFields = $request->validated();
    
            if(isset($formFields['photo']) && $formFields['photo'] !== 'null' ) {
                $formFields['photo'] = $request->file('photo')->store('vehicules', 'public');
            }else{
                unset($formFields['photo']);
            }
    
            $vehicule->fill($formFields);
            $vehicule->save();

            $data = Vehicule::with(['user' => function ($query) {
                $query->select('id', 'userName', 'email' , 'adress' , 'phone');
            } , 'reparations'])
            ->where('id', $vehicule->id) 
            ->latest()
            ->first();

        
    
            return response()->json([
                "data" => $data
            ], 200);
        } catch (\Exception $e) {
         
            return response()->json([
                "error" => "erreur de modification du véhicule."
            ], 500);
        }
    }


    
    //  add Vehicule 

    public function addVehicule(VehiculeRequest $request){
        try {
            $formFields = $request->validated();
           
    
            if($request->hasFile('photo')){
                $formFields['photo'] = $request->file('photo')->store('vehicules', 'public');
            }else{
                $formFields['photo'] = "vehicules/vehicule2.png";
            }
    
            $vehicule = Vehicule::create($formFields);

            $data = Vehicule::with(['user' => function ($query) {
                $query->select('id', 'userName', 'email' , 'adress' , 'phone');
            } , 'reparations' ])
            ->where('id', $vehicule->id) 
            ->latest()
            ->first();

    
            if($vehicule){
                return response()->json(['data' => $data], 200);
            }else{
                return response()->json(['error' => "Erreur de création"], 500);
            }
        } catch(\Exception $e) {
            // Log or handle the exception as needed
            return response()->json(['error' => "Erreur de création"], 500);
        }
    }


    // demende reparation 

    public function demendeReparation( Request $request ,  Vehicule $vehicule){
        $checkReparationExist = Reparation::where('vehicule_id', '=', $vehicule->id)
                                            ->whereIn('status', ['en attente', 'en cours'])
                                            ->get()
                                            ->count();

        if($checkReparationExist === 0 ){
                $currentDateTime = Carbon::now();
                $vehicule->reparations()->attach([
                    $vehicule->id => [
                        'user_id' => $vehicule->user_id,
                        'mecanique_id' => null,
                        'description' => $request->description,
                        'status' => "en attente" ,
                        'start_date' => $currentDateTime->toDateTimeString(),
                        'end_date' =>null,
                        // 'mechanic_note',
                        // 'client_note
                    ]
                ]);

                return response()->json([
                    "data" => $vehicule
                ] , 200);
        }else{
            return response()->json([
                "error" => "la reparation deja exist"
               ] ,400);
        }
        
      

        
    
        
    }


    // reparation d'un Client 
    public function reparationClient ($clientId){
        $user = User::find($clientId);
        $reparations = $user->reparations;

        return response()->json([
            "data" => $reparations
        ]);
    }


    // update info user 

    public function storeModifierUtilisateur (RegisterUpdateRequest $request ,User $user){
        
        try {
            $formFields = $request->validated();
            if (!empty($formFields['password'])) {
                $user['password'] =$formFields['password'];
            }

            $user['email'] =$formFields['email'];
            $user['userName'] =$formFields['userName'];
            $user['adress'] =$formFields['adress'];
            $user['phone'] =$formFields['phone'];

            //$user->fill($formFields);
            $user->save();
            return response()->json([
                "data" => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "Email deja existe" 
            ], 500);
        }


    }
    
}
