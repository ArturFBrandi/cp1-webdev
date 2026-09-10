import { FiAward, FiLock } from "react-icons/fi";
import "./AchievementBadge.css";

export function AchievementBadge({ titulo, descricao, progresso, meta, desbloqueado }) {
  const percentual = Math.round((progresso / meta) * 100);

  return (
    <div className={`achievement-badge${desbloqueado ? " unlocked" : ""}`}>
      <div className="achievement-badge-icon">
        {desbloqueado ? <FiAward size={22} /> : <FiLock size={20} />}
      </div>
      <div className="achievement-badge-body">
        <strong>{titulo}</strong>
        <p>{descricao}</p>
        <div className="achievement-badge-track">
          <div className="achievement-badge-fill" style={{ width: `${percentual}%` }} />
        </div>
        <span className="achievement-badge-progress">
          {progresso}/{meta}
        </span>
      </div>
    </div>
  );
}
