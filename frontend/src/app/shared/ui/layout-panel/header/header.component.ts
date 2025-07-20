import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDropdownComponent } from './components/user-dropdown.component';
import { ToggleThemeComponent } from '../../../toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-header-panel',
  standalone: true,
  imports: [CommonModule, UserDropdownComponent, ToggleThemeComponent],
  templateUrl: './header.component.html',
})
export class HeaderPanelComponent {}
