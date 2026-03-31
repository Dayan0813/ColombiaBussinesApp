/**
 * ErrorMessage.jsx
 * Componente para mostrar errores de forma amigable
 * Solo muestra errores de contenido, no de API key
 */
import "./ErrorMessage.css";

export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  // Determinar tipo de error para mostrar mensaje apropiado
  const getErrorInfo = (err) => {
    const msg = err?.message || String(err);

    if (msg.includes("404") || msg.includes("no encontrado")) {
      return {
        icon: "🔍",
        title: "Sin resultados",
        detail: "No se encontraron artículos con los parámetros indicados. Intenta con otros filtros.",
      };
    }
    if (msg.includes("429") || msg.includes("Demasiadas")) {
      return {
        icon: "⏳",
        title: "Límite de solicitudes",
        detail: "Has realizado demasiadas solicitudes. Espera unos segundos e intenta de nuevo.",
      };
    }
    if (msg.includes("402") || msg.includes("Límite de uso")) {
      return {
        icon: "📊",
        title: "Límite del plan alcanzado",
        detail: "Se ha alcanzado el límite de solicitudes del plan gratuito.",
      };
    }
    if (msg.includes("503") || msg.includes("mantenimiento")) {
      return {
        icon: "🔧",
        title: "Servicio en mantenimiento",
        detail: "The News API está en mantenimiento temporal. Intenta más tarde.",
      };
    }
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("conexión")) {
      return {
        icon: "📡",
        title: "Error de conexión",
        detail: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      };
    }
    if (msg.includes("UUID") || msg.includes("uuid")) {
      return {
        icon: "🔑",
        title: "UUID inválido",
        detail: "El identificador de artículo no es válido. Verifica el formato.",
      };
    }
    return {
      icon: "⚠️",
      title: "Error al cargar",
      detail: msg,
    };
  };

  const { icon, title, detail } = getErrorInfo(error);

  return (
    <div className="error-container">
      <div className="error-icon">{icon}</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-detail">{detail}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          🔄 Intentar de nuevo
        </button>
      )}
    </div>
  );
}
