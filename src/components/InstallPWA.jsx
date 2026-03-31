/**
 * InstallPWA.jsx
 * Banner de instalación de la PWA.
 * Aparece cuando el navegador dispara el evento 'beforeinstallprompt'.
 */
import { useState, useEffect } from "react";
import "./InstallPWA.css";

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Capturar el evento de instalación del navegador
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };

    // Detectar si ya está instalada como PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    window.addEventListener("beforeinstallprompt", handler);

    // Cuando se instala exitosamente
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible || installed) return null;

  return (
    <div className="pwa-banner" role="banner" aria-label="Instalar aplicación">
      <div className="pwa-banner-icon">📲</div>
      <div className="pwa-banner-text">
        <strong>Instalar Colombia News</strong>
        <span>Accede rápido desde tu pantalla de inicio</span>
      </div>
      <div className="pwa-banner-actions">
        <button className="pwa-btn-install" onClick={handleInstall}>
          Instalar
        </button>
        <button className="pwa-btn-dismiss" onClick={handleDismiss} aria-label="Cerrar">
          ✕
        </button>
      </div>
    </div>
  );
}
