# Architecture — Watchly

## 1. Visão Geral

Watchly é uma SPA em React (Vite), sem backend próprio. Consome a API pública do TMDB para catálogo (trending, busca, detalhes, gêneros) e persiste todo o estado pessoal do usuário (perfil, lista de assistidos, avaliações) em `localStorage` via hooks customizados. A navegação usa React Router com um layout raiz (Navbar) e rotas filhas, incluindo uma rota dinâmica para detalhes.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── layout/        # Navbar, RootLayout
│   ├── media/          # MediaCard, MediaGrid, SearchBar, GenreFilter, RatingStars
│   ├── stats/           # StatCard, GenreBar
│   ├── achievements/    # AchievementBadge
│   └── common/          # LoadingState, EmptyState, ErrorState
├── pages/
│   ├── Home.jsx
│   ├── Detalhes.jsx
│   ├── Perfil.jsx
│   ├── Estatisticas.jsx
│   └── Conquistas.jsx
├── hooks/
│   ├── useWatchedList.js
│   ├── useProfile.js
│   └── useDebounce.js
├── services/
│   └── tmdb.js
├── utils/
│   └── achievements.js
├── App.jsx
├── main.jsx
└── index.css
```

## 3. Páginas e Rotas

| Página | Rota | Objetivo |
|---|---|---|
| Home / Descobrir | `/` | Trending (TMDB) + busca + filtro por gênero |
| Detalhes | `/detalhes/:tipo/:id` | Sinopse, gêneros, nota TMDB, marcar como assistido e avaliar (rota dinâmica) |
| Perfil | `/perfil` | Nome/avatar locais + resumo de estatísticas + conquistas recentes |
| Estatísticas | `/estatisticas` | Métricas de consumo: total, horas, nota média, distribuição por gênero |
| Conquistas | `/conquistas` | Lista completa de conquistas com progresso |

Todas as rotas são filhas de um layout raiz (`RootLayout`, em `/`) que renderiza a `Navbar` fixa e um `<Outlet />` para o conteúdo da página.

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| `RootLayout` | Layout raiz com Navbar + `Outlet` | — |
| `Navbar` | Navegação entre as 5 páginas | — |
| `MediaCard` | Card de um filme/série (pôster, título, ano, nota TMDB) | `item`, `watched` |
| `MediaGrid` | Grade de `MediaCard`s com estado vazio | `items`, `isWatched`, `emptyTitulo`, `emptyMensagem` |
| `SearchBar` | Campo de busca controlado | `value`, `onChange`, `placeholder` |
| `GenreFilter` | Chips de filtro por gênero | `generos`, `selecionado`, `onSelect` |
| `RatingStars` | Avaliação por estrelas (interativa ou somente leitura) | `value`, `onChange`, `readOnly`, `max` |
| `StatCard` | Cartão de estatística (ícone + valor + rótulo) | `icon`, `label`, `value`, `helper` |
| `GenreBar` | Barra de distribuição percentual por gênero | `nome`, `contagem`, `percentual` |
| `AchievementBadge` | Card de conquista com progresso | `titulo`, `descricao`, `progresso`, `meta`, `desbloqueado` |
| `LoadingState` / `EmptyState` / `ErrorState` | Estados padrão de carregamento/vazio/erro | mensagens/ícones/título |

## 5. Estado da Aplicação

| Estado | Onde será controlado? | Por quê? |
|---|---|---|
| Lista de assistidos (`watchedList`) | Hook `useWatchedList` (localStorage) | Precisa persistir entre sessões e ser lido por Perfil, Estatísticas, Conquistas e Detalhes — centralizado em um hook evita duplicar lógica de leitura/escrita. |
| Perfil (`nome`, `avatar`) | Hook `useProfile` (localStorage) | Usado apenas na página Perfil, mas persistido para sobreviver a reloads. |
| Query de busca / debounce | `useState` + `useDebounce` em `Home` | Estado de interação local à página, não precisa ser compartilhado. |
| Filtro de gênero selecionado | `useState` em `Home` | Estado de UI local à página. |
| Resultados do catálogo (`items`) e `status` (loading/success/error) | `useState` em `Home` e `Detalhes` | Resultado de chamada assíncrona à API, precisa dos 4 estados (loading/success/error/vazio) para a UI. |
| Mapa de gêneros (`id -> nome`) | `useState` em `Home`, `Perfil`, `Estatisticas`, alimentado por `getAllGenres` (cache em módulo) | Necessário para traduzir `generoIds` salvos localmente em nomes legíveis nas estatísticas/filtros. |

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Buscar catálogo | Ao montar `Home` e sempre que `debouncedQuery` muda | Chama `getTrending()` ou `searchMulti()` no TMDB e atualiza `items`/`status`. |
| Buscar gêneros (Home) | Ao montar `Home` | Chama `getAllGenres()` para popular os chips de filtro. |
| Buscar detalhes | Ao montar `Detalhes` e sempre que `tipo`/`id` mudam | Chama `getDetails(tipo, id)` no TMDB e atualiza `detalhe`/`status`. |
| Buscar gêneros (Perfil/Estatísticas) | Ao montar cada página | Chama `getAllGenres()` para traduzir `generoIds` da lista de assistidos. |
| Persistir `watchedList` | Sempre que `watchedList` muda | Grava o array atualizado em `localStorage`. |
| Persistir `profile` | Sempre que `profile` muda | Grava nome/avatar atualizados em `localStorage`. |

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| `react-router-dom` | Rotas, layout e navegação | Exigido no enunciado (múltiplas páginas, layout, rota dinâmica). |
| `react-icons` | Ícones (navbar, botões, estados) | Biblioteca de ícones exigida no enunciado; usados apenas ícones do pacote `fi` (Feather). |
| TMDB API (`fetch` nativo) | Catálogo de filmes/séries | API do domínio escolhido, sugerida no enunciado. |
