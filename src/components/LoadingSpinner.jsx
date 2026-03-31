/**
 * LoadingSpinner.jsx
 * Componente de carga animado
 */
import "./LoadingSpinner.css";

export default function LoadingSpinner({ message = "Cargando noticias..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}
