/**
 * ArticleDetail.jsx
 * Sección 5: Detalle de artículo por UUID
 * Endpoint: GET /v1/news/uuid/{uuid}
 */
import { useState, useEffect } from "react";
import { getArticleByUuid } from "../api/newsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";
import "./ArticleDetail.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

export default function ArticleDetail({ initialUuid = "" }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [uuid, setUuid] = useState(initialUuid);

  useEffect(() => {
    if (initialUuid) {
      setUuid(initialUuid);
      fetchArticle(initialUuid);
    }
  }, [initialUuid]);

  const fetchArticle = async (targetUuid = uuid) => {
    if (!targetUuid.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setArticle(null);
    try {
      const data = await getArticleByUuid(targetUuid.trim());
      setArticle(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchArticle();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha desconocida";
    return new Date(dateStr).toLocaleDateString("es-CO", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon">📄</div>
        <div>
          <h2 className="section-title">Artículo por UUID</h2>
          <p className="section-desc">
            Consulta un artículo específico por su identificador usando{" "}
            <code>/v1/news/uuid/&#123;uuid&#125;</code>
          </p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label htmlFor="detail-uuid">UUID del artículo *</label>
          <input
            id="detail-uuid"
            type="text"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Ej: 147013d8-6c2c-4d50-8bad-eb3c8b7f5740"
            required
          />
          <small className="form-hint">
            💡 Copia el UUID desde cualquier tarjeta de artículo en las otras secciones
          </small>
        </div>
        <button type="submit" className="btn-search" disabled={loading || !uuid.trim()}>
          {loading ? "Cargando..." : "📄 Ver artículo"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Cargando artículo..." />}
      {error && <ErrorMessage error={error} onRetry={() => fetchArticle()} />}

      {!loading && !error && searched && !article && (
        <div className="empty-state"><span>📭</span><p>Artículo no encontrado.</p></div>
      )}

      {!loading && article && (
        <div className="article-detail-card">
          <img
            src={article.image_url || FALLBACK_IMAGE}
            alt={article.title}
            className="detail-image"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          <div className="detail-body">
            <div className="detail-categories">
              {(article.categories || []).map((cat) => (
                <span key={cat} className={`category-badge cat-${cat}`}>{cat}</span>
              ))}
            </div>
            <h2 className="detail-title">{article.title}</h2>
            <p className="detail-description">{article.description}</p>
            {article.snippet && (
              <blockquote className="detail-snippet">"{article.snippet}..."</blockquote>
            )}
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="meta-label">🌐 Fuente</span>
                <span className="meta-value">{article.source}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">🕐 Publicado</span>
                <span className="meta-value">{formatDate(article.published_at)}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">🗣 Idioma</span>
                <span className="meta-value">{article.language?.toUpperCase()}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">🔑 UUID</span>
                <span className="meta-value uuid-text">{article.uuid}</span>
              </div>
            </div>
            {article.keywords && (
              <div className="detail-keywords">
                <span className="meta-label">🏷 Keywords:</span>
                <p>{article.keywords}</p>
              </div>
            )}
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn-search detail-link">
              Leer artículo completo ↗
            </a>
          </div>
        </div>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>📄 Ingresa el UUID de un artículo para ver su información completa y detallada.</p>
        </div>
      )}
    </section>
  );
}
