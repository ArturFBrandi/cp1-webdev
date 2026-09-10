const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "pt-BR";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

async function tmdbFetch(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      "Chave da API TMDB não configurada. Crie um arquivo .env com VITE_TMDB_API_KEY."
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Erro ao consultar TMDB (${response.status})`);
  }

  return response.json();
}

function normalizeResult(item) {
  const tipo = item.media_type ?? (item.first_air_date ? "tv" : "movie");
  return {
    id: item.id,
    tipo,
    titulo: item.title ?? item.name,
    posterPath: item.poster_path,
    dataLancamento: item.release_date ?? item.first_air_date,
    notaTmdb: item.vote_average,
    generoIds: item.genre_ids ?? [],
    sinopse: item.overview,
  };
}

export async function getTrending() {
  const data = await tmdbFetch("/trending/all/week");
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeResult);
}

export async function searchMulti(query) {
  if (!query?.trim()) return [];
  const data = await tmdbFetch("/search/multi", { query });
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeResult);
}

const DEFAULT_EPISODE_RUNTIME_MINUTES = 45;

function computeSeriesRuntime(data) {
  const episodeRuntime =
    data.episode_run_time?.[0] ||
    data.last_episode_to_air?.runtime ||
    data.next_episode_to_air?.runtime ||
    DEFAULT_EPISODE_RUNTIME_MINUTES;
  return episodeRuntime * (data.number_of_episodes ?? 0);
}

export async function getDetails(tipo, id) {
  const path = tipo === "tv" ? `/tv/${id}` : `/movie/${id}`;
  const data = await tmdbFetch(path);
  return {
    id: data.id,
    tipo,
    titulo: data.title ?? data.name,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    sinopse: data.overview,
    notaTmdb: data.vote_average,
    dataLancamento: data.release_date ?? data.first_air_date,
    generos: data.genres ?? [],
    generoIds: (data.genres ?? []).map((genero) => genero.id),
    runtime: tipo === "tv"
      ? computeSeriesRuntime(data)
      : data.runtime ?? 0,
    numeroTemporadas: data.number_of_seasons,
    numeroEpisodios: data.number_of_episodes,
  };
}

let genreCache = null;

export async function getAllGenres() {
  if (genreCache) return genreCache;
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbFetch("/genre/movie/list"),
    tmdbFetch("/genre/tv/list"),
  ]);
  const merged = new Map();
  [...movieGenres.genres, ...tvGenres.genres].forEach((genre) => {
    merged.set(genre.id, genre.name);
  });
  genreCache = merged;
  return merged;
}
