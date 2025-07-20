import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() route: string = '/panel/dashboard';
  @Input() showText: boolean = true;
  @Input() textSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() textColor: string = '';
  @Input() logoUrl: string = '';
  @Input() logoAlt: string = '';
  @Input() brandName: string = '';
  @Input() useDarkFilter: boolean = true;
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'; // Nueva propiedad para layout
}
