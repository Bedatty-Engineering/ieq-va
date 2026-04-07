import type {
  InstitutionalCard,
  InstitutionalScheduleItem,
  InstitutionalTimelineItem
} from "../types";

export const churchInfo = {
  imagePath: "/images/vila-arlindo.jpeg",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=-29.6458463,-52.2960489&t=k&z=17&ie=UTF8&iwloc=&output=embed",
  mapsPlaceUrl:
    "https://www.google.com/maps/place/5%C2%AA+Igreja+do+Evangelho+Quadrangular+de+Vila+Arlindo/@-29.6458416,-52.2986292,17z/data=!3m1!4b1!4m6!3m5!1s0x951c971cdc06b81d:0xbd292610bdb25035!8m2!3d-29.6458463!4d-52.2960489!16s%2Fg%2F11vhtm1f9m",
  instagramUrl: "https://www.instagram.com/5ieq.vilaarlindo/",
  addressLines: [
    "5ª Igreja do Evangelho Quadrangular de Vila Arlindo",
    "Vila Arlindo",
    "Venâncio Aires - RS"
  ]
} as const;

export const homeValueCards: InstitutionalCard[] = [
  {
    title: "Amor",
    description: "Recebemos pessoas com atenção, escuta e cuidado, valorizando cada família que chega."
  },
  {
    title: "Comunhão",
    description: "Fortalecemos vínculos locais por meio de encontros de oração, culto e convivência cristã."
  },
  {
    title: "Palavra",
    description: "Mantemos a mensagem bíblica no centro da vida da igreja, com clareza e simplicidade."
  }
];

export const homeAgendaHighlights: InstitutionalScheduleItem[] = [
  { label: "Quarta-feira", details: "19h · Culto de oração" },
  { label: "2ª sexta", details: "20h · Encontro de jovens" },
  { label: "Sábado", details: "19h · Culto da família e crianças" }
];

export const aboutTimelineItems: InstitutionalTimelineItem[] = [
  {
    year: "Início",
    title: "Primeiros encontros da comunidade",
    description:
      "A presença da igreja foi sendo formada por reuniões locais de culto, oração e comunhão, com participação próxima das famílias da região."
  },
  {
    year: "Crescimento",
    title: "Consolidação da vida comunitária",
    description:
      "Com o passar do tempo, a igreja fortaleceu sua identidade institucional e sua constância nos encontros públicos e no cuidado pastoral."
  },
  {
    year: "Serviço",
    title: "Ensino, oração e acolhimento",
    description:
      "A comunidade permaneceu comprometida com a Palavra, com a intercessão e com uma atuação simples, mas presente, em Vila Arlindo."
  },
  {
    year: "Hoje",
    title: "Continuidade com reverência e proximidade",
    description:
      "A 5IEQ Vila Arlindo segue servindo de forma acessível, preservando a comunhão local e abrindo espaço para crescimento futuro do site e da comunicação."
  }
];

export const aboutValues: InstitutionalCard[] = [
  {
    title: "Amor genuíno",
    description: "Recebemos pessoas com respeito, escuta e disposição para caminhar ao lado delas."
  },
  {
    title: "Palavra central",
    description: "O ensino bíblico continua sendo referência para a vida da igreja e sua comunicação."
  },
  {
    title: "Comunidade real",
    description: "Valorizamos vínculos autênticos, cuidado mútuo e convivência cristã cotidiana."
  }
];
