export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: { 'pt-BR': string; en: string };
}

interface ProjectAssets {
  images: ProjectImage[];
  demo?: string;
  source?: string;
}

// Paths are relative to Vite's base URL, including GitHub Pages subdirectories.
export const projectAssets: Record<string, ProjectAssets> = {
  '01': {
    images: [
      {
        src: 'projects/automacao_fiscal.png',
        width: 1952,
        height: 806,
        alt: {
          'pt-BR':
            'Automação fiscal: consulta de notas da SEFAZ, filtros por emissão e geração de planilhas.',
          en: 'Fiscal automation: SEFAZ invoice lookup, issue date filters and spreadsheet generation.',
        },
      },
    ],
  },
  '02': {
    images: [
      {
        src: 'projects/gestao_financeira.png',
        width: 1619,
        height: 971,
        alt: {
          'pt-BR':
            'Gestão financeira: visão geral de notas, duplicatas, vencimentos, pagamentos e boletos, com valores ocultos.',
          en: 'Financial management: overview of invoices, receivables, due dates, payments and payment slips, with amounts hidden.',
        },
      },
    ],
  },
  '03': {
    demo: 'https://ricardolhc.github.io/ValorantGuess/',
    source: 'https://github.com/ricardolhc/ValorantGuess',
    images: [
      {
        src: 'projects/valorantguess.webp',
        width: 1440,
        height: 960,
        alt: {
          'pt-BR':
            'ValorantGuess em uma rodada: ícone da habilidade, tempo restante, pontuação e opções Q, E, C e X.',
          en: 'ValorantGuess during a round: ability icon, remaining time, score and Q, E, C and X choices.',
        },
      },
    ],
  },
  '04': {
    demo: 'https://ricardolhc.github.io/rumble-challenge/',
    source: 'https://github.com/ricardolhc/rumble-challenge',
    images: [
      {
        src: 'projects/rumble-challenge.webp',
        width: 1440,
        height: 960,
        alt: {
          'pt-BR':
            'Rumble Challenge: seleção de personagens e controles para sorteio de equipes.',
          en: 'Rumble Challenge: character selection and team draw controls.',
        },
      },
    ],
  },
};
