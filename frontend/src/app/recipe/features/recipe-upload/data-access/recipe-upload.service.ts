import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeUploadService {
  constructor(private http: HttpClient) {}

  analyzeAndSuggestImage(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/images/analyze-and-suggest`,
      formData
    );
  }
}
