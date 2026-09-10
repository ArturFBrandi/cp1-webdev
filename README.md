# Watchly

MVP de "novo TV Time" focado em **perfil, estatísticas e gamificação** para quem assiste filmes e séries.

> Requisitos do trabalho: [CP1 - 2TRI - WebDev - Criando o novo TV Time](https://cherry-client-b8f.notion.site/CP1-2TRI-WebDev-Criando-o-novo-TV-Time-3cf911d84e0d801f96c5fbd82102fe29)

## Integrantes

- Artur Brandi

## Problema

Com o fim do TV Time, quem assiste filmes e séries perdeu uma forma simples de registrar o que já viu e de visualizar o próprio hábito de consumo — e o incentivo de gamificação que ajudava a manter esse registro em dia.

## Solução

O Watchly permite descobrir filmes/séries em alta, marcar títulos como assistidos e avaliá-los com estrelas. A partir desse histórico (salvo no navegador), o app gera automaticamente:
- um **perfil** com nome/avatar personalizáveis e resumo de consumo;
- **estatísticas** de consumo (tempo assistido, nota média, distribuição por gênero);
- **conquistas** de gamificação com progresso (ex: maratonista, explorador de gêneros, sequência de dias).

## Tecnologias

- React + Vite
- React Router (rotas, layout e rota dinâmica `/detalhes/:tipo/:id`)
- react-icons
- CSS puro (por componente)
- `localStorage` para persistir perfil, lista de assistidos e avaliações (sem backend)

## API usada

[TMDB — The Movie Database](https://developer.themoviedb.org/docs/getting-started) (`api.themoviedb.org/3`), para trending, busca, detalhes e gêneros de filmes/séries.

## Funcionalidades

- Descobrir filmes/séries em alta e buscar por título, com filtro por gênero.
- Ver detalhes (sinopse, gêneros, nota da comunidade) e marcar como assistido.
- Avaliar títulos assistidos com estrelas (1 a 5).
- Perfil com nome/avatar editáveis e resumo de consumo.
- Estatísticas de consumo (total assistido, horas, nota média, distribuição por gênero).
- Conquistas de gamificação com progresso e desbloqueio automático.

Documentação completa de requisitos e arquitetura em [`docs/requirements.md`](./docs/requirements.md) e [`docs/architecture.md`](./docs/architecture.md). Referências visuais em [`docs/references/references.md`](./docs/references/references.md).

## Uso de IA

Este projeto foi desenvolvido com apoio do **Claude Code**, seguindo a metodologia de Spec Driven Development pedida no enunciado: a IA auxiliou na extração e organização dos requisitos, na especificação (`docs/`), na geração de código dentro do escopo definido e na captura das referências visuais. Decisões de escopo do MVP, nome do produto, convenções técnicas (bibliotecas permitidas) e revisão do código gerado foram feitas pelos integrantes do projeto.

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz (baseado em `.env.example`) com sua chave da API do TMDB:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```
   Obtenha uma chave gratuita criando uma conta em [themoviedb.org](https://www.themoviedb.org/settings/api).
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:5173`.

Para gerar o build de produção: `npm run build` (saída em `dist/`).
