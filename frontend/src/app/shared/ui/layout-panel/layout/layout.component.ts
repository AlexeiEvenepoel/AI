import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import SideNavigationComponent from '../side-navigation/side-navigation.component';
import { FooterPanelComponent } from '../footer/footer.component';
import { HeaderPanelComponent } from '../header/header.component';

@Component({
  selector: 'app-layout-panel',
  standalone: true,
  imports: [
    RouterModule,
    SideNavigationComponent,
    FooterPanelComponent,
    HeaderPanelComponent,
  ],
  templateUrl: './layout.component.html',
  styles: ``,
})
export default class LayoutPanelComponent {}
