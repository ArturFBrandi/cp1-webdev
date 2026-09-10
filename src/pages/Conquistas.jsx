import { useMemo } from "react";
import { useWatchedList } from "../hooks/useWatchedList";
import { computeAchievements } from "../utils/achievements";
import { AchievementBadge } from "../components/achievements/AchievementBadge";
import "./Conquistas.css";

export function Conquistas() {
  const { watchedList } = useWatchedList();

  const achievements = useMemo(() => {
    const computed = computeAchievements(watchedList);
    return [...computed].sort((a, b) => Number(b.desbloqueado) - Number(a.desbloqueado));
  }, [watchedList]);

  const desbloqueadas = achievements.filter((item) => item.desbloqueado).length;

  return (
    <div>
      <h1 className="page-title">Conquistas</h1>
      <p className="page-subtitle">
        {desbloqueadas} de {achievements.length} conquistas desbloqueadas.
      </p>

      <div className="conquistas-grid">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} {...achievement} />
        ))}
      </div>
    </div>
  );
}
