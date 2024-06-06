<?php

namespace App\Http\Controllers;

use App\Mail\gestionsMail;
use App\Models\VerificationMail;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;
use Exception;
class MailController extends Controller
{
    public function index(Request $request) 
    {
        $email = $request->email ;  
        $title = $request->title;
        $code = rand(1000, 9999);

        $mailData = [
            'title' => $title,
            'message' => "votre code de verification est : ". $code,
        ];
         
        try {
           

            $res = $this->check_mail($email);
            
            if($res === 1){
                VerificationMail::create([
                    "code" => $code , 
                    "email"=>$email
                ]);
                Mail::to($request->email)->send(new gestionsMail($mailData));
                return response([
                    "result" => true
                ],200);

               

            }

            if($res === 2 ){
                $verMail = VerificationMail::where('email', $email)->first();

                $verMail->fill([
                    "code" => $code
                ]);
                $verMail->save();
                Mail::to($request->email)->send(new gestionsMail($mailData));

                return response([
                    "result" => true
                ],200);
            }

            return response([
                "result" => false
            ],400);
        } catch (Exception $e) {
            return response([
                "result" => false
            ],400);
        }
    }

    public function check_mail($email){

        $verificationmail = VerificationMail::where('email', $email)->first();

        if($verificationmail){
            if($verificationmail->user_id){
                return  3;
            }else{
                return 2;
            }
        }else{
            return 1;
        }

        

    }

    // verifier email 

    public function verificayions(Request $request){
        $code = $request->code ; 
        $email = $request->email; 

        $verification = VerificationMail::where([
            ['email', '=', $email],
            ["code" , "=" , $code]
        ])->first();

        if($verification){
            return response([
                "data" => $verification
            ], 200);
        }else{
            return response([
                "error" => "le code incorrect !"
            ], 400);
        }


    }
    
     // forget Password : 

        public function existMailsAndSendCode(Request $request){

            $email = $request->email ; 
    
            $verifyEmail = VerificationMail::where('email', $email)->first();
    
            if($verifyEmail){
                $title = "Forget Password";
                $code = rand(1000, 9999);
        
                $mailData = [
                    'title' => $title,
                    'message' => "votre code de verification est : ". $code,
                ];
                 
                try {
                   
        
                    $res = $this->check_mail($email);
                    
                    if($res === 1){
                        VerificationMail::create([
                            "code" => $code , 
                            "email"=>$email
                        ]);
                        Mail::to($request->email)->send(new gestionsMail($mailData));
                        return response([
                            "result" => true
                        ],200);
        
                       
        
                    }
        
                    if($res === 2 ){
                        $verMail = VerificationMail::where('email', $email)->first();
        
                        $verMail->fill([
                            "code" => $code
                        ]);
                        $verMail->save();
                        Mail::to($request->email)->send(new gestionsMail($mailData));
        
                        return response([
                            "result" => true
                        ],200);
                    }
        
                    return response([
                        "result" => false
                    ],400);
                } catch (Exception $e) {
                    return response([
                        "result" => false
                    ],400);
                }
            }else{
    
            }
    
            return response([
                "result" => false
            ],400);
    
        }

}
