import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeUploadService } from '../data-access/recipe-upload.service';

@Component({
  selector: 'app-recipe-upload',
  templateUrl: './recipe-upload.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [RecipeUploadService],
})
export default class RecipeUploadComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  analysis: any = null;
  suggestedRecipes: any[] = [];
  loading = false;
  error: string | null = null;
  dragActive = false;

  // Modal properties
  showModal = false;
  selectedRecipe: any = null;

  constructor(private uploadService: RecipeUploadService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.error = 'Por favor selecciona un archivo de imagen válido';
      return;
    }

    this.selectedFile = file;
    this.analysis = null;
    this.suggestedRecipes = [];
    this.error = null;

    // Crear preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadImage() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.uploadService.analyzeAndSuggestImage(formData).subscribe({
      next: (res) => {
        this.analysis = res.data.analysis;
        this.suggestedRecipes = res.data.suggested_recipes;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al analizar la imagen';
        this.loading = false;
      },
    });
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.analysis = null;
    this.suggestedRecipes = [];
    this.error = null;
  }

  getConfidencePercentage(): number {
    return Math.round((this.analysis?.confidence || 0) * 100);
  }

  getConfidenceColor(): string {
    const confidence = this.getConfidencePercentage();
    if (confidence >= 70) return 'bg-green-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getDifficultyIcon(difficulty?: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
      case 'muy fácil':
        return 'text-green-500';
      case 'intermedio':
        return 'text-yellow-500';
      case 'difícil':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  // Modal methods
  openRecipeModal(recipe: any) {
    this.selectedRecipe = recipe;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.showModal = false;
    this.selectedRecipe = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  getTotalTime(): number {
    if (!this.selectedRecipe) return 0;
    return (
      (this.selectedRecipe.prep_time || 0) +
      (this.selectedRecipe.cook_time || 0)
    );
  }

  formatInstructions(instructions: string): string[] {
    return instructions
      .split('\n')
      .filter((instruction) => instruction.trim().length > 0);
  }
  cleanInstruction(instruction: string): string {
    return instruction.replace(/^\d+\.\s*/, '');
  }
}
