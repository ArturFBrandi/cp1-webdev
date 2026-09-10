import { Link } from "react-router-dom";
import { FiCheckCircle, FiStar } from "react-icons/fi";
import { IMAGE_BASE_URL } from "../../services/tmdb";
import "./MediaCard.css";

export function MediaCard({ item, watched = false }) {
  const ano = item.dataLancamento ? item.dataLancamento.slice(0, 4) : "—";

  return (
    <Link to={`/detalhes/${item.tipo}/${item.id}`} className="media-card">
      <div className="media-card-poster">
        {item.posterPath ? (
          <img src={`${IMAGE_BASE_URL}${item.posterPath}`} alt={item.titulo} loading="lazy" />
        ) : (
          <div className="media-card-placeholder">{item.titulo}</div>
        )}
        {watched && (
          <span className="media-card-watched">
            <FiCheckCircle size={14} /> Assistido
          </span>
        )}
      </div>
      <div className="media-card-info">
        <strong className="media-card-title">{item.titulo}</strong>
        <div className="media-card-meta">
          <span>{ano}</span>
          <span className="media-card-tipo">{item.tipo === "tv" ? "Série" : "Filme"}</span>
          {item.notaTmdb > 0 && (
            <span className="media-card-nota">
              <FiStar size={13} /> {item.notaTmdb.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
