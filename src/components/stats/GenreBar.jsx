import "./GenreBar.css";

export function GenreBar({ nome, contagem, percentual }) {
  return (
    <div className="genre-bar">
      <div className="genre-bar-header">
        <span>{nome}</span>
        <span>{contagem}</span>
      </div>
      <div className="genre-bar-track">
        <div className="genre-bar-fill" style={{ width: `${percentual}%` }} />
      </div>
    </div>
  );
}
