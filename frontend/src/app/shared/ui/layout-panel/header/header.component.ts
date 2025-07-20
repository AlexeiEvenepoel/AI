import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../auth/data-access/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../auth/interfaces/auth.interface';

@Component({
  selector: 'app-header-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderPanelComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}
