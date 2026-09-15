# Watchly

MVP de "novo TV Time" focado em **perfil, estatísticas e gamificação** para quem assiste filmes e séries.

> Requisitos do trabalho: [CP1 - 2TRI - WebDev - Criando o novo TV Time](https://cherry-client-b8f.notion.site/CP1-2TRI-WebDev-Criando-o-novo-TV-Time-3cf911d84e0d801f96c5fbd82102fe29)

## Integrantes

- Artur Fabi Brandi RM570258
- Victor Bertacchini De Godoy RM571454
- Victor Lula Heineken Rodrigues RM570782

## Problema

Com o fim do TV Time, quem assiste filmes e séries perdeu uma forma simples de registrar o que já viu e de visualizar o próprio hábito de consumo — e o incentivo de gamificação que ajudava a manter esse registro em dia.

## Solução

O Watchly permite descobrir filmes/séries em alta, marcar títulos como assistidos e avaliá-los com estrelas. A partir desse histórico (salvo no navegador), o app gera automaticamente:

- um **perfil** com nome/avatar personalizáveis e resumo de consumo;
- **estatísticas** de consumo (tempo assistido, nota média, distribuição por gênero);
- **conquistas** de gamificação com progresso (ex: maratonista, explorador de gêneros, sequência de dias).

## Tecnologias

- React + Vite
- React Router (rotas, layout, rota dinâmica `/detalhes/:tipo/:id` e fallback 404)
- react-icons
- CSS puro (por componente)
- `localStorage` para persistir perfil, lista de assistidos e avaliações (sem backend)
- API TMDB para catálogo de filmes e séries

## API usada

[TMDB — The Movie Database](https://developer.themoviedb.org/docs/getting-started) (`api.themoviedb.org/3`), utilizada para:

- filmes e séries em alta;
- busca por título;
- detalhes de filmes e séries;
- gêneros;
- pôsteres e imagens;
- nota da comunidade.

## Funcionalidades

- Descobrir filmes/séries em alta e buscar por título, com filtro por gênero.
- Ver detalhes (sinopse, gêneros, nota da comunidade) e marcar como assistido.
- Avaliar títulos assistidos com estrelas (1 a 5).
- Perfil com nome/avatar editáveis e resumo de consumo.
- Estatísticas de consumo (total assistido, horas, nota média, distribuição por gênero).
- Conquistas de gamificação com progresso e desbloqueio automático.
- Exibição das conquistas desbloqueadas mais recentes no perfil.
- Persistência local dos dados do usuário entre sessões.
- Estados de carregamento, erro e conteúdo vazio.
- Página 404 para rotas inexistentes.
- Melhorias de acessibilidade para navegação por teclado e leitores de tela.
- Interface responsiva para desktop e dispositivos móveis.

Documentação completa de requisitos e arquitetura em [`docs/requirements.md`](./docs/requirements.md) e [`docs/architecture.md`](./docs/architecture.md).

Referências visuais em [`docs/references/references.md`](./docs/references/references.md).

## Estrutura principal

```text
src/
├── components/
│   ├── achievements/
│   ├── common/
│   ├── layout/
│   ├── media/
│   └── stats/
├── hooks/
├── pages/
│   ├── Home.jsx
│   ├── Detalhes.jsx
│   ├── Perfil.jsx
│   ├── Estatisticas.jsx
│   ├── Conquistas.jsx
│   └── NotFound.jsx
├── services/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

## Rotas

| Rota | Página | Objetivo |
|---|---|---|
| `/` | Home | Descobrir, buscar e filtrar filmes/séries |
| `/detalhes/:tipo/:id` | Detalhes | Ver informações, marcar como assistido e avaliar |
| `/perfil` | Perfil | Editar perfil e visualizar resumo e conquistas recentes |
| `/estatisticas` | Estatísticas | Visualizar métricas de consumo |
| `/conquistas` | Conquistas | Acompanhar conquistas e progresso |
| `*` | Not Found | Tratar URLs inexistentes com página 404 |

## Acessibilidade

O projeto inclui alguns cuidados básicos de acessibilidade:

- `aria-label` nos principais links de navegação;
- `aria-hidden` em ícones puramente decorativos;
- identificação semântica da navegação principal;
- `aria-pressed` na seleção de avatar;
- estado de foco visível (`:focus-visible`) para teclado;
- títulos e regiões estruturadas semanticamente;
- página 404 com navegação clara de retorno.

## Persistência

Os dados pessoais do usuário são armazenados localmente no navegador com `localStorage`.

São persistidos:

- nome;
- avatar;
- lista de títulos assistidos;
- avaliações;
- data em que cada título foi marcado como assistido.

Não há autenticação nem backend próprio no MVP.

## Uso de IA

Este projeto foi desenvolvido com apoio do **Claude Code**, seguindo a metodologia de Spec Driven Development pedida no enunciado.

A IA auxiliou em:

- extração e organização dos requisitos;
- especificação dos documentos em `docs/`;
- geração e refinamento de código dentro do escopo definido;
- estruturação da arquitetura;
- apoio na criação das referências visuais.

As decisões de escopo do MVP, nome do produto, convenções técnicas, bibliotecas utilizadas, revisão do código gerado e melhorias finais foram realizadas pelos integrantes do projeto.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz baseado em `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Configure sua chave da API do TMDB:

   ```env
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```

   Obtenha uma chave gratuita criando uma conta em [themoviedb.org](https://www.themoviedb.org/settings/api).

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse:

   ```text
   http://localhost:5173
   ```

## Validação do projeto

Para validar o código:

```bash
npm run lint
```

Para gerar o build de produção:

```bash
npm run build
```

A saída do build será criada na pasta `dist/`.

## Build e deploy

O projeto é compatível com plataformas de hospedagem para aplicações Vite/React, como Vercel.

Ao publicar, a variável abaixo deve ser configurada no ambiente da plataforma:

```env
VITE_TMDB_API_KEY=sua_chave_tmdb
```

A chave real não deve ser versionada no GitHub.
