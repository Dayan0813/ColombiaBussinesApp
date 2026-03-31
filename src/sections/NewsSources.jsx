/**
 * NewsSources.jsx
 * Sección 6: Fuentes de noticias disponibles
 * Endpoint: GET /v1/news/sources
 */
import { useState } from "react";
import { getNewsSources } from "../api/newsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";
import "./NewsSources.css";

const CATEGORY_LABELS = {
  business: "Negocios", tech: "Tecnología", general: "General",
  science: "Ciencia", health: "Salud", sports: "Deportes",
  entertainment: "Entretenimiento", politics: "Política",
};

export default function NewsSources() {
  const [sources, setSources] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [language, setLanguage] = useState("es");
  const [categories, setCategories] = useState("business");
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const fetchSources = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await getNewsSources({ language, categories, page: currentPage });
      setSources(data.data || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSources(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchSources(newPage);
  };

  // Filtro local por dominio
  const filteredSources = sources.filter((s) =>
    s.domain?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon">🌐</div>
        <div>
          <h2 className="section-title">Fuentes de Noticias</h2>
          <p className="section-desc">
            Explora las fuentes disponibles en la API usando{" "}
            <code>/v1/news/sources</code>
          </p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="src-lang">Idioma</label>
            <select id="src-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
              <option value="">Todos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="src-cat">Categoría</label>
            <select id="src-cat" value={categories} onChange={(e) => setCategories(e.target.value)}>
              <option value="business">Negocios</option>
              <option value="tech">Tecnología</option>
              <option value="general">General</option>
              <option value="">Todas</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-search" disabled={loading}>
          {loading ? "Cargando..." : "🌐 Cargar fuentes"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Cargando fuentes de noticias..." />}
      {error && <ErrorMessage error={error} onRetry={() => fetchSources(page)} />}

      {!loading && !error && searched && sources.length === 0 && (
        <div className="empty-state"><span>📭</span><p>No se encontraron fuentes.</p></div>
      )}

      {!loading && sources.length > 0 && (
        <>
          {meta && (
            <div className="results-meta">
              <span>🌐 {meta.found?.toLocaleString()} fuentes encontradas</span>
              <span>Página {meta.page} · Mostrando {meta.returned}</span>
            </div>
          )}

          {/* Filtro local */}
          <div className="sources-filter">
            <input
              type="text"
              placeholder="🔍 Filtrar por dominio..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="sources-search-input"
            />
          </div>

          <div className="sources-grid">
            {filteredSources.map((source) => (
              <div key={source.source_id} className="source-card">
                <div className="source-favicon">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                    alt={source.domain}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="source-info">
                  <a
                    href={`https://${source.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-domain"
                  >
                    {source.domain}
                  </a>
                  <div className="source-meta">
                    {source.language && (
                      <span className="source-tag">🗣 {source.language.toUpperCase()}</span>
                    )}
                    {source.locale && (
                      <span className="source-tag">📍 {source.locale.toUpperCase()}</span>
                    )}
                    {(source.categories || []).slice(0, 2).map((cat) => (
                      <span key={cat} className={`category-badge cat-${cat}`}>
                        {CATEGORY_LABELS[cat] || cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.found > 50 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                ← Anterior
              </button>
              <span className="page-info">Página {page}</span>
              <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={meta.returned < 50}>
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>🌐 Explora las fuentes de noticias disponibles en la API, filtrando por idioma y categoría.</p>
        </div>
      )}
    </section>
  );
}
