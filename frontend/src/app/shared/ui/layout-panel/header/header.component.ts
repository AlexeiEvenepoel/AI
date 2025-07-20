import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../auth/data-access/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../auth/interfaces/auth.interface';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-header-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderPanelComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Usamos una señal para el estado del usuario
  user: Signal<User | null> = toSignal(this.authService.currentUser$, {
    initialValue: null,
  });
  isLoggingOut = false;

  async logOut() {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/sign-in']);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.isLoggingOut = false;
    }
  }
}
