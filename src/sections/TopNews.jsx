/**
 * TopNews.jsx
 * Sección 1: Noticias Top de Negocios en Colombia
 * Endpoint: GET /v1/news/top
 */
import { useState, useCallback } from "react";
import { getTopBusinessNews } from "../api/newsApi";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";

export default function TopNews({ onViewSimilar, onViewDetail }) {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Parámetros del formulario
  const [language, setLanguage] = useState("es");
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [publishedOn, setPublishedOn] = useState("");

  const fetchNews = useCallback(async (currentPage = page) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await getTopBusinessNews({ language, limit, page: currentPage, publishedOn });
      setArticles(data.data || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [language, limit, page, publishedOn]);

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
      {/* Encabezado */}
      <div className="section-header">
        <div className="section-icon">📈</div>
        <div>
          <h2 className="section-title">Top Noticias de Negocios</h2>
          <p className="section-desc">
            Las noticias más relevantes de negocios en Colombia usando{" "}
            <code>/v1/news/top</code>
          </p>
        </div>
      </div>

      {/* Formulario de filtros */}
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="top-lang">Idioma</label>
            <select id="top-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="top-limit">Artículos por página</label>
            <select id="top-limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="top-date">Fecha específica (opcional)</label>
            <input
              id="top-date"
              type="date"
              value={publishedOn}
              onChange={(e) => setPublishedOn(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button type="submit" className="btn-search" disabled={loading}>
          {loading ? "Buscando..." : "🔍 Buscar noticias top"}
        </button>
      </form>

      {/* Resultados */}
      {loading && <LoadingSpinner message="Cargando noticias top de Colombia..." />}
      {error && <ErrorMessage error={error} onRetry={() => fetchNews()} />}

      {!loading && !error && searched && articles.length === 0 && (
        <div className="empty-state">
          <span>📭</span>
          <p>No se encontraron artículos con los filtros seleccionados.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <>
          {meta && (
            <div className="results-meta">
              <span>📊 {meta.found?.toLocaleString()} artículos encontrados</span>
              <span>Página {meta.page} · Mostrando {meta.returned}</span>
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

          {/* Paginación */}
          {meta && meta.found > limit && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                ← Anterior
              </button>
              <span className="page-info">Página {page}</span>
              <button
                className="page-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={meta.returned < limit}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>🇨🇴 Configura los filtros y presiona <strong>Buscar</strong> para ver las noticias top de negocios en Colombia.</p>
        </div>
      )}
    </section>
  );
}
