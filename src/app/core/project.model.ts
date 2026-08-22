export type ProjectStatus = 'available' | 'building';

export interface LocalizedText {
  pt: string;
  en: string;
}

export interface PortfolioProject {
  slug: string;
  number: string;
  title: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  stack: string[];
  status: ProjectStatus;
  repositoryUrl?: string;
  demoUrl?: string;
  downloadUrl?: string;
  imageUrl?: string;
}

export const PROJECTS: PortfolioProject[] = [
  {
    slug: 'hub-calculadoras', number: '01',
    title: { pt: 'Hub de Calculadoras', en: 'Useful Calculators Hub' },
    problem: { pt: 'Ferramentas simples costumam estar escondidas em sites lentos e cheios de anúncios.', en: 'Simple tools are often buried in slow, ad-heavy websites.' },
    solution: { pt: 'Três calculadoras diretas para valor-hora, juros compostos e custo de deslocamento.', en: 'Three direct calculators for hourly rates, compound interest and commuting costs.' },
    stack: ['Ionic', 'Angular', 'TypeScript'], status: 'available',
    repositoryUrl: 'https://github.com/AvinSSSS/Portifolio', demoUrl: '/Portifolio/calculadoras',
  },
  {
    slug: 'nfe', number: '02',
    title: { pt: 'Descomplicador de NFe', en: 'NFe Explorer' },
    problem: { pt: 'Pastas com centenas de XMLs tornam uma consulta simples demorada e sujeita a erro.', en: 'Folders with hundreds of XML files make simple checks slow and error-prone.' },
    solution: { pt: 'Aplicativo Windows que consolida documentos fiscais e exporta um relatório em CSV.', en: 'A Windows app that consolidates tax documents and exports a CSV report.' },
    stack: ['Delphi', 'VCL', 'XML'], status: 'building',
  },
  {
    slug: 'organizador-arquivos', number: '03',
    title: { pt: 'Organizador de Arquivos', en: 'Batch File Organizer' },
    problem: { pt: 'Renomear fotos e documentos manualmente consome tempo e cria inconsistências.', en: 'Renaming photos and documents manually wastes time and creates inconsistencies.' },
    solution: { pt: 'Renomeação em lote com prévia, detecção de conflitos e desfazer.', en: 'Batch renaming with preview, conflict detection and undo.' },
    stack: ['Delphi', 'VCL', 'Windows'], status: 'building',
  },
  {
    slug: 'discord-bot', number: '04',
    title: { pt: 'Bot Utilitário para Discord', en: 'Discord Utility Bot' },
    problem: { pt: 'Comunidades pequenas precisam organizar recepção e suporte sem painéis complexos.', en: 'Small communities need to organize onboarding and support without complex dashboards.' },
    solution: { pt: 'Boas-vindas configuráveis e fluxo enxuto de tickets com transcript.', en: 'Configurable welcomes and a lean ticket flow with transcripts.' },
    stack: ['Node.js', 'discord.js', 'Docker'], status: 'building',
  },
  {
    slug: 'assistente-laudos', number: '05',
    title: { pt: 'Assistente de Orçamento e Laudo', en: 'Quote & Report Assistant' },
    problem: { pt: 'Prestadores perdem horas transformando anotações em documentos profissionais.', en: 'Service providers spend hours turning notes into professional documents.' },
    solution: { pt: 'Gera texto técnico revisável e PDF orçado com apoio do Gemini.', en: 'Creates editable technical copy and a priced PDF with Gemini assistance.' },
    stack: ['Python', 'Streamlit', 'Gemini'], status: 'building',
  },
];
