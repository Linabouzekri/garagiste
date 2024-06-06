<?php

namespace App\Http\Middleware;

use App\Models\Utilisateur;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class ClientMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // if(session('id_client') === null){
        //     Session::flush();
        //     Auth::logout();
        //     return to_route('login.login');
        // }

        $user =auth()->user();
        if (auth()->check() && $user->role === 0) {
            return $next($request);
        }
        
        if($user->role === 2){
            return to_route("admin.home");
        }elseif($user->role === 1){
            return to_route('mecanicien.home', $user->id);
        }
    }
}
