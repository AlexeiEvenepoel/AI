import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private recipesUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<{ success: boolean; data: Recipe[] }> {
    return this.http.get<{ success: boolean; data: Recipe[] }>(
      `${this.recipesUrl}/`
    );
  }

  getRecipeById(id: number): Observable<{ success: boolean; data: Recipe }> {
    return this.http.get<{ success: boolean; data: Recipe }>(
      `${this.recipesUrl}/${id}`
    );
  }

  searchRecipes(
    ingredients: string[]
  ): Observable<{ success: boolean; data: Recipe[] }> {
    return this.http.post<{ success: boolean; data: Recipe[] }>(
      `${this.recipesUrl}/search`,
      { ingredients }
    );
  }

  createRecipe(
    recipe: Partial<Recipe>
  ): Observable<{ success: boolean; data: Recipe }> {
    return this.http.post<{ success: boolean; data: Recipe }>(
      `${this.recipesUrl}/`,
      recipe
    );
  }

  // Puedes agregar métodos para PUT y DELETE si lo necesitas
}
