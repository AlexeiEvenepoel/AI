import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';
// import { TokenService } from '../../../../auth/data-access/token.service';
// import { HasRoleDirective } from '../../../../core/hasRole.directive';
import { LogoComponent } from './components/logo/logo.component';

@Component({
  selector: 'app-side-navigation',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './side-navigation.component.html',
})
export default class SideNavigationComponent implements OnInit, AfterViewInit {
  // private tokenService = inject(TokenService);
  private router = inject(Router);

  loading = signal(true);
  userRole = signal<string | null>(null);
  userName = signal<string | null>(null);

  // Para detectar si estamos en móvil
  isMobile = window.innerWidth < 1024;

  ngOnInit() {
    setTimeout(() => {
      initFlowbite();
    }, 100);

    // Obtener el rol y nombre del usuario del token
    // if (this.tokenService.hasToken() && !this.tokenService.isTokenExpired()) {
    //   const payload = this.tokenService.getTokenPayload();
    //   if (payload) {
    //     this.userRole.set(payload.role);
    //     // Usar name si existe, de lo contrario usar email
    //     this.userName.set(payload.name || payload.email);
    //   }
    // }

    // Suscribirse a los eventos de cambio de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.closeSidebarOnMobile();
        }
      });
  }

  ngAfterViewInit() {
    // Agregar listeners a elementos del sidebar que tienen click handlers
    this.addClickListenersToSidebarLinks();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth < 1024;
  }

  // Método para cerrar el sidebar en móvil
  closeSidebarOnMobile() {
    if (!this.isMobile) return;

    // Buscar el sidebar element por ID (usado por Flowbite)
    const sidebar = document.getElementById('logo-sidebar');

    if (sidebar && sidebar.classList.contains('transform-none')) {
      // Simular un clic en el botón de toggle para cerrar
      const toggleButton = document.getElementById('sidebar-toggle-btn');
      if (toggleButton) {
        toggleButton.click();
      } else {
        // Alternativa: manipular las clases directamente
        sidebar.classList.remove('transform-none');
        sidebar.classList.add('-translate-x-full');
      }
    }
  }

  // Agregar listeners a los links y botones dentro del sidebar
  addClickListenersToSidebarLinks() {
    setTimeout(() => {
      // Seleccionar todos los enlaces de navegación
      const navLinks = document.querySelectorAll('#logo-sidebar a[routerLink]');

      // Agregar event listeners a cada enlace
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (this.isMobile) {
            this.closeSidebarOnMobile();
          }
        });
      });

      // También manejar los botones de dropdown (que pueden no navegar pero abren submenús)
      const dropdownButtons = document.querySelectorAll(
        '#logo-sidebar button[data-collapse-toggle]'
      );

      // No cerramos en clicks a botones dropdown para permitir abrir/cerrar submenús
    }, 500); // Retraso para asegurar que los elementos estén renderizados
  }
}
