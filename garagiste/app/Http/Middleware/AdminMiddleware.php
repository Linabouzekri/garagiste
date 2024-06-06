<?php

namespace App\Http\Middleware;

use App\Models\Utilisateur;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user =auth()->user();
        if (auth()->check() && $user->role === 2) {
            return $next($request);
        }
        
        if($user->role === 0){
            return to_route('user.home', $user->id);
        }elseif($user->role === 1){
           
            return to_route('mecanicien.home', $user->id);
        }
        
    }
}
