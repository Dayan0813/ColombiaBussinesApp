/**
 * newsApi.js
 * Módulo central para todas las peticiones a The News API
 * País enfocado: Colombia (locale: co)
 * Tema: Business
 */

const BASE_URL = "https://api.thenewsapi.com/v1";
// Coloca tu API token aquí o en una variable de entorno .env
const API_TOKEN = import.meta.env.VITE_NEWS_API_TOKEN || "xWd5qDFNw0UrlU7d70ZA1qrkuVGrlkND96nQWo8d";

/**
 * Función auxiliar para construir la URL con parámetros
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_token", API_TOKEN);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

/**
 * Función auxiliar para realizar fetch con manejo de errores
 */
const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  // Manejo de errores de la API (no relacionados con el API key)
  if (!response.ok) {
    const errorCode = data?.error?.code || "unknown_error";
    const errorMsg = data?.error?.message || "Error desconocido";

    // Errores de contenido (no de autenticación)
    if (response.status === 404) {
      throw new Error("Recurso no encontrado. Verifica los parámetros.");
    }
    if (response.status === 429) {
      throw new Error("Demasiadas solicitudes. Espera un momento e intenta de nuevo.");
    }
    if (response.status === 402) {
      throw new Error("Límite de uso alcanzado en el plan actual.");
    }
    if (response.status === 503) {
      throw new Error("El servicio está en mantenimiento. Intenta más tarde.");
    }
    throw new Error(`Error ${response.status}: ${errorMsg}`);
  }

  return data;
};

// ─────────────────────────────────────────────
// ENDPOINT 1: Noticias Top de Negocios en Colombia
// GET /v1/news/top
// ─────────────────────────────────────────────
export const getTopBusinessNews = async ({
  language = "es",
  limit = 10,
  page = 1,
  publishedOn = "",
  // _categoryOverride permite a Headlines.jsx pedir distintas categorías
  _categoryOverride = "business",
} = {}) => {
  const url = buildUrl("/news/top", {
    locale: "co",
    categories: _categoryOverride,
    language,
    limit,
    page,
    ...(publishedOn && { published_on: publishedOn }),
  });
  return fetchData(url);
};

// ─────────────────────────────────────────────
// ENDPOINT 2: Búsqueda de Noticias (All News)
// GET /v1/news/all
// ─────────────────────────────────────────────
export const searchAllNews = async ({ search, language = "es", categories = "business", publishedAfter = "", publishedBefore = "", limit = 10, page = 1 } = {}) => {
  const url = buildUrl("/news/all", {
    search,
    language,
    categories,
    limit,
    page,
    ...(publishedAfter && { published_after: publishedAfter }),
    ...(publishedBefore && { published_before: publishedBefore }),
  });
  return fetchData(url);
};

// ─────────────────────────────────────────────
// ENDPOINT 3: Titulares por Categoría
// GET /v1/news/top (múltiples llamadas paralelas, una por categoría)
// Nota: /v1/news/headlines requiere plan de pago (403 en plan gratuito)
// ─────────────────────────────────────────────
// Esta funcionalidad se implementa directamente en Headlines.jsx
// usando Promise.allSettled con getTopBusinessNews por cada categoría.

// ─────────────────────────────────────────────
// ENDPOINT 4: Noticias Similares por UUID
// GET /v1/news/similar/{uuid}
// ─────────────────────────────────────────────
export const getSimilarNews = async (uuid, { language = "es", categories = "business", limit = 6 } = {}) => {
  if (!uuid) throw new Error("Se requiere un UUID válido para buscar noticias similares.");
  const url = buildUrl(`/news/similar/${uuid}`, {
    language,
    categories,
    limit,
  });
  return fetchData(url);
};

// ─────────────────────────────────────────────
// ENDPOINT 5: Artículo Específico por UUID
// GET /v1/news/uuid/{uuid}
// ─────────────────────────────────────────────
export const getArticleByUuid = async (uuid) => {
  if (!uuid) throw new Error("Se requiere un UUID válido.");
  const url = buildUrl(`/news/uuid/${uuid}`);
  return fetchData(url);
};

// ─────────────────────────────────────────────
// ENDPOINT 6: Fuentes de Noticias
// GET /v1/news/sources
// ─────────────────────────────────────────────
export const getNewsSources = async ({ language = "es", categories = "business", page = 1 } = {}) => {
  const url = buildUrl("/news/sources", {
    language,
    categories,
    page,
    api_token: API_TOKEN,
  });
  return fetchData(url);
};
