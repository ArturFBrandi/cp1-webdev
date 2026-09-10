function toDayKey(isoDate) {
  return isoDate.slice(0, 10);
}

function computeStreakDays(watchedList) {
  const uniqueDays = [...new Set(watchedList.map((item) => toDayKey(item.assistidoEm)))].sort();
  if (uniqueDays.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const previousDay = new Date(uniqueDays[i - 1]);
    const currentDay = new Date(uniqueDays[i]);
    const diffInDays = Math.round((currentDay - previousDay) / (1000 * 60 * 60 * 24));

    currentStreak = diffInDays === 1 ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  return longestStreak;
}

export function computeStats(watchedList, genreNamesMap = new Map()) {
  const totalAssistidos = watchedList.length;
  const totalFilmes = watchedList.filter((item) => item.tipo === "movie").length;
  const totalSeries = watchedList.filter((item) => item.tipo === "tv").length;
  const tempoTotalMinutos = watchedList.reduce((sum, item) => sum + (item.runtime || 0), 0);

  const avaliados = watchedList.filter((item) => item.nota > 0);
  const notaMedia = avaliados.length
    ? avaliados.reduce((sum, item) => sum + item.nota, 0) / avaliados.length
    : 0;

  const generoContagem = new Map();
  watchedList.forEach((item) => {
    (item.generoIds || []).forEach((generoId) => {
      generoContagem.set(generoId, (generoContagem.get(generoId) || 0) + 1);
    });
  });

  const distribuicaoGeneros = [...generoContagem.entries()]
    .map(([generoId, contagem]) => ({
      id: generoId,
      nome: genreNamesMap.get(generoId) ?? "Outro",
      contagem,
      percentual: totalAssistidos ? Math.round((contagem / totalAssistidos) * 100) : 0,
    }))
    .sort((a, b) => b.contagem - a.contagem);

  return {
    totalAssistidos,
    totalFilmes,
    totalSeries,
    tempoTotalMinutos,
    tempoTotalHoras: Math.round((tempoTotalMinutos / 60) * 10) / 10,
    notaMedia: Math.round(notaMedia * 10) / 10,
    generoFavorito: distribuicaoGeneros[0] ?? null,
    distribuicaoGeneros,
    generosDistintos: generoContagem.size,
  };
}

export function computeAchievements(watchedList) {
  const total = watchedList.length;
  const avaliados = watchedList.filter((item) => item.nota > 0).length;
  const generosDistintos = new Set(watchedList.flatMap((item) => item.generoIds || [])).size;
  const streak = computeStreakDays(watchedList);

  const rules = [
    {
      id: "primeira-watch",
      titulo: "Primeira Watch",
      descricao: "Marque seu primeiro filme ou série como assistido.",
      progresso: total,
      meta: 1,
    },
    {
      id: "maratonista",
      titulo: "Maratonista",
      descricao: "Assista 10 filmes ou séries.",
      progresso: total,
      meta: 10,
    },
    {
      id: "colecionador",
      titulo: "Colecionador",
      descricao: "Assista 25 filmes ou séries.",
      progresso: total,
      meta: 25,
    },
    {
      id: "explorador-generos",
      titulo: "Explorador de Gêneros",
      descricao: "Assista conteúdos de 5 gêneros diferentes.",
      progresso: generosDistintos,
      meta: 5,
    },
    {
      id: "critico",
      titulo: "Crítico",
      descricao: "Avalie 10 filmes ou séries.",
      progresso: avaliados,
      meta: 10,
    },
    {
      id: "streak-3",
      titulo: "Sequência de 3 dias",
      descricao: "Registre atividade em 3 dias seguidos.",
      progresso: streak,
      meta: 3,
    },
    {
      id: "streak-7",
      titulo: "Sequência de 7 dias",
      descricao: "Registre atividade em 7 dias seguidos.",
      progresso: streak,
      meta: 7,
    },
  ];

  return rules.map((rule) => ({
    ...rule,
    progresso: Math.min(rule.progresso, rule.meta),
    desbloqueado: rule.progresso >= rule.meta,
  }));
}
