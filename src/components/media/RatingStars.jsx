import { FiStar } from "react-icons/fi";
import "./RatingStars.css";

export function RatingStars({ value = 0, onChange, readOnly = false, max = 5 }) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <div className={`rating-stars${readOnly ? " readonly" : ""}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={star <= value ? "filled" : ""}
          onClick={() => onChange?.(star)}
          aria-label={`Avaliar com ${star} estrela(s)`}
        >
          <FiStar size={20} />
        </button>
      ))}
    </div>
  );
}
