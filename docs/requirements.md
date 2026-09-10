# Requirements — Watchly

## 1. Visão do Produto

### Nome
Watchly

### Problema
Com o fim do TV Time, quem assiste filmes e séries perdeu uma forma simples de registrar o que já viu e de enxergar, de forma visual, o próprio hábito de consumo (quanto tempo assistiu, quais gêneros prefere) — e perdeu também o incentivo de "gamificação" que motivava a manter esse registro em dia.

### Público
Pessoas que assistem regularmente filmes e séries e gostam de acompanhar o próprio histórico e estatísticas de consumo (perfil "cinéfilo"), de forma similar ao que Letterboxd faz para filmes e Strava faz para atividades físicas.

### Proposta de solução
Um MVP web onde o usuário descobre filmes/séries em alta (via TMDB), marca o que assistiu e avalia com estrelas. A partir desse histórico, o Watchly gera automaticamente um perfil com estatísticas de consumo (tempo assistido, gênero favorito, distribuição por gênero) e desbloqueia conquistas conforme o usuário mantém o hábito.

## 2. Objetivo do MVP

Ao final do projeto, o usuário deve conseguir: buscar/descobrir filmes e séries reais via API, marcar títulos como assistidos e avaliá-los, visualizar um perfil com nome/avatar editáveis, ver estatísticas calculadas a partir do que assistiu, e desbloquear/acompanhar conquistas de gamificação — tudo persistido localmente no navegador (sem necessidade de backend/login).

## 3. Funcionalidades

### F01 — Descobrir e buscar filmes/séries

**Descrição:** Na Home, o usuário vê uma grade de filmes/séries em alta (trending do TMDB) e pode buscar por título, além de filtrar por gênero.

**Critérios de aceitação:**
- [ ] Ao abrir a Home sem buscar nada, uma grade de títulos em alta é exibida.
- [ ] Ao digitar um termo na busca, a grade é substituída pelos resultados da busca (com debounce, sem disparar uma requisição por tecla).
- [ ] Ao selecionar um gênero, apenas títulos daquele gênero aparecem na grade atual (busca ou trending).
- [ ] Títulos já marcados como assistidos exibem um indicador visual no card.

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio (busca sem resultados)
- [x] Erro (falha ao consultar a API)

### F02 — Ver detalhes e marcar como assistido

**Descrição:** Ao clicar em um card, o usuário acessa a página de detalhes (`/detalhes/:tipo/:id`) com sinopse, gêneros, nota da comunidade (TMDB) e pode marcar o título como assistido.

**Critérios de aceitação:**
- [ ] A página mostra pôster, título, ano, gêneros e sinopse do título selecionado.
- [ ] O botão "Marcar como assistido" adiciona o título à lista pessoal do usuário (persistida em localStorage) com a data/hora atual.
- [ ] Depois de marcado como assistido, o botão fica desabilitado e passa a exibir "Assistido".

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio (não aplicável — sempre há um título)
- [x] Erro (id inválido ou falha na API)

### F03 — Avaliar um título assistido

**Descrição:** Depois de marcar um título como assistido, o usuário pode avaliá-lo com 1 a 5 estrelas na própria página de detalhes.

**Critérios de aceitação:**
- [ ] A avaliação por estrelas só aparece depois que o título foi marcado como assistido.
- [ ] Clicar em uma estrela salva a nota imediatamente (persistida em localStorage).
- [ ] A nota dada é usada no cálculo da "nota média" nas Estatísticas.

**Estados:**
- [x] Inicial (sem nota, 0 estrelas)
- [x] Sucesso (nota salva e refletida visualmente)

### F04 — Perfil do usuário

**Descrição:** Página `/perfil` onde o usuário define nome e avatar (emoji) e vê um resumo rápido do seu consumo e das conquistas mais recentes.

**Critérios de aceitação:**
- [ ] O usuário pode escolher um avatar entre opções pré-definidas.
- [ ] O usuário pode editar o nome de exibição e salvar.
- [ ] O resumo mostra total de filmes assistidos, séries assistidas e horas assistidas.
- [ ] As conquistas desbloqueadas mais recentemente aparecem na própria página de perfil.

**Estados:**
- [x] Inicial (perfil com valores padrão)
- [x] Sucesso (dados salvos e refletidos)
- [x] Vazio (nenhuma conquista desbloqueada ainda)

### F05 — Estatísticas de consumo

**Descrição:** Página `/estatisticas` com métricas agregadas calculadas a partir da lista de assistidos: total assistido, horas assistidas, nota média dada e distribuição por gênero.

**Critérios de aceitação:**
- [ ] Sem nenhum título assistido, a página exibe um estado vazio orientando o usuário a assistir algo primeiro.
- [ ] Com títulos assistidos, os cartões de estatística refletem os valores corretos (recalculados a cada mudança na lista).
- [ ] A distribuição por gênero mostra, para cada gênero presente, a contagem e o percentual sobre o total assistido.

**Estados:**
- [x] Vazio (nenhum item assistido)
- [x] Sucesso (métricas calculadas)

### F06 — Conquistas (gamificação)

**Descrição:** Página `/conquistas` que lista regras de gamificação (ex: maratonista, explorador de gêneros, sequência de dias) com progresso e estado de desbloqueio, calculadas a partir da lista de assistidos.

**Critérios de aceitação:**
- [ ] Cada conquista mostra progresso atual / meta (ex: 6/10) e uma barra visual.
- [ ] Conquistas atingidas são destacadas visualmente como desbloqueadas.
- [ ] A lista é recalculada automaticamente sempre que o usuário marca um novo título como assistido ou avalia um título.

**Estados:**
- [x] Sucesso (lista de conquistas com progresso)

## 4. Regras do Produto

- Todo o estado do usuário (perfil, lista de assistidos, avaliações) é local ao navegador (localStorage) — não há autenticação nem backend próprio.
- Os dados de catálogo (pôsteres, sinopses, gêneros, nota da comunidade) vêm sempre do TMDB; nada de catálogo é inventado ou cacheado permanentemente sem vir da API.
- Uma avaliação (nota do usuário) só existe para títulos já marcados como assistidos.
- Conquistas são sempre derivadas (calculadas) da lista de assistidos — nunca são marcadas manualmente pelo usuário.

## 5. Fora do Escopo

- Login/autenticação de usuários e sincronização entre dispositivos.
- Comunidade, comentários ou interação entre usuários.
- Onde assistir (streaming providers) e recomendações personalizadas por algoritmo.
- Notificações e envio de e-mails.
