<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Controller;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware extends Controller
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // If no user or user has no roles, deny access
        if (!$user || !$user->roles()->exists()) {
            return $this->error(
                message: 'Unauthorized access.',
                status: 403
            );
        }

        // Check if user has any of the required roles
        $hasRole = $user->roles()->whereIn('slug', $roles)->exists();

        if (!$hasRole) {
            return $this->error(
                message: 'Insufficient role permissions.',
                status: 403
            );
        }

        return $next($request);
    }
}
