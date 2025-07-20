import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/data-access/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'recipe-app';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Al inicializar la app, verificar si el usuario está autenticado
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    if (this.authService.isAuthenticated()) {
      // Si está autenticado y está en una ruta de auth, redirigir al dashboard
      const currentUrl = this.router.url;
      if (currentUrl.includes('/auth/')) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // Si no está autenticado y no está en una ruta de auth, redirigir al login
      const currentUrl = this.router.url;
      if (!currentUrl.includes('/auth/')) {
        this.router.navigate(['/auth/sign-in']);
      }
    }
  }
}
