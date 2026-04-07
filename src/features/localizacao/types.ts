export interface LocalizacaoProgramacaoItem {
  id: string;
  title: string;
  schedule: string;
  summary?: string;
  Content: any;
}

export interface LocalizacaoFaqItem {
  id: string;
  question: string;
  Content: any;
}

export interface LocalizacaoPageData {
  programacao: LocalizacaoProgramacaoItem[];
  faqItems: LocalizacaoFaqItem[];
}
