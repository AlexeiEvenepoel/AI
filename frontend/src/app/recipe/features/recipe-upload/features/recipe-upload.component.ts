import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RecipeUploadService } from '../data-access/recipe-upload.service';

@Component({
  selector: 'app-recipe-upload',
  templateUrl: './recipe-upload.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [RecipeUploadService],
})
export default class RecipeUploadComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  analysis: any = null;
  suggestedRecipes: any[] = [];
  loading = false;
  error: string | null = null;
  dragActive = false;
  isDarkMode = false;

  constructor(
    private uploadService: RecipeUploadService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Detectar el tema inicial del sistema
    this.detectSystemTheme();

    // Escuchar cambios en las preferencias del sistema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => this.detectSystemTheme());
    }
  }

  private detectSystemTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Usar preferencia del sistema
      this.isDarkMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }

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
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.error = 'Por favor selecciona un archivo de imagen válido';
      return;
    }

    // Validar tamaño del archivo (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      this.error = 'El archivo es demasiado grande. Máximo 10MB permitidos';
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
        console.error('Error analyzing image:', err);
        this.error =
          err.error?.error ||
          'Error al analizar la imagen. Por favor intenta de nuevo.';
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

  // Método para reiniciar completamente el componente
  resetComponent() {
    this.removeImage();

    // Reset del input file
    const fileInput = this.document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    // Scroll hacia arriba para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para subir otra imagen (mantiene resultados actuales)
  uploadAnotherImage() {
    // Solo limpia la imagen actual y errores, mantiene los resultados
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = null;
    this.loading = false;

    // Reset del input file
    const fileInput = this.document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getConfidencePercentage(): number {
    return Math.round((this.analysis?.confidence || 0) * 100);
  }

  getConfidenceColor(): string {
    const confidence = this.getConfidencePercentage();
    if (confidence >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (confidence >= 60)
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (confidence >= 40)
      return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  }

  getConfidenceTextColor(): string {
    const confidence = this.getConfidencePercentage();
    if (confidence >= 80) return 'text-green-700 dark:text-green-300';
    if (confidence >= 60) return 'text-yellow-700 dark:text-yellow-300';
    if (confidence >= 40) return 'text-orange-700 dark:text-orange-300';
    return 'text-red-700 dark:text-red-300';
  }

  getDifficultyIcon(difficulty?: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
      case 'muy fácil':
        return 'text-green-500 dark:text-green-400';
      case 'intermedio':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'difícil':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  }

  // Método para obtener el estado actual del análisis
  get hasResults(): boolean {
    return !!(this.analysis || this.suggestedRecipes.length > 0);
  }

  // Método para formatear el tamaño del archivo
  formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  // Método para obtener información adicional del archivo
  get fileInfo(): string {
    if (!this.selectedFile) return '';

    const size = this.formatFileSize(this.selectedFile.size);
    const type = this.selectedFile.type.split('/')[1].toUpperCase();
    return `${type} - ${size}`;
  }
}
