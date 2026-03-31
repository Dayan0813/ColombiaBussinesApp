/**
 * App.jsx
 * Componente raíz de la aplicación
 * Colombia Business News - The News API Explorer
 *
 * Endpoints utilizados:
 * 1. /v1/news/top       → TopNews (noticias top de negocios)
 * 2. /v1/news/all       → SearchNews (búsqueda avanzada)
 * 3. /v1/news/headlines → Headlines (titulares por categoría)
 * 4. /v1/news/similar   → SimilarNews (noticias similares por UUID)
 * 5. /v1/news/uuid      → ArticleDetail (artículo específico)
 * 6. /v1/news/sources   → NewsSources (fuentes disponibles)
 */
import { useState } from "react";
import Navbar from "./components/Navbar";
import TopNews from "./sections/TopNews";
import SearchNews from "./sections/SearchNews";
import Headlines from "./sections/Headlines";
import SimilarNews from "./sections/SimilarNews";
import ArticleDetail from "./sections/ArticleDetail";
import NewsSources from "./sections/NewsSources";
import InstallPWA from "./components/InstallPWA";
import "./App.css";

export default function App() {
  const [activeSection, setActiveSection] = useState("top");
  // UUID compartido entre secciones (para navegar desde una tarjeta)
  const [sharedUuid, setSharedUuid] = useState("");

  // Navegar a "Noticias Similares" con un UUID específico
  const handleViewSimilar = (uuid) => {
    setSharedUuid(uuid);
    setActiveSection("similar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navegar a "Artículo Detalle" con un UUID específico
  const handleViewDetail = (uuid) => {
    setSharedUuid(uuid);
    setActiveSection("article");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Renderizar la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case "top":
        return <TopNews onViewSimilar={handleViewSimilar} onViewDetail={handleViewDetail} />;
      case "search":
        return <SearchNews onViewSimilar={handleViewSimilar} onViewDetail={handleViewDetail} />;
      case "headlines":
        return <Headlines onViewSimilar={handleViewSimilar} onViewDetail={handleViewDetail} />;
      case "similar":
        return (
          <SimilarNews
            key={sharedUuid}
            initialUuid={sharedUuid}
            onViewDetail={handleViewDetail}
          />
        );
      case "article":
        return <ArticleDetail key={sharedUuid} initialUuid={sharedUuid} />;
      case "sources":
        return <NewsSources />;
      default:
        return <TopNews onViewSimilar={handleViewSimilar} onViewDetail={handleViewDetail} />;
    }
  };

  return (
    <div className="app">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="app-main">
        {renderSection()}
      </main>
      <footer className="app-footer">
        <p className="footer-institution">Institución Educativa SENA</p>
        <p className="footer-author">Dayan Shirley Arenas</p>
        <p className="footer-api">
          La API utilizada para hacer este programa fue extraída del sitio web{" "}
          <a href="https://www.thenewsapi.com" target="_blank" rel="noopener noreferrer">
            The News API
          </a>
        </p>
        <p className="footer-copy">© 2026 Todos los derechos reservados</p>
      </footer>
      <InstallPWA />
    </div>
  );
}
