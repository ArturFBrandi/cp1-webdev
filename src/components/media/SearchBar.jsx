import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

export function SearchBar({ value, onChange, placeholder = "Buscar filmes e séries..." }) {
  return (
    <div className="search-bar">
      <FiSearch size={18} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
