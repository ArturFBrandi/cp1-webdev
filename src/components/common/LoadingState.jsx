import "./states.css";

export function LoadingState({ mensagem = "Carregando..." }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <p>{mensagem}</p>
    </div>
  );
}
