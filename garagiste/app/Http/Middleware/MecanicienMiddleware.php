<?php

namespace App\Http\Middleware;

use App\Models\Utilisateur;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MecanicienMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        $user =auth()->user();
        if (auth()->check() && $user->role === 1) {
            return $next($request);
        }
        
        if($user->role === 2){
            return to_route("admin.home");
        }elseif($user->role === 0){
            return to_route('user.home', $user->id);
        }
    }
}
