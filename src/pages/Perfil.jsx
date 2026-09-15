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

/**
 * Calcula uma data aproximada de desbloqueio para cada conquista.
 *
 * Como o projeto atualmente salva a data em que o título foi marcado como
 * assistido (`assistidoEm`), mas não salva uma data específica para o momento
 * em que uma avaliação foi feita, usamos a evolução cronológica da lista de
 * assistidos para descobrir em qual ponto cada conquista passou a ser
 * desbloqueada.
 */
function getAchievementsWithUnlockDate(watchedList) {
  const orderedList = [...watchedList].sort((a, b) => {
    const dateA = new Date(a.assistidoEm || 0).getTime();
    const dateB = new Date(b.assistidoEm || 0).getTime();
    return dateA - dateB;
  });

  const unlockDates = new Map();
  let previousUnlocked = new Set();

  orderedList.forEach((_, index) => {
    const currentList = orderedList.slice(0, index + 1);
    const currentAchievements = computeAchievements(currentList);

    const currentUnlocked = new Set(
      currentAchievements
        .filter((achievement) => achievement.desbloqueado)
        .map((achievement) => achievement.id)
    );

    currentAchievements.forEach((achievement) => {
      if (
        achievement.desbloqueado &&
        !previousUnlocked.has(achievement.id) &&
        !unlockDates.has(achievement.id)
      ) {
        unlockDates.set(
          achievement.id,
          orderedList[index]?.assistidoEm || new Date(0).toISOString()
        );
      }
    });

    previousUnlocked = currentUnlocked;
  });

  return computeAchievements(watchedList).map((achievement) => ({
    ...achievement,
    desbloqueadoEm: unlockDates.get(achievement.id) || null,
  }));
}

export function Perfil() {
  const { profile, setProfile, avatarOptions } = useProfile();
  const { watchedList } = useWatchedList();

  const [genreMap, setGenreMap] = useState(new Map());
  const [editingName, setEditingName] = useState(profile.nome);

  useEffect(() => {
    getAllGenres()
      .then(setGenreMap)
      .catch(() => setGenreMap(new Map()));
  }, []);

  useEffect(() => {
    setEditingName(profile.nome);
  }, [profile.nome]);

  const stats = useMemo(
    () => computeStats(watchedList, genreMap),
    [watchedList, genreMap]
  );

  const conquistasRecentes = useMemo(() => {
    return getAchievementsWithUnlockDate(watchedList)
      .filter((achievement) => achievement.desbloqueado)
      .sort((a, b) => {
        const dateA = new Date(a.desbloqueadoEm || 0).getTime();
        const dateB = new Date(b.desbloqueadoEm || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [watchedList]);

  const totalConquistasDesbloqueadas = useMemo(() => {
    return computeAchievements(watchedList).filter(
      (achievement) => achievement.desbloqueado
    ).length;
  }, [watchedList]);

  function handleSalvarNome(event) {
    event.preventDefault();

    setProfile((current) => ({
      ...current,
      nome: editingName.trim() || current.nome,
    }));
  }

  return (
    <div>
      <h1 className="page-title">Perfil</h1>

      <p className="page-subtitle">
        Seus dados ficam salvos apenas neste navegador.
      </p>

      <div className="perfil-header">
        <div className="perfil-avatar-picker">
          <span className="perfil-avatar">{profile.avatar}</span>

          <div className="perfil-avatar-options">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                className={avatar === profile.avatar ? "active" : ""}
                onClick={() =>
                  setProfile((current) => ({
                    ...current,
                    avatar,
                  }))
                }
                aria-label={`Selecionar avatar ${avatar}`}
                aria-pressed={avatar === profile.avatar}
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
        <StatCard
          icon={FiFilm}
          label="Filmes assistidos"
          value={stats.totalFilmes}
        />

        <StatCard
          icon={FiTv}
          label="Séries assistidas"
          value={stats.totalSeries}
        />

        <StatCard
          icon={FiClock}
          label="Horas assistidas"
          value={stats.tempoTotalHoras}
        />

        <StatCard
          icon={FiAward}
          label="Conquistas"
          value={totalConquistasDesbloqueadas}
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
