import { useEffect, useMemo, useState } from "react";
import { FiFilm, FiClock, FiStar, FiPieChart } from "react-icons/fi";
import { useWatchedList } from "../hooks/useWatchedList";
import { getAllGenres } from "../services/tmdb";
import { computeStats } from "../utils/achievements";
import { StatCard } from "../components/stats/StatCard";
import { GenreBar } from "../components/stats/GenreBar";
import { EmptyState } from "../components/common/EmptyState";
import "./Estatisticas.css";

export function Estatisticas() {
  const { watchedList } = useWatchedList();
  const [genreMap, setGenreMap] = useState(new Map());

  useEffect(() => {
    getAllGenres().then(setGenreMap).catch(() => setGenreMap(new Map()));
  }, []);

  const stats = useMemo(() => computeStats(watchedList, genreMap), [watchedList, genreMap]);

  if (watchedList.length === 0) {
    return (
      <EmptyState
        icone="📊"
        titulo="Ainda sem estatísticas"
        mensagem="Marque filmes e séries como assistidos para ver suas métricas aqui."
      />
    );
  }

  return (
    <div>
      <h1 className="page-title">Estatísticas</h1>
      <p className="page-subtitle">Seu consumo de filmes e séries, calculado a partir do que você assistiu.</p>

      <div className="stats-grid">
        <StatCard icon={FiFilm} label="Total assistido" value={stats.totalAssistidos} />
        <StatCard icon={FiClock} label="Horas assistidas" value={stats.tempoTotalHoras} />
        <StatCard
          icon={FiStar}
          label="Nota média dada"
          value={stats.notaMedia > 0 ? stats.notaMedia.toFixed(1) : "—"}
        />
        <StatCard icon={FiPieChart} label="Gêneros explorados" value={stats.generosDistintos} />
      </div>

      <h2 className="section-title">Distribuição por gênero</h2>
      {stats.distribuicaoGeneros.length === 0 ? (
        <p className="page-subtitle">Sem dados de gênero suficientes ainda.</p>
      ) : (
        <div>
          {stats.distribuicaoGeneros.map((genero) => (
            <GenreBar key={genero.id} {...genero} />
          ))}
        </div>
      )}
    </div>
  );
}
