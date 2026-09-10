import "./states.css";

export function EmptyState({ icone, titulo, mensagem }) {
  return (
    <div className="state-box">
      {icone && <div className="state-icon">{icone}</div>}
      <strong>{titulo}</strong>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
