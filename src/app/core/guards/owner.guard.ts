import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean {
        const user = this.authService.currentUser();

        if (user && user.perfil === 'DONO') {
            return true;
        }

        // Redirecionar para ordens se não for dono
        this.router.navigate(['/ordens']);
        return false;
    }
}
