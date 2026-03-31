/**
 * Headlines.jsx
 * Sección 3: Titulares por categoría (estilo Google News)
 * Endpoint: GET /v1/news/top (agrupado por categoría manualmente)
 * Nota: /v1/news/headlines requiere plan de pago, se usa /v1/news/top
 * con múltiples categorías para simular el mismo comportamiento.
 */
import { useState } from "react";
import { getTopBusinessNews } from "../api/newsApi";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Section.css";

// Categorías disponibles en el plan gratuito
const CATEGORIES = [
  { id: "business", label: "Negocios", search: "business" },
  { id: "tech", label: "Tecnología", search: "tech" },
  { id: "general", label: "General", search: "general" },
  { id: "politics", label: "Política", search: "politics" },
  { id: "science", label: "Ciencia", search: "science" },
];

export default function Headlines({ onViewSimilar, onViewDetail }) {
  // headlineData: { business: [...], tech: [...], ... }
  const [headlineData, setHeadlineData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState("business");

  const [language, setLanguage] = useState("es");
  const [publishedOn, setPublishedOn] = useState("");
  const [perCategory, setPerCategory] = useState(4);

  const fetchHeadlines = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Hacemos una petición por cada categoría usando /v1/news/top
      const results = await Promise.allSettled(
        CATEGORIES.map((cat) =>
          getTopBusinessNews({
            language,
            limit: perCategory,
            page: 1,
            publishedOn,
            // Sobreescribimos la categoría en cada llamada
            _categoryOverride: cat.search,
          })
        )
      );

      // Construir el mapa de categoría → artículos
      const grouped = {};
      results.forEach((result, i) => {
        const catId = CATEGORIES[i].id;
        if (result.status === "fulfilled") {
          grouped[catId] = result.value.data || [];
        } else {
          grouped[catId] = [];
        }
      });

      setHeadlineData(grouped);
      setActiveCategory("business");
    } catch (err) {
      setError(err);
      setHeadlineData({});
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHeadlines();
  };

  const activeArticles = headlineData[activeCategory] || [];
  const hasData = Object.values(headlineData).some((arr) => arr.length > 0);

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon">📰</div>
        <div>
          <h2 className="section-title">Titulares por Categoría</h2>
          <p className="section-desc">
            Noticias agrupadas por categoría usando{" "}
            <code>/v1/news/top</code> con múltiples consultas paralelas
          </p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hl-lang">Idioma</label>
            <select id="hl-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hl-per-cat">Artículos por categoría</label>
            <select id="hl-per-cat" value={perCategory} onChange={(e) => setPerCategory(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hl-date">Fecha (opcional)</label>
            <input
              id="hl-date"
              type="date"
              value={publishedOn}
              onChange={(e) => setPublishedOn(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button type="submit" className="btn-search" disabled={loading}>
          {loading ? "Cargando..." : "📰 Cargar titulares"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Cargando titulares por categoría..." />}
      {error && <ErrorMessage error={error} onRetry={fetchHeadlines} />}

      {!loading && !error && searched && !hasData && (
        <div className="empty-state">
          <span>📭</span>
          <p>No se encontraron titulares con los filtros seleccionados.</p>
        </div>
      )}

      {!loading && hasData && (
        <>
          {/* Tabs de categorías */}
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                <span className="tab-count">{headlineData[cat.id]?.length || 0}</span>
              </button>
            ))}
          </div>

          {activeArticles.length > 0 ? (
            <div className="articles-grid">
              {activeArticles.map((article) => (
                <ArticleCard
                  key={article.uuid}
                  article={article}
                  onViewSimilar={onViewSimilar}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>📭</span>
              <p>No hay artículos en esta categoría.</p>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="welcome-hint">
          <p>📰 Carga los titulares para ver noticias agrupadas por categoría. Navega entre ellas con los tabs.</p>
        </div>
      )}
    </section>
  );
}
