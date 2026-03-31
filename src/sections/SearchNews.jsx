/**
 * SearchNews.jsx
 * Sección 2: Búsqueda avanzada de noticias
 * Endpoint: GET /v1/news/all
 */
import { useState } from "react";
import { searchAllNews } from "../api/newsApi";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";

export default function SearchNews({ onViewSimilar, onViewDetail }) {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [search, setSearch] = useState("Colombia negocios");
  const [language, setLanguage] = useState("es");
  const [categories, setCategories] = useState("business");
  const [publishedAfter, setPublishedAfter] = useState("");
  const [publishedBefore, setPublishedBefore] = useState("");
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);

  const fetchNews = async (currentPage = 1) => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchAllNews({
        search: search.trim(),
        language,
        categories,
        publishedAfter,
        publishedBefore,
        limit,
        page: currentPage,
      });
      setArticles(data.data || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchNews(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon">🔍</div>
        <div>
          <h2 className="section-title">Búsqueda de Noticias</h2>
          <p className="section-desc">
            Busca en millones de artículos con filtros avanzados usando{" "}
            <code>/v1/news/all</code>
          </p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label htmlFor="search-query">Término de búsqueda *</label>
          <input
            id="search-query"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ej: economía Colombia, inversión, exportaciones..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="search-lang">Idioma</label>
            <select id="search-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
              <option value="">Todos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="search-cat">Categoría</label>
            <select id="search-cat" value={categories} onChange={(e) => setCategories(e.target.value)}>
              <option value="business">Negocios</option>
              <option value="business,tech">Negocios + Tech</option>
              <option value="business,politics">Negocios + Política</option>
              <option value="">Todas</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="search-limit">Resultados</label>
            <select id="search-limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="search-after">Publicado después de</label>
            <input
              id="search-after"
              type="date"
              value={publishedAfter}
              onChange={(e) => setPublishedAfter(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-before">Publicado antes de</label>
            <input
              id="search-before"
              type="date"
              value={publishedBefore}
              onChange={(e) => setPublishedBefore(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-search" disabled={loading || !search.trim()}>
          {loading ? "Buscando..." : "🔍 Buscar"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Buscando artículos..." />}
      {error && <ErrorMessage error={error} onRetry={() => fetchNews(page)} />}

      {!loading && !error && searched && articles.length === 0 && (
        <div className="empty-state">
          <span>📭</span>
          <p>No se encontraron artículos para "{search}". Intenta con otros términos.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <>
          {meta && (
            <div className="results-meta">
              <span>📊 {meta.found?.toLocaleString()} resultados para "{search}"</span>
              <span>Página {meta.page} · {meta.returned} artículos</span>
            </div>
          )}

          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.uuid}
                article={article}
                onViewSimilar={onViewSimilar}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>

          {meta && meta.found > limit && (
            <div className="pagination">
              <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                ← Anterior
              </button>
              <span className="page-info">Página {page}</span>
              <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={meta.returned < limit}>
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>💡 Ingresa un término de búsqueda y aplica filtros para encontrar noticias específicas de negocios.</p>
        </div>
      )}
    </section>
  );
}
