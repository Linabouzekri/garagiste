<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\MecanicientController;
use App\Http\Controllers\API\StatistiqueController;
use App\Http\Controllers\MailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware(["api"])->group(function(){
   
    Route::post('/login' , [LoginController::class , 'login']);
    Route::post('/register' , [LoginController::class , 'register']);
    Route::post('/email', [MailController::class, 'index']);
    Route::post('/email/verify', [MailController::class, 'verificayions']);
    Route::post('/forgetpassword' , [LoginController::class , 'forgetPassword']);
    Route::post('/email/forgetpassword/veryexistMail', [MailController::class, 'existMailsAndSendCode']);

    // admin 
    Route::prefix('admin')->name("admin.")->group(function(){
        Route::controller(AdminController::class)->group(function(){

            Route::get('/users' , "gestionUtilisatuer");
            Route::get("/mecaniciens" , "allMecaniciens");
            Route::delete("/deleteUtilisateur" , "deleteUtilisateur");
            Route::post("/addUtilisateur" , "addUtilisateur");
            Route::post("/modifierUtilisateur/{user}" , "storeModifierUtilisateur");

            // Vehicules 
            Route::get('/vehicules' , "gestionVehicules");
            Route::delete("/deleteVehicule" , "deleteVehicule");
            Route::post("/addVehicule" , "addVehicule");
            Route::post("/storeModifierVehicule/{vehicule}" , 'storeModifierVehicule');

            // reparation 
            Route::get('/reparations/{stat}' , "allreparations");
            Route::post("/reparation/affecte/" , "affectreparation" );
            Route::post("/reparation/updateaffectation" , "updateaffectreparation" );
    
        });

        Route::controller(StatistiqueController::class)->group(function(){

            Route::get('/statistique/total' , "totalStat");
            Route::get('/statistique/reparation/mecanique' , "reparations");
          
          
        });

    });

    // client  

    Route::prefix('client')->name('client.')->group(function(){
        Route::controller(ClientController::class)->group(function(){
            Route::get('/vehicules/{user}' , "vehicules");
            Route::post('/demendeReparation/{vehicule}' , 'demendeReparation');
            // Route::get('/detailles/{vehicule}' , "detaillesVehicule");
            Route::post("/addVehicule" , "addVehicule");
            Route::delete('/vehicule/{vehicule}' , 'deleteVehicule');
            Route::post('/vehicule/{vehicule}' , 'storeModifierVehicule');
            Route::get("/vehicule/reparations/{clientId}" , "reparationClient");
            Route::post("/update/{user}" , "storeModifierUtilisateur");

        });

        Route::controller(StatistiqueController::class)->group(function(){
            Route::get('/statistique/{user}' , "statistiqueClient");
          
        });

    });

    // mecanicien 

    Route::prefix('mecanicien')->name('mecanicien.')->group(function(){
        Route::controller(MecanicientController::class)->group(function(){
            Route::get('/reparations/{mecaniqueId}' , "reparations");
            Route::post("/reparation/fin/{idReparation}" , "finReparation" );

        });

        Route::controller(StatistiqueController::class)->group(function(){
            Route::get('/statistique/{user}' , "statistiqueMecanicien");
          
        });

    });


});
