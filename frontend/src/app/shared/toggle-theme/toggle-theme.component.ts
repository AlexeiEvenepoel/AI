import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../data-access/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ToggleThemeComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  isAnimating = false;
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Suscribirse a cambios de tema
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.isDarkMode = theme === 'dark';
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.themeService.toggleTheme();

    // Resetear animación después de un tiempo
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  getCurrentThemeLabel(): string {
    return this.isDarkMode ? 'Modo Oscuro' : 'Modo Claro';
  }

  getNextThemeLabel(): string {
    return this.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }
}
