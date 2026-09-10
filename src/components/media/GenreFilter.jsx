import "./GenreFilter.css";

export function GenreFilter({ generos, selecionado, onSelect }) {
  if (generos.length === 0) return null;

  return (
    <div className="genre-filter">
      <button
        className={selecionado === null ? "active" : ""}
        onClick={() => onSelect(null)}
        type="button"
      >
        Todos
      </button>
      {generos.map((genero) => (
        <button
          key={genero.id}
          className={selecionado === genero.id ? "active" : ""}
          onClick={() => onSelect(genero.id)}
          type="button"
        >
          {genero.nome}
        </button>
      ))}
    </div>
  );
}
