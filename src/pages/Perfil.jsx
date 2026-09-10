import { useEffect, useMemo, useState } from "react";
import { FiFilm, FiTv, FiClock, FiAward } from "react-icons/fi";
import { useProfile } from "../hooks/useProfile";
import { useWatchedList } from "../hooks/useWatchedList";
import { getAllGenres } from "../services/tmdb";
import { computeStats, computeAchievements } from "../utils/achievements";
import { StatCard } from "../components/stats/StatCard";
import { AchievementBadge } from "../components/achievements/AchievementBadge";
import { EmptyState } from "../components/common/EmptyState";
import "./Perfil.css";

export function Perfil() {
  const { profile, setProfile, avatarOptions } = useProfile();
  const { watchedList } = useWatchedList();
  const [genreMap, setGenreMap] = useState(new Map());
  const [editingName, setEditingName] = useState(profile.nome);

  useEffect(() => {
    getAllGenres().then(setGenreMap).catch(() => setGenreMap(new Map()));
  }, []);

  const stats = useMemo(() => computeStats(watchedList, genreMap), [watchedList, genreMap]);
  const conquistasRecentes = useMemo(
    () => computeAchievements(watchedList).filter((item) => item.desbloqueado).slice(-3).reverse(),
    [watchedList]
  );

  function handleSalvarNome(event) {
    event.preventDefault();
    setProfile((current) => ({ ...current, nome: editingName.trim() || current.nome }));
  }

  return (
    <div>
      <h1 className="page-title">Perfil</h1>
      <p className="page-subtitle">Seus dados ficam salvos apenas neste navegador.</p>

      <div className="perfil-header">
        <div className="perfil-avatar-picker">
          <span className="perfil-avatar">{profile.avatar}</span>
          <div className="perfil-avatar-options">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                className={avatar === profile.avatar ? "active" : ""}
                onClick={() => setProfile((current) => ({ ...current, avatar }))}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <form className="perfil-nome-form" onSubmit={handleSalvarNome}>
          <label htmlFor="perfil-nome">Nome de exibição</label>
          <div className="perfil-nome-row">
            <input
              id="perfil-nome"
              type="text"
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              maxLength={40}
            />
            <button type="submit" className="btn btn-secondary">
              Salvar
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title">Resumo</h2>
      <div className="perfil-stats">
        <StatCard icon={FiFilm} label="Filmes assistidos" value={stats.totalFilmes} />
        <StatCard icon={FiTv} label="Séries assistidas" value={stats.totalSeries} />
        <StatCard icon={FiClock} label="Horas assistidas" value={stats.tempoTotalHoras} />
        <StatCard
          icon={FiAward}
          label="Conquistas"
          value={conquistasRecentes.length ? `${conquistasRecentes.length}+` : 0}
        />
      </div>

      <h2 className="section-title">Conquistas recentes</h2>
      {conquistasRecentes.length === 0 ? (
        <EmptyState
          icone="🏆"
          titulo="Nenhuma conquista ainda"
          mensagem="Marque títulos como assistidos para desbloquear conquistas."
        />
      ) : (
        <div className="perfil-conquistas">
          {conquistasRecentes.map((conquista) => (
            <AchievementBadge key={conquista.id} {...conquista} />
          ))}
        </div>
      )}
    </div>
  );
}
