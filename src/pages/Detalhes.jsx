import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCheck, FiClock, FiStar } from "react-icons/fi";
import { getDetails, IMAGE_BASE_URL } from "../services/tmdb";
import { useWatchedList } from "../hooks/useWatchedList";
import { RatingStars } from "../components/media/RatingStars";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import "./Detalhes.css";

export function Detalhes() {
  const { tipo, id } = useParams();
  const [detalhe, setDetalhe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const { isWatched, getWatchedItem, markAsWatched, setRating } = useWatchedList();

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getDetails(tipo, id)
      .then((data) => {
        if (cancelled) return;
        setDetalhe(data);
        setStatus("success");
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(error.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [tipo, id]);

  if (status === "loading") return <LoadingState mensagem="Carregando detalhes..." />;
  if (status === "error" || !detalhe) {
    return <ErrorState mensagem={errorMessage || "Não foi possível carregar este título."} />;
  }

  const assistido = isWatched(tipo, id);
  const watchedItem = getWatchedItem(tipo, id);

  function handleMarcarAssistido() {
    markAsWatched({
      id: detalhe.id,
      tipo,
      titulo: detalhe.titulo,
      posterPath: detalhe.posterPath,
      generoIds: detalhe.generoIds,
      runtime: detalhe.runtime,
    });
  }

  return (
    <div className="detalhes">
      <div className="detalhes-poster">
        {detalhe.posterPath ? (
          <img src={`${IMAGE_BASE_URL}${detalhe.posterPath}`} alt={detalhe.titulo} />
        ) : (
          <div className="detalhes-poster-placeholder">{detalhe.titulo}</div>
        )}
      </div>

      <div className="detalhes-info">
        <span className="pill">{tipo === "tv" ? "Série" : "Filme"}</span>
        <h1>{detalhe.titulo}</h1>

        <div className="detalhes-meta">
          {detalhe.dataLancamento && <span>{detalhe.dataLancamento.slice(0, 4)}</span>}
          {detalhe.notaTmdb > 0 && (
            <span>
              <FiStar size={15} /> {detalhe.notaTmdb.toFixed(1)} (TMDB)
            </span>
          )}
          {detalhe.runtime > 0 && (
            <span>
              <FiClock size={15} /> {Math.round(detalhe.runtime / 60)}h no total
            </span>
          )}
        </div>

        {detalhe.generos.length > 0 && (
          <div className="detalhes-generos">
            {detalhe.generos.map((genero) => (
              <span key={genero.id} className="pill">
                {genero.name}
              </span>
            ))}
          </div>
        )}

        <p className="detalhes-sinopse">{detalhe.sinopse || "Sinopse não disponível."}</p>

        <div className="detalhes-acoes">
          <button
            type="button"
            className={`btn ${assistido ? "btn-secondary" : "btn-primary"}`}
            onClick={handleMarcarAssistido}
            disabled={assistido}
          >
            <FiCheck /> {assistido ? "Assistido" : "Marcar como assistido"}
          </button>

          {assistido && (
            <div className="detalhes-avaliacao">
              <span>Sua nota:</span>
              <RatingStars value={watchedItem?.nota ?? 0} onChange={(nota) => setRating(tipo, id, nota)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
