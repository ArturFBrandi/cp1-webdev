import { Link } from "react-router-dom";
import { FiAlertCircle, FiHome } from "react-icons/fi";
import "./NotFound.css";

export function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found-icon" aria-hidden="true">
        <FiAlertCircle />
      </div>

      <p className="not-found-code">404</p>

      <h1 id="not-found-title" className="not-found-title">
        Página não encontrada
      </h1>

      <p className="not-found-message">
        A página que você tentou acessar não existe ou pode ter sido movida.
      </p>

      <Link to="/" className="btn btn-primary not-found-button">
        <FiHome aria-hidden="true" />
        Voltar para o início
      </Link>
    </section>
  );
}
