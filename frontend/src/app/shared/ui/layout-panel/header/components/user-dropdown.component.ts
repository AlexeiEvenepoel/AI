import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import { TokenService } from '../../../../../auth/data-access/token.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent implements OnInit {
  // private tokenService = inject(TokenService);
  private router = inject(Router);

  // Señales para los datos del usuario
  userName = signal<string | null>(null);
  userEmail = signal<string | null>(null);
  userRole = signal<string | null>(null);

  ngOnInit() {
    initFlowbite();
    // this.loadUserFromToken();
  }

  // Carga la información del usuario desde el token JWT
  // loadUserFromToken() {
  //   if (this.tokenService.hasToken() && !this.tokenService.isTokenExpired()) {
  //     const payload = this.tokenService.getTokenPayload();
  //     if (payload) {
  //       // Usar el name desde el payload, con email como respaldo
  //       this.userName.set(payload.name || payload.email);
  //       this.userEmail.set(payload.email);
  //       this.userRole.set(payload.role);
  //     }
  //   }
  // }

  // Propiedad computada para acceder a los datos del usuario
  get userData() {
    return {
      name: this.userName(),
      email: this.userEmail(),
      role: this.userRole(),
    };
  }

  // logOut() {
  //   this.tokenService.removeToken();
  //   this.router.navigateByUrl('/auth/sign-in');
  // }
}
