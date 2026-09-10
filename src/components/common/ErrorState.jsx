import { FiAlertTriangle } from "react-icons/fi";
import "./states.css";

export function ErrorState({ mensagem = "Algo deu errado. Tente novamente." }) {
  return (
    <div className="state-box state-box-error">
      <FiAlertTriangle size={28} />
      <p>{mensagem}</p>
    </div>
  );
}
