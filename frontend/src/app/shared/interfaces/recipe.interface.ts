export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  created_at?: string;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity: string;
  notes: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
  updated_at: string;
  ingredients: RecipeIngredient[];
}
