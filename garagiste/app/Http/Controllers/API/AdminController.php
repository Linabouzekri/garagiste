<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\RegisterUpdateRequest;
use App\Http\Requests\VehiculeRequest;
use App\Models\Reparation;
use App\Models\User;
use App\Models\Vehicule;
use App\Models\VerificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function gestionUtilisatuer(){

        $data = User::with('vehicules')
        ->where('role', '<', 2)
        ->latest()
        ->get();
       

        return response()->json([
           "data" => $data
        ] , 200);
    }

    public function allMecaniciens (){

        $data = User::select('id', 'userName', 'email', 'adress', 'phone', 'role')
        ->where('role', '=', 1)
        ->latest()
        ->get();
       

        return response()->json([
           "data" => $data
        ] , 200);
        
    }

    // delete users
    public function deleteUtilisateur(Request $request) {
        try {
            $id = $request->id;
    
            $user = User::find($id);
    
            if (!$user) {
                return response()->json([
                    "error" => "Utilisateur non trouvé"
                ], 404);
            }
    
            $user->delete();
            
            return response()->json([
                "id" => $id
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "Impossible de supprimer l'utilisateur " 
            ], 500);
        }
    }

    // ajouter user 
    public function addUtilisateur(RegisterRequest $request) {
        try {
            $formFields = $request->validated();
           
            if (array_key_exists('role', $formFields)) {
                $formFields['role'] = 1;
            } else {
                $formFields['role'] = 0;
            }
    
            $user = User::create($formFields);

            VerificationMail::create([
                "code" => "0000" , 
                "email"=> $formFields['email']
            ]);

            $result = User::where("id", $user->id)
               ->with('vehicules')
               ->first();

    
            return response()->json([
                "data" => $result,
                
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "users deja existe"
            ], 500);
        }
    }


    // modifier user 

    public function storeModifierUtilisateur(RegisterUpdateRequest $request, User $user) {
        try {
            $formFields = $request->validated();
            if (!empty($formFields['password'])) {
                $user['password'] =$formFields['password'];
            }

            if (!empty($formFields['role'])) {
                $user['role'] =$formFields['role'];
            }

            $user['email'] =$formFields['email'];
            $user['userName'] =$formFields['userName'];
            $user['adress'] =$formFields['adress'];
            $user['phone'] =$formFields['phone'];

            
            //$user->fill($formFields);
            $user->save();

            $result = User::where("id", $user->id)
            ->with('vehicules')
            ->first();
           
            return response()->json([
                "data" => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "Email deja existe" 
            ], 500);
        }
    }
    
    
    // gestion Vehicules 

    public function gestionVehicules(){
        $data = Vehicule::with(['user' => function ($query) {
           
            $query->select('id', 'userName', 'email' , 'adress' , 'phone' , 'role');
        }])->latest()->get();
       

        return response()->json([
            "data" => $data
         ] , 200);

       
    }

    // delete Vehicule 

    public function deleteVehicule(Request $request){
        $id = $request->id;
    
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
        return response()->json(['id' => $id], 200);
        
    }


    //  add Vehicule 

    public function addVehicule(VehiculeRequest $request){
        try {
            $formFields = $request->validated();
            // return response()->json(['data' => $formFields], 200);
    
            if($request->hasFile('photo')){
                $formFields['photo'] = $request->file('photo')->store('vehicules', 'public');
            }else{
                $formFields['photo'] = "vehicules/vehicule2.png";
            }
    
            $vehicule = Vehicule::create($formFields);

            $data = Vehicule::with(['user' => function ($query) {
                $query->select('id', 'userName', 'email' , 'adress' , 'phone' , 'role');
            }])
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


    // update Vehicule

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
                $query->select('id', 'userName', 'email' , 'adress' , 'phone' , 'role');
            }])
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


    // all reparations en attents 
    public function allreparations ($stat){
        $status = "en attente";

        if($stat == 2 ){
            $status ="en cours";
        }

        if($stat == 3 ){
            $status = "termine";
        }
        $reparations = Reparation::where([
                 ['status' , "=" , $status]
        ])->with(['vehicule.user' , 'mecanicien' ])->get();

        return response()->json([
            "data" => $reparations
        ]);
    }
    

    // affect Reparation 

    public function affectreparation(Request $request){
        $mecanique_id = $request->mecanique_id;
        $idReparation = $request->idReparation;

        $data["status"] = "en cours";
        $data['mecanique_id']= $mecanique_id;

        $reparation = Reparation::find($idReparation);
        $reparation->fill($data);
        $reparation->save();
        return response()->json([
            'data' => $idReparation
        ]);
    }

    // update affectation 

    public function updateaffectreparation(Request $request){
        $mecanique_id = $request->mecanique_id;
        $idReparation = $request->idReparation;

        $data['mecanique_id']= $mecanique_id;

        $reparation = Reparation::find($idReparation);
        $reparation->fill($data);
        $reparation->save();

        $reparation = Reparation::where([
            ['id' , "=" , $idReparation]
        ])->with('vehicule')->get();
        
        return response()->json([
            'data' => $reparation
        ]);
        
    }
    
    
    
    
}
