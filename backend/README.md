# Recipe Recommendation Backend

Backend API para el sistema de recomendación de recetas basado en reconocimiento de imágenes usando BLIP.

## Estructura del Proyecto

```
backend/
├── api/                    # API REST con Flask
│   ├── routes/            # Endpoints de la API
│   │   ├── recipe_routes.py    # Rutas para recetas
│   │   └── image_routes.py     # Rutas para análisis de imágenes
│   ├── services/          # Lógica de negocio
│   │   ├── recipe_service.py   # Servicio de recetas
│   │   └── image_service.py    # Servicio de análisis de imágenes
│   ├── models/            # Modelos de base de datos
│   │   ├── recipe.py           # Modelo de recetas
│   │   └── ingredient.py       # Modelo de ingredientes
│   └── dto/               # Data Transfer Objects
│       ├── recipe_dto.py       # DTOs para recetas
│       └── ingredient_dto.py   # DTOs para ingredientes
├── ml/                    # Módulo de Machine Learning
│   ├── blip/              # Modelo BLIP para análisis de imágenes
│   │   ├── image_processor.py  # Wrapper para BLIP
│   │   └── [archivos del modelo]
│   └── utils/             # Utilidades de ML
│       └── ingredient_extractor.py  # Extractor de ingredientes
├── config/                # Configuración
│   └── database.py        # Configuración de base de datos
├── data/                  # Datos de ejemplo
│   └── sample_recipes.json     # Recetas de ejemplo
├── docker-compose.yml     # Docker Compose para PostgreSQL
├── requirements.txt       # Dependencias de Python
├── main.py               # Punto de entrada de la aplicación
├── test_blip.py          # Script de prueba para BLIP
└── load_sample_data.py   # Script para cargar datos de ejemplo
```

## Instalación y Configuración

### 1. Clonar y navegar al directorio

```bash
cd backend
```

### 2. Crear entorno virtual (recomendado)

```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copiar `.env.example` a `.env` y ajustar las variables:

```bash
POSTGRES_USER=recipe_user
POSTGRES_PASSWORD=recipe_password
POSTGRES_DB=recipe_db
DATABASE_URL=postgresql://recipe_user:recipe_password@localhost:5435/recipe_db
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### 5. Iniciar base de datos

```bash
docker-compose up -d
```

### 6. Cargar datos de ejemplo (opcional)

```bash
python load_sample_data.py
```

### 7. Probar el modelo BLIP

```bash
python test_blip.py
```

### 8. Iniciar el servidor

```bash
python main.py
```

El servidor estará disponible en `http://localhost:5000`

## Endpoints de la API

### Análisis de Imágenes

#### `POST /api/images/analyze`

Analiza una imagen y extrae ingredientes.

**Parámetros:**

- `image`: Archivo de imagen (FormData)

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "description": "a sliced onion on a cutting board",
    "ingredients": ["onion"],
    "confidence": 0.85
  }
}
```

#### `POST /api/images/analyze-and-suggest`

Analiza una imagen y sugiere recetas basadas en los ingredientes detectados.

**Parámetros:**

- `image`: Archivo de imagen (FormData)

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "description": "a sliced onion on a cutting board",
      "ingredients": ["onion"],
      "confidence": 0.85
    },
    "suggested_recipes": [...],
    "recipe_count": 3
  }
}
```

### Recetas

#### `GET /api/recipes/`

Obtiene todas las recetas.

#### `GET /api/recipes/{id}`

Obtiene una receta específica por ID.

#### `POST /api/recipes/`

Crea una nueva receta.

#### `PUT /api/recipes/{id}`

Actualiza una receta existente.

#### `DELETE /api/recipes/{id}`

Elimina una receta.

#### `POST /api/recipes/search`

Busca recetas por ingredientes.

**Parámetros:**

```json
{
  "ingredients": ["chicken", "onion", "garlic"]
}
```

## Tecnologías Utilizadas

- **Flask**: Framework web de Python
- **SQLAlchemy**: ORM para base de datos
- **PostgreSQL**: Base de datos relacional
- **BLIP**: Modelo de visión-lenguaje para análisis de imágenes
- **PyTorch**: Framework de deep learning
- **Transformers**: Biblioteca de Hugging Face para modelos pre-entrenados
- **Docker**: Containerización para la base de datos

## Modelos de Datos

### Recipe

```python
{
  "id": int,
  "name": str,
  "description": str,
  "instructions": str,
  "prep_time": int,  # minutos
  "cook_time": int,  # minutos
  "servings": int,
  "created_at": datetime,
  "updated_at": datetime,
  "ingredients": [RecipeIngredient]
}
```

### Ingredient

```python
{
  "id": int,
  "name": str,
  "category": str,
  "created_at": datetime
}
```

### RecipeIngredient

```python
{
  "id": int,
  "recipe_id": int,
  "ingredient_id": int,
  "quantity": str,
  "notes": str,
  "ingredient": Ingredient
}
```

## Desarrollo

### Agregar nuevos ingredientes

Editar `ml/utils/ingredient_extractor.py` y añadir nuevas palabras clave al diccionario `ingredient_keywords`.

### Probar endpoints

Usar herramientas como Postman o curl:

```bash
# Probar análisis de imagen
curl -X POST -F "image=@path/to/image.jpg" http://localhost:5000/api/images/analyze

# Buscar recetas
curl -X POST -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "onion"]}' \
  http://localhost:5000/api/recipes/search
```

## Notas

- El modelo BLIP se ejecuta localmente, no envía datos a servicios externos
- La primera ejecución puede ser lenta debido a la carga del modelo
- Para mejor rendimiento, usar GPU si está disponible
- Los archivos del modelo BLIP deben estar en `ml/blip/`
