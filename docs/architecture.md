# Architecture — Watchly

## 1. Visão Geral

Watchly é uma SPA em React (Vite), sem backend próprio. Consome a API pública do TMDB para catálogo (trending, busca, detalhes e gêneros) e persiste todo o estado pessoal do usuário (perfil, lista de assistidos e avaliações) em `localStorage` por meio de hooks customizados.

A navegação usa React Router com um layout raiz (`RootLayout`) e rotas filhas, incluindo uma rota dinâmica para detalhes e uma rota de fallback para páginas inexistentes.

A arquitetura separa responsabilidades entre páginas, componentes reutilizáveis, hooks, serviços e funções utilitárias.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   └── RootLayout.jsx
│   ├── media/
│   │   ├── MediaCard.jsx
│   │   ├── MediaGrid.jsx
│   │   ├── SearchBar.jsx
│   │   ├── GenreFilter.jsx
│   │   └── RatingStars.jsx
│   ├── stats/
│   │   ├── StatCard.jsx
│   │   └── GenreBar.jsx
│   ├── achievements/
│   │   └── AchievementBadge.jsx
│   └── common/
│       ├── LoadingState.jsx
│       ├── EmptyState.jsx
│       └── ErrorState.jsx
├── pages/
│   ├── Home.jsx
│   ├── Detalhes.jsx
│   ├── Perfil.jsx
│   ├── Estatisticas.jsx
│   ├── Conquistas.jsx
│   └── NotFound.jsx
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
| Detalhes | `/detalhes/:tipo/:id` | Sinopse, gêneros, nota TMDB, marcar como assistido e avaliar |
| Perfil | `/perfil` | Nome/avatar locais + resumo de estatísticas + conquistas recentes |
| Estatísticas | `/estatisticas` | Métricas de consumo: total, horas, nota média e distribuição por gênero |
| Conquistas | `/conquistas` | Lista completa de conquistas com progresso |
| Not Found | `*` | Página 404 para qualquer rota inexistente |

Todas as rotas são filhas de um layout raiz (`RootLayout`, em `/`) que renderiza a `Navbar` e um `<Outlet />` para o conteúdo da página.

Exemplo simplificado da configuração de rotas:

```jsx
<Route path="/" element={<RootLayout />}>
  <Route index element={<Home />} />
  <Route path="detalhes/:tipo/:id" element={<Detalhes />} />
  <Route path="perfil" element={<Perfil />} />
  <Route path="estatisticas" element={<Estatisticas />} />
  <Route path="conquistas" element={<Conquistas />} />
  <Route path="*" element={<NotFound />} />
</Route>
```

## 4. Componentes

| Componente | Responsabilidade | Props principais |
|---|---|---|
| `RootLayout` | Layout raiz com Navbar + `Outlet` | — |
| `Navbar` | Navegação principal entre páginas | — |
| `MediaCard` | Card de filme/série (pôster, título, ano e nota TMDB) | `item`, `watched` |
| `MediaGrid` | Grade de `MediaCard`s com estado vazio | `items`, `isWatched`, `emptyTitulo`, `emptyMensagem` |
| `SearchBar` | Campo de busca controlado | `value`, `onChange`, `placeholder` |
| `GenreFilter` | Chips de filtro por gênero | `generos`, `selecionado`, `onSelect` |
| `RatingStars` | Avaliação por estrelas | `value`, `onChange`, `readOnly`, `max` |
| `StatCard` | Cartão de estatística | `icon`, `label`, `value`, `helper` |
| `GenreBar` | Barra de distribuição percentual por gênero | `nome`, `contagem`, `percentual` |
| `AchievementBadge` | Card de conquista com progresso | `titulo`, `descricao`, `progresso`, `meta`, `desbloqueado` |
| `LoadingState` | Estado visual de carregamento | mensagens |
| `EmptyState` | Estado visual vazio | título, mensagem, ícone |
| `ErrorState` | Estado visual de erro | mensagem |
| `NotFound` | Página de fallback para rotas inválidas | — |

## 5. Estado da Aplicação

| Estado | Onde é controlado? | Por quê? |
|---|---|---|
| Lista de assistidos (`watchedList`) | Hook `useWatchedList` + `localStorage` | Precisa persistir entre sessões e ser lida por várias páginas |
| Perfil (`nome`, `avatar`) | Hook `useProfile` + `localStorage` | Dados pessoais persistidos localmente |
| Query de busca | `useState` em `Home` | Estado local da página |
| Query com debounce | Hook `useDebounce` | Evita uma requisição por tecla digitada |
| Filtro de gênero | `useState` em `Home` | Estado local da interface |
| Catálogo (`items`) | `useState` em `Home` | Resultado das chamadas ao TMDB |
| Status de requisição | `useState` em `Home` e `Detalhes` | Controla loading/success/error |
| Detalhes do título | `useState` em `Detalhes` | Dados específicos do item selecionado |
| Mapa de gêneros | `useState` + `getAllGenres()` | Traduz IDs de gênero em nomes |
| Nome em edição | `useState` em `Perfil` | Permite editar antes de salvar |

## 6. Hooks Customizados

### `useWatchedList`

Responsável por:

- carregar a lista de títulos assistidos;
- persistir a lista no `localStorage`;
- verificar se um título já foi assistido;
- recuperar um item específico;
- marcar um título como assistido;
- salvar avaliações;
- remover títulos da lista.

Cada item salvo inclui informações como:

- `id`;
- `tipo`;
- `titulo`;
- `posterPath`;
- `generoIds`;
- `runtime`;
- `nota`;
- `assistidoEm`.

### `useProfile`

Responsável pelo estado persistente do perfil:

- nome de exibição;
- avatar;
- opções pré-definidas de avatar.

### `useDebounce`

Responsável por atrasar a atualização da busca para evitar requisições excessivas enquanto o usuário digita.

## 7. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Buscar catálogo | Ao montar `Home` e quando `debouncedQuery` muda | Chama `getTrending()` ou `searchMulti()` |
| Buscar gêneros (Home) | Ao montar `Home` | Popula o filtro por gênero |
| Buscar detalhes | Quando `tipo` ou `id` muda | Consulta os detalhes no TMDB |
| Buscar gêneros (Perfil) | Ao montar `Perfil` | Traduz IDs de gênero para estatísticas |
| Buscar gêneros (Estatísticas) | Ao montar `Estatisticas` | Traduz IDs para nomes legíveis |
| Persistir `watchedList` | Quando `watchedList` muda | Atualiza o `localStorage` |
| Persistir `profile` | Quando o perfil muda | Atualiza o `localStorage` |
| Sincronizar nome em edição | Quando `profile.nome` muda | Mantém o campo do perfil consistente |

## 8. Serviço TMDB

O arquivo `src/services/tmdb.js` centraliza todas as chamadas externas.

Responsabilidades:

- validar a existência da chave da API;
- montar URLs e parâmetros;
- definir idioma `pt-BR`;
- tratar erros HTTP;
- buscar conteúdos em alta;
- realizar busca por texto;
- carregar detalhes;
- carregar gêneros;
- normalizar o formato dos dados;
- calcular uma estimativa de duração total para séries;
- manter cache em memória para gêneros.

Funções principais:

```text
getTrending()
searchMulti(query)
getDetails(tipo, id)
getAllGenres()
```

## 9. Persistência em localStorage

O projeto não utiliza backend próprio.

O estado do usuário é persistido localmente no navegador, permitindo que os dados sejam mantidos depois de recarregar ou fechar a página.

Principais dados persistidos:

```text
watchly:watched-list
perfil do usuário
```

A lista de assistidos contém também a data/hora em que cada item foi marcado, utilizada para estatísticas e conquistas.

## 10. Estatísticas

As estatísticas são calculadas dinamicamente a partir de `watchedList`.

Principais métricas:

- total de títulos assistidos;
- total de filmes;
- total de séries;
- tempo total assistido;
- nota média;
- gêneros distintos;
- gênero favorito;
- distribuição percentual por gênero.

Não existe armazenamento duplicado das estatísticas: elas são sempre derivadas do estado persistido.

## 11. Gamificação

As conquistas são calculadas pela função `computeAchievements()`.

Exemplos:

- Primeira Watch;
- Maratonista;
- Colecionador;
- Explorador de Gêneros;
- Crítico;
- Sequência de 3 dias;
- Sequência de 7 dias.

Cada conquista possui:

- identificador;
- título;
- descrição;
- progresso;
- meta;
- status de desbloqueio.

Na página de Perfil, as conquistas desbloqueadas são organizadas para exibir as mais recentes com base na evolução cronológica dos títulos marcados como assistidos.

## 12. Estados da Interface

As páginas tratam explicitamente diferentes estados da aplicação.

### Carregamento

Utiliza `LoadingState`.

### Erro

Utiliza `ErrorState`.

### Vazio

Utiliza `EmptyState` ou estado vazio específico em componentes como `MediaGrid`.

### Sucesso

Exibe os dados retornados da API ou calculados localmente.

Essa separação melhora a experiência e deixa claro o resultado de ações assíncronas.

## 13. Acessibilidade

Foram implementadas melhorias básicas de acessibilidade sem adicionar bibliotecas externas.

### Navbar

- `aria-label` para navegação principal;
- `aria-label` nos links;
- `aria-hidden="true"` em ícones decorativos.

### Perfil

- `aria-label` nos botões de avatar;
- `aria-pressed` para indicar o avatar selecionado;
- associação entre `label` e `input`.

### Página 404

- região semântica com `section`;
- título associado por `aria-labelledby`;
- ícones decorativos ocultados de leitores de tela;
- link claro para voltar à página inicial.

### Navegação por teclado

O CSS global utiliza `:focus-visible` para:

- links;
- botões;
- inputs;
- selects;
- textareas.

Isso mantém o foco visível para usuários que navegam com teclado.

## 14. Responsividade

A aplicação utiliza:

- grids flexíveis;
- containers com largura máxima;
- imagens responsivas;
- navegação horizontal;
- regras de mídia para telas pequenas.

Na Navbar, em telas menores, os textos podem ser ocultados enquanto os ícones permanecem disponíveis com `aria-label`, preservando a acessibilidade.

## 15. Página 404

A rota:

```text
*
```

atua como fallback do React Router.

O componente `NotFound` apresenta:

- código 404;
- mensagem explicativa;
- ícone visual;
- botão para retornar à Home.

Isso evita páginas vazias em URLs inválidas.

## 16. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| `react` | Componentes e estado | Base da aplicação |
| `react-dom` | Renderização | Integração do React com o DOM |
| `react-router-dom` | Rotas, layout e navegação | Exigido para múltiplas páginas e rota dinâmica |
| `react-icons` | Ícones | Padroniza a interface sem imagens externas |
| TMDB API (`fetch` nativo) | Catálogo de filmes/séries | Fonte de dados do domínio |

## 17. Segurança e Configuração

A chave da API do TMDB não é armazenada diretamente no código-fonte.

A aplicação lê:

```env
VITE_TMDB_API_KEY
```

por meio de:

```js
import.meta.env.VITE_TMDB_API_KEY
```

O `.env` está incluído no `.gitignore`, evitando que a chave local seja versionada.

O repositório mantém apenas `.env.example` com um valor ilustrativo.

## 18. Fluxo Principal da Aplicação

```text
Usuário abre a Home
        ↓
Watchly consulta trending no TMDB
        ↓
Usuário busca ou filtra conteúdo
        ↓
Usuário abre /detalhes/:tipo/:id
        ↓
TMDB retorna os detalhes
        ↓
Usuário marca como assistido
        ↓
useWatchedList atualiza localStorage
        ↓
Usuário pode avaliar o título
        ↓
Perfil / Estatísticas / Conquistas
recalculam os dados automaticamente
```

## 19. Decisões de Arquitetura

### Sem backend

O MVP não exige autenticação ou sincronização entre dispositivos. Por isso, `localStorage` reduz complexidade e atende ao objetivo do projeto.

### Serviço externo isolado

Todas as chamadas ao TMDB ficam em `services/tmdb.js`, evitando dependência direta da API dentro dos componentes.

### Estatísticas derivadas

Métricas e conquistas são calculadas a partir da lista de assistidos, evitando inconsistências causadas por armazenamento duplicado.

### Componentes pequenos e reutilizáveis

A UI é dividida em componentes com responsabilidades específicas, facilitando manutenção e leitura.

### Tratamento explícito de estados

Loading, erro e vazio possuem componentes próprios, evitando duplicação de código nas páginas.

### Fallback de rota

A página `NotFound` garante uma experiência consistente mesmo quando o usuário acessa uma URL inexistente.
