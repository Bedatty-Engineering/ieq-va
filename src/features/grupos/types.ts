export interface GrupoCardData {
  id: string;
  title: string;
  audience: string;
  schedule: string;
  summary?: string;
  order: number;
}

export interface GruposPageData {
  groups: GrupoCardData[];
}
