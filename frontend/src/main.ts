import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ThemeService } from './app/shared/data-access/theme.service';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
