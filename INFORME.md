# Informe: Colombia Business News - The News API

## Descripción del Proyecto

Aplicación web desarrollada en **React + Vite** que permite explorar noticias de negocios de **Colombia** utilizando 6 endpoints diferentes de [The News API](https://www.thenewsapi.com).

---

## Endpoints Utilizados

### 1. `/v1/news/top` — Noticias Top de Negocios
**Sección:** "Top Negocios"

Retorna las noticias más relevantes del momento. Se filtra por:
- `locale=co` (Colombia)
- `categories=business`
- Parámetros opcionales: `language`, `limit`, `page`, `published_on`

**Uso en la app:** El usuario selecciona idioma, cantidad de artículos y fecha opcional, luego presiona "Buscar noticias top" para ver los artículos más importantes de negocios en Colombia.

---

### 2. `/v1/news/all` — Búsqueda Avanzada
**Sección:** "Buscar Noticias"

Permite buscar en millones de artículos históricos y en tiempo real. Soporta operadores lógicos (`+`, `|`, `-`). Se filtra por:
- `search` (término de búsqueda)
- `language`, `categories`, `published_after`, `published_before`, `limit`, `page`

**Uso en la app:** El usuario ingresa un término (ej: "economía Colombia") y aplica filtros de fecha, idioma y categoría para encontrar artículos específicos.

---

### 3. `/v1/news/headlines` — Titulares por Categoría
**Sección:** "Titulares"

Retorna titulares agrupados por categoría (general, business, tech, sports, etc.) al estilo Google News. Se filtra por:
- `locale=co` (Colombia)
- `language`, `headlines_per_category`, `published_on`

**Uso en la app:** El usuario carga los titulares y navega entre categorías mediante tabs. Cada categoría muestra sus artículos principales con imágenes.

---

### 4. `/v1/news/similar/{uuid}` — Noticias Similares
**Sección:** "Noticias Similares"

Dado el UUID de un artículo, retorna artículos relacionados por similitud de contenido. Se filtra por:
- `uuid` (identificador del artículo base)
- `language`, `categories`, `limit`

**Uso en la app:** El usuario puede ingresar un UUID manualmente o hacer clic en "Ver similares" desde cualquier tarjeta de artículo en otras secciones, lo que navega automáticamente a esta sección con el UUID precargado.

---

### 5. `/v1/news/uuid/{uuid}` — Artículo Específico
**Sección:** "Artículo por UUID"

Retorna la información completa de un artículo específico dado su UUID único. Muestra: título, descripción, imagen, fuente, fecha, categorías, keywords y snippet.

**Uso en la app:** El usuario ingresa un UUID o hace clic en "Detalle" desde cualquier tarjeta. Se muestra una vista detallada con imagen grande, metadata completa y enlace al artículo original.

---

### 6. `/v1/news/sources` — Fuentes de Noticias
**Sección:** "Fuentes"

Lista todas las fuentes (dominios) disponibles en la API. Se filtra por:
- `language`, `categories`, `page`

**Uso en la app:** El usuario explora las fuentes disponibles con filtros de idioma y categoría. Incluye un filtro local por nombre de dominio y paginación. Cada fuente muestra su favicon, dominio, idioma y categorías.

---

## Tecnologías Utilizadas

- **React 18** con Hooks (useState, useEffect, useCallback)
- **Vite** como bundler y servidor de desarrollo
- **CSS puro** con diseño responsive (sin frameworks externos)
- **Fetch API** nativa para las peticiones HTTP
- Variables de entorno con `import.meta.env`

## Características del Diseño

- Tema oscuro profesional (dark mode)
- Totalmente responsive: móvil, tablet y escritorio
- Menú hamburguesa en dispositivos móviles
- Imágenes con fallback automático
- Manejo de errores diferenciado por tipo
- Navegación entre secciones con UUID compartido
- Paginación en todas las secciones que lo soportan

## Cómo Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar API token
cp .env.example .env
# Editar .env y colocar tu token de thenewsapi.com

# 3. Ejecutar en desarrollo
npm run dev

# 4. Construir para producción
npm run build
```
