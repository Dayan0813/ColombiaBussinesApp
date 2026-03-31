/**
 * SimilarNews.jsx
 * Sección 4: Noticias similares por UUID
 * Endpoint: GET /v1/news/similar/{uuid}
 */
import { useState, useEffect } from "react";
import { getSimilarNews } from "../api/newsApi";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";

export default function SimilarNews({ initialUuid = "", onViewDetail }) {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [uuid, setUuid] = useState(initialUuid);
  const [language, setLanguage] = useState("es");
  const [categories, setCategories] = useState("business");
  const [limit, setLimit] = useState(6);

  // Si se recibe un UUID externo (desde otra sección), buscarlo automáticamente
  useEffect(() => {
    if (initialUuid && initialUuid !== uuid) {
      setUuid(initialUuid);
    }
  }, [initialUuid]);

  useEffect(() => {
    if (initialUuid) {
      setUuid(initialUuid);
      fetchSimilar(initialUuid);
    }
  }, [initialUuid]);

  const fetchSimilar = async (targetUuid = uuid) => {
    if (!targetUuid.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await getSimilarNews(targetUuid.trim(), { language, categories, limit });
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
    fetchSimilar();
  };

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon">🔗</div>
        <div>
          <h2 className="section-title">Noticias Similares</h2>
          <p className="section-desc">
            Encuentra artículos relacionados a uno específico usando{" "}
            <code>/v1/news/similar/&#123;uuid&#125;</code>
          </p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label htmlFor="sim-uuid">UUID del artículo *</label>
          <input
            id="sim-uuid"
            type="text"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Ej: cc11e3ab-ced0-4a42-9146-e426505e2e67"
            required
          />
          <small className="form-hint">
            💡 Puedes obtener el UUID desde las otras secciones haciendo clic en "Ver similares"
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sim-lang">Idioma</label>
            <select id="sim-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="">Todos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sim-cat">Categoría</label>
            <select id="sim-cat" value={categories} onChange={(e) => setCategories(e.target.value)}>
              <option value="business">Negocios</option>
              <option value="business,tech">Negocios + Tech</option>
              <option value="">Todas</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sim-limit">Cantidad</label>
            <select id="sim-limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-search" disabled={loading || !uuid.trim()}>
          {loading ? "Buscando..." : "🔗 Buscar similares"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Buscando artículos similares..." />}
      {error && <ErrorMessage error={error} onRetry={() => fetchSimilar()} />}

      {!loading && !error && searched && articles.length === 0 && (
        <div className="empty-state">
          <span>🔍</span>
          <p>No se encontraron artículos similares para este UUID.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <>
          {meta && (
            <div className="results-meta">
              <span>🔗 {meta.found?.toLocaleString()} artículos similares encontrados</span>
              <span>Mostrando {meta.returned}</span>
            </div>
          )}
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.uuid}
                article={article}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        </>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>🔗 Ingresa el UUID de un artículo para encontrar noticias relacionadas. Puedes copiarlo desde las otras secciones.</p>
        </div>
      )}
    </section>
  );
}
