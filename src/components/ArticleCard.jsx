/**
 * ArticleCard.jsx
 * Tarjeta reutilizable para mostrar un artículo de noticias con imagen
 */
import "./ArticleCard.css";

// Imagen de respaldo cuando no hay imagen disponible
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80";

export default function ArticleCard({ article, onViewSimilar, onViewDetail, compact = false }) {
  if (!article) return null;

  const {
    uuid,
    title,
    description,
    snippet,
    url,
    image_url,
    source,
    published_at,
    categories = [],
    language,
  } = article;

  // Formatear fecha legible
  const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha desconocida";
    try {
      return new Date(dateStr).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className={`article-card ${compact ? "compact" : ""}`}>
      {/* Imagen del artículo */}
      <div className="article-image-wrapper">
        <img
          src={image_url || FALLBACK_IMAGE}
          alt={title || "Noticia"}
          className="article-image"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
          loading="lazy"
        />
        {/* Categorías como badges sobre la imagen */}
        {categories.length > 0 && (
          <div className="article-categories">
            {categories.slice(0, 2).map((cat) => (
              <span key={cat} className={`category-badge cat-${cat}`}>
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="article-content">
        <h3 className="article-title">{title || "Sin título"}</h3>

        {!compact && (
          <p className="article-description">
            {description || snippet || "Sin descripción disponible."}
          </p>
        )}

        {/* Meta info */}
        <div className="article-meta">
          <span className="article-source">🌐 {source || "Fuente desconocida"}</span>
          <span className="article-date">🕐 {formatDate(published_at)}</span>
          {language && <span className="article-lang">🗣 {language.toUpperCase()}</span>}
        </div>

        {/* Acciones */}
        <div className="article-actions">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Leer artículo ↗
          </a>
          {onViewSimilar && uuid && (
            <button
              className="btn btn-secondary"
              onClick={() => onViewSimilar(uuid)}
            >
              Ver similares
            </button>
          )}
          {onViewDetail && uuid && (
            <button
              className="btn btn-outline"
              onClick={() => onViewDetail(uuid)}
            >
              Detalle
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
