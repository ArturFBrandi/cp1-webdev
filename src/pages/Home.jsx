import { useEffect, useMemo, useState } from "react";
import { getTrending, searchMulti, getAllGenres } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import { useWatchedList } from "../hooks/useWatchedList";
import { SearchBar } from "../components/media/SearchBar";
import { GenreFilter } from "../components/media/GenreFilter";
import { MediaGrid } from "../components/media/MediaGrid";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export function Home() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [items, setItems] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const { isWatched } = useWatchedList();

  useEffect(() => {
    getAllGenres()
      .then((genreMap) => setGenreOptions([...genreMap.entries()].map(([id, nome]) => ({ id, nome }))))
      .catch(() => setGenreOptions([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const request = debouncedQuery.trim() ? searchMulti(debouncedQuery) : getTrending();

    request
      .then((results) => {
        if (cancelled) return;
        setItems(results);
        setStatus("success");
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(error.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const filteredItems = useMemo(() => {
    if (selectedGenre === null) return items;
    return items.filter((item) => item.generoIds.includes(selectedGenre));
  }, [items, selectedGenre]);

  return (
    <div>
      <h1 className="page-title">Descobrir</h1>
      <p className="page-subtitle">
        Filmes e séries em alta para você marcar como assistido e acompanhar seu perfil.
      </p>

      <SearchBar value={query} onChange={setQuery} />
      <GenreFilter generos={genreOptions} selecionado={selectedGenre} onSelect={setSelectedGenre} />

      {status === "loading" && <LoadingState mensagem="Buscando títulos..." />}
      {status === "error" && <ErrorState mensagem={errorMessage || "Não foi possível carregar o catálogo do TMDB."} />}
      {status === "success" && (
        <MediaGrid
          items={filteredItems}
          isWatched={isWatched}
          emptyTitulo="Nada encontrado"
          emptyMensagem="Tente outro termo de busca ou remova o filtro de gênero."
        />
      )}
    </div>
  );
}
