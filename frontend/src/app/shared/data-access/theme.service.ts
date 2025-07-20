import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Verificar preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;

    // Si no hay tema guardado, usar preferencia del sistema
    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);

    // Aplicar clase al documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  isDarkMode(): boolean {
    return this.currentThemeSubject.value === 'dark';
  }
}
