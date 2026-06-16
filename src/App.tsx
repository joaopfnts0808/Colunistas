// @ts-nocheck
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import "./styles.css";

// ── Design System ─────────────────────────────────────────────────────────
const GRADIENT = "linear-gradient(90deg, #1900ff, #0098fa, #00ff6e, #fff700, #ff8414, #ff575b)";
const FONT_BASE = "'Gibson', sans-serif";
const FONT_DESTAQUE = "'Oswald', sans-serif";

const DARK = {
  fontBase: FONT_BASE,
  fontDestaque: FONT_DESTAQUE,
  bg: "#000000",
  s1: "#111111",
  s2: "#181818",
  s3: "#1e1e1e",
  b: "#262626",
  b2: "#333333",
  accent: "#951F1E",
  acDim: "#951F1E18",
  acBg: "#1a0505",
  acA33: "#951F1E33",
  acA44: "#951F1E44",
  purple: "#6d20ff",
  purBg: "#10052a",
  purA33: "#6d20ff33",
  purA44: "#6d20ff44",
  green: "#00ff6e",
  grBg: "#001a0e",
  grA44: "#00ff6e44",
  amber: "#fff700",
  amBg: "#1a1a00",
  amA44: "#fff70044",
  red: "#951F1E",
  redBg: "#1a0505",
  redA44: "#951F1E44",
  text: "#FFFFFF",
  muted: "#CCCCCC",
  dim: "#707070",
  faint: "#2e2e2e",
  gradient: GRADIENT,
};

const LIGHT = {
  fontBase: FONT_BASE,
  fontDestaque: FONT_DESTAQUE,
  bg: "#FFFFFF",
  s1: "#F5F5F5",
  s2: "#EEEEEE",
  s3: "#E6E6E6",
  b: "#DADADA",
  b2: "#CACACA",
  accent: "#951F1E",
  acDim: "#951F1E10",
  acBg: "#FFF3F3",
  acA33: "#951F1E22",
  acA44: "#951F1E33",
  purple: "#5a0eee",
  purBg: "#F3EEFF",
  purA33: "#5a0eee22",
  purA44: "#5a0eee33",
  green: "#009944",
  grBg: "#EDFFF5",
  grA44: "#00994433",
  amber: "#B87800",
  amBg: "#FFFBE8",
  amA44: "#B8780033",
  red: "#951F1E",
  redBg: "#FFF3F3",
  redA44: "#951F1E33",
  text: "#111111",
  muted: "#444444",
  dim: "#888888",
  faint: "#E2E2E2",
  gradient: GRADIENT,
};

// Backward compat: C always points to DARK for module-level uses
const C = DARK;

// ── Error Boundary ────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:24,fontFamily:"monospace",fontSize:12,color:"#ff575b",background:"#0a0a0a",minHeight:"100vh"}}>
          <div style={{fontWeight:700,marginBottom:8}}>Erro de renderização:</div>
          <pre style={{whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{String(this.state.error)}</pre>
          <pre style={{whiteSpace:"pre-wrap",wordBreak:"break-all",color:"#707070",marginTop:8}}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ThemeCtx = createContext("dark");
const useC = () => {
  const theme = useContext(ThemeCtx);
  return theme === "light" ? LIGHT : DARK;
};

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const EDITORIAS = [
  "Cultura Queer e Trans",
  "História e Memória Política",
  "Práticas Sexuais, Corpo e Relacionamentos",
  "Diversidade, Equidade e Inclusão",
  "Linguagem Neutra e Inovação Linguística",
  "Tecnologia e Futuro",
];

// Mapeamento das editorias para as cores do arco-íris da marca
const ED_COLORS = {
  "Cultura Queer e Trans": "#ff575b",
  "História e Memória Política": "#fff700",
  "Práticas Sexuais, Corpo e Relacionamentos": "#6d20ff",
  "Diversidade, Equidade e Inclusão": "#00ff6e",
  "Linguagem Neutra e Inovação Linguística": "#0098fa",
  "Tecnologia e Futuro": "#ff8414",
};

const getStatusCfg = (cs) => ({
  Pendente: { color: cs.dim, bg: cs.s2 },
  Enviado: { color: cs.amber, bg: cs.amBg },
  "Em Revisão": { color: cs.purple, bg: cs.purBg },
  Publicado: { color: cs.green, bg: cs.grBg },
  Rejeitado: { color: cs.accent, bg: cs.acBg },
});

const COLUMNISTS = [
  {
    id: 6,
    nome: "Matheus Theodore",
    pronomes: "Ele/Dele",
    sigla: "MT",
    curso: "Publicidade e Propaganda, Anhanguera",
    email: "matheustheodore@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Jornada do azarão: como corpos marginalizados criam novas narrativas",
      "Comunidade BDSM e por que é acolhedora para corpos dissidentes",
      "Juventude preta com gênero fluido e expressões pouco populares",
    ],
  },
  {
    id: 9,
    nome: "Moon Kenzo",
    pronomes: "Ela/Dela",
    sigla: "MK",
    curso: "Letras-Inglês, UVA",
    email: "contatomoonkenzo@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "O mito do fast-sex: Por que não estou perdendo nada ao recusar 15 minutos de nada",
      "Turistas da Submissão: você quer o fetiche mas não aguenta minha disciplina",
      "A Solidão de Quem Transcende: O preço de não ser 'a fácil'",
    ],
  },
  {
    id: 10,
    nome: "Sabrina Kali Nogueira Marinho",
    pronomes: "Ela/dela",
    sigla: "SK",
    curso: "Jornalismo, UFRJ",
    email: "sabrinakali.noog@gmail.com",
    editorias: [
      "Linguagem Neutra e Inovação Linguística",
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Amor e solidão: sentimentos opostos que se parecem nos relacionamentos",
      "Pajubá e Gualín do TTK: dialetos nascidos na ditadura militar",
      "Segregades do amor: a comunidade trans e a exclusão do amor romântico",
    ],
  },
  {
    id: 12,
    nome: "Benjamim Siqueira Souto",
    pronomes: "ele/elu",
    sigla: "BS",
    curso: "Ciências Humanas, Estácio de Sá",
    email: "benjamimsiqueirasouto@gmail.com",
    editorias: [
      "Linguagem Neutra e Inovação Linguística",
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Desconstrução da cisheteronormatividade na arte contemporânea",
      "Estética do desejo dissidente e as Não-Imagens",
      "Ficção científica e criação de mundos como ferramentas de autoconhecimento LGBTQIA+",
    ],
  },
  {
    id: 13,
    nome: "Isabella Piana",
    pronomes: "Ela/Dela",
    sigla: "IP",
    curso: "Jornalismo, UFRGS",
    email: "isabellacopatti@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Como a heterossexualidade compulsória ainda exige que LGBT performem papéis de gênero tradicionais",
      "Como a pornografia molda nossos relacionamentos e a cultura ao nosso redor",
      "Isso é mais queer do que você pensa: o que foi criado pela cultura queer e apropriado pela heteronormatividade",
    ],
  },
  {
    id: 14,
    nome: "Raphael Mello",
    pronomes: "Ele",
    sigla: "RM",
    curso: "Psicologia, UNIP",
    email: "rafhaelpsicologo@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Entre o desejo e a sobrevivência: o que os relacionamentos LGBT revelam sobre afeto na contemporaneidade",
      "Corpos desejáveis, corpos descartáveis: o mercado afetivo dentro da comunidade LGBT",
      "Quando sair do armário não basta: as marcas psíquicas da colonialidade nos afetos LGBT",
    ],
  },
  {
    id: 15,
    nome: "Eduardo Barbosa",
    pronomes: "Ele/dele",
    sigla: "EB",
    curso: "Sociologia (Pós-Graduação), UFSCar",
    email: "barbosaskid@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "Não-monogamia é mesmo uma política subversiva para homens gays?",
      "O corpo musculoso da bicha é um problema para quem?",
      "Por que o gay preto é pra sexo e o gay branco é pra namoro?",
    ],
  },
  {
    id: 16,
    nome: "Callisto Jasmim Rodrigues Melo",
    pronomes: "Ela/dela",
    sigla: "CJ",
    curso: "Jornalismo, Uni7 (Fortaleza)",
    email: "callisto.jasmim@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "Como a geração Z está preservando e inovando os ballrooms?",
      "Entrevistar LGBTQIAPN+ das décadas de 50 a 90 com documentos de memória afetiva",
      "O que as práticas sexuais de pessoas trans revelam sobre como a sociedade as enxerga?",
    ],
  },
  {
    id: 18,
    nome: "Guilherme Clisma Araujo de Sousa",
    pronomes: "ele/dele",
    sigla: "GC",
    curso: "Letras Inglês, UFC",
    email: "guilhermeendel@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Tecnologia e Futuro",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Sexo, afeto e liberdade: desaprendendo padrões para criar relações mais honestas",
      "O corpo como território político: o que nossos desejos dizem sobre quem somos?",
      "Prazer também é política: como o corpo se torna espaço de autonomia e resistência",
    ],
  },
  {
    id: 20,
    nome: "José Luiz Alves Neto",
    pronomes: "Ele/dele",
    sigla: "JL",
    curso: "Mestrado em Geografia, Unifal-MG",
    email: "jose.alves@sou.unifal-mg.edu.br",
    editorias: [
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Vida e memória insubmissas de pessoas LGBTQIA+ interioranas",
      "Economia política do sexo no mundo globalizado",
      "Relações de gênero e educação voltadas à diferença",
    ],
  },
  {
    id: 21,
    nome: "Mariana Freire de Moraes",
    pronomes: "Ela/dela",
    sigla: "MF",
    curso: "Estudos Literários, UNICAMP",
    email: "m200590@dac.unicamp.br",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "O corpo do artista queer contemporâneo: na poesia, no teatro, na fotografia",
      "Literatura lésbica brasileira: o erotismo nas obras",
      "A rua e o flâneur queer: sempre estivemos nas ruas e a rua sempre foi o lugar do nosso desejo",
    ],
  },
  {
    id: 22,
    nome: "Rafaela Silva Mancini",
    pronomes: "Ela/dela",
    sigla: "RS",
    curso: "Letras, FFLCH USP",
    email: "rafaelasmancini@gmail.com",
    editorias: [
      "Linguagem Neutra e Inovação Linguística",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Corpos femininos e a proteção contra ISTs",
      "Corpo e Ocupação: Em quais lugares estamos?",
      "Quem dita a palavra do corpo feminino?",
    ],
  },
  {
    id: 23,
    nome: "Hayllon Pessoa",
    pronomes: "Ele/dele",
    sigla: "HP",
    curso: "Letras + Cinema e Audiovisual + Mestrando",
    email: "ahayllon@gmail.com",
    editorias: ["Cultura Queer e Trans"],
    pautas: [
      "Do 'queer' ao 'cuir': a dissidência reinventada pelo cinema latino-americano",
      "Cinema queer nordestino: corpos dissidentes longe do eixo",
      "O fim inevitável? Repensando o sofrimento LGBTQIA+ nas telas",
    ],
  },
  {
    id: 24,
    nome: "Jaime Santana Neto",
    pronomes: "Ele/dele",
    sigla: "JN",
    curso: "Jornalismo (21 anos de profissão)",
    email: "jaimenetoparticular@gmail.com",
    editorias: [
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "Discutindo relações gays: dinâmicas e tabus",
      "Homens gays 40+: escolhas e sacrifícios",
      "Solidão Homoafetiva e seus desafios",
    ],
  },
  {
    id: 25,
    nome: "Arthur Monteiro",
    pronomes: "Ele/Dele",
    sigla: "AM",
    curso: "Jornalismo, Ceub",
    email: "amm240699@gmail.com",
    editorias: ["Cultura Queer e Trans"],
    pautas: [
      "O techno como expoente queer no Brasil e no mundo",
      "Dez anos da MPB mais queer que nunca: linha temporal 2016-2026",
      "O preço de ser LGBT na cultura pop dos anos 80",
    ],
  },
  {
    id: 28,
    nome: "Hélio Lucas Carvalho Gonçalves",
    pronomes: "Ele/dele",
    sigla: "HL",
    curso: "Jornalismo, UDF (Brasília)",
    email: "heliolucascg@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Quem tem medo de gênero nas escolas?",
      "A nova pornografia política: deepfakes sexuais como arma",
      "A bancada do pânico moral: quando 'proteger crianças' vira desculpa para apagar diversidade",
    ],
  },
  {
    id: 29,
    nome: "Lucas José Oliveira Souza",
    pronomes: "Ele, dele",
    sigla: "LJ",
    curso: "Marketing, Anhanguera Caruaru",
    email: "eu.luccasjose@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "SEXO É SÓ TEATRAL: sobre minha (re)descoberta com a prática sexual",
      "XUXA E A INSERÇÃO QUEER NA TV",
      "GRAFISMO DE MULHERES CIS E TRANS: arte e expressão no interior de Pernambuco",
    ],
  },
  {
    id: 30,
    nome: "Pedro Augusto Pinto Luz",
    pronomes: "Qualquer",
    sigla: "PA",
    curso: "Comunicação Social, UNEB",
    email: "luzpedroaugusto@gmail.com",
    editorias: ["Cultura Queer e Trans", "História e Memória Política"],
    pautas: [
      "Hannah de Girls e a relação com o corpo enquanto pessoa gorda",
      "Paralelos entre cultura pop e experiências pessoais LGBTQ+",
      "A escrita como necessidade: quando o outro me reconhece no texto",
    ],
  },
  {
    id: 33,
    nome: "Vicente Buccarini",
    pronomes: "Ele/Dele",
    sigla: "VB",
    curso: "Psicologia (Unifor) + Jornalismo (UFC)",
    email: "vicentebuccarini@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "Masturbação: tabus e revelações",
      "Banheiros masculinos como espaço de sociabilidade e repressão",
      "Cultura tecno e os corpos que a habitam",
    ],
  },
  {
    id: 34,
    nome: "Isabela",
    pronomes: "ela/dela",
    sigla: "IB",
    curso: "Jornalismo, UFU",
    email: "belacmellol@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Tecnologia e Futuro",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Direitos reprodutivos: pautas para corpos que geram",
      "Gênero e identidade étnica: a emancipação das mulheres árabes",
      "Cultura da pista de dança (ballroom, vogue) e histórias de resistência",
    ],
  },
  {
    id: 35,
    nome: "Maria Clara Rocha e Silva",
    pronomes: "ela/dela",
    sigla: "MC",
    curso: "Jornalismo, UFU",
    email: "mariaclararochaesilvaxv@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Tecnologia e Futuro",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "Espelhos Distorcidos: deepfakes pornôs contra mulheres na política",
      "Do romance de banca ao áudio por assinatura: erotismo pensado para mulheres",
      "Eu sou marrom: Milo J e ancestralidade como disputa por pertencimento",
    ],
  },
  {
    id: 37,
    nome: "Maria Eduarda Amorim",
    pronomes: "Ela/Dela",
    sigla: "ME",
    curso: "Jornalismo, UFU",
    email: "mariaeduardaamorimufu@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Tecnologia e Futuro",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "A mulher cis e a masturbação: tabu e normalidade",
      "O trabalho sexual na contemporaneidade: neoliberalismo e OnlyFans",
      "A teoria queer através de Gayle Rubin",
    ],
  },
  {
    id: 38,
    nome: "Jean",
    pronomes: "Ele",
    sigla: "JE",
    curso: "Gestão Pública, UFMG (formado em Letras)",
    email: "jouto.contato@gmail.com",
    editorias: ["Práticas Sexuais, Corpo e Relacionamentos"],
    pautas: [
      "Abuso sexual de meninos gays: o silêncio que adoece",
      "Pornografia na construção do imaginário erótico gay",
      "Como o belohorizontino flerta fora dos aplicativos?",
    ],
  },
  {
    id: 39,
    nome: "Ágatha Sirigni Nunes",
    pronomes: "ela/dela",
    sigla: "AS",
    curso: "Letras Português/Inglês, PUC-Rio",
    email: "agathanunestexts@gmail.com",
    editorias: [
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "A construção histórica da monogamia como modelo dominante",
      "A ausência de referências LGBTQIAPN+ durante a infância",
      "Por que os homens ocupam posição de sujeito nas narrativas sobre sexo?",
    ],
  },
  {
    id: 43,
    nome: "Amanda Alves Braga",
    pronomes: "Ela/Dela",
    sigla: "AA",
    curso: "Jornalismo, UNIVALE",
    email: "bragaamanda487@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "História e Memória Política",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "A comunidade queer é cronicamente online?",
      "O que o BDSM pode ensinar sobre comunicação e consentimento?",
      "A linguagem queer secreta: códigos e encontros antes da era digital",
    ],
  },
  {
    id: 46,
    nome: "Maria Eduarda Neves Costa",
    pronomes: "Ela/Dela",
    sigla: "MN",
    curso: "Letras Português-Inglês, UFRJ",
    email: "mariaeduardaneves.16144@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
      "Diversidade, Equidade e Inclusão",
    ],
    pautas: [
      "A ausência de lésbicas 'masc' na dramaturgia brasileira",
      "Novas possibilidades imagéticas da experiência lésbica: Carol Biazin",
      "Qual a conceptualização discursiva da mulher sáfica nas redes sociais?",
    ],
  },
  {
    id: 52,
    nome: "Gabriel Jóia de Macedo",
    pronomes: "Ele/Dele",
    sigla: "GJ",
    curso: "Imagem e Som, UFSCar",
    email: "gabrielvic.joia@gmail.com",
    editorias: [
      "Cultura Queer e Trans",
      "Práticas Sexuais, Corpo e Relacionamentos",
    ],
    pautas: [
      "Masculinidades trans em pauta: Como faz a barba?",
      "Existe amor para esse corpo trans?",
      "Pode um homem trans ser jogador de futebol?",
    ],
  },
  {
    id: 53,
    nome: "Débora Adones",
    pronomes: "Ela/dela",
    sigla: "DA",
    curso: "Jornalismo, UESB",
    email: "deboraadones198@gmail.com",
    editorias: ["Cultura Queer e Trans", "Diversidade, Equidade e Inclusão"],
    pautas: [
      "A vivência LGBTQ+ nas cidades de pequeno porte do Brasil",
      "Como personagens explosivos fazem alusão à vivência queer no cinema",
      "A democratização da educação sexual LGBTQ+ pela internet",
    ],
  },
  {
    id: 56,
    nome: "Lucas Brito",
    pronomes: "Ele/Dele",
    sigla: "LB",
    curso: "Doutorado em Sociologia, UnB",
    email: "lbritodelima@gmail.com",
    editorias: ["Práticas Sexuais, Corpo e Relacionamentos"],
    pautas: [
      "Sexo em locais públicos como cartografia do desejo nas cities",
      "Sexo e o ambiente da política brasileira",
      "Quanto mais sexo, menos sexo? Jovens e a recessão sexual",
    ],
  },
];


// ── Chat System ───────────────────────────────────────────────────────────

const getChatUserId = (user) =>
  user.role === "gestor" ? `gestor_${user.gestorEmail||user.email||"g"}` : `col_${user.colId}`;

const getChatUserName = (user, colunista, gestorProfile) => {
  if (user.role === "colunista") return colunista?.nome || "Colunista";
  const g = GESTORES.find(g => g.email === (user.gestorEmail||user.email));
  return g?.nome || gestorProfile?.nome || "Gestor";
};

const getChatUserSigla = (user, colunista) => {
  if (user.role === "colunista") return colunista?.sigla || "??";
  const g = GESTORES.find(g => g.email === (user.gestorEmail||user.email));
  return g?.nome?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "G";
};

const getChatUserFoto = (user, colunista, contraExtra, gestorProfile) => {
  if (user.role === "colunista") return contraExtra?.[user.colId]?.foto || "";
  const g = GESTORES.find(g => g.email === (user.gestorEmail||user.email));
  return g?.foto || gestorProfile?.foto || "";
};

const dmChannelKey = (a, b) => {
  const s = [a, b].sort();
  return `sx2_dm_${s[0]}_${s[1]}`;
};

const playNotifSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch(_) {}
};

const buildAllChatUsers = (contraExtra) => {
  const users = [];
  GESTORES.forEach((g) => {
    users.push({
      id: `gestor_${g.email}`,
      nome: g.nome,
      sigla: g.nome.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
      foto: g.foto || "",
    });
  });
  COLUMNISTS.forEach((c) => {
    users.push({
      id: `col_${c.id}`,
      nome: c.nome,
      sigla: c.sigla,
      foto: contraExtra?.[c.id]?.foto || "",
    });
  });
  return users;
};

// ── ChatFloat ─────────────────────────────────────────────────────────────
function ChatFloat({ user, colunista, gestorProfile, contraExtra }) {
  const cs = useC();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("global"); // "global" | "dms" | userId
  const [msgs, setMsgs] = useState({});       // { channelKey: [msg] }
  const [input, setInput] = useState("");
  const [presence, setPresence] = useState({});
  const [unread, setUnread] = useState({});
  const endRef = useRef(null);
  const pollRef = useRef(null);
  const hbRef = useRef(null);
  const openRef = useRef(open);
  const viewRef = useRef(view);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => { viewRef.current = view; }, [view]);

  const myId   = getChatUserId(user);
  const myName = getChatUserName(user, colunista, gestorProfile);
  const mySig  = getChatUserSigla(user, colunista);
  const myFoto = getChatUserFoto(user, colunista, contraExtra, gestorProfile);

  const curKey = view === "global"
    ? "sx2_chat_global"
    : view === "dms" ? null
    : dmChannelKey(myId, view);

  const curMsgs = curKey ? (msgs[curKey] || []) : [];
  const allUsers = buildAllChatUsers(contraExtra).filter(u => u.id !== myId);

  const totalUnread = Object.values(unread).reduce((a,b)=>a+b, 0);

  const isOnline = (uid) => {
    const last = presence[uid];
    return last && (Date.now() - last < 90000);
  };

  const loadChannel = async (key, silent = false) => {
    try {
      const data = await sbFetch(`kv_store?key=eq.${encodeURIComponent(key)}&select=value`);
      const fetched = data?.[0]?.value ? JSON.parse(data[0].value) : [];
      setMsgs(prev => {
        const old = prev[key] || [];
        if (!silent && fetched.length > old.length && old.length > 0) {
          const newOnes = fetched.slice(old.length).filter(m => m.fromId !== myId);
          if (newOnes.length > 0) {
            playNotifSound();
            const isActive = openRef.current && viewRef.current !== "dms" &&
              (viewRef.current === "global" ? key === "sx2_chat_global" : dmChannelKey(myId, viewRef.current) === key);
            if (!isActive) {
              setUnread(u => ({...u, [key]: (u[key]||0) + newOnes.length}));
            }
          }
        }
        return {...prev, [key]: fetched};
      });
    } catch(_) {}
  };

  const loadPresence = async () => {
    try {
      const data = await sbFetch(`kv_store?key=eq.sx2_presence&select=value`);
      if (data?.[0]?.value) setPresence(JSON.parse(data[0].value));
    } catch(_) {}
  };

  const heartbeat = async () => {
    try {
      const data = await sbFetch(`kv_store?key=eq.sx2_presence&select=value`);
      const current = data?.[0]?.value ? JSON.parse(data[0].value) : {};
      current[myId] = Date.now();
      await sbFetch("kv_store", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ key: "sx2_presence", value: JSON.stringify(current), updated_at: new Date().toISOString() }),
      });
      setPresence(current);
    } catch(_) {}
  };

  useEffect(() => {
    loadChannel("sx2_chat_global", true);
    loadPresence();
    heartbeat();

    const poll = () => {
      loadChannel("sx2_chat_global");
      loadPresence();
      const v = viewRef.current;
      if (v !== "global" && v !== "dms") {
        loadChannel(dmChannelKey(myId, v));
      }
    };

    pollRef.current = setInterval(poll, 3000);
    hbRef.current   = setInterval(heartbeat, 30000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(hbRef.current);
    };
  }, []);

  useEffect(() => {
    if (view !== "global" && view !== "dms") {
      loadChannel(dmChannelKey(myId, view), true);
    }
  }, [view]);

  useEffect(() => {
    if (open && curKey) {
      setUnread(u => ({...u, [curKey]: 0}));
    }
  }, [open, curKey]);

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [curMsgs, open, view]);

  const sendMsg = async () => {
    const text = input.trim();
    if (!text || !curKey) return;
    setInput("");
    const msg = {
      id: Date.now(),
      fromId: myId,
      fromName: myName,
      fromSig: mySig,
      fromFoto: myFoto,
      text,
      ts: new Date().toISOString(),
    };
    const updated = [...(msgs[curKey]||[]), msg].slice(-100);
    setMsgs(prev => ({...prev, [curKey]: updated}));
    try {
      await sbFetch("kv_store", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ key: curKey, value: JSON.stringify(updated), updated_at: new Date().toISOString() }),
      });
    } catch(_) {}
  };

  const fmtTime = (ts) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  const dmUnreadTotal = Object.entries(unread)
    .filter(([k]) => k !== "sx2_chat_global")
    .reduce((a,[,v])=>a+v, 0);

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat"
        style={{
          position:"fixed", bottom:24, right:24,
          width:52, height:52, borderRadius:"50%",
          background: GRADIENT,
          border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, boxShadow:"0 4px 24px rgba(0,0,0,0.45)",
          zIndex:300, transition:"transform 0.15s",
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      >
        💬
        {totalUnread > 0 && (
          <span style={{
            position:"absolute", top:-4, right:-4,
            background:"#ff575b", color:"#fff",
            borderRadius:"50%", fontSize:9, fontWeight:700,
            width:18, height:18, display:"flex",
            alignItems:"center", justifyContent:"center",
            border:"2px solid #000",
          }}>{totalUnread > 9 ? "9+" : totalUnread}</span>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position:"fixed", bottom:84, right:24,
          width:360, height:500,
          background:cs.s1,
          border:`1px solid ${cs.b}`,
          borderRadius:12,
          display:"flex", flexDirection:"column",
          zIndex:299,
          boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
          overflow:"hidden",
        }}>
          {/* rainbow stripe */}
          <div style={{height:4, background:GRADIENT, flexShrink:0}} />

          {/* Tab bar */}
          <div style={{display:"flex", borderBottom:`1px solid ${cs.faint}`, flexShrink:0, background:cs.s2}}>
            {[
              {key:"global", label:"🌐 Global", badge: unread["sx2_chat_global"]||0},
              {key:"dms",    label:"💬 DMs",    badge: dmUnreadTotal},
            ].map(t => (
              <button key={t.key} onClick={()=>setView(t.key)}
                style={{
                  background:"none", border:"none",
                  color: (view === t.key || (t.key==="dms" && view!=="global")) ? cs.text : cs.dim,
                  padding:"10px 14px", cursor:"pointer",
                  fontSize:12, fontFamily:"inherit",
                  fontWeight: (view === t.key || (t.key==="dms" && view!=="global")) ? 700 : 400,
                  borderBottom: (view === t.key || (t.key==="dms" && view!=="global"))
                    ? `2px solid ${cs.accent}` : "2px solid transparent",
                }}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{marginLeft:4, background:cs.accent, color:"#fff",
                    borderRadius:8, fontSize:9, padding:"1px 5px", fontWeight:700}}>
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Body */}
          {view === "dms" ? (
            /* DM user list */
            <div style={{flex:1, overflow:"auto"}}>
              {allUsers.map(u => {
                const k = dmChannelKey(myId, u.id);
                const badge = unread[k] || 0;
                const online = isOnline(u.id);
                return (
                  <button key={u.id} onClick={()=>setView(u.id)}
                    style={{
                      width:"100%", background:"none", border:"none",
                      color:cs.text, padding:"9px 14px",
                      cursor:"pointer", display:"flex", alignItems:"center",
                      gap:10, textAlign:"left", fontFamily:"inherit",
                      borderBottom:`1px solid ${cs.faint}`,
                    }}>
                    <div style={{position:"relative", flexShrink:0}}>
                      {u.foto
                        ? <div style={{width:34,height:34,borderRadius:"50%",overflow:"hidden"}}>
                            <img src={u.foto} alt={u.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}
                              onError={e=>e.target.style.display="none"}/>
                          </div>
                        : <div style={{width:34,height:34,borderRadius:"50%",background:cs.acBg,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:11,fontWeight:700,color:cs.accent}}>{u.sigla}</div>
                      }
                      <span style={{
                        position:"absolute", bottom:0, right:0,
                        width:10, height:10, borderRadius:"50%",
                        background: online ? "#00ff6e" : cs.dim,
                        border:`2px solid ${cs.s1}`,
                      }}/>
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:600}}>{u.nome}</div>
                      <div style={{fontSize:10, color: online ? cs.green : cs.dim}}>
                        {online ? "● online" : "offline"}
                      </div>
                    </div>
                    {badge > 0 && (
                      <span style={{background:cs.accent, color:"#fff",
                        borderRadius:8, fontSize:9, padding:"2px 6px", fontWeight:700}}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : view === "global" ? (
            <>
              <ChatMsgs msgs={curMsgs} myId={myId} cs={cs} endRef={endRef} fmtTime={fmtTime}/>
              <ChatInput input={input} setInput={setInput} onSend={sendMsg} cs={cs}/>
            </>
          ) : (
            /* DM conversation */
            <>
              <div style={{display:"flex", alignItems:"center", gap:8,
                padding:"8px 12px", borderBottom:`1px solid ${cs.faint}`, flexShrink:0}}>
                <button onClick={()=>setView("dms")}
                  style={{background:"none",border:"none",color:cs.dim,
                    cursor:"pointer",fontSize:18,lineHeight:1,padding:0}}>‹</button>
                {(() => {
                  const u = allUsers.find(u=>u.id===view);
                  if (!u) return null;
                  return (
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <div style={{position:"relative"}}>
                        {u.foto
                          ? <div style={{width:26,height:26,borderRadius:"50%",overflow:"hidden"}}>
                              <img src={u.foto} alt={u.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}
                                onError={e=>e.target.style.display="none"}/>
                            </div>
                          : <div style={{width:26,height:26,borderRadius:"50%",background:cs.acBg,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:9,fontWeight:700,color:cs.accent}}>{u.sigla}</div>
                        }
                        <span style={{position:"absolute",bottom:0,right:0,
                          width:8,height:8,borderRadius:"50%",
                          background:isOnline(u.id)?"#00ff6e":cs.dim,
                          border:`2px solid ${cs.s1}`}}/>
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:cs.text}}>{u.nome}</div>
                        <div style={{fontSize:10,color:isOnline(u.id)?cs.green:cs.dim}}>
                          {isOnline(u.id)?"● online":"offline"}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <ChatMsgs msgs={curMsgs} myId={myId} cs={cs} endRef={endRef} fmtTime={fmtTime}/>
              <ChatInput input={input} setInput={setInput} onSend={sendMsg} cs={cs}/>
            </>
          )}
        </div>
      )}
    </>
  );
}

function ChatMsgs({ msgs, myId, cs, endRef, fmtTime }) {
  return (
    <div style={{flex:1, overflow:"auto", padding:"10px 12px",
      display:"flex", flexDirection:"column", gap:8}}>
      {msgs.length === 0 && (
        <div style={{color:cs.dim, fontSize:12, textAlign:"center", marginTop:24}}>
          Nenhuma mensagem ainda. Diga oi! 👋
        </div>
      )}
      {msgs.map(m => {
        const isMe = m.fromId === myId;
        return (
          <div key={m.id} style={{display:"flex", flexDirection:"column",
            alignItems: isMe ? "flex-end" : "flex-start"}}>
            {!isMe && (
              <div style={{fontSize:10, color:cs.dim, marginBottom:2, paddingLeft:4}}>
                {m.fromName}
              </div>
            )}
            <div style={{
              background: isMe ? cs.accent : cs.s3,
              color: isMe ? "#fff" : cs.text,
              padding:"7px 11px",
              borderRadius: isMe ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              maxWidth:"82%", fontSize:12, lineHeight:1.4,
              wordBreak:"break-word",
            }}>{m.text}</div>
            <div style={{fontSize:10, color:cs.dim, marginTop:2,
              paddingLeft:4, paddingRight:4}}>
              {fmtTime(m.ts)}
            </div>
          </div>
        );
      })}
      <div ref={endRef}/>
    </div>
  );
}

function ChatInput({ input, setInput, onSend, cs }) {
  return (
    <div style={{padding:"8px 12px", borderTop:`1px solid ${cs.faint}`,
      display:"flex", gap:8, flexShrink:0, background:cs.s2}}>
      <input
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onSend();}}}
        placeholder="Mensagem..."
        style={{
          flex:1, background:cs.s1,
          border:`1px solid ${cs.b}`,
          borderRadius:20, color:cs.text,
          padding:"7px 14px", fontSize:12,
          fontFamily:"inherit", outline:"none",
        }}
      />
      <button onClick={onSend}
        style={{
          background:cs.accent, border:"none",
          borderRadius:"50%", width:34, height:34,
          cursor:"pointer", fontSize:16, color:"#fff",
          display:"flex", alignItems:"center",
          justifyContent:"center", flexShrink:0,
        }}>↑</button>
    </div>
  );
}


// ── Supabase Storage ─────────────────────────────────────────────────────
const SUPABASE_URL = "https://otuaojndrwreslvmgqta.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWFvam5kcndyZXNsdm1ncXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzMwMjEsImV4cCI6MjA5NzA0OTAyMX0.DqFszTE4nd6-3TbImOECURrYMk27RIaFtxIHEsDsDTI";

const sbFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const save = async (k, v) => {
  // Cache local imediato
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {}
  // Supabase como fonte de verdade (upsert)
  try {
    await sbFetch("kv_store", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ key: k, value: JSON.stringify(v), updated_at: new Date().toISOString() }),
    });
  } catch (_) {}
};

const load = async (k, d = null) => {
  // Supabase primeiro
  try {
    const rows = await sbFetch(`kv_store?key=eq.${encodeURIComponent(k)}&select=value`);
    if (rows && rows.length > 0) {
      const v = JSON.parse(rows[0].value);
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {}
      return v;
    }
  } catch (_) {}
  // Fallback: localStorage
  try {
    const lv = localStorage.getItem(k);
    if (lv !== null) return JSON.parse(lv);
  } catch (_) {}
  return d;
};

const loadAll = async () => {
  try {
    const rows = await sbFetch("kv_store?select=key,value");
    if (!rows || rows.length === 0) return null;
    const data = {};
    rows.forEach((r) => {
      try { data[r.key] = JSON.parse(r.value); } catch (_) {}
    });
    return data;
  } catch (_) {
    return null;
  }
};

// ── Tiny UI primitives ──────────────────────────────────────────────────
function Label({ c, ...p }) {
  const cs = useC();
  return (
    <div
      style={{
        fontSize: 10,
        color: c ?? cs.muted,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 7,
        fontFamily: cs.fontBase,
        ...p.style,
      }}
    >
      {p.children}
    </div>
  );
}

const Badge = ({ label, color, bg, style = {} }) => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      color,
      background: bg,
      border: `1px solid ${color}44`,
      padding: "2px 9px",
      borderRadius: 3,
      ...style,
    }}
  >
    {label}
  </span>
);

function Divider({ style = {} }) {
  const cs = useC();
  return <div style={{ borderBottom: `1px solid ${cs.faint}`, ...style }} />;
}

function Avatar({ sigla, size = 32, style = {} }) {
  const cs = useC();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: cs.acBg,
        border: `1px solid ${cs.acA33}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.3,
        fontWeight: 700,
        color: cs.accent,
        flexShrink: 0,
        fontFamily: cs.fontDestaque,
        ...style,
      }}
    >
      {sigla}
    </div>
  );
}

function Btn({
  onClick,
  children,
  variant = "ghost",
  small,
  disabled,
  style = {},
}) {
  const cs = useC();
  const base = {
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 4,
    fontSize: small ? 11 : 12,
    fontWeight: 500,
    opacity: disabled ? 0.4 : 1,
    transition: "opacity 0.15s",
    border: "none",
    fontFamily: "inherit",
  };
  const v = {
    ghost: {
      background: "transparent",
      border: `1px solid ${cs.b2}`,
      color: cs.muted,
      padding: small ? "4px 10px" : "7px 16px",
    },
    primary: {
      background: cs.acBg,
      border: `1px solid ${cs.acA44}`,
      color: cs.accent,
      padding: small ? "4px 10px" : "7px 16px",
    },
    success: {
      background: cs.grBg,
      border: `1px solid ${cs.grA44}`,
      color: cs.green,
      padding: small ? "4px 10px" : "7px 16px",
    },
    danger: {
      background: cs.redBg,
      border: `1px solid ${cs.redA44}`,
      color: cs.red,
      padding: small ? "4px 10px" : "7px 16px",
    },
    purple: {
      background: cs.purBg,
      border: `1px solid ${cs.purA44}`,
      color: cs.purple,
      padding: small ? "4px 10px" : "7px 16px",
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...v[variant], ...style }}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, width = 560 }) {
  const cs = useC();
  const theme = useContext(ThemeCtx);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: 16,
      }}
    >
      <div
        style={{
          background: cs.s1,
          border: `1px solid ${cs.b}`,
          borderRadius: 8,
          width: "100%",
          maxWidth: width,
          maxHeight: "85vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: `1px solid ${cs.faint}`,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              fontFamily: cs.fontDestaque,
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: cs.dim,
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  const cs = useC();
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: cs.s2,
        border: `1px solid ${cs.b}`,
        color: cs.text,
        padding: "9px 12px",
        borderRadius: 4,
        fontSize: 14,
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
}

function Select({ value, onChange, options, placeholder, style = {} }) {
  const cs = useC();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: cs.s2,
        border: `1px solid ${cs.b}`,
        color: value ? cs.text : cs.dim,
        padding: "9px 12px",
        borderRadius: 4,
        fontSize: 14,
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const cfg = STATUS_CFG[status] || STATUS_CFG["Enviado"];
  return <Badge label={status} color={cfg.color} bg={cfg.bg} />;
}

// ── Login Screen ────────────────────────────────────────────────────────
function LoginScreen({ onLogin, passwords, savePasswords }) {
  const cs = useC();
  const [step, setStep] = useState("role");
  const [colId, setColId] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [pendingCol, setPendingCol] = useState(null);

  const showErro = (msg) => {
    setErro(msg);
    setTimeout(() => setErro(""), 2800);
  };

  const handleGestor = () => {
    const gestor = GESTORES.find(g => g.email === email.trim() && g.senha === senha);
    if (gestor) onLogin({ role: "gestor", gestorEmail: gestor.email });
    else showErro("E-mail ou senha incorretos.");
  };

  const handleColunista = () => {
    if (!colId) return;
    const id = Number(colId);
    const senhaAtual = passwords[id] || "123456";
    if (senha !== senhaAtual) {
      showErro("Senha incorreta.");
      return;
    }
    if (senhaAtual === "123456") {
      setPendingCol(id);
      setSenha("");
      setNovaSenha("");
      setConfirma("");
      setStep("trocar");
    } else {
      onLogin({ role: "colunista", colId: id });
    }
  };

  const handleTrocarSenha = () => {
    if (novaSenha.length < 6) {
      showErro("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirma) {
      showErro("As senhas nao coincidem.");
      return;
    }
    if (novaSenha === "123456") {
      showErro("Escolha uma senha diferente da padrao.");
      return;
    }
    const updated = { ...passwords, [pendingCol]: novaSenha };
    savePasswords(updated);
    onLogin({ role: "colunista", colId: pendingCol });
  };

  const col = pendingCol ? COLUMNISTS.find((c) => c.id === pendingCol) : null;
  const ErrBox = () =>
    erro ? (
      <div
        style={{
          background: cs.redBg,
          border: `1px solid ${cs.redA44}`,
          borderRadius: 4,
          padding: "8px 12px",
          fontSize: 12,
          color: cs.red,
          marginBottom: 12,
        }}
      >
        {erro}
      </div>
    ) : null;

  return (
    <div
      style={{
        background: cs.bg,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: cs.fontBase,
      }}
    >
      <div
        style={{
          width: 420,
          background: cs.s1,
          border: `1px solid ${cs.b}`,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Barra de Arco-Íris [SSEX BBOX] */}
        <div style={{ height: 6, background: cs.gradient, width: "100%" }} />

        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: `1px solid ${cs.faint}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: cs.accent,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 8,
              fontFamily: cs.fontDestaque,
            }}
          >
            [SSEX BBOX]
          </div>
          <div
            style={{
              fontSize: 21,
              fontWeight: 700,
              color: cs.text,
              fontFamily: cs.fontDestaque,
            }}
          >
            Gestão Editorial
          </div>
          <div style={{ fontSize: 12, color: cs.muted, marginTop: 4 }}>
            Noves Colunistas 2026
          </div>
        </div>
        <div style={{ padding: 24 }}>
          {step === "role" && (
            <>
              <Label>Como voce entra?</Label>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <button
                  onClick={() => {
                    setStep("gestor");
                    setEmail("");
                    setSenha("");
                  }}
                  style={{
                    background: cs.s2,
                    border: `1px solid ${cs.acA33}`,
                    borderRadius: 6,
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: cs.text,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ color: cs.accent }}>Gestor</span>
                  </div>
                  <div style={{ fontSize: 11, color: cs.muted }}>
                    Painel completo: textos, ideias, contrapartidas, calendario
                  </div>
                </button>
                <button
                  onClick={() => {
                    setStep("colunista");
                    setColId("");
                    setSenha("");
                  }}
                  style={{
                    background: cs.s2,
                    border: `1px solid ${cs.purA33}`,
                    borderRadius: 6,
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: cs.text,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ color: cs.purple }}>Colunista</span>
                  </div>
                  <div style={{ fontSize: 11, color: cs.muted }}>
                    Enviar textos, acompanhar publicacoes e contrapartidas
                  </div>
                </button>
              </div>
            </>
          )}

          {step === "gestor" && (
            <>
              <Label>Acesso Gestor</Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Input
                  value={email}
                  onChange={setEmail}
                  placeholder="E-mail"
                  type="email"
                />
                <Input
                  value={senha}
                  onChange={setSenha}
                  placeholder="Senha"
                  type="password"
                />
              </div>
              <ErrBox />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  onClick={() => {
                    setStep("role");
                    setErro("");
                  }}
                >
                  ← Voltar
                </Btn>
                <Btn
                  variant="primary"
                  onClick={handleGestor}
                  disabled={!email || !senha}
                >
                  Entrar
                </Btn>
              </div>
            </>
          )}

          {step === "colunista" && (
            <>
              <Label>Acesso Colunista</Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Select
                  value={colId}
                  onChange={setColId}
                  placeholder="selecione seu nome"
                  options={COLUMNISTS.map((c) => ({
                    value: String(c.id),
                    label: c.nome,
                  }))}
                />
                <Input
                  value={senha}
                  onChange={setSenha}
                  placeholder="Senha"
                  type="password"
                />
              </div>
              <ErrBox />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  onClick={() => {
                    setStep("role");
                    setErro("");
                  }}
                >
                  ← Voltar
                </Btn>
                <Btn
                  variant="purple"
                  onClick={handleColunista}
                  disabled={!colId || !senha}
                >
                  Entrar
                </Btn>
              </div>
            </>
          )}

          {step === "trocar" && col && (
            <>
              <div
                style={{
                  background: cs.amBg,
                  border: `1px solid ${cs.amA44}`,
                  borderRadius: 6,
                  padding: "12px 14px",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: cs.amber,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Primeiro acesso
                </div>
                <div style={{ fontSize: 12, color: cs.muted }}>
                  Ola,{" "}
                  <strong style={{ color: cs.text }}>
                    {col.nome.split(" ")[0]}
                  </strong>
                  ! Por seguranca, crie uma senha pessoal antes de continuar.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div>
                  <Label>Nova senha (min. 6 caracteres)</Label>
                  <Input
                    value={novaSenha}
                    onChange={setNovaSenha}
                    placeholder="Nova senha"
                    type="password"
                  />
                </div>
                <div>
                  <Label>Confirmar nova senha</Label>
                  <Input
                    value={confirma}
                    onChange={setConfirma}
                    placeholder="Repita a senha"
                    type="password"
                  />
                </div>
              </div>
              <ErrBox />
              <Btn
                variant="purple"
                onClick={handleTrocarSenha}
                disabled={!novaSenha || !confirma}
                style={{
                  width: "100%",
                  padding: "10px",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                Salvar senha e entrar
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── NavBar ──────────────────────────────────────────────────────────────
function NavBar({
  user,
  colunista,
  activeTab,
  setActiveTab,
  notifCount,
  onLogout,
  gsStatus,
  contraExtra={},
  theme="dark",
  setTheme,
}) {
  const cs = useC();
  const gestorTabs = [
    { id: "painel", label: "Painel" },
    { id: "ideias", label: "Banco de Ideias" },
    { id: "briefing", label: "Briefing" },
    { id: "contrapartidas", label: "Contrapartidas" },
    { id: "calendario", label: "Calendário" },
    { id: "colunistas", label: "Colunistas" },
    { id: "leituras", label: "Leituras" },
    { id: "trilha", label: "Trilha" },
  ];
  const coliTabs = [
    { id: "enviar", label: "Enviar Texto" },
    { id: "meus", label: "Meus Textos" },
    { id: "calendario", label: "Meu Calendário" },
    { id: "contrapartidas", label: "Contrapartidas" },
    { id: "leituras", label: "Leituras" },
    { id: "trilha", label: "Trilha" },
  ];
  const tabs = user.role === "gestor" ? gestorTabs : coliTabs;
  return (
    <div
      style={{
        background: cs.s1,
        borderBottom: `1px solid ${cs.faint}`,
        position: "sticky",
        top: 0,
        zIndex: 90,
        boxShadow: theme === "light" ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Barra de Arco-Íris [SSEX BBOX] */}
      <div
        style={{
          height: theme === "light" ? 5 : 4,
          background: cs.gradient,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 20px 0 20px", // Acomoda a barra superior
          height: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: cs.accent,
              textTransform: "uppercase",
              fontFamily: cs.fontDestaque,
            }}
          >
            [SSEX BBOX]
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === t.id ? cs.text : cs.dim,
                  padding: "0 12px",
                  height: 48,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: activeTab === t.id ? 600 : 400,
                  borderBottom: activeTab === t.id ? `3px solid transparent` : "2px solid transparent",
                  borderImage: activeTab === t.id ? `${cs.gradient} 1` : "none",
                  transition: "color 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {t.label}
                {t.id === "painel" && notifCount > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      background: cs.accent,
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: 9,
                      padding: "1px 5px",
                      fontWeight: 700,
                    }}
                  >
                    {notifCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {colunista && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {contraExtra?.[colunista.id]?.foto
                ? <div style={{width:28,height:28,borderRadius:"50%",overflow:"hidden",border:`1px solid ${cs.acA44}`,flexShrink:0}}><img src={contraExtra[colunista.id].foto} alt={colunista.nome} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/></div>
                : <Avatar sigla={colunista.sigla} size={26} />
              }
              <span style={{ fontSize: 12, color: cs.muted }}>
                {colunista.nome}
              </span>
            </div>
          )}
          {user.role === "gestor" && (
            <span
              style={{
                fontSize: 12,
                color: cs.muted,
                background: cs.acBg,
                border: `1px solid ${cs.acA33}`,
                padding: "3px 10px",
                borderRadius: 3,
              }}
            >
              Gestor
            </span>
          )}
          <span
            style={{
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color:
                gsStatus === "conectado"
                  ? cs.green
                  : gsStatus === "offline"
                  ? cs.amber
                  : cs.dim,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  gsStatus === "conectado"
                    ? cs.green
                    : gsStatus === "offline"
                    ? cs.amber
                    : cs.dim,
                display: "inline-block",
              }}
            />
            {gsStatus === "conectado"
              ? "Sheets"
              : gsStatus === "offline"
              ? "cache local"
              : "..."}
          </span>
          <button onClick={()=>setTheme&&setTheme(t=>t==="dark"?"light":"dark")}
            style={{background:"none",border:`1px solid ${cs.faint}`,color:cs.dim,borderRadius:4,cursor:"pointer",fontSize:12,padding:"4px 10px",fontFamily:"inherit"}}>
            {theme==="dark"?"☀️":"🌙"}
          </button>
          <Btn small onClick={onLogout}>
            Sair
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────

function StatCard({ label, value, color, sub }) {
  const cs = useC();
  const theme = useContext(ThemeCtx);
  return (
    <div
      style={{
        background: cs.s1,
        border: theme === "light" ? "none" : `1px solid ${cs.faint}`,
        borderRadius: 6,
        padding: "14px 16px",
        flex: 1,
        minWidth: 100,
        boxShadow: theme === "light" ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 11, color: cs.muted, marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color,
          lineHeight: 1,
          fontFamily: cs.fontDestaque,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: cs.dim, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

// ── GESTOR: Painel ──────────────────────────────────────────────────────

// ── ProfileCard ─────────────────────────────────────────────────────────
function ProfileCard({ nome, pronomes, foto, descricao, bioLink, instagram="", twitter="", linkedin="", onEdit, editMode=false, editData, setEditData, onSave }) {
  const cs = useC();
  const theme = useContext(ThemeCtx);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({foto:"",descricao:"",bioLink:"",pronomes:"",instagram:"",twitter:"",linkedin:""});

  const startEdit = () => {
    setDraft({foto:foto||"",descricao:descricao||"",bioLink:bioLink||"",pronomes:pronomes||"",instagram:instagram||"",twitter:twitter||"",linkedin:linkedin||""});
    setEditing(true);
  };

  const saveEdit = () => {
    onEdit(draft);
    setEditing(false);
  };

  const firstName = nome?.split(" ")[0] || nome;

  return (
    <div style={{background:cs.s1,border:theme==="light"?"1px solid #E0E0E0":`1px solid ${cs.faint}`,borderRadius:10,padding:"20px 24px",marginBottom:20,display:"flex",gap:20,alignItems:"flex-start",position:"relative",boxShadow:theme==="light"?"0 1px 10px rgba(0,0,0,0.06)":"none",borderTop:theme==="light"?"3px solid transparent":undefined,backgroundImage:theme==="light"?`linear-gradient(${cs.s1}, ${cs.s1}), ${GRADIENT}`:undefined,backgroundOrigin:theme==="light"?"border-box":undefined,backgroundClip:theme==="light"?"padding-box, border-box":undefined}}>
      {/* Photo */}
      <div style={{width:80,height:80,borderRadius:"50%",background:cs.s2,border:`2px solid ${cs.acA44}`,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {foto
          ?<img src={foto} alt={nome} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          :<span style={{fontSize:24,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque}}>{nome?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
        }
      </div>
      {/* Info */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,color:cs.accent,marginBottom:2}}>Oi, {firstName}! 👋</div>
        <div style={{fontSize:20,fontWeight:700,fontFamily:cs.fontDestaque,color:cs.text,marginBottom:2}}>{nome}</div>
        {pronomes&&<div style={{fontSize:12,color:cs.dim,marginBottom:6}}>{pronomes}</div>}
        {descricao&&<div style={{fontSize:13,color:cs.muted,marginBottom:6}}>{descricao}</div>}
        {bioLink&&(
          bioLink.startsWith("http")
            ?<a href={bioLink} target="_blank" rel="noreferrer" style={{fontSize:12,color:cs.accent,wordBreak:"break-all"}}>{bioLink}</a>
            :<div style={{fontSize:12,color:cs.muted,fontStyle:"italic"}}>{bioLink.slice(0,200)}{bioLink.length>200?"...":""}</div>
        )}
        {(instagram||twitter||linkedin)&&(
          <div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}>
            {instagram&&<a href={instagram.startsWith("http")?instagram:`https://instagram.com/${instagram.replace("@","")}`} target="_blank" rel="noreferrer" style={{fontSize:11,color:cs.accent}}>📷 {instagram}</a>}
            {twitter&&<a href={twitter.startsWith("http")?twitter:`https://twitter.com/${twitter.replace("@","")}`} target="_blank" rel="noreferrer" style={{fontSize:11,color:cs.accent}}>𝕏 {twitter}</a>}
            {linkedin&&<a href={linkedin.startsWith("http")?linkedin:`https://linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer" style={{fontSize:11,color:cs.accent}}>in {linkedin}</a>}
          </div>
        )}
      </div>
      {/* Edit button */}
      <button onClick={startEdit} style={{background:"none",border:`1px solid ${cs.faint}`,color:cs.dim,borderRadius:4,cursor:"pointer",fontSize:11,padding:"4px 10px",flexShrink:0}}>✎ Editar perfil</button>

      {/* Edit modal */}
      {editing&&(
        <Modal title="Editar Perfil" onClose={()=>setEditing(false)} width={560}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:70,height:70,borderRadius:"50%",background:cs.s2,border:`1px solid ${cs.faint}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {draft.foto
                  ?<img src={draft.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<span style={{fontSize:20,fontWeight:700,color:cs.accent}}>{nome?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                }
              </div>
              <div style={{flex:1}}><Label>URL da Foto (300×300)</Label>
                <Input value={draft.foto} onChange={v=>setDraft(d=>({...d,foto:v}))} placeholder="https://..."/>
              </div>
            </div>
            <div><Label>Pronomes</Label>
              <Input value={draft.pronomes} onChange={v=>setDraft(d=>({...d,pronomes:v}))} placeholder="Ex: ela/dela, ele/dele, elu/delu"/>
            </div>
            <div>
              <Label>Descrição curta (até 100 caracteres)</Label>
              <Input value={draft.descricao} onChange={v=>setDraft(d=>({...d,descricao:v.slice(0,100)}))} placeholder="Uma frase sobre você..."/>
              <div style={{fontSize:10,color:cs.dim,marginTop:3,textAlign:"right"}}>{(draft.descricao||"").length}/100</div>
            </div>
            <div>
              <Label>Bio / Link de apresentação</Label>
              <textarea value={draft.bioLink} onChange={e=>setDraft(d=>({...d,bioLink:e.target.value.slice(0,1000)}))}
                placeholder="https://... ou texto de apresentação"
                style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:60,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Label>Instagram</Label><Input value={draft.instagram||""} onChange={v=>setDraft(d=>({...d,instagram:v}))} placeholder="@usuario ou URL"/></div>
              <div style={{flex:1}}><Label>Twitter / X</Label><Input value={draft.twitter||""} onChange={v=>setDraft(d=>({...d,twitter:v}))} placeholder="@usuario ou URL"/></div>
            </div>
            <div><Label>LinkedIn</Label><Input value={draft.linkedin||""} onChange={v=>setDraft(d=>({...d,linkedin:v}))} placeholder="usuario ou URL"/></div>
            <Btn variant="primary" onClick={saveEdit}>Salvar perfil</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PainelTab({ texts, updateTextStatus, notifications, markNotifRead, contraExtra={}, gestorProfile={}, setGestorProfile, user }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const theme = useContext(ThemeCtx);
  const totalTexts = texts.length;
  const entregues = texts.filter(t=>t.status==="Enviado"||t.status==="Em Revisão").length;
  const publicados = texts.filter(t=>t.status==="Publicado").length;
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [colFilter, setColFilter] = useState(0);
  const [detail, setDetail] = useState(null);
  const [editField, setEditField] = useState({
    briefing: "",
    prazo: "",
    link: "",
  });
  const unread = notifications.filter((n) => !n.lida);
  const filtered = texts.filter((t) => {
    if(colFilter && t.colId !== colFilter) return false;
    if (filter !== "todos" && t.status !== filter) return false;
    if (
      search &&
      !t.titulo.toLowerCase().includes(search.toLowerCase()) &&
      !t.colunistaNome.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });
  const counts = [
    "Enviado",
    "Em Revisão",
    "Publicado",
    "Rejeitado",
    "Pendente",
  ].reduce(
    (a, s) => ({ ...a, [s]: texts.filter((t) => t.status === s).length }),
    {}
  );

  const openDetail = (t) => {
    setDetail(t);
    setEditField({
      briefing: t.briefing || "",
      prazo: t.prazo || t.dataEntrega || "",
      link: t.link || "",
    });
  };
  const saveEdit = () => {
    const updated = { ...detail, ...editField };
    updateTextStatus(detail.id, detail.status, editField);
    setDetail(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      {(()=>{
        // Busca perfil base do gestor logado + sobrescreve com edições salvas
        const baseGestor = GESTORES.find(g=>g.email===user?.gestorEmail) || GESTORES[0];
        const perfil = {...baseGestor, ...gestorProfile};
        return (
          <ProfileCard
            nome={perfil.nome}
            pronomes={perfil.pronomes}
            foto={perfil.foto}
            descricao={perfil.descricao}
            bioLink={perfil.bioLink}
            onEdit={(d)=>setGestorProfile({...gestorProfile,...d})}
          />
        );
      })()}
      {(()=>{
        const comBriefing = texts.filter(t=>t.briefing&&t.briefing.trim()).length;
        const comLink = texts.filter(t=>t.link&&t.link.trim()).length;
        const colAtivos = new Set(texts.filter(t=>t.status!=="Publicado").map(t=>t.colId)).size;
        const proxPub = texts.filter(t=>t.dataPublicacao&&t.status!=="Publicado").sort((a,b)=>a.dataPublicacao.localeCompare(b.dataPublicacao))[0];
        const proxCol = proxPub ? COLUMNISTS.find(c=>c.id===proxPub.colId) : null;
        const proxFoto = proxPub ? (contraExtra[proxPub.colId]||{}).foto : null;
        return (
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"12px 16px",flex:2,minWidth:200}}>
              <div style={{fontSize:10,color:cs.dim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Próxima Publicação</div>
              {proxPub ? (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {proxFoto
                    ? <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><img src={proxFoto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                    : <Avatar sigla={proxCol?.sigla||"?"} size={36}/>
                  }
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:cs.text}}>{proxCol?.nome||proxPub.colunistaNome}</div>
                    <div style={{fontSize:11,color:cs.accent}}>{proxPub.dataPublicacao}</div>
                    <div style={{fontSize:10,color:cs.dim,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:200}}>{proxPub.titulo}</div>
                  </div>
                </div>
              ) : <div style={{fontSize:13,color:cs.dim}}>Nenhuma agendada</div>}
            </div>
            {[
              {label:"Com Briefing",val:comBriefing,color:cs.purple,sub:`de ${texts.length}`},
              {label:"Link Enviado",val:comLink,color:cs.green,sub:`de ${texts.length}`},
              {label:"Colunistas Ativos",val:colAtivos,color:cs.amber,sub:`de ${COLUMNISTS.length}`},
            ].map(({label,val,color,sub})=>(
              <div key={label} style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"12px 16px",flex:1,minWidth:120}}>
                <div style={{fontSize:10,color:cs.dim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{label}</div>
                <div style={{fontSize:24,fontWeight:700,fontFamily:cs.fontDestaque,color}}>{val}</div>
                <div style={{fontSize:10,color:cs.dim,marginTop:2}}>{sub}</div>
              </div>
            ))}
          </div>
        );
      })()}
      {unread.length > 0 && (
        <div
          style={{
            background: cs.acBg,
            border: `1px solid ${cs.acA33}`,
            borderRadius: 6,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, color: cs.accent, fontWeight: 600 }}>
            🔔 {unread.length} nova{unread.length > 1 ? "s" : ""} notificação
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {unread.slice(0, 3).map((n) => (
              <div
                key={n.id}
                onClick={() => markNotifRead(n.id)}
                style={{
                  fontSize: 11,
                  color: cs.muted,
                  background: cs.s1,
                  border: `1px solid ${cs.faint}`,
                  borderRadius: 4,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                {n.mensagem.slice(0, 55)}…{" "}
                <span style={{ color: cs.accent }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <StatCard label="Total" value={texts.length} />
        <StatCard
          label="Tarefas"
          value={counts["Pendente"] || 0}
          color={cs.dim}
          sub="aguardando produção"
        />
        <StatCard
          label="Enviados"
          value={counts["Enviado"] || 0}
          color={cs.amber}
          sub="em fila de revisão"
        />
        <StatCard
          label="Em Revisão"
          value={counts["Em Revisão"] || 0}
          color={cs.purple}
          sub="com o gestor"
        />
        <StatCard
          label="Publicados"
          value={counts["Publicado"] || 0}
          color={cs.green}
          sub="no ar"
        />
      </div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}
      >
        <Input
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título ou colunista..."
          style={{ flex: 1, minWidth: 200 }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems:"center" }}>
          <select value={colFilter} onChange={e=>setColFilter(Number(e.target.value))}
            style={{background:cs.s1,border:`1px solid ${cs.b}`,color:colFilter?cs.text:cs.dim,padding:"5px 8px",borderRadius:4,fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>
            <option value={0}>Todos colunistas</option>
            {COLUMNISTS.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {[
            "todos",
            "Enviado",
            "Em Revisão",
            "Publicado",
            "Rejeitado",
            "Pendente",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? cs.s3 : "transparent",
                border: `1px solid ${filter === f ? cs.accent + "44" : cs.faint}`,
                color: filter === f ? cs.accent : cs.dim,
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              {f === "todos" ? `Todos (${texts.length})` : f}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: cs.dim }}>
          Nenhum texto encontrado.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((t) => {
            const ec = ED_COLORS[t.editoria] || cs.muted;
            return (
              <div
                key={t.id}
                onClick={() => openDetail(t)}
                style={{
                  background: cs.s1,
                  border: (() => { if(!t.dataEntrega) return `1px solid ${cs.faint}`; const dl=Math.ceil((new Date(t.dataEntrega)-new Date())/(1000*60*60*24)); if(dl<0) return `1px solid ${cs.red}`; if(dl<=3) return `1px solid ${cs.amber}`; return `1px solid ${cs.faint}`; })(),
                  borderLeft: `4px solid ${ec}`,
                  borderRadius: 4,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                }}
              >
                {(()=>{
                  const col=COLUMNISTS.find(c=>c.id===t.colId);
                  const foto=(contraExtra[t.colId]||{}).foto;
                  if(foto) return <div style={{width:30,height:30,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`1px solid ${cs.acA33}`}}><img src={foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>;
                  return <Avatar sigla={col?.sigla||"?"} size={30}/>;
                })()}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: cs.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.titulo}
                  </div>
                  <div style={{ fontSize: 11, color: cs.muted, marginTop: 2 }}>
                    {t.colunistaNome} ·{" "}
                    <span style={{ color: ec }}>{t.editoria}</span>
                  </div>
                  {t.briefing && (
                    <div
                      style={{
                        fontSize: 11,
                        color: cs.dim,
                        marginTop: 2,
                        fontStyle: "italic",
                      }}
                    >
                      {t.briefing.startsWith("http") ? "Briefing: " : "Briefing: "}
                      {t.briefing.startsWith("http")
                        ? t.briefing.slice(0, 50) + (t.briefing.length > 50 ? "..." : "")
                        : t.briefing.slice(0, 60) + (t.briefing.length > 60 ? "..." : "")}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {(t.prazo || t.dataEntrega) && (
                    <span style={{ fontSize: 11, color: cs.dim }}>
                      {t.prazo || t.dataEntrega}
                    </span>
                  )}
                  <StatusBadge status={t.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {detail && (
        <Modal
          title="Detalhes do Texto"
          onClose={() => setDetail(null)}
          width={620}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar
                sigla={
                  COLUMNISTS.find((c) => c.id === detail.colId)?.sigla || "?"
                }
                size={40}
              />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {detail.titulo}
                </div>
                <div style={{ fontSize: 12, color: cs.muted, marginTop: 2 }}>
                  {detail.colunistaNome} · {detail.editoria}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <Label>Submetido em</Label>
                <div style={{ fontSize: 13 }}>{detail.dataSubmissao}</div>
              </div>
              <div style={{ flex: 1 }}>
                <Label>Status</Label>
                <StatusBadge status={detail.status} />
              </div>
            </div>
            {detail.link && (
              <div>
                <Label>Link do Colunista</Label>
                <a
                  href={detail.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: cs.accent,
                    wordBreak: "break-all",
                  }}
                >
                  {detail.link}
                </a>
              </div>
            )}
            <div
              style={{
                background: cs.s2,
                borderRadius: 6,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Label c={cs.accent}>Editar Tarefa</Label>
              <div>
                <Label>Briefing</Label>
                <textarea
                  value={editField.briefing}
                  onChange={(e) => setEditField((f) => ({ ...f, briefing: e.target.value }))}
                  placeholder="Link, instruções ou contexto para o colunista..."
                  style={{width:"100%",background:cs.s1,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:80,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}
                />
              </div>
              <div>
                <Label>Feedback / Retorno</Label>
                <textarea
                  value={editField.feedback||""}
                  onChange={(e) => setEditField((f) => ({ ...f, feedback: e.target.value }))}
                  placeholder="Aprovado, precisa de ajustes, comentários..."
                  style={{width:"100%",background:cs.s1,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:60,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Label>Prazo / Data de Entrega</Label>
                  <Input
                    type="date"
                    value={editField.prazo}
                    onChange={(v) => setEditField((f) => ({ ...f, prazo: v }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label>Link Publicado</Label>
                  <Input
                    value={editField.link}
                    onChange={(v) => setEditField((f) => ({ ...f, link: v }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <Btn variant="primary" onClick={saveEdit}>
                Salvar alterações
              </Btn>
            </div>
            <div>
              <Label>Atualizar status</Label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Em Revisão", "Publicado", "Rejeitado"].map((s) => {
                  const cfg = STATUS_CFG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        updateTextStatus(detail.id, s, editField);
                        setDetail({ ...detail, status: s });
                      }}
                      style={{
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}44`,
                        color: cfg.color,
                        padding: "7px 14px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {detail?.statusHistory?.length > 0 && (
            <div style={{marginTop:8}}>
              <Label>Histórico</Label>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {[...(detail.statusHistory||[])].reverse().map((h,i)=>(
                  <div key={i} style={{fontSize:11,color:cs.dim,display:"flex",gap:8}}>
                    <span style={{color:STATUS_CFG[h.status]?.color||cs.dim,fontWeight:600}}>{h.status}</span>
                    <span>{new Date(h.ts).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── GESTOR: Banco de Ideias ─────────────────────────────────────────────
function IdeiaTab({
  ideasStatus,
  setIdeaStatus,
  addText,
  gsTarefas,
  ideiasExtra,
  addIdeia,
  contraExtra={},
  texts=[],
  updateTextStatus,
}) {
  const cs = useC();
  const [filter, setFilter] = useState("todas");
  const [edFilter, setEdFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [sugestaoModal, setSugestaoModal] = useState(false);
  const [sugestaoOpen, setSugestaoOpen] = useState(false);
  const [novaPauta, setNovaPauta] = useState("");
  const [novaEd, setNovaEd] = useState("");
  const [novaCol, setNovaCol] = useState("");
  const [novaEsboco, setNovaEsboco] = useState("");
  const [editIdeia, setEditIdeia] = useState(null); // modal de edição de tarefa
  const [editIdeiaData, setEditIdeiaData] = useState({});

  const openEditIdeia = (idea) => {
    // Busca por key (mais confiável que título — títulos podem ter diferenças sutis)
    const texto = texts.find(t => t.key === idea.key) ||
                  texts.find(t => t.colId === idea.colId && t.titulo === idea.pauta);
    setEditIdeiaData({
      titulo: texto?.titulo || idea.pauta,
      editoria: texto?.editoria || idea.editoria,
      dataEntrega: texto?.dataEntrega || texto?.prazo || "",
      dataPublicacao: texto?.dataPublicacao || "",
      briefing: texto?.briefing || idea.esboco || "",
      link: texto?.link || "",
      status: texto?.status || "Pendente",
      _textoId: texto?.id ?? null,
    });
    setEditIdeia(idea);
  };

  const saveEditIdeia = () => {
    const id = editIdeiaData._textoId;
    if(id !== null && id !== undefined) {
      updateTextStatus(Number(id), editIdeiaData.status, {
        titulo: editIdeiaData.titulo,
        editoria: editIdeiaData.editoria,
        dataEntrega: editIdeiaData.dataEntrega,
        dataPublicacao: editIdeiaData.dataPublicacao,
        briefing: editIdeiaData.briefing,
        link: editIdeiaData.link,
      });
    } else {
      // Cria o texto se ainda não existe
      addText({
        colId: editIdeia.colId,
        colunistaNome: editIdeia.nome,
        titulo: editIdeiaData.titulo,
        editoria: editIdeiaData.editoria,
        dataEntrega: editIdeiaData.dataEntrega,
        dataPublicacao: editIdeiaData.dataPublicacao,
        briefing: editIdeiaData.briefing,
        link: editIdeiaData.link,
        obs: "Do banco de ideias",
        status: editIdeiaData.status || "Pendente",
      });
      setIdeaStatus(editIdeia.key, "em tarefa");
    }
    setEditIdeia(null);
  };

  const allIdeas = COLUMNISTS.flatMap((col) =>
    col.pautas.map((p, i) => {
      const key = `${col.id}_${i}`;
      return {
        key,
        colId: col.id,
        nome: col.nome,
        sigla: col.sigla,
        editoria: col.editorias[0] || "",
        pauta: p,
        status: texts.some(t=>t.key===key) ? "em tarefa" : (ideasStatus[key] || "disponível"),
      };
    })
  ).concat(
    (ideiasExtra || []).map((e, i) => ({
      key: `extra_${i}`,
      colId: e.colId,
      nome: e.nome,
      sigla: e.sigla || "?",
      editoria: e.editoria,
      pauta: e.pauta,
      status: ideasStatus[`extra_${i}`] || "sugestão",
    }))
  );

  const filtered = allIdeas.filter(
    (i) =>
      i.status !== "excluída" && (filter === "todas" || i.status === filter)
  );
  const byCol = COLUMNISTS.map((col) => ({
    col,
    ideas: filtered.filter((i) => i.colId === col.id),
  })).filter((g) => g.ideas.length > 0);

  const toggleSel = (key) =>
    setSelected((s) =>
      s.includes(key)
        ? s.filter((k) => k !== key)
        : [...key, ...s.filter((k) => k !== key), key].slice(-87)
    );
  const selectAll = () => {
    const keys = filtered.map((i) => i.key);
    setSelected(selected.length === keys.length ? [] : keys);
    setSelectMode(true);
  };
  const transformSelected = () => {
    filtered
      .filter((i) => selected.includes(i.key))
      .forEach((idea) => {
        addText({
          colId: idea.colId,
          colunistaNome: idea.nome,
          titulo: idea.pauta,
          editoria: idea.editoria,
          dataEntrega: "",
          obs: "Do banco de ideias",
          status: "Pendente",
        });
        setIdeaStatus(idea.key, "em tarefa");
      });
    setSelected([]);
    setSelectMode(false);
  };

  const ecolor = (ed) => ED_COLORS[ed] || cs.muted;

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 2,
              fontFamily: cs.fontDestaque,
            }}
          >
            Banco de Ideias
          </div>
          <div style={{ fontSize: 12, color: cs.muted }}>
            {allIdeas.length} pautas ·{" "}
            {allIdeas.filter((i) => i.status === "em tarefa").length} viraram
            tarefas
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Btn small onClick={() => setSugestaoOpen(s=>!s)} variant="primary">
            + Sugestão
          </Btn>
          <Btn
            small
            onClick={selectAll}
            variant={selectMode ? "purple" : "ghost"}
          >
            {selectMode && selected.length > 0
              ? `${selected.length} selecionadas`
              : "Selecionar Todas"}
          </Btn>
          {selectMode && selected.length > 0 && (
            <Btn small variant="success" onClick={transformSelected}>
              → Transformar ({selected.length})
            </Btn>
          )}
          {selectMode && (
            <Btn
              small
              onClick={() => {
                setSelectMode(false);
                setSelected([]);
              }}
            >
              Cancelar
            </Btn>
          )}
        </div>
      </div>
      {/* Filters */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
      >
        {["todas", "disponível", "em tarefa", "descartada", "sugestão"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? cs.s3 : "transparent",
                border: `1px solid ${filter === f ? cs.accent + "44" : cs.faint}`,
                color: filter === f ? cs.accent : cs.dim,
                padding: "5px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                textTransform: "capitalize",
                fontFamily: "inherit",
              }}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Suggestion Box — always visible above cards */}
      {sugestaoOpen && <div style={{background:cs.acBg,border:`2px solid ${cs.accent}`,borderRadius:8,padding:"16px 20px",marginBottom:24}}>
        <div style={{fontSize:14,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque,marginBottom:8}}>✦ Sugira uma nova pauta</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <Select value={novaCol} onChange={setNovaCol} placeholder="— colunista —"
            options={COLUMNISTS.map(c=>({value:String(c.id),label:c.nome}))}/>
          <Select value={novaEd} onChange={setNovaEd} placeholder="— editoria —"
            options={novaCol?(COLUMNISTS.find(c=>c.id===Number(novaCol))?.editorias||EDITORIAS).map(e=>({value:e,label:e})):EDITORIAS.map(e=>({value:e,label:e}))}/>
        </div>
        <Input value={novaPauta} onChange={setNovaPauta} placeholder="Ex: A invisibilidade bissexual nos espaços queer..." style={{marginBottom:10}}/>
        <textarea value={novaEsboco} onChange={e=>setNovaEsboco(e.target.value)}
          placeholder="Esboço: ângulo, argumento, abordagem proposta..."
          style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:70,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <Btn variant="primary" disabled={!novaCol||!novaPauta} onClick={()=>{
          if(!novaCol||!novaPauta)return;
          const col=COLUMNISTS.find(c=>c.id===Number(novaCol));
          addIdeia({colId:Number(novaCol),nome:col?.nome||"",sigla:col?.sigla||"?",editoria:novaEd||col?.editorias[0]||"",pauta:novaPauta,esboco:novaEsboco});
          setNovaPauta("");setNovaCol("");setNovaEd("");setNovaEsboco("");
        }}>Adicionar ao Banco de Ideias</Btn>
      </div>}

      {/* By columnist */}
      {byCol.map(({ col, ideas }) => (
        <div key={col.id} style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {(()=>{
              const foto=(contraExtra[col.id]||{}).foto;
              if(foto) return <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`1px solid ${cs.acA44}`}}><img src={foto} alt={col.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>;
              return <Avatar sigla={col.sigla} size={40}/>;
            })()}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: cs.text, fontFamily: cs.fontDestaque }}>
                {col.nome}
              </div>
              <div style={{ fontSize: 11, color: cs.dim }}>
                {col.pronomes} · {col.curso}
              </div>
            </div>
            <span style={{ fontSize: 11, color: cs.dim, marginLeft: "auto" }}>
              {ideas.length} pauta{ideas.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: 10,
            }}
          >
            {ideas.map((idea) => {
              const ec = ecolor(idea.editoria);
              const cfg_st =
                idea.status === "em tarefa"
                  ? { color: cs.green, bg: cs.grBg }
                  : idea.status === "descartada"
                  ? { color: cs.red, bg: cs.redBg }
                  : idea.status === "sugestão"
                  ? { color: cs.purple, bg: cs.purBg }
                  : { color: cs.amber, bg: cs.amBg };
              const isSel = selected.includes(idea.key);
              return (
                <div
                  key={idea.key}
                  onClick={() => selectMode ? toggleSel(idea.key) : openEditIdeia(idea)}
                  style={{
                    background: isSel ? cs.acBg : cs.s1,
                    border: `1px solid ${isSel ? cs.accent + "66" : cs.faint}`,
                    borderRadius: 6,
                    padding: 14,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {/* Editoria tag */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: ec,
                        background: ec + "18",
                        border: `1px solid ${ec}33`,
                        padding: "2px 8px",
                        borderRadius: 3,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        maxWidth: "70%",
                        lineHeight: 1.4,
                      }}
                    >
                      {idea.editoria.split(":")[0]}
                    </span>
                    <Badge
                      label={idea.status}
                      color={cfg_st.color}
                      bg={cfg_st.bg}
                    />
                    {idea.status==="em tarefa"&&(()=>{
                      const t=texts.find(tx=>tx.key===idea.key);
                      return t?.dataPublicacao?<span style={{fontSize:9,color:cs.accent,fontWeight:600}}>📅 {t.dataPublicacao}</span>:null;
                    })()}
                  </div>
                  {/* Pauta */}
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: cs.text,
                      lineHeight: 1.5,
                    }}
                  >
                    {idea.pauta}
                  </div>
                  {/* Actions */}
                  {!selectMode && (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginTop: "auto",
                      }}
                    >
                      {idea.status !== "em tarefa" && (
                        <Btn
                          small
                          variant="primary"
                          onClick={() => {
                            addText({
                              colId: idea.colId,
                              colunistaNome: idea.nome,
                              titulo: idea.pauta,
                              editoria: idea.editoria,
                              dataEntrega: "",
                              obs: "Do banco de ideias",
                              status: "Pendente",
                            });
                            setIdeaStatus(idea.key, "em tarefa");
                          }}
                        >
                          → Criar Tarefa
                        </Btn>
                      )}
                      {idea.status === "em tarefa" && (
                        <>
                          <Btn small variant="purple" onClick={()=>openEditIdeia(idea)}>Editar</Btn>
                          <Btn small onClick={() => setIdeaStatus(idea.key, "disponível")}>Reabrir</Btn>
                        </>
                      )}
                      {idea.status !== "descartada" && (
                        <Btn
                          small
                          variant="danger"
                          onClick={() => setIdeaStatus(idea.key, "descartada")}
                        >
                          Descartar
                        </Btn>
                      )}
                      {idea.status === "descartada" && (
                        <Btn
                          small
                          variant="danger"
                          style={{ background: cs.red, color: cs.text }}
                          onClick={() => setIdeaStatus(idea.key, "excluída")}
                        >
                          Excluir Definitivamente
                        </Btn>
                      )}
                    </div>
                  )}
                  {selectMode && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: isSel ? cs.accent : cs.dim,
                      }}
                    >
                      {isSel ? "✓ Selecionada" : "Clique para selecionar"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sugestão modal */}
      {sugestaoModal && (
        <Modal title="✦ Sugerir Nova Pauta" onClose={()=>setSugestaoModal(false)} width={580}>
          <div style={{background:cs.acBg,border:`1px solid ${cs.acA33}`,borderRadius:6,padding:"12px 14px",marginBottom:16}}>
            <div style={{fontSize:12,color:cs.accent,fontWeight:700,marginBottom:2}}>Destaque para uma nova ideia</div>
            <div style={{fontSize:12,color:cs.muted}}>A pauta vai para o banco com status "sugestão", visível para o gestor.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><Label>Colunista</Label>
              <Select value={novaCol} onChange={setNovaCol} placeholder="— selecione —" options={COLUMNISTS.map(c=>({value:String(c.id),label:c.nome}))}/>
            </div>
            <div><Label>Editoria</Label>
              <Select value={novaEd} onChange={setNovaEd} placeholder="— selecione —"
                options={novaCol?(COLUMNISTS.find(c=>c.id===Number(novaCol))?.editorias||EDITORIAS).map(e=>({value:e,label:e})):EDITORIAS.map(e=>({value:e,label:e}))}/>
            </div>
            <div><Label>Título / Pauta sugerida *</Label>
              <Input value={novaPauta} onChange={setNovaPauta} placeholder="Ex: Por que o gay preto é pra sexo e o gay branco é pra namoro?"/>
            </div>
            <div><Label>Esboço / Descrição da pauta</Label>
              <textarea value={novaEsboco} onChange={e=>setNovaEsboco(e.target.value)}
                placeholder="Ângulo, argumento principal, abordagem proposta..."
                style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:100,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <Btn variant="primary" disabled={!novaCol||!novaPauta} onClick={()=>{
              if(!novaCol||!novaPauta)return;
              const col=COLUMNISTS.find(c=>c.id===Number(novaCol));
              addIdeia({colId:Number(novaCol),nome:col?.nome||"",sigla:col?.sigla||"?",editoria:novaEd||col?.editorias[0]||"",pauta:novaPauta,esboco:novaEsboco});
              setNovaPauta("");setNovaCol("");setNovaEd("");setNovaEsboco("");setSugestaoModal(false);
            }}>Adicionar ao Banco de Ideias</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── GESTOR: Contrapartidas ──────────────────────────────────────────────
function ContrapartidasTab({
  contrapartidas,
  toggleContrapartida,
  texts,
  contraExtra,
  setContraExtra,
}) {
  const cs = useC();
  const [editCol, setEditCol] = useState(null);
  const [editData, setEditData] = useState({
    foto: "",
    descricao: "",
    obs: "",
  });
  const tipos = [
    { key: "certificadoHoras", label: "Cert. Horas" },
    { key: "acessoOficinas", label: "Oficinas" },
    { key: "certificadoFormacao", label: "Cert. Formação" },
  ];
  const total = COLUMNISTS.length * tipos.length;
  const done = COLUMNISTS.reduce(
    (acc, c) => acc + tipos.filter((t) => contrapartidas[c.id]?.[t.key]).length,
    0
  );

  const openEdit = (col) => {
    const ex = contraExtra[col.id] || {};
    setEditData({
      foto: ex.foto || "",
      descricao: ex.descricao || "",
      bioLink: ex.bioLink || "",
      obs: ex.obs || "",
    });
    setEditCol(col);
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 2,
              fontFamily: cs.fontDestaque,
            }}
          >
            Gestão de Contrapartidas
          </div>
          <div style={{ fontSize: 12, color: cs.muted }}>
            {done}/{total} itens concluídos ({Math.round((done / total) * 100)}
            %)
          </div>
        </div>
        <div
          style={{
            height: 4,
            flex: 1,
            maxWidth: 300,
            background: cs.faint,
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(done / total) * 100}%`,
              background: cs.green,
              borderRadius: 2,
              transition: "width 0.5s",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 14,
        }}
      >
        {COLUMNISTS.map((col) => {
          const cp = contrapartidas[col.id] || {};
          const ex = contraExtra[col.id] || {};
          const pub = texts.filter(
            (t) => t.colId === col.id && t.status === "Publicado"
          ).length;
          const allDone = tipos.every((t) => cp[t.key]);
          return (
            <div
              key={col.id}
              style={{
                background: cs.s1,
                border: `1px solid ${allDone ? cs.green + "44" : cs.faint}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Photo + name header */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 14px 10px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 6,
                    background: cs.s2,
                    border: `1px solid ${cs.faint}`,
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ex.foto ? (
                    <img
                      src={ex.foto}
                      alt={col.nome}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span
                      style={{ fontSize: 18, fontWeight: 700, color: cs.accent }}
                    >
                      {col.sigla}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: allDone ? cs.green : cs.text,
                    }}
                  >
                    {col.nome}
                  </div>
                  <div style={{ fontSize: 11, color: cs.dim, marginTop: 2 }}>
                    {col.pronomes}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: cs.green,
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    {pub} publicado{pub !== 1 ? "s" : ""}
                  </div>
                </div>
                <button
                  onClick={() => openEdit(col)}
                  style={{
                    background: "none",
                    border: `1px solid ${cs.faint}`,
                    color: cs.dim,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11,
                    padding: "3px 8px",
                    fontFamily: "inherit",
                  }}
                >
                  ✎ Editar
                </button>
              </div>
              {/* Contrapartidas toggles */}
              <div style={{ display: "flex", gap: 6, padding: "0 14px 10px" }}>
                {tipos.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => toggleContrapartida(col.id, t.key)}
                    style={{
                      flex: 1,
                      background: cp[t.key] ? cs.grBg : cs.s2,
                      border: `1px solid ${
                        cp[t.key] ? cs.green + "44" : cs.faint
                      }`,
                      color: cp[t.key] ? cs.green : cs.dim,
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: "6px 4px",
                      fontSize: 10,
                      fontWeight: cp[t.key] ? 700 : 400,
                      textAlign: "center",
                      fontFamily: "inherit",
                    }}
                  >
                    {cp[t.key] ? "✓ " : ""}
                    {t.label}
                  </button>
                ))}
              </div>
              {/* Description preview */}
              {(ex.descricao || ex.obs) && (
                <div style={{ padding: "0 14px 12px" }}>
                  {ex.descricao && (
                    <div
                      style={{
                        fontSize: 11,
                        color: cs.muted,
                        fontStyle: "italic",
                        marginBottom: 4,
                      }}
                    >
                      {ex.descricao.slice(0, 80)}
                      {ex.descricao.length > 80 ? "..." : ""}
                    </div>
                  )}
                  {ex.obs && (
                    <div style={{ fontSize: 11, color: cs.dim }}>
                      {ex.obs.slice(0, 60)}
                      {ex.obs.length > 60 ? "..." : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editCol && (
        <Modal
          title={`Editar — ${editCol.nome}`}
          onClose={() => setEditCol(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>URL da Foto (300×300)</Label>
              <Input
                value={editData.foto}
                onChange={(v) => setEditData((d) => ({ ...d, foto: v }))}
                placeholder="https://..."
              />
              {editData.foto && (
                <img
                  src={editData.foto}
                  alt="preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginTop: 8,
                    border: `1px solid ${cs.faint}`,
                  }}
                />
              )}
            </div>
            <div>
              <Label>Descrição / Bio</Label>
              <textarea
                value={editData.descricao}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, descricao: e.target.value }))
                }
                placeholder="Breve descrição do colunista..."
                style={{
                  width: "100%",
                  background: cs.s2,
                  border: `1px solid ${cs.b}`,
                  color: cs.text,
                  padding: "9px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  minHeight: 70,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <Label>Observações internas</Label>
              <textarea
                value={editData.obs}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, obs: e.target.value }))
                }
                placeholder="Notas internas, avisos, acordos..."
                style={{
                  width: "100%",
                  background: cs.s2,
                  border: `1px solid ${cs.b}`,
                  color: cs.text,
                  padding: "9px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  minHeight: 60,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <Btn
              variant="primary"
              onClick={() => {
                // Pass plain value — App's setContraExtra handles saving
                setContraExtra(prev => ({ ...prev, [editCol.id]: { ...editData } }));
                setEditCol(null);
              }}
            >
              Salvar perfil
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── GESTOR: Calendário ──────────────────────────────────────────────────
function CalendarioTab({ calendar, texts, calPautas, setCalPautas }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const START_YEAR = 2026;
  const START_MONTH = 5;
  const months12 = Array.from({ length: 12 }, (_, i) => {
    const mi = (START_MONTH + i) % 12;
    const yr = START_YEAR + Math.floor((START_MONTH + i) / 12);
    return {
      label: `${MONTHS_SHORT[mi]} ${yr}`,
      fullLabel: `${MONTHS[mi]} de ${yr}`,
      mi,
      yr,
      key: `${yr}-${String(mi + 1).padStart(2, "0")}`,
    };
  });
  const [viewIdx, setViewIdx] = useState(0);
  const [addPautaOpen, setAddPautaOpen] = useState(false);
  const [newColId, setNewColId] = useState("");
  const [newPauta, setNewPauta] = useState("");

  const cur = months12[viewIdx];
  const mKey = cur.key;

  const availCols = COLUMNISTS.filter((c) =>
    (calendar[c.id] || []).includes(cur.mi)
  );
  const meTexts = texts.filter((t) => {
    const ds = t.dataPublicacao || t.prazo || t.dataEntrega;
    if (!ds) return false;
    const d = new Date(ds);
    return !isNaN(d) && d.getMonth() === cur.mi && d.getFullYear() === cur.yr;
  });
  // Combina calPautas manuais + textos com dataPublicacao neste mês
  const calManuais = calPautas[mKey] || [];
  const textsComPub = texts.filter(t => {
    if (!t.dataPublicacao) return false;
    const d = new Date(t.dataPublicacao);
    return !isNaN(d) && d.getMonth() === cur.mi && d.getFullYear() === cur.yr;
  });
  const mPautas = [
    ...calManuais,
    ...textsComPub.map(t => ({
      colId: t.colId, nome: t.colunistaNome, pauta: t.titulo,
      editoria: t.editoria, horario: "", dataEntrega: t.dataEntrega || "",
      dataPublicacao: t.dataPublicacao, status: t.status,
      link: t.link || "", _fromText: true, _textId: t.id
    }))
  ];

  const addPauta = () => {
    if (!newColId || !newPauta) return;
    const col = COLUMNISTS.find((c) => c.id === Number(newColId));
    const entry = {
      colId: Number(newColId),
      nome: col?.nome || "",
      pauta: newPauta,
      editoria: col?.editorias[0] || "",
    };
    const updated = {
      ...calPautas,
      [mKey]: [...(calPautas[mKey] || []), entry],
    };
    setCalPautas(updated);
    save("sx2_calPautas", updated);
    setNewColId("");
    setNewPauta("");
    setAddPautaOpen(false);
  };
  const removePauta = (idx) => {
    const updated = {
      ...calPautas,
      [mKey]: mPautas.filter((_, i) => i !== idx),
    };
    setCalPautas(updated);
    save("sx2_calPautas", updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 4,
          fontFamily: cs.fontDestaque,
        }}
      >
        Calendário Editorial
      </div>
      <div style={{ fontSize: 12, color: cs.muted, marginBottom: 14 }}>
        A partir de 15 de junho de 2026
      </div>
      <div
        style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}
      >
        {months12.map((m, i) => {
          const hasPautas = (calPautas[m.key] || []).length > 0;
          const hasTexts =
            texts.filter((t) => {
              const d = new Date(t.prazo || t.dataEntrega || "");
              return (
                !isNaN(d) && d.getMonth() === m.mi && d.getFullYear() === m.yr
              );
            }).length > 0;
          return (
            <button
              key={i}
              onClick={() => setViewIdx(i)}
              style={{
                background: viewIdx === i ? cs.acBg : "transparent",
                border: `1px solid ${
                  viewIdx === i ? cs.accent + "44" : cs.faint
                }`,
                color:
                  viewIdx === i
                    ? cs.accent
                    : hasPautas || hasTexts
                    ? cs.text
                    : cs.dim,
                borderRadius: 4,
                cursor: "pointer",
                padding: "7px 12px",
                fontSize: 11,
                fontWeight: viewIdx === i ? 700 : 400,
                position: "relative",
                fontFamily: "inherit",
              }}
            >
              {m.label}
              {(()=>{
                const cnt=texts.filter(t=>t.dataPublicacao&&t.dataPublicacao.startsWith(m.key)).length;
                return cnt>0?<span style={{fontSize:9,background:cs.accent+"33",color:cs.accent,borderRadius:10,padding:"1px 5px",marginLeft:4,fontWeight:700}}>{cnt}</span>:null;
              })()}
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: cs.accent,
          marginBottom: 16,
          fontFamily: cs.fontDestaque,
        }}
      >
        {cur.fullLabel}
      </div>

      <div style={{marginBottom: 20}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Label>Calendário do mês — {mPautas.length} pautas</Label>
          <Btn small variant="primary" onClick={() => setAddPautaOpen(true)}>
            + Adicionar
          </Btn>
        </div>
          {mPautas.length === 0 ? (
            <div style={{ fontSize: 12, color: cs.dim, padding: "16px 0" }}>
              Nenhuma pauta agendada.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {mPautas.map((p, i) => (
                <div key={i} style={{background:p._fromText?cs.s1:cs.s2,border:`1px solid ${p._fromText?(STATUS_CFG[p.status]?.color||cs.accent)+"33":cs.faint}`,borderRadius:4,padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <Avatar sigla={COLUMNISTS.find((c) => c.id === p.colId)?.sigla || "?"} size={26}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: cs.text, marginBottom:3 }}>{p.pauta}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                      <span style={{ fontSize: 11, color: cs.dim }}>{p.nome}</span>
                      {p.status&&<StatusBadge status={p.status}/>}
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {p.dataEntrega&&<span style={{fontSize:10,color:cs.amber}}>📝 Entrega: {new Date(p.dataEntrega).toLocaleDateString("pt-BR")}</span>}
                      {p.dataPublicacao&&<span style={{fontSize:10,color:cs.accent}}>🚀 Pub: {new Date(p.dataPublicacao).toLocaleDateString("pt-BR")}</span>}
                      {p.horario&&!p.dataPublicacao&&<span style={{fontSize:10,color:cs.accent}}>🕐 {cur.fullLabel} às {p.horario}</span>}
                    </div>
                    {p.link&&<a href={p.link} target="_blank" rel="noreferrer" style={{fontSize:10,color:cs.purple,display:"block",marginTop:3,wordBreak:"break-all"}}>{p.link}</a>}
                  </div>
                  {!p._fromText&&(
                    <button onClick={() => removePauta(i)} style={{background:"none",border:"none",color:cs.dim,cursor:"pointer",fontSize:14,flexShrink:0}}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      <div>
        <Label>
          Colunistas disponíveis em {cur.fullLabel} ({availCols.length})
        </Label>
        {availCols.length === 0 ? (
          <div style={{ fontSize: 12, color: cs.dim }}>
            Ninguém indicou preferência por este mês.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {availCols.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: cs.s1,
                  border: `1px solid ${cs.faint}`,
                  borderRadius: 4,
                  padding: "8px 12px",
                }}
              >
                <Avatar sigla={c.sigla} size={24} />
                <span style={{ fontSize: 12 }}>{c.nome}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {addPautaOpen && (
        <Modal
          title={`Adicionar Pauta — ${cur.fullLabel}`}
          onClose={() => setAddPautaOpen(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <Label>Colunista</Label>
              <Select
                value={newColId}
                onChange={setNewColId}
                placeholder="— selecione —"
                options={COLUMNISTS.map((c) => ({
                  value: String(c.id),
                  label: c.nome,
                }))}
              />
            </div>
            {newColId && (
              <div>
                <Label>Sugestões de pauta</Label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 8,
                  }}
                >
                  {COLUMNISTS.find(
                    (c) => c.id === Number(newColId)
                  )?.pautas.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setNewPauta(p)}
                      style={{
                        padding: "6px 10px",
                        background: newPauta === p ? cs.acBg : cs.s2,
                        border: `1px solid ${
                          newPauta === p ? cs.accent + "44" : cs.faint
                        }`,
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                        color: newPauta === p ? cs.accent : cs.text,
                      }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label>Ou escreva uma pauta livre</Label>
              <Input
                value={newPauta}
                onChange={setNewPauta}
                placeholder="Título ou tema da pauta..."
              />
            </div>
            <Btn
              variant="primary"
              onClick={addPauta}
              disabled={!newColId || !newPauta}
            >
              Adicionar ao mês
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── GESTOR: Colunistas ──────────────────────────────────────────────────
function ColunistasTab({ texts, contraExtra, setContraExtra, briefings=[] }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const [edFilterCol, setEdFilterCol] = useState("");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({foto:"",descricao:"",bioLink:"",obs:""});

  const openProfile = (col) => {
    const ex = contraExtra[col.id] || {};
    setEditData({foto:ex.foto||"",descricao:ex.descricao||"",bioLink:ex.bioLink||"",obs:ex.obs||""});
    setProfile(col);
  };

  const saveProfile = () => {
    setContraExtra(prev => ({...prev,[profile.id]:editData}));
    setProfile(null);
  };

  const filtered = COLUMNISTS.filter(
    (c) =>
      (!search ||
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.curso.toLowerCase().includes(search.toLowerCase())) &&
      (!edFilterCol || c.editorias.includes(edFilterCol))
  );
  return (
    <div style={{ padding: 20 }}>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <Input value={search} onChange={setSearch} placeholder="Buscar colunista ou instituição..." style={{flex:1,minWidth:200}}/>
        <select value={edFilterCol||""} onChange={e=>setEdFilterCol(e.target.value)}
          style={{background:cs.s1,border:`1px solid ${cs.b}`,color:(edFilterCol||"")?cs.text:cs.dim,padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>
          <option value="">Todas editorias</option>
          {EDITORIAS.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtered.map((col) => {
          const myTexts = texts.filter((t) => t.colId === col.id);
          const pub = myTexts.filter((t) => t.status === "Publicado").length;
          const ex = contraExtra[col.id] || {};
          return (
            <div key={col.id} onClick={()=>openProfile(col)}
              style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:8,overflow:"hidden",cursor:"pointer",transition:"border-color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=cs.accent+"44"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=cs.faint}>
              <div style={{display:"flex",gap:12,padding:"16px 14px 12px",alignItems:"center"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:cs.s2,border:`1px solid ${cs.acA33}`,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {ex.foto ? (
                    <img src={ex.foto} alt={col.nome} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e)=>(e.target.style.display="none")}/>
                  ) : (
                    <span style={{fontSize:16,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque}}>{col.sigla}</span>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:cs.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{col.nome}</div>
                  <div style={{fontSize:11,color:cs.dim,marginTop:2}}>{col.pronomes}</div>
                  <div style={{fontSize:11,color:cs.muted,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{col.curso}</div>
                </div>
              </div>
              <div style={{display:"flex",borderTop:`1px solid ${cs.faint}`}}>
                <div style={{flex:1,padding:"8px 0",textAlign:"center",borderRight:`1px solid ${cs.faint}`}}>
                  <div style={{fontSize:16,fontWeight:700,color:cs.text,fontFamily:cs.fontDestaque}}>{myTexts.length}</div>
                  <div style={{fontSize:10,color:cs.dim}}>envios</div>
                </div>
                <div style={{flex:1,padding:"8px 0",textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:cs.green,fontFamily:cs.fontDestaque}}>{pub}</div>
                  <div style={{fontSize:10,color:cs.dim}}>publicados</div>
                </div>
              </div>
              <div style={{padding:"10px 14px",borderTop:`1px solid ${cs.faint}`,display:"flex",flexWrap:"wrap",gap:4}}>
                {col.editorias.map((e,i)=>{
                  const ec=ED_COLORS[e]||cs.muted;
                  return <span key={i} style={{fontSize:9,color:ec,background:ec+"18",border:`1px solid ${ec}33`,padding:"2px 7px",borderRadius:3}}>{e.split(":")[0].split(",")[0]}</span>;
                })}
              </div>
              {ex.descricao&&<div style={{padding:"0 14px 12px",fontSize:11,color:cs.dim,fontStyle:"italic"}}>{ex.descricao.slice(0,100)}{ex.descricao.length>100?"...":""}</div>}
              {/* Demandas ativas */}
              {(()=>{
                const pendentes=myTexts.filter(t=>t.status!=="Publicado"&&t.status!=="Rejeitado");
                const bfs=briefings.filter(b=>b.colId===col.id&&b.status!=="Concluído");
                const proxPub=pendentes.filter(t=>t.dataPublicacao).sort((a,b)=>a.dataPublicacao.localeCompare(b.dataPublicacao))[0];
                const atrasados=pendentes.filter(t=>t.dataEntrega&&Math.ceil((new Date(t.dataEntrega)-new Date())/(1000*60*60*24))<0).length;
                if(pendentes.length===0&&bfs.length===0) return null;
                return(
                  <div style={{padding:"8px 14px 12px",borderTop:`1px solid ${cs.faint}`}}>
                    <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                      <div style={{fontSize:10,color:cs.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Demandas ativas</div>
                      {proxPub&&<div style={{fontSize:10,color:cs.accent}}>📅 {proxPub.dataPublicacao}</div>}
                      {atrasados>0&&<div style={{fontSize:10,color:cs.red,fontWeight:700}}>⚠ {atrasados} atrasad{atrasados>1?"as":"a"}</div>}
                    </div>
                    {bfs.map((b,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{fontSize:11,color:cs.purple,flex:1,minWidth:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>📋 {b.editoria}</div>
                        {b.dataPublicacao&&<div style={{fontSize:10,color:cs.accent,flexShrink:0,marginLeft:6}}>Pub: {new Date(b.dataPublicacao).toLocaleDateString("pt-BR")}</div>}
                        {b.dataEntrega&&<div style={{fontSize:10,color:cs.amber,flexShrink:0,marginLeft:6}}>Ent: {new Date(b.dataEntrega).toLocaleDateString("pt-BR")}</div>}
                      </div>
                    ))}
                    {pendentes.map((t,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{fontSize:11,color:cs.amber,flex:1,minWidth:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>✎ {t.titulo}</div>
                        <div style={{fontSize:10,color:STATUS_CFG[t.status]?.color||cs.muted,flexShrink:0,marginLeft:6}}>{t.status}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      {profile && (
        <Modal title={profile.nome} onClose={()=>setProfile(null)} width={640}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Photo + info */}
            <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
              <div style={{flexShrink:0}}>
                <div style={{width:100,height:100,borderRadius:8,background:cs.s2,border:`1px solid ${cs.faint}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                  {editData.foto
                    ?<img src={editData.foto} alt={profile.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    :<span style={{fontSize:28,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque}}>{profile.sigla}</span>
                  }
                </div>
                {editData.foto&&(
                  <a href={editData.foto} download={`${profile.nome.replace(/ /g,"_")}.jpg`} target="_blank" rel="noreferrer"
                    style={{fontSize:10,color:cs.accent,display:"block",textAlign:"center",textDecoration:"none"}}>
                    ⬇ Download foto
                  </a>
                )}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:700,fontFamily:cs.fontDestaque,color:cs.text,marginBottom:4}}>{profile.nome}</div>
                <div style={{fontSize:12,color:cs.dim,marginBottom:2}}>{profile.pronomes} · {profile.email}</div>
                <div style={{fontSize:12,color:cs.muted,marginBottom:8}}>{profile.curso}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {profile.editorias.map((e,i)=>{
                    const ec=ED_COLORS[e]||cs.muted;
                    return <span key={i} style={{fontSize:9,color:ec,background:ec+"18",border:`1px solid ${ec}33`,padding:"2px 7px",borderRadius:3}}>{e.split(",")[0]}</span>;
                  })}
                </div>
              </div>
            </div>

            <div style={{height:1,background:cs.faint}}/>

            {/* Edit fields */}
            <div><Label>URL da Foto (300×300)</Label>
              <Input value={editData.foto} onChange={v=>setEditData(d=>({...d,foto:v}))} placeholder="https://..."/>
            </div>
            <div>
              <Label>Descrição curta (até 100 caracteres)</Label>
              <Input value={editData.descricao} onChange={v=>setEditData(d=>({...d,descricao:v.slice(0,100)}))} placeholder="Bio curta do colunista..."/>
              <div style={{fontSize:10,color:cs.dim,marginTop:4,textAlign:"right"}}>{(editData.descricao||"").length}/100</div>
            </div>
            <div>
              <Label>Link de Bio (até 1000 caracteres)</Label>
              <textarea value={editData.bioLink} onChange={e=>setEditData(d=>({...d,bioLink:e.target.value.slice(0,1000)}))}
                placeholder="https://... ou texto de apresentação completa"
                style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:80,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
              <div style={{fontSize:10,color:cs.dim,marginTop:4,textAlign:"right"}}>{(editData.bioLink||"").length}/1000</div>
            </div>
            <div>
              <Label>Observações internas</Label>
              <textarea value={editData.obs} onChange={e=>setEditData(d=>({...d,obs:e.target.value}))}
                placeholder="Notas, acordos, avisos internos..."
                style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:60,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn variant="primary" onClick={saveProfile}>Salvar perfil</Btn>
              <Btn onClick={()=>setProfile(null)}>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── COLUNISTA: Enviar Texto ─────────────────────────────────────────────
function EnviarTab({ colunista, addText, addIdeia, contraExtra={}, setContraExtra, texts=[], updateTextStatus }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const myTotal = texts.filter(t=>t.colId===colunista?.id).length;
  const myEntregues = texts.filter(t=>t.colId===colunista?.id&&(t.status==="Enviado"||t.status==="Em Revisão"||t.status==="Publicado")).length;
  const [titulo, setTitulo] = useState("");
  const [editoria, setEditoria] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [link, setLink] = useState("");
  const [obs, setObs] = useState("");
  const [sent, setSent] = useState(false);
  const [sugerirMode, setSugerirMode] = useState(false);
  const [sugestaoOpen, setSugestaoOpen] = useState(false);
  const [sugestao, setSugestao] = useState("");
  const [sugestaoEd, setSugestaoEd] = useState("");

  const handleSubmit = () => {
    if (!titulo || !editoria) return;
    addText({
      colId: colunista.id,
      colunistaNome: colunista.nome,
      titulo,
      editoria,
      dataEntrega,
      link,
      obs,
    });
    setTitulo("");
    setEditoria("");
    setDataEntrega("");
    setLink("");
    setObs("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

    const colExtra = (contraExtra||{})[colunista?.id] || {};
  const myTexts = texts.filter(t=>t.colId===colunista?.id);
  const [expandedId, setExpandedId] = useState(null);
  const [linkEdit, setLinkEdit] = useState({});
  return (
    <div style={{padding:20}}>
      <ProfileCard
        nome={colunista?.nome||""}
        pronomes={colunista?.pronomes||""}
        foto={colExtra.foto||""}
        descricao={colExtra.descricao||""}
        bioLink={colExtra.bioLink||""}
        onEdit={(d)=>{ if(setContraExtra && colunista?.id) setContraExtra(prev=>({...prev,[colunista.id]:{...(prev[colunista.id]||{}),...d}})); }}
      />
      {myTotal > 0 && (
        <div style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:cs.dim,marginBottom:4}}>{myEntregues} de {myTotal} textos entregues</div>
            <div style={{background:cs.s2,borderRadius:4,height:6,overflow:"hidden"}}>
              <div style={{width:`${myTotal?(myEntregues/myTotal*100):0}%`,background:cs.green,height:"100%",transition:"width 0.3s"}}/>
            </div>
          </div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:cs.fontDestaque,color:cs.green}}>{myTotal?Math.round(myEntregues/myTotal*100):0}%</div>
        </div>
      )}
      {myTexts.length > 0 && (
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,fontFamily:cs.fontDestaque,marginBottom:10,color:cs.text,letterSpacing:"0.05em",textTransform:"uppercase"}}>Suas Tarefas</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {myTexts.map(t=>{
              const open=expandedId===t.id;
              return(
                <div key={t.id} onClick={()=>setExpandedId(open?null:t.id)}
                  style={{background:cs.s1,border:`1px solid ${open?cs.accent+"44":cs.faint}`,borderRadius:6,cursor:"pointer",overflow:"hidden"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px"}}>
                    <div style={{flex:1,paddingRight:8}}>
                      <div style={{fontSize:13,fontWeight:600}}>{t.titulo}</div>
                      {t.dataEntrega&&<div style={{fontSize:11,color:cs.dim,marginTop:2}}>Entrega: {t.dataEntrega}</div>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <StatusBadge status={t.status}/>
                      <span style={{fontSize:10,color:cs.dim}}>{open?"▲":"▼"}</span>
                    </div>
                  </div>
                  {open&&(
                    <div style={{borderTop:`1px solid ${cs.faint}`,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:cs.dim}}>{t.editoria}</span>
                        {t.dataEntrega&&<span style={{fontSize:11,color:cs.dim}}>Entrega: {t.dataEntrega}</span>}
                        {t.dataPublicacao&&<span style={{fontSize:11,color:cs.dim}}>Publicação: {t.dataPublicacao}</span>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        <Label>Briefing</Label>
                        <textarea
                          value={linkEdit[`brief_${t.id}`]??t.briefing??""}
                          onChange={e=>{e.stopPropagation();setLinkEdit(p=>({...p,[`brief_${t.id}`]:e.target.value}));}}
                          onClick={e=>e.stopPropagation()}
                          placeholder="Link, instruções ou contexto..."
                          style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"7px 10px",borderRadius:4,fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",minHeight:60}}
                        />
                        <button onClick={e=>{e.stopPropagation();if(updateTextStatus)updateTextStatus(t.id,t.status,{briefing:linkEdit[`brief_${t.id}`]??t.briefing??""});setLinkEdit(p=>({...p,[`brief_${t.id}`]:undefined}));}} style={{alignSelf:"flex-end",background:cs.accent,color:"#fff",border:"none",borderRadius:4,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Salvar</button>
                      </div>
                      {t.obs&&t.obs!=="Tarefa do banco de ideias"&&<div style={{fontSize:12,color:cs.dim}}>{t.obs}</div>}
                    {t.feedback&&<div style={{fontSize:12,background:cs.purBg,border:`1px solid ${cs.purA33}`,borderRadius:4,padding:"8px 10px"}}><span style={{color:cs.purple,fontWeight:600}}>Feedback: </span><span style={{color:cs.muted}}>{t.feedback}</span></div>}
                      {t.feedback&&<div style={{fontSize:12,background:cs.purBg,border:`1px solid ${cs.purA33}`,borderRadius:4,padding:"8px 10px"}}><span style={{color:cs.purple,fontWeight:600}}>Feedback: </span><span style={{color:cs.muted}}>{t.feedback}</span></div>}
                      <div style={{background:cs.s2,borderRadius:6,padding:12,display:"flex",flexDirection:"column",gap:10}}>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <input
                            value={linkEdit[t.id]??t.link??""}
                            onChange={e=>{e.stopPropagation();setLinkEdit(p=>({...p,[t.id]:e.target.value}));}}
                            onClick={e=>e.stopPropagation()}
                            placeholder="Cole o link do seu texto (Google Docs, Drive...)"
                            style={{flex:1,background:cs.s1,border:`1px solid ${cs.b}`,color:cs.text,padding:"7px 10px",borderRadius:4,fontSize:12,fontFamily:"inherit",outline:"none"}}
                          />
                          <button
                            onClick={e=>{
                              e.stopPropagation();
                              const newLink=linkEdit[t.id]??"";
                              if(updateTextStatus) updateTextStatus(t.id, t.status, {link:newLink});
                              setLinkEdit(p=>({...p,[t.id]:undefined}));
                            }}
                            style={{background:cs.accent,color:"#fff",border:"none",borderRadius:4,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}
                          >Salvar link</button>
                        </div>
                        {t.link&&(linkEdit[t.id]===undefined)&&<a href={t.link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:11,color:cs.accent,wordBreak:"break-all"}}>{t.link}</a>}
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {[{s:"Pendente",label:"Pendente"},{s:"Enviado",label:"Texto entregue"},{s:"Publicado",label:"Publicado"}].map(({s,label})=>{
                            const cfg=STATUS_CFG[s]||{};
                            const active=t.status===s;
                            return(
                              <button key={s}
                                onClick={e=>{e.stopPropagation();if(updateTextStatus)updateTextStatus(t.id,s,{});}}
                                style={{background:active?cfg.bg:"transparent",border:`1px solid ${active?cfg.color+"88":cs.b}`,color:active?cfg.color:cs.dim,padding:"6px 14px",borderRadius:4,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:active?600:400}}
                              >{label}</button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {sugerirMode ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 4,
                  fontFamily: cs.fontDestaque,
                }}
              >
                Enviar Texto
              </div>
              <div style={{ fontSize: 12, color: cs.muted }}>
                Preencha os dados e clique em enviar.
              </div>
            </div>
            <Btn small variant="purple" onClick={() => setSugerirMode(true)}>
              + Sugerir Pauta
            </Btn>
          </div>
          {sent && (
            <div
              style={{
                background: cs.grBg,
                border: `1px solid ${cs.grA44}`,
                borderRadius: 6,
                padding: "12px 16px",
                marginBottom: 16,
                fontSize: 13,
                color: cs.green,
                fontWeight: 600,
              }}
            >
              ✓ Texto enviado!
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Título do Texto *</Label>
              <Input
                value={titulo}
                onChange={setTitulo}
                placeholder="Título do seu texto"
              />
            </div>
            <div>
              <Label>Editoria *</Label>
              <Select
                value={editoria}
                onChange={setEditoria}
                placeholder="— selecione —"
                options={colunista.editorias.map((e) => ({
                  value: e,
                  label: e,
                }))}
              />
            </div>
            <div>
              <Label>Data de Entrega</Label>
              <Input
                type="date"
                value={dataEntrega}
                onChange={setDataEntrega}
              />
            </div>
            <div>
              <Label>Link ou URL do Arquivo</Label>
              <Input
                value={link}
                onChange={setLink}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Observações</Label>
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Notas adicionais..."
                style={{
                  width: "100%",
                  background: cs.s2,
                  border: `1px solid ${cs.b}`,
                  color: cs.text,
                  padding: "9px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  minHeight: 80,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn
                variant="primary"
                onClick={handleSubmit}
                disabled={!titulo || !editoria}
              >
                Enviar Texto
              </Btn>
              <span style={{ fontSize: 11, color: cs.dim, alignSelf: "center" }}>
                * obrigatórios
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: cs.s2,
              borderRadius: 6,
              border: `1px solid ${cs.faint}`,
            }}
          >
            <Label>Suas pautas sugeridas na seleção</Label>
            {colunista.pautas.map((p, i) => (
              <div
                key={i}
                onClick={() => {
                  setTitulo(p);
                  setEditoria(colunista.editorias[0] || "");
                }}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <span style={{ color: cs.accent, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 12, color: cs.muted }}>{p}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 4,
                  fontFamily: cs.fontDestaque,
                }}
              >
                Sugerir Nova Pauta
              </div>
              <div style={{ fontSize: 12, color: cs.muted }}>
                Sua sugestão vai para o Banco de Ideias da gestão.
              </div>
            </div>
            <Btn small onClick={() => setSugerirMode(false)}>
              ← Voltar
            </Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Editoria</Label>
              <Select
                value={sugestaoEd}
                onChange={setSugestaoEd}
                placeholder="— selecione —"
                options={colunista.editorias.map((e) => ({
                  value: e,
                  label: e,
                }))}
              />
            </div>
            <div>
              <Label>Pauta sugerida</Label>
              <textarea
                value={sugestao}
                onChange={(e) => setSugestao(e.target.value)}
                placeholder="Descreva sua ideia de pauta..."
                style={{
                  width: "100%",
                  background: cs.s2,
                  border: `1px solid ${cs.b}`,
                  color: cs.text,
                  padding: "9px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  minHeight: 100,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <Btn
              variant="purple"
              disabled={!sugestao}
              onClick={() => {
                addIdeia({
                  colId: colunista.id,
                  nome: colunista.nome,
                  sigla: colunista.sigla,
                  editoria: sugestaoEd || colunista.editorias[0] || "",
                  pauta: sugestao,
                });
                setSugestao("");
                setSugestaoEd("");
                setSugerirMode(false);
              }}
            >
              Enviar Sugestão
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ── COLUNISTA: Meus Textos ──────────────────────────────────────────────
function MeusTextosTab({ texts, colunista, contraExtra={}, setContraExtra, updateTextStatus }) {
  const cs = useC();
  const STATUS_CFG = getStatusCfg(cs);
  const [expandedId, setExpandedId] = useState(null);
  const [linkEdit, setLinkEdit] = useState({});
  const pub = texts.filter((t) => t.status === "Publicado").length;
  const pen = texts.filter((t) =>
    ["Enviado", "Em Revisão", "Pendente"].includes(t.status)
  ).length;
  const colExtra = (contraExtra||{})[colunista?.id] || {};
  return (
    <div style={{ padding: 20 }}>
      <ProfileCard
        nome={colunista?.nome||""}
        pronomes={colunista?.pronomes||""}
        foto={colExtra.foto||""}
        descricao={colExtra.descricao||""}
        bioLink={colExtra.bioLink||""}
        onEdit={(d)=>{ if(setContraExtra && colunista?.id) setContraExtra(prev=>({...prev,[colunista.id]:{...(prev[colunista.id]||{}),...d}})); }}
      />
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <StatCard label="Total enviados" value={texts.length} />
        <StatCard label="Publicados" value={pub} color={cs.green} />
        <StatCard label="Em andamento" value={pen} color={cs.amber} />
      </div>
      {texts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: cs.dim }}>
          Você ainda não enviou nenhum texto.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {texts
            .slice()
            .reverse()
            .map((t) => {
              const open = expandedId === t.id;
              return (
              <div
                key={t.id}
                onClick={()=>setExpandedId(open?null:t.id)}
                style={{
                  background: cs.s1,
                  border: `1px solid ${open?cs.accent+"44":cs.faint}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <div style={{padding:"14px 16px"}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div style={{flex:1,paddingRight:12}}>
                    <div style={{fontSize:14,fontWeight:600}}>{t.titulo}</div>
                    {t.dataEntrega&&<div style={{fontSize:11,color:cs.dim,marginTop:2}}>Entrega: {t.dataEntrega}</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <StatusBadge status={t.status} />
                    <span style={{fontSize:10,color:cs.dim}}>{open?"▲":"▼"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: cs.dim }}>
                    {t.editoria}
                  </span>
                  {(t.prazo || t.dataEntrega) && (
                    <span style={{ fontSize: 11, color: cs.dim }}>
                      Prazo: {t.prazo || t.dataEntrega}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: cs.dim }}>
                    Enviado: {t.dataSubmissao}
                  </span>
                </div>
                </div>
                {open && (
                  <div style={{borderTop:`1px solid ${cs.faint}`,padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <Label>Briefing</Label>
                      <textarea
                        value={linkEdit[`brief_${t.id}`]??t.briefing??""}
                        onChange={e=>{e.stopPropagation();setLinkEdit(p=>({...p,[`brief_${t.id}`]:e.target.value}));}}
                        onClick={e=>e.stopPropagation()}
                        placeholder="Link, instruções ou contexto..."
                        style={{width:"100%",background:cs.s1,border:`1px solid ${cs.b}`,color:cs.text,padding:"7px 10px",borderRadius:4,fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",minHeight:60}}
                      />
                      <button onClick={e=>{e.stopPropagation();if(updateTextStatus)updateTextStatus(t.id,t.status,{briefing:linkEdit[`brief_${t.id}`]??t.briefing??""});setLinkEdit(p=>({...p,[`brief_${t.id}`]:undefined}));}} style={{alignSelf:"flex-end",background:cs.accent,color:"#fff",border:"none",borderRadius:4,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Salvar</button>
                    </div>
                    {t.dataPublicacao&&<div style={{fontSize:11,color:cs.dim}}>Publicação prevista: {t.dataPublicacao}</div>}
                    {t.obs&&t.obs!=="Tarefa do banco de ideias"&&<div style={{fontSize:12,color:cs.dim}}>{t.obs}</div>}
                    <div style={{background:cs.s2,borderRadius:6,padding:12,display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input
                          value={linkEdit[t.id]??t.link??""}
                          onChange={e=>{e.stopPropagation();setLinkEdit(p=>({...p,[t.id]:e.target.value}));}}
                          onClick={e=>e.stopPropagation()}
                          placeholder="Cole o link do seu texto (Google Docs, Drive...)"
                          style={{flex:1,background:cs.s1,border:`1px solid ${cs.b}`,color:cs.text,padding:"7px 10px",borderRadius:4,fontSize:12,fontFamily:"inherit",outline:"none"}}
                        />
                        <button
                          onClick={e=>{
                            e.stopPropagation();
                            const newLink=linkEdit[t.id]??"";
                            if(updateTextStatus) updateTextStatus(t.id, t.status, {link:newLink});
                            setLinkEdit(p=>({...p,[t.id]:undefined}));
                          }}
                          style={{background:cs.accent,color:"#fff",border:"none",borderRadius:4,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}
                        >Salvar link</button>
                      </div>
                      {t.link&&(linkEdit[t.id]===undefined)&&(
                        <a href={t.link} target="_blank" rel="noreferrer"
                          style={{fontSize:11,color:cs.accent,display:"block",wordBreak:"break-all"}}
                          onClick={e=>e.stopPropagation()}>
                          {t.link}
                        </a>
                      )}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {[{s:"Pendente",label:"Pendente"},{s:"Enviado",label:"Texto entregue"},{s:"Publicado",label:"Publicado"}].map(({s,label})=>{
                          const cfg=STATUS_CFG[s]||{};
                          const active=t.status===s;
                          return(
                            <button key={s}
                              onClick={e=>{e.stopPropagation();if(updateTextStatus)updateTextStatus(t.id,s,{});}}
                              style={{background:active?cfg.bg:"transparent",border:`1px solid ${active?cfg.color+"88":cs.b}`,color:active?cfg.color:cs.dim,padding:"6px 14px",borderRadius:4,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:active?600:400}}
                            >{label}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ── COLUNISTA: Calendário ────────────────────────────────────────────────
function MeuCalendarioTab({ texts=[], colunista }) {
  const cs = useC();
  const [viewMode, setViewMode] = useState("lista"); // "lista" | "grade"
  const myTexts = (texts||[]).filter(t=>t.colId===colunista?.id);
  const byMonth = {};
  myTexts.forEach(t=>{
    const d = t.dataPublicacao||t.dataEntrega; if(!d) return;
    const [y,m] = d.split("-"); const key=`${y}-${m}`;
    if(!byMonth[key]) byMonth[key]=[];
    byMonth[key].push(t);
  });
  const months = Object.keys(byMonth).sort();
  return (
    <div style={{padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{fontSize:16,fontWeight:700,fontFamily:cs.fontDestaque}}>Meu Calendário Editorial</div>
        <div style={{display:"flex",gap:6}}>
          {["lista","grade"].map(m=>(
            <button key={m} onClick={()=>setViewMode(m)}
              style={{background:viewMode===m?cs.accent:"transparent",border:`1px solid ${viewMode===m?cs.accent:cs.faint}`,color:viewMode===m?"#fff":cs.dim,padding:"4px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
              {m==="lista"?"☰ Lista":"⊞ Grade"}
            </button>
          ))}
        </div>
      </div>
      <div style={{fontSize:12,color:cs.muted,marginBottom:20}}>Suas datas de entrega e publicação.</div>
      {months.length===0 ? (
        <div style={{textAlign:"center",padding:40,color:cs.dim}}>Nenhuma tarefa com data definida.</div>
      ) : viewMode==="lista" ? (<>{months.map(mk=>{
            const [y,m]=mk.split("-");
            return(
              <div key={mk} style={{marginBottom:24}}>
                <div style={{fontSize:13,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,borderBottom:`1px solid ${cs.faint}`,paddingBottom:6}}>{MONTHS[parseInt(m)-1]} {y}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {byMonth[mk].sort((a,b)=>(a.dataEntrega||"").localeCompare(b.dataEntrega||"")).map(t=>{
                    const dl=t.dataEntrega?Math.ceil((new Date(t.dataEntrega)-new Date())/(1000*60*60*24)):null;
                    const borderColor=dl===null?cs.faint:dl<0?cs.red:dl<=3?cs.amber:cs.faint;
                    return(
                      <div key={t.id} style={{background:cs.s1,border:`1px solid ${borderColor}`,borderRadius:6,padding:"12px 14px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                          <div style={{fontSize:13,fontWeight:600,flex:1}}>{t.titulo}</div>
                          <StatusBadge status={t.status}/>
                        </div>
                        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:6}}>
                          <span style={{fontSize:11,color:cs.dim}}>{t.editoria}</span>
                          {t.dataEntrega&&<span style={{fontSize:11,color:dl<0?cs.red:dl<=3?cs.amber:cs.dim}}>Entrega: {t.dataEntrega}</span>}
                          {t.dataPublicacao&&<span style={{fontSize:11,color:cs.dim}}>Publicação: {t.dataPublicacao}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>) : (
        <>
          {months.map(mk=>{
            const [y,m]=mk.split("-");
            const daysInMonth = new Date(parseInt(y),parseInt(m),0).getDate();
            const firstDay = new Date(parseInt(y),parseInt(m)-1,1).getDay();
            const tasksByDay = {};
            byMonth[mk].forEach(t=>{
              const d = (t.dataPublicacao||t.dataEntrega||"").split("-")[2];
              if(d){ if(!tasksByDay[d]) tasksByDay[d]=[]; tasksByDay[d].push(t); }
            });
            return(
              <div key={mk} style={{marginBottom:24}}>
                <div style={{fontSize:13,fontWeight:700,color:cs.accent,fontFamily:cs.fontDestaque,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,borderBottom:`1px solid ${cs.faint}`,paddingBottom:6}}>{MONTHS[parseInt(m)-1]} {y}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
                  {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=><div key={d} style={{fontSize:9,color:cs.dim,textAlign:"center",padding:4,fontWeight:700}}>{d}</div>)}
                  {Array.from({length:firstDay}).map((_,i)=><div key={"e"+i}/>)}
                  {Array.from({length:daysInMonth}).map((_,i)=>{
                    const day = String(i+1).padStart(2,"0");
                    const tasks = tasksByDay[day]||[];
                    return(
                      <div key={day} style={{background:tasks.length?cs.acBg:cs.s1,border:`1px solid ${tasks.length?cs.accent+"44":cs.faint}`,borderRadius:4,padding:4,minHeight:48,position:"relative"}}>
                        <div style={{fontSize:10,color:tasks.length?cs.accent:cs.dim,fontWeight:tasks.length?700:400}}>{i+1}</div>
                        {tasks.map((t,ti)=>(
                          <div key={ti} style={{fontSize:8,color:cs.text,background:cs.accent+"22",borderRadius:2,padding:"1px 3px",marginTop:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}} title={t.titulo}>{t.titulo.slice(0,15)}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ── COLUNISTA: Contrapartidas ────────────────────────────────────────────
function MinhasContrapartidasTab({ contrapartidas }) {
  const cs = useC();
  const tipos = [
    {
      key: "certificadoHoras",
      label: "Certificado de Horas Complementares",
      desc: "Certificado para atividades complementares universitárias",
    },
    {
      key: "acessoOficinas",
      label: "Acesso a Oficinas Exclusivas",
      desc: "Oficinas exclusivas de criação de texto do instituto",
    },
    {
      key: "certificadoFormacao",
      label: "Certificado de Formação",
      desc: "Certificado de formação de colunista [SSEX BBOX]",
    },
  ];
  const done = tipos.filter((t) => contrapartidas[t.key]).length;
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 4,
          fontFamily: cs.fontDestaque,
        }}
      >
        Minhas Contrapartidas
      </div>
      <div style={{ fontSize: 12, color: cs.muted, marginBottom: 12 }}>
        {done}/{tipos.length} liberadas
      </div>
      <div
        style={{
          height: 4,
          background: cs.faint,
          borderRadius: 2,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(done / tipos.length) * 100}%`,
            background: cs.green,
            borderRadius: 2,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tipos.map((t) => {
          const ok = contrapartidas[t.key];
          return (
            <div
              key={t.key}
              style={{
                background: ok ? cs.grBg : cs.s1,
                border: `1px solid ${ok ? cs.green + "44" : cs.faint}`,
                borderRadius: 6,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: ok ? cs.grBg : cs.s3,
                  border: `1px solid ${ok ? cs.green : cs.faint}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: ok ? cs.green : cs.dim,
                  flexShrink: 0,
                }}
              >
                {ok ? "✓" : "○"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: ok ? cs.green : cs.text,
                    marginBottom: 2,
                  }}
                >
                  {t.label}
                </div>
                <div style={{ fontSize: 11, color: cs.muted }}>{t.desc}</div>
                {!ok && (
                  <div style={{ fontSize: 11, color: cs.dim, marginTop: 4 }}>
                    Aguardando confirmação da equipe editorial.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Horários de publicação (Seg/Qua/Sex: 10h, 12h, 18h) ────────────────
const HORARIOS_PUB = ["10:00","12:00","18:00"];
const DIAS_PUB = [1,3,5]; // 1=Seg, 3=Qua, 5=Sex
const DATA_INICIO_PUB = new Date("2026-06-22");

function proximosSlots(n=6) {
  const slots = [];
  const d = new Date(DATA_INICIO_PUB);
  while(slots.length < n) {
    if(DIAS_PUB.includes(d.getDay())) {
      HORARIOS_PUB.forEach(h => {
        const label = `${d.toLocaleDateString("pt-BR")} às ${h}`;
        const isoDate = d.toISOString().slice(0,10);
        slots.push({label, isoDate, horario:h});
      });
    }
    d.setDate(d.getDate()+1);
    if(slots.length>=n) break;
  }
  return slots.slice(0,n);
}

function dataEntregaSugerida(isoDataPublicacao) {
  if(!isoDataPublicacao) return "";
  const d = new Date(isoDataPublicacao);
  d.setDate(d.getDate()-3);
  return d.toISOString().slice(0,10);
}

// ── GESTOR: Briefing ─────────────────────────────────────────────────────
function BriefingTab({ briefings, addBriefing, texts, updateTextStatus }) {
  const cs = useC();
  const [colId, setColId] = useState("");
  const [editoria, setEditoria] = useState("");
  const [linkRef, setLinkRef] = useState("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [dataEntrega, setDataEntregaB] = useState("");
  const [obs, setObs] = useState("");
  const [sent, setSent] = useState(false);
  const slots = proximosSlots(18);

  const handleDataPub = (v) => {
    setDataPublicacao(v);
    setDataEntregaB(dataEntregaSugerida(v));
  };

  const submit = () => {
    if(!colId||!editoria) return;
    const col = COLUMNISTS.find(c=>c.id===Number(colId));
    addBriefing({colId:Number(colId),colunistaNome:col?.nome||"",editoria,linkRef,dataPublicacao,dataEntrega,obs,status:"Enviado"});
    setColId("");setEditoria("");setLinkRef("");setDataPublicacao("");setDataEntregaB("");setObs("");
    setSent(true);setTimeout(()=>setSent(false),3000);
  };

  return (
    <div style={{padding:20,maxWidth:700}}>
      <div style={{fontSize:16,fontWeight:700,fontFamily:cs.fontDestaque,marginBottom:4}}>Enviar Briefing</div>
      <div style={{fontSize:13,color:cs.muted,marginBottom:20}}>Selecione colunista, editoria e data de publicação. A entrega sugerida é calculada automaticamente (3 dias antes).</div>

      {sent&&<div style={{background:cs.grBg,border:`1px solid ${cs.grA44}`,borderRadius:6,padding:"12px 16px",marginBottom:16,fontSize:13,color:cs.green,fontWeight:600}}>✓ Briefing enviado!</div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div><Label>Colunista *</Label>
          <Select value={colId} onChange={setColId} placeholder="— selecione —" options={COLUMNISTS.map(c=>({value:String(c.id),label:c.nome}))}/>
        </div>
        <div><Label>Editoria *</Label>
          <Select value={editoria} onChange={setEditoria} placeholder="— selecione —"
            options={colId ? (COLUMNISTS.find(c=>c.id===Number(colId))?.editorias||EDITORIAS).map(e=>({value:e,label:e})) : EDITORIAS.map(e=>({value:e,label:e}))}/>
        </div>
        <div><Label>Data de Publicação</Label>
          <Select value={dataPublicacao} onChange={handleDataPub} placeholder="— selecione slot —"
            options={slots.map(s=>({value:s.isoDate,label:s.label}))}/>
          <div style={{fontSize:10,color:cs.dim,marginTop:4}}>Apenas Seg, Qua e Sex · 10h, 12h ou 18h</div>
        </div>
        <div><Label>Data de Entrega (automática)</Label>
          <Input type="date" value={dataEntrega} onChange={setDataEntregaB} placeholder=""/>
          <div style={{fontSize:10,color:cs.dim,marginTop:4}}>3 dias antes da publicação</div>
        </div>
        <div style={{gridColumn:"1/-1"}}><Label>Link de Referência</Label>
          <Input value={linkRef} onChange={setLinkRef} placeholder="https://... artigo, referência ou documento"/>
        </div>
        <div style={{gridColumn:"1/-1"}}><Label>Instruções / Observações</Label>
          <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Diretrizes editoriais, tom, pontos obrigatórios..."
            style={{width:"100%",background:cs.s2,border:`1px solid ${cs.b}`,color:cs.text,padding:"9px 12px",borderRadius:4,fontSize:13,minHeight:100,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
        </div>
      </div>
      <Btn variant="primary" onClick={submit} disabled={!colId||!editoria}>Enviar Briefing</Btn>

      {briefings.length>0&&(
        <div style={{marginTop:28}}>
          <div style={{fontSize:13,fontWeight:700,fontFamily:cs.fontDestaque,marginBottom:12}}>Briefings enviados ({briefings.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {briefings.slice().reverse().map(b=>(
              <div key={b.id} style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:cs.text}}>{b.colunistaNome}</div>
                    <div style={{fontSize:11,color:cs.dim}}>{b.editoria}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {b.dataPublicacao&&<div style={{fontSize:11,color:cs.accent}}>Publ.: {new Date(b.dataPublicacao).toLocaleDateString("pt-BR")}</div>}
                    {b.dataEntrega&&<div style={{fontSize:11,color:cs.amber}}>Entrega: {new Date(b.dataEntrega).toLocaleDateString("pt-BR")}</div>}
                  </div>
                </div>
                {b.linkRef&&<a href={b.linkRef} target="_blank" rel="noreferrer" style={{fontSize:11,color:cs.purple,display:"block",marginBottom:4,wordBreak:"break-all"}}>{b.linkRef}</a>}
                {b.obs&&<div style={{fontSize:12,color:cs.muted,fontStyle:"italic"}}>{b.obs}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Leituras Essenciais (gestor edita, colunista lê) ─────────────────────

function PdfViewer({ url, leituraId, colId, onProgress }) {
  const cs = useC();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if(!url) return;
    const loadPdf = () => {
      if(!window.pdfjsLib) { setError(true); setLoading(false); return; }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      window.pdfjsLib.getDocument(url).promise.then(doc => {
        setPdfDoc(doc); setTotal(doc.numPages); setLoading(false);
      }).catch(()=>{ setError(true); setLoading(false); });
    };
    if(window.pdfjsLib) { loadPdf(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = loadPdf;
    script.onerror = ()=>{ setError(true); setLoading(false); };
    document.head.appendChild(script);
  }, [url]);

  useEffect(() => {
    if(!pdfDoc) return;
    pdfDoc.getPage(page).then(p => {
      const canvas = document.getElementById(`pdf-canvas-${leituraId}`);
      if(!canvas) return;
      const ctx = canvas.getContext("2d");
      const vp = p.getViewport({scale:1.4});
      canvas.height = vp.height; canvas.width = vp.width;
      p.render({canvasContext:ctx, viewport:vp});
      if(onProgress) onProgress(page, pdfDoc.numPages);
    });
  }, [page, pdfDoc]);

  if(loading) return <div style={{padding:40,textAlign:"center",color:cs.dim}}>Carregando PDF...</div>;
  if(error) return <div style={{padding:40,textAlign:"center",color:cs.red}}>Não foi possível carregar. Certifique-se que o PDF está em /public/pdfs/ no repositório.</div>;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
      <canvas id={`pdf-canvas-${leituraId}`} style={{maxWidth:"100%",border:`1px solid ${cs.faint}`,borderRadius:4}}/>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{background:cs.s2,border:`1px solid ${cs.b}`,color:page===1?cs.dim:cs.text,padding:"6px 14px",borderRadius:4,cursor:page===1?"not-allowed":"pointer",fontFamily:"inherit"}}>← Anterior</button>
        <span style={{fontSize:12,color:cs.muted}}>Página {page} de {total}</span>
        <button onClick={()=>setPage(p=>Math.min(total,p+1))} disabled={page===total} style={{background:cs.s2,border:`1px solid ${cs.b}`,color:page===total?cs.dim:cs.text,padding:"6px 14px",borderRadius:4,cursor:page===total?"not-allowed":"pointer",fontFamily:"inherit"}}>Próxima →</button>
      </div>
      <div style={{width:"100%",background:cs.s2,borderRadius:4,height:6,overflow:"hidden"}}>
        <div style={{width:`${total?((page/total)*100):0}%`,background:cs.accent,height:"100%",transition:"width 0.3s"}}/>
      </div>
    </div>
  );
}
function LeiturasTab({ leituras, setLeituras, role, user, readProgress={}, setReadProgress }) {
  const cs = useC();
  const [form, setForm] = useState({titulo:"",link:"",editoria:"",descricao:""});
  const [adding, setAdding] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);

  const addLeitura = () => {
    if(!form.titulo||!form.link) return;
    setLeituras(prev=>[...prev,{...form,id:Date.now()}]);
    setForm({titulo:"",link:"",editoria:"",descricao:""});setAdding(false);
  };

  return (
    <div style={{padding:20,maxWidth:760}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontSize:16,fontWeight:700,fontFamily:cs.fontDestaque,marginBottom:2}}>Leituras Essenciais</div>
          <div style={{fontSize:13,color:cs.muted}}>Material obrigatório para certificação dos colunistas.</div>
        </div>
        {role==="gestor"&&<Btn variant="primary" small onClick={()=>setAdding(true)}>+ Adicionar</Btn>}
      </div>

      {viewingPdf ? (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:cs.fontDestaque}}>{viewingPdf.titulo}</div>
            <Btn small onClick={()=>setViewingPdf(null)}>← Voltar</Btn>
          </div>
          {role==="gestor" ? (
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
              {COLUMNISTS.map(col=>{
                const prog=(readProgress[col.id]||{})[viewingPdf.id];
                const pct=prog&&prog.total?Math.round(prog.page/prog.total*100):0;
                return(
                  <div key={col.id} style={{display:"flex",alignItems:"center",gap:10,background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"8px 12px",marginBottom:4}}>
                    <Avatar sigla={col.sigla} size={26}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600}}>{col.nome}</div>
                      {prog?<div style={{fontSize:10,color:cs.dim}}>Pág. {prog.page}/{prog.total} · {new Date(prog.lastRead).toLocaleDateString("pt-BR")}</div>:<div style={{fontSize:10,color:cs.dim}}>Não iniciou</div>}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:pct===100?cs.green:pct>0?cs.amber:cs.dim}}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <PdfViewer url={viewingPdf.link} leituraId={viewingPdf.id} colId={user?.colId}
              onProgress={(page,total)=>{ if(setReadProgress&&user?.colId) setReadProgress(user.colId,viewingPdf.id,page,total); }}/>
          )}
        </div>
      ) : (
        <>
          {leituras.length===0
            ?<div style={{textAlign:"center",padding:40,color:cs.dim,fontSize:14}}>Nenhuma leitura cadastrada ainda.</div>
            :<div style={{display:"flex",flexDirection:"column",gap:10}}>
              {leituras.map((l,idx)=>{
                const ec=ED_COLORS[l.editoria]||cs.muted;
                const prog=role==="colunista"?(readProgress[user?.colId]||{})[l.id]:null;
                const pct=prog&&prog.total?Math.round(prog.page/prog.total*100):0;
                const allProg=role==="gestor"?COLUMNISTS.map(c=>(readProgress[c.id]||{})[l.id]).filter(Boolean):[];
                const avgPct=allProg.length?Math.round(allProg.reduce((a,p)=>a+(p.total?p.page/p.total:0),0)/allProg.length*100):0;
                return(
                  <div key={l.id||idx} onClick={()=>setViewingPdf(l)}
                    style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start",cursor:"pointer"}}>
                    <div style={{flex:1}}>
                      {l.editoria&&<div style={{fontSize:10,color:ec,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l.editoria}</div>}
                      <div style={{fontSize:14,fontWeight:600,color:cs.text,marginBottom:4}}>{l.titulo}</div>
                      {l.descricao&&<div style={{fontSize:12,color:cs.muted,marginBottom:6}}>{l.descricao}</div>}
                      {role==="colunista"&&pct>0&&<div style={{background:cs.s2,borderRadius:4,height:4,overflow:"hidden",marginTop:4}}><div style={{width:`${pct}%`,background:pct===100?cs.green:cs.accent,height:"100%"}}/></div>}
                      {role==="gestor"&&avgPct>0&&<div style={{fontSize:10,color:cs.dim,marginTop:4}}>{allProg.length} lendo · média {avgPct}%</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      {role==="colunista"&&<div style={{fontSize:12,fontWeight:700,color:pct===100?cs.green:pct>0?cs.amber:cs.dim}}>{pct>0?`${pct}%`:"Ler"}</div>}
                      {role==="gestor"&&(
                        <button onClick={e=>{e.stopPropagation();setLeituras(prev=>prev.filter((_,i)=>i!==idx));}}
                          style={{background:"none",border:"none",color:cs.dim,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </>
      )}

      {adding&&(
        <Modal title="Adicionar Leitura" onClose={()=>setAdding(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><Label>Título *</Label><Input value={form.titulo} onChange={v=>setForm(f=>({...f,titulo:v}))} placeholder="Nome da leitura"/></div>
            <div><Label>Link *</Label><Input value={form.link} onChange={v=>setForm(f=>({...f,link:v}))} placeholder="https://..."/></div>
            <div><Label>Editoria (opcional)</Label>
              <Select value={form.editoria} onChange={v=>setForm(f=>({...f,editoria:v}))} placeholder="— todas as editorias —" options={EDITORIAS.map(e=>({value:e,label:e}))}/>
            </div>
            <div><Label>Descrição</Label><Input value={form.descricao} onChange={v=>setForm(f=>({...f,descricao:v}))} placeholder="Breve descrição do material"/></div>
            <Btn variant="primary" onClick={addLeitura} disabled={!form.titulo||!form.link}>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Trilha de Aprendizado (PDFs por editoria) ─────────────────────────────
function TrilhaTab({ trilha, setTrilha, role, colunista, user, readProgress={}, setReadProgress }) {
  const cs = useC();
  const [viewingPdf, setViewingPdf] = useState(null);
  const [form, setForm] = useState({titulo:"",link:"",editoria:"",descricao:""});
  const [adding, setAdding] = useState(false);

  // Colunista só vê as editorias dele
  const editoriasFiltro = role==="colunista" && colunista ? colunista.editorias : EDITORIAS;
  const filtered = trilha.filter(t=>!t.editoria||editoriasFiltro.includes(t.editoria));

  const addItem = () => {
    if(!form.titulo||!form.link) return;
    setTrilha(prev=>[...prev,{...form,id:Date.now()}]);
    setForm({titulo:"",link:"",editoria:"",descricao:""});setAdding(false);
  };

  const byEditoria = editoriasFiltro.map(ed=>({
    ed,
    items: filtered.filter(t=>t.editoria===ed)
  })).filter(g=>g.items.length>0||(role==="gestor"));

  return (
    <div style={{padding:20,maxWidth:760}}>
      {viewingPdf ? (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:cs.fontDestaque}}>{viewingPdf.titulo}</div>
            <Btn small onClick={()=>setViewingPdf(null)}>← Voltar</Btn>
          </div>
          {role==="gestor" ? (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {COLUMNISTS.map(col=>{
                const prog=(readProgress[col.id]||{})[viewingPdf.id];
                const pct=prog&&prog.total?Math.round(prog.page/prog.total*100):0;
                return(
                  <div key={col.id} style={{display:"flex",alignItems:"center",gap:10,background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"8px 12px",marginBottom:4}}>
                    <Avatar sigla={col.sigla} size={26}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600}}>{col.nome}</div>
                      {prog?<div style={{fontSize:10,color:cs.dim}}>Pág. {prog.page}/{prog.total}</div>:<div style={{fontSize:10,color:cs.dim}}>Não iniciou</div>}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:pct===100?cs.green:pct>0?cs.amber:cs.dim}}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <PdfViewer url={viewingPdf.link} leituraId={viewingPdf.id} colId={user?.colId}
              onProgress={(page,total)=>{ if(setReadProgress&&user?.colId) setReadProgress(user.colId,viewingPdf.id,page,total); }}/>
          )}
        </div>
      ) : (
      <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontSize:16,fontWeight:700,fontFamily:cs.fontDestaque,marginBottom:2}}>Trilha de Aprendizado</div>
          <div style={{fontSize:13,color:cs.muted}}>{role==="colunista"?"Material da sua trilha de formação.":"PDFs e links de formação por editoria."}</div>
        </div>
        {role==="gestor"&&<Btn variant="primary" small onClick={()=>setAdding(true)}>+ Adicionar</Btn>}
      </div>

      {filtered.length===0
        ?<div style={{textAlign:"center",padding:40,color:cs.dim,fontSize:14}}>Nenhum material cadastrado.</div>
        :<div style={{display:"flex",flexDirection:"column",gap:20}}>
          {EDITORIAS.map(ed=>{
            const items = filtered.filter(t=>t.editoria===ed);
            if(items.length===0) return null;
            const ec=ED_COLORS[ed]||cs.muted;
            return(
              <div key={ed}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:4,height:16,background:ec,borderRadius:2}}/>
                  <div style={{fontSize:13,fontWeight:700,color:ec}}>{ed}</div>
                  <span style={{fontSize:11,color:cs.dim}}>({items.length})</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,paddingLeft:12}}>
                  {items.map((item,idx)=>(
                    <div key={item.id||idx} onClick={()=>item.link?.endsWith(".pdf")?setViewingPdf(item):window.open(item.link,"_blank")} style={{background:cs.s1,border:`1px solid ${cs.faint}`,borderRadius:6,padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:cs.text,marginBottom:3}}>{item.titulo}</div>
                        {item.descricao&&<div style={{fontSize:12,color:cs.muted,marginBottom:4}}>{item.descricao}</div>}
                        <a href={item.link} target="_blank" rel="noreferrer" style={{fontSize:12,color:cs.accent,wordBreak:"break-all"}}>
                          {item.link.includes("pdf")?"📄 ":""}{item.link}
                        </a>
                      </div>
                      {role==="gestor"&&(
                        <button onClick={()=>setTrilha(prev=>prev.filter(t=>t.id!==item.id))}
                          style={{background:"none",border:"none",color:cs.dim,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      }
      </div>
      )}

      {adding&&(
        <Modal title="Adicionar Material" onClose={()=>setAdding(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><Label>Editoria *</Label>
              <Select value={form.editoria} onChange={v=>setForm(f=>({...f,editoria:v}))} placeholder="— selecione —" options={EDITORIAS.map(e=>({value:e,label:e}))}/>
            </div>
            <div><Label>Título *</Label><Input value={form.titulo} onChange={v=>setForm(f=>({...f,titulo:v}))} placeholder="Nome do material"/></div>
            <div><Label>Link ou URL do PDF *</Label><Input value={form.link} onChange={v=>setForm(f=>({...f,link:v}))} placeholder="https://... (PDF, artigo, vídeo)"/></div>
            <div><Label>Descrição</Label><Input value={form.descricao} onChange={v=>setForm(f=>({...f,descricao:v}))} placeholder="Breve descrição"/></div>
            <Btn variant="primary" onClick={addItem} disabled={!form.titulo||!form.link}>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────
function AppInner() {
  const cs = useC();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("sx2_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("sx2_tab") || "painel";
  });

  const [texts, setTexts] = useState([]);
  const [contrapartidas, setContrapartidas] = useState({});
  const [contraExtra, setContraExtraState] = useState({});
  const [readProgress, setReadProgressState] = useState({});
  const [theme, setTheme] = useState("dark");

  const [calendar, setCalendar] = useState({});
  const [calPautas, setCalPautasState] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [ideasStatus, setIdeasStatusState] = useState({});
  const [ideiasExtra, setIdeiasExtraState] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [gsStatus, setGsStatus] = useState("conectando");
  const [gsTarefas, setGsTarefas] = useState([]);
  const [gestorProfile, setGestorProfileState] = useState({foto:"",descricao:"",bioLink:"",pronomes:""});
  const [leituras, setLeiturasState] = useState([]);
  const [trilha, setTrilhaState] = useState([]);
  const [briefings, setBriefingsState] = useState([]);

  useEffect(() => {
    let isFetching = false;

    const syncWithSupabase = async () => {
      if (isFetching) return;
      isFetching = true;
      setGsStatus("conectando");

      try {
        const data = await loadAll();
        if (data) {
          // Supabase é confiável — usa diretamente sem merge complexo
          if (data.sx2_texts) setTexts(data.sx2_texts);
          if (data.sx2_contra) setContrapartidas(data.sx2_contra);
          if (data.sx2_contraExtra) setContraExtraState(data.sx2_contraExtra);
        if (data.sx2_readProgress) setReadProgressState(data.sx2_readProgress);
          if (data.sx2_cal) setCalendar(data.sx2_cal);
          if (data.sx2_calPautas) setCalPautasState(data.sx2_calPautas);
          if (data.sx2_notif) setNotifications(data.sx2_notif);
          if (data.sx2_ideas) setIdeasStatusState(data.sx2_ideas);
          if (data.sx2_ideiasExtra) setIdeiasExtraState(data.sx2_ideiasExtra);
          if (data.sx2_passwords) setPasswords(data.sx2_passwords);
          if (data.sx2_gestorProfile) setGestorProfileState(data.sx2_gestorProfile);
          if (data.sx2_leituras) setLeiturasState(data.sx2_leituras);
          if (data.sx2_trilha) setTrilhaState(data.sx2_trilha);
          if (data.sx2_briefings) setBriefingsState(data.sx2_briefings);
          setGsStatus("conectado");
        } else {
          setGsStatus("offline");
        }
      } catch (_) {
        setGsStatus("offline");
      }
      isFetching = false;
    };

    async function init() {
      const [t, co, ce, cal, cp, n, i, ie, p, l, tr, br] = await Promise.all([
        load("sx2_texts", []),
        load("sx2_contra", {}),
        load("sx2_contraExtra", {}),
        load("sx2_cal", {}),
        load("sx2_calPautas", {}),
        load("sx2_notif", []),
        load("sx2_ideas", {}),
        load("sx2_ideiasExtra", []),
        load("sx2_passwords", {}),
        load("sx2_leituras", []),
        load("sx2_trilha", []),
        load("sx2_briefings", []),
        load("sx2_gestorProfile", {foto:"",descricao:"",bioLink:"",pronomes:""}),
      ]);

      // Seed histórico de publicações: Matheus e Moon Kenzo já têm 1 publicado
      const seedTexts = t.length === 0 ? [
        {id:1,colId:6,colunistaNome:"Matheus Theodore",titulo:"Melly e o álbum que reacende a chama por dentro",editoria:"Cultura Queer e Trans",dataEntrega:"2026-06-07",dataPublicacao:"2026-06-10",status:"Publicado",dataSubmissao:"07/06/2026",link:"https://ssexbbox.com/melly-e-o-album-que-reacende-a-chama-por-dentro/",obs:"Texto inaugural"},
        {id:2,colId:9,colunistaNome:"Moon Kenzo",titulo:"Turistas da Submissão: você quer o fetiche mas não aguenta",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataEntrega:"2026-06-02",dataPublicacao:"2026-06-05",status:"Publicado",dataSubmissao:"02/06/2026",link:"https://ssexbbox.com/turistas-da-submissao-voce-quer-o-fetiche-mas-nao-aguenta/",obs:"Texto inaugural"},
      ] : t;

      // Seed tasks from schedule if not already in texts
      const existingKeys = new Set(seedTexts.map(t=>t.key||"").filter(Boolean));
      const missingTasks = TASK_SCHEDULE.filter(task => !existingKeys.has(task.key));

      // Sync dates: update any existing task whose dates differ from TASK_SCHEDULE
      const scheduleByKey = Object.fromEntries(TASK_SCHEDULE.map(t=>[t.key, t]));
      let datesUpdated = false;
      const syncedTexts = seedTexts.map(t => {
        const sched = scheduleByKey[t.key];
        if (sched && (t.dataPublicacao !== sched.dataPublicacao || t.dataEntrega !== sched.dataEntrega)) {
          datesUpdated = true;
          return { ...t, dataPublicacao: sched.dataPublicacao, dataEntrega: sched.dataEntrega };
        }
        return t;
      });

      const allTexts = [...syncedTexts, ...missingTasks];
      setTexts(allTexts);
      if(t.length===0 || missingTasks.length > 0 || datesUpdated) save("sx2_texts", allTexts);
      setContrapartidas(co);
      setContraExtraState(ce);
      setCalendar(cal);
      setCalPautasState(cp);
      setNotifications(n);
      setIdeasStatusState(i);
      setIdeiasExtraState(ie);
      setPasswords(p);
      setLeiturasState(l);
      setTrilhaState(tr);
      setBriefingsState(br);
      setLoaded(true);

      setTimeout(syncWithSupabase, 500);
    }

    init();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncWithSupabase();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const addText = useCallback((text) => {
    const entry = {
      ...text,
      id: Date.now(),
      dataSubmissao: new Date().toLocaleDateString("pt-BR"),
      status: text.status || "Enviado",
    };
    setTexts((prev) => {
      const n = [...prev, entry];
      save("sx2_texts", n);
      return n;
    });
    if (!text.status || text.status === "Enviado") {
      const notif = {
        id: Date.now() + 1,
        mensagem: `Novo texto: "${text.titulo}" por ${text.colunistaNome}`,
        data: new Date().toLocaleDateString("pt-BR"),
        lida: false,
      };
      setNotifications((prev) => {
        const n = [notif, ...prev];
        save("sx2_notif", n);
        return n;
      });
    }
  }, []);

  const updateTextStatus = useCallback((id, status, extra = {}) => {
    setTexts((prev) => {
      const found = prev.find(t=>t.id===id);
      const histEntry = {status, ts: new Date().toISOString()};
      const statusHistory = [...(found?.statusHistory||[]), histEntry];
      const n = prev.map((t) => t.id === id ? { ...t, status, ...extra, statusHistory } : t);
      save("sx2_texts", n);
      if(status==="Enviado" && found) {
        setNotifications(prev=>{
          const notif={id:Date.now(),textId:id,colunistaNome:found.colunistaNome,titulo:found.titulo,ts:new Date().toISOString(),read:false,type:"entrega"};
          const nn=[notif,...prev]; save("sx2_notifs",nn); return nn;
        });
      }
      return n;
    });
  }, []);

  const toggleContrapartida = useCallback((colId, tipo) => {
    setContrapartidas((prev) => {
      const n = {
        ...prev,
        [colId]: { ...prev[colId], [tipo]: !prev[colId]?.[tipo] },
      };
      save("sx2_contra", n);
      return n;
    });
  }, []);

  const setReadProgress = useCallback((colId, leituraId, page, total) => {
    setReadProgressState(prev => {
      const n = {...prev, [colId]: {...(prev[colId]||{}), [leituraId]: {page, total, lastRead: new Date().toISOString()}}};
      save("sx2_readProgress", n);
      return n;
    });
  }, []);

  const setContraExtra = useCallback((fn) => {
    setContraExtraState((prev) => {
      const n = typeof fn === "function" ? fn(prev) : fn;
      save("sx2_contraExtra", n);
      return n;
    });
  }, []);

  const toggleCalendar = useCallback((colId, mes) => {
    setCalendar((prev) => {
      const cur = prev[colId] || [];
      const n = {
        ...prev,
        [colId]: cur.includes(mes)
          ? cur.filter((m) => m !== mes)
          : [...cur, mes],
      };
      save("sx2_cal", n);
      return n;
    });
  }, []);

  const setCalPautas = useCallback((v) => {
    setCalPautasState(v);
  }, []);

  const setIdeaStatus = useCallback((key, status) => {
    setIdeasStatusState((prev) => {
      const n = { ...prev, [key]: status };
      save("sx2_ideas", n);
      return n;
    });
  }, []);

  const addIdeia = useCallback((idea) => {
    setIdeiasExtraState((prev) => {
      const n = [...prev, idea];
      save("sx2_ideiasExtra", n);
      return n;
    });
  }, []);

  const markNotifRead = useCallback((id) => {
    setNotifications((prev) => {
      const n = prev.map((x) => (x.id === id ? { ...x, lida: true } : x));
      save("sx2_notif", n);
      return n;
    });
  }, []);

  const savePasswords = useCallback((p) => {
    setPasswords(p);
    save("sx2_passwords", p);
  }, []);

  const setGestorProfile = useCallback((data) => {
    setGestorProfileState(data);
    save("sx2_gestorProfile", data);
  }, []);

  const setLeituras = useCallback((fn) => {
    setLeiturasState((prev) => {
      const n = typeof fn === "function" ? fn(prev) : fn;
      save("sx2_leituras", n);
      return n;
    });
  }, []);

  const setTrilha = useCallback((fn) => {
    setTrilhaState((prev) => {
      const n = typeof fn === "function" ? fn(prev) : fn;
      save("sx2_trilha", n);
      return n;
    });
  }, []);

  const addBriefing = useCallback((b) => {
    setBriefingsState((prev) => {
      const n = [...prev, { ...b, id: Date.now() }];
      save("sx2_briefings", n);
      return n;
    });
  }, []);

  const handleLogin = useCallback((u) => {
    setUser(u);
    const startTab = u.role === "gestor" ? "painel" : "enviar";
    setTab(startTab);
    localStorage.setItem("sx2_session", JSON.stringify(u));
    localStorage.setItem("sx2_tab", startTab);
  }, []);

  if (!loaded)
    return (
      <div
        style={{
          background: cs.bg,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: cs.accent,
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        carregando...
      </div>
    );
  if (!user)
    return (
      <LoginScreen
        onLogin={handleLogin}
        passwords={passwords}
        savePasswords={savePasswords}
      />
    );

  const colunista =
    user.role === "colunista"
      ? COLUMNISTS.find((c) => c.id === user.colId)
      : null;
  const unread = notifications.filter((n) => !n.lida).length;

  return (
    <ThemeCtx.Provider value={theme}>
    <>
    {theme === "light" && (
      <style>{`
        .rainbow-card-top::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1900ff, #0098fa, #00ff6e, #fff700, #ff8414, #ff575b);
        }
        .light-mode-card {
          box-shadow: 0 1px 6px rgba(0,0,0,0.07);
          border: 1px solid #E8E8E8 !important;
        }
      `}</style>
    )}
    <div
      style={{
        background: cs.bg,
        minHeight: "100vh",
        fontFamily: cs.fontBase,
        color: cs.text,
      }}
    >
      <NavBar
        user={user}
        colunista={colunista}
        activeTab={tab}
        setActiveTab={(t) => {
          setTab(t);
          localStorage.setItem("sx2_tab", t);
        }}
        notifCount={unread}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("sx2_session");
          localStorage.removeItem("sx2_tab");
        }}
        gsStatus={gsStatus}
        contraExtra={contraExtra}
        theme={theme}
        setTheme={setTheme}
      />
      {user.role === "gestor" ? (
        <>
          {tab === "painel" && (
            <PainelTab
              texts={texts}
              updateTextStatus={updateTextStatus}
              notifications={notifications}
              markNotifRead={markNotifRead}
              contraExtra={contraExtra}
              gestorProfile={gestorProfile}
              setGestorProfile={setGestorProfile}
              user={user}
            />
          )}
          {tab === "ideias" && (
            <IdeiaTab
              ideasStatus={ideasStatus}
              setIdeaStatus={setIdeaStatus}
              addText={addText}
              gsTarefas={gsTarefas}
              ideiasExtra={ideiasExtra}
              addIdeia={addIdeia}
              contraExtra={contraExtra}
              texts={texts}
              updateTextStatus={updateTextStatus}
            />
          )}
          {tab === "contrapartidas" && (
            <ContrapartidasTab
              contrapartidas={contrapartidas}
              toggleContrapartida={toggleContrapartida}
              texts={texts}
              contraExtra={contraExtra}
              setContraExtra={setContraExtra}
            />
          )}
          {tab === "calendario" && (
            <CalendarioTab
              calendar={calendar}
              texts={texts}
              calPautas={calPautas}
              setCalPautas={setCalPautas}
            />
          )}
          {tab === "colunistas" && (
            <ColunistasTab texts={texts} contraExtra={contraExtra} setContraExtra={setContraExtra} briefings={briefings}/>
          )}
          {tab === "briefing" && (
            <BriefingTab briefings={briefings} addBriefing={addBriefing} texts={texts} updateTextStatus={updateTextStatus}/>
          )}
          {tab === "leituras" && (
            <LeiturasTab leituras={leituras} setLeituras={setLeituras} role="gestor" user={user} readProgress={readProgress} setReadProgress={setReadProgress}/>
          )}
          {tab === "trilha" && (
            <TrilhaTab trilha={trilha} setTrilha={setTrilha} role="gestor" user={user} readProgress={readProgress} setReadProgress={setReadProgress}/>
          )}
        </>
      ) : (
        <>
          {tab === "enviar" && (
            <EnviarTab
              colunista={colunista}
              addText={addText}
              addIdeia={addIdeia}
              texts={texts}
              contraExtra={contraExtra}
              setContraExtra={setContraExtra}
              updateTextStatus={updateTextStatus}
            />
          )}
          {tab === "meus" && (
            <MeusTextosTab
              texts={texts.filter((t) => t.colId === user.colId)}
              colunista={colunista}
              contraExtra={contraExtra}
              setContraExtra={setContraExtra}
              updateTextStatus={updateTextStatus}
            />
          )}
          {tab === "calendario" && (
            <MeuCalendarioTab
              texts={texts}
              colunista={colunista}
            />
          )}
          {tab === "contrapartidas" && (
            <MinhasContrapartidasTab
              contrapartidas={contrapartidas[user.colId] || {}}
            />
          )}
          {tab === "leituras" && (
            <LeiturasTab leituras={leituras} role="colunista" user={user} readProgress={readProgress} setReadProgress={setReadProgress}/>
          )}
          {tab === "trilha" && (
            <TrilhaTab trilha={trilha} role="colunista" colunista={colunista}/>
          )}
        </>
      )}
      {/* ── Chat flotante ── */}
      <ChatFloat
        user={user}
        colunista={colunista}
        gestorProfile={gestorProfile}
        contraExtra={contraExtra}
      />
    </div>
    </>
    </ThemeCtx.Provider>
  );
}const TASK_SCHEDULE = [
  {id:20000,colId:6,colunistaNome:"Matheus Theodore",titulo:"Jornada do azarão: como corpos marginalizados criam novas narrativas",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-22",dataEntrega:"2026-06-19",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"6_0"},
  {id:20001,colId:6,colunistaNome:"Matheus Theodore",titulo:"Comunidade BDSM e por que é acolhedora para corpos dissidentes",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-09",dataEntrega:"2026-07-06",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"6_1"},
  {id:20002,colId:6,colunistaNome:"Matheus Theodore",titulo:"Juventude preta com gênero fluido e expressões pouco populares",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-28",dataEntrega:"2026-07-24",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"6_2"},
  {id:20003,colId:9,colunistaNome:"Moon Kenzo",titulo:"O mito do fast-sex: Por que não estou perdendo nada ao recusar 15 minutos de nada",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-06-22",dataEntrega:"2026-06-19",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"9_0"},
  {id:20004,colId:9,colunistaNome:"Moon Kenzo",titulo:"Turistas da Submissão: você quer o fetiche mas não aguenta",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-10",dataEntrega:"2026-07-07",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"9_1"},
  {id:20005,colId:9,colunistaNome:"Moon Kenzo",titulo:"A Solidão de Quem Transcende: O preço de não ser a fácil",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-29",dataEntrega:"2026-07-24",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"9_2"},
  {id:20006,colId:10,colunistaNome:"Sabrina Kali Nogueira Marinho",titulo:"Amor e solidão: sentimentos opostos que se parecem nos relacionamentos",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-06-22",dataEntrega:"2026-06-19",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"10_0"},
  {id:20007,colId:10,colunistaNome:"Sabrina Kali Nogueira Marinho",titulo:"Pajubá e Gualín do TTK: dialetos nascidos na ditadura militar",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-07-10",dataEntrega:"2026-07-07",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"10_1"},
  {id:20008,colId:10,colunistaNome:"Sabrina Kali Nogueira Marinho",titulo:"Segregades do amor: a comunidade trans e a exclusão do amor romântico",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-07-29",dataEntrega:"2026-07-24",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"10_2"},
  {id:20009,colId:12,colunistaNome:"Benjamim Siqueira Souto",titulo:"Desconstrução da cisheteronormatividade na arte contemporânea",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-06-23",dataEntrega:"2026-06-19",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"12_0"},
  {id:20010,colId:12,colunistaNome:"Benjamim Siqueira Souto",titulo:"Estética do desejo dissidente e as Não-Imagens",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-07-10",dataEntrega:"2026-07-07",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"12_1"},
  {id:20011,colId:12,colunistaNome:"Benjamim Siqueira Souto",titulo:"Ficção científica como ferramenta de autoconhecimento LGBTQIA+",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-07-29",dataEntrega:"2026-07-24",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"12_2"},
  {id:20012,colId:13,colunistaNome:"Isabella Piana",titulo:"Como a heterossexualidade compulsória ainda exige que LGBT performem papéis tradicionais",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-24",dataEntrega:"2026-06-19",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"13_0"},
  {id:20013,colId:13,colunistaNome:"Isabella Piana",titulo:"Como a pornografia molda nossos relacionamentos e a cultura",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-13",dataEntrega:"2026-07-10",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"13_1"},
  {id:20014,colId:13,colunistaNome:"Isabella Piana",titulo:"Isso é mais queer do que você pensa: o que a cultura queer criou e a heteronormatividade apropriou",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-30",dataEntrega:"2026-07-27",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"13_2"},
  {id:20015,colId:14,colunistaNome:"Raphael Mello",titulo:"Entre o desejo e a sobrevivência: relacionamentos LGBT e afeto na contemporaneidade",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-24",dataEntrega:"2026-06-19",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"14_0"},
  {id:20016,colId:14,colunistaNome:"Raphael Mello",titulo:"Corpos desejáveis, corpos descartáveis: o mercado afetivo dentro da comunidade LGBT",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-13",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"14_1"},
  {id:20017,colId:14,colunistaNome:"Raphael Mello",titulo:"Quando sair do armário não basta: marcas psíquicas da colonialidade nos afetos LGBT",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-31",dataEntrega:"2026-07-28",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"14_2"},
  {id:20018,colId:15,colunistaNome:"Eduardo Barbosa",titulo:"Não-monogamia é mesmo uma política subversiva para homens gays",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-24",dataEntrega:"2026-06-19",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"15_0"},
  {id:20019,colId:15,colunistaNome:"Eduardo Barbosa",titulo:"O corpo musculoso da bicha é um problema para quem",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-13",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"15_1"},
  {id:20020,colId:15,colunistaNome:"Eduardo Barbosa",titulo:"Por que o gay preto é pra sexo e o gay branco é pra namoro — uma análise racial dos afetos gays",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-31",dataEntrega:"2026-07-28",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"15_2"},
  {id:20021,colId:16,colunistaNome:"Callisto Jasmim Rodrigues Melo",titulo:"Como a geração Z está preservando e inovando os ballrooms",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-25",dataEntrega:"2026-06-22",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"16_0"},
  {id:20022,colId:16,colunistaNome:"Callisto Jasmim Rodrigues Melo",titulo:"Entrevistas LGBTQIAPN+ das décadas de 50 a 90 com documentos de memória afetiva",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-14",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"16_1"},
  {id:20023,colId:16,colunistaNome:"Callisto Jasmim Rodrigues Melo",titulo:"O que as práticas sexuais de pessoas trans revelam sobre como a sociedade as enxerga",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-31",dataEntrega:"2026-07-28",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"16_2"},
  {id:20024,colId:18,colunistaNome:"Guilherme Clisma Araujo de Sousa",titulo:"Sexo, afeto e liberdade: desaprendendo padrões para criar relações mais honestas",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-26",dataEntrega:"2026-06-23",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"18_0"},
  {id:20025,colId:18,colunistaNome:"Guilherme Clisma Araujo de Sousa",titulo:"O corpo como território político: o que nossos desejos dizem sobre quem somos",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-15",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"18_1"},
  {id:20026,colId:18,colunistaNome:"Guilherme Clisma Araujo de Sousa",titulo:"Prazer também é política: como o corpo se torna espaço de autonomia e resistência",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-03",dataEntrega:"2026-07-31",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"18_2"},
  {id:20027,colId:20,colunistaNome:"José Luiz Alves Neto",titulo:"Vida e memória insubmissas de pessoas LGBTQIA+ interioranas",editoria:"História e Memória Política",dataPublicacao:"2026-06-26",dataEntrega:"2026-06-23",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"20_0"},
  {id:20028,colId:20,colunistaNome:"José Luiz Alves Neto",titulo:"Economia política do sexo no mundo globalizado",editoria:"História e Memória Política",dataPublicacao:"2026-07-15",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"20_1"},
  {id:20029,colId:20,colunistaNome:"José Luiz Alves Neto",titulo:"Relações de gênero e educação voltadas à diferença",editoria:"História e Memória Política",dataPublicacao:"2026-08-03",dataEntrega:"2026-07-31",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"20_2"},
  {id:20030,colId:21,colunistaNome:"Mariana Freire de Moraes",titulo:"O corpo do artista queer contemporâneo: na poesia, no teatro, na fotografia",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-26",dataEntrega:"2026-06-23",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"21_0"},
  {id:20031,colId:21,colunistaNome:"Mariana Freire de Moraes",titulo:"Literatura lésbica brasileira: o erotismo nas obras",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-15",dataEntrega:"2026-07-10",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"21_1"},
  {id:20032,colId:21,colunistaNome:"Mariana Freire de Moraes",titulo:"A rua e o flâneur queer: sempre estivemos nas ruas e a rua sempre foi o lugar do nosso desejo",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-03",dataEntrega:"2026-07-31",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"21_2"},
  {id:20033,colId:22,colunistaNome:"Rafaela Silva Mancini",titulo:"Corpos femininos e a proteção contra ISTs",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-06-29",dataEntrega:"2026-06-26",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"22_0"},
  {id:20034,colId:22,colunistaNome:"Rafaela Silva Mancini",titulo:"Corpo e Ocupação: em quais lugares estamos",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-07-16",dataEntrega:"2026-07-13",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"22_1"},
  {id:20035,colId:22,colunistaNome:"Rafaela Silva Mancini",titulo:"Quem dita a palavra do corpo feminino",editoria:"Linguagem Neutra e Inovação Linguística",dataPublicacao:"2026-08-04",dataEntrega:"2026-07-31",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"22_2"},
  {id:20036,colId:23,colunistaNome:"Hayllon Pessoa",titulo:"Do queer ao cuir: a dissidência reinventada pelo cinema latino-americano",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-29",dataEntrega:"2026-06-26",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"23_0"},
  {id:20037,colId:23,colunistaNome:"Hayllon Pessoa",titulo:"Cinema queer nordestino: corpos dissidentes longe do eixo",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-17",dataEntrega:"2026-07-14",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"23_1"},
  {id:20038,colId:23,colunistaNome:"Hayllon Pessoa",titulo:"O fim inevitável: repensando o sofrimento LGBTQIA+ nas telas",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-05",dataEntrega:"2026-07-31",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"23_2"},
  {id:20039,colId:24,colunistaNome:"Jaime Santana Neto",titulo:"Discutindo relações gays: dinâmicas e tabus",editoria:"História e Memória Política",dataPublicacao:"2026-06-29",dataEntrega:"2026-06-26",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"24_0"},
  {id:20040,colId:24,colunistaNome:"Jaime Santana Neto",titulo:"Homens gays 40+: escolhas e sacrifícios",editoria:"História e Memória Política",dataPublicacao:"2026-07-17",dataEntrega:"2026-07-14",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"24_1"},
  {id:20041,colId:24,colunistaNome:"Jaime Santana Neto",titulo:"Solidão homoafetiva e seus desafios",editoria:"História e Memória Política",dataPublicacao:"2026-08-05",dataEntrega:"2026-07-31",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"24_2"},
  {id:20042,colId:25,colunistaNome:"Arthur Monteiro",titulo:"O techno como expoente queer no Brasil e no mundo",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-06-30",dataEntrega:"2026-06-26",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"25_0"},
  {id:20043,colId:25,colunistaNome:"Arthur Monteiro",titulo:"Dez anos da MPB mais queer que nunca: linha temporal 2016-2026",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-17",dataEntrega:"2026-07-14",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"25_1"},
  {id:20044,colId:25,colunistaNome:"Arthur Monteiro",titulo:"O preço de ser LGBT na cultura pop dos anos 80",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-05",dataEntrega:"2026-07-31",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"25_2"},
  {id:20045,colId:28,colunistaNome:"Hélio Lucas Carvalho Gonçalves",titulo:"Quem tem medo de gênero nas escolas",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-01",dataEntrega:"2026-06-26",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"28_0"},
  {id:20046,colId:28,colunistaNome:"Hélio Lucas Carvalho Gonçalves",titulo:"A nova pornografia política: deepfakes sexuais como arma",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-20",dataEntrega:"2026-07-17",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"28_1"},
  {id:20047,colId:28,colunistaNome:"Hélio Lucas Carvalho Gonçalves",titulo:"A bancada do pânico moral: quando proteger crianças vira desculpa para apagar diversidade",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-06",dataEntrega:"2026-08-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"28_2"},
  {id:20048,colId:29,colunistaNome:"Lucas José Oliveira Souza",titulo:"SEXO É SÓ TEATRAL: sobre minha redescoberta com a prática sexual",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-01",dataEntrega:"2026-06-26",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"29_0"},
  {id:20049,colId:29,colunistaNome:"Lucas José Oliveira Souza",titulo:"XUXA E A INSERÇÃO QUEER NA TV",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-20",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"29_1"},
  {id:20050,colId:29,colunistaNome:"Lucas José Oliveira Souza",titulo:"GRAFISMO DE MULHERES CIS E TRANS: arte e expressão no interior de Pernambuco",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-07",dataEntrega:"2026-08-04",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"29_2"},
  {id:20051,colId:30,colunistaNome:"Pedro Augusto Pinto Luz",titulo:"Hannah de Girls e a relação com o corpo enquanto pessoa gorda",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-01",dataEntrega:"2026-06-26",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"30_0"},
  {id:20052,colId:30,colunistaNome:"Pedro Augusto Pinto Luz",titulo:"Paralelos entre cultura pop e experiências pessoais LGBTQ+",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-20",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"30_1"},
  {id:20053,colId:30,colunistaNome:"Pedro Augusto Pinto Luz",titulo:"A escrita como necessidade: quando o outro me reconhece no texto",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-07",dataEntrega:"2026-08-04",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"30_2"},
  {id:20054,colId:33,colunistaNome:"Vicente Buccarini",titulo:"Masturbação: tabus e revelações",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-02",dataEntrega:"2026-06-29",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"33_0"},
  {id:20055,colId:33,colunistaNome:"Vicente Buccarini",titulo:"Banheiros masculinos como espaço de sociabilidade e repressão",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-21",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"33_1"},
  {id:20056,colId:33,colunistaNome:"Vicente Buccarini",titulo:"Cultura tecno e os corpos que a habitam",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-07",dataEntrega:"2026-08-04",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"33_2"},
  {id:20057,colId:34,colunistaNome:"Isabela",titulo:"Direitos reprodutivos: pautas para corpos que geram",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-03",dataEntrega:"2026-06-30",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"34_0"},
  {id:20058,colId:34,colunistaNome:"Isabela",titulo:"Gênero e identidade étnica: a emancipação das mulheres árabes",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-22",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"34_1"},
  {id:20059,colId:34,colunistaNome:"Isabela",titulo:"Cultura da pista de dança (ballroom, vogue) e histórias de resistência",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-10",dataEntrega:"2026-08-07",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"34_2"},
  {id:20060,colId:35,colunistaNome:"Maria Clara Rocha e Silva",titulo:"Espelhos Distorcidos: deepfakes pornôs contra mulheres na política",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-03",dataEntrega:"2026-06-30",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"35_0"},
  {id:20061,colId:35,colunistaNome:"Maria Clara Rocha e Silva",titulo:"Do romance de banca ao áudio por assinatura: erotismo pensado para mulheres",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-22",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"35_1"},
  {id:20062,colId:35,colunistaNome:"Maria Clara Rocha e Silva",titulo:"Milo J e ancestralidade como disputa por pertencimento",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-10",dataEntrega:"2026-08-07",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"35_2"},
  {id:20063,colId:37,colunistaNome:"Maria Eduarda Amorim",titulo:"A mulher cis e a masturbação: tabu e normalidade",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-03",dataEntrega:"2026-06-30",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"37_0"},
  {id:20064,colId:37,colunistaNome:"Maria Eduarda Amorim",titulo:"O trabalho sexual na contemporaneidade: neoliberalismo e OnlyFans",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-22",dataEntrega:"2026-07-17",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"37_1"},
  {id:20065,colId:37,colunistaNome:"Maria Eduarda Amorim",titulo:"A teoria queer através de Gayle Rubin",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-10",dataEntrega:"2026-08-07",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"37_2"},
  {id:20066,colId:38,colunistaNome:"Jean",titulo:"Abuso sexual de meninos gays: o silêncio que adoece",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-06",dataEntrega:"2026-07-03",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"38_0"},
  {id:20067,colId:38,colunistaNome:"Jean",titulo:"Pornografia na construção do imaginário erótico gay",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-23",dataEntrega:"2026-07-20",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"38_1"},
  {id:20068,colId:38,colunistaNome:"Jean",titulo:"Como o belohorizontino flerta fora dos aplicativos",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-08-11",dataEntrega:"2026-08-07",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"38_2"},
  {id:20069,colId:39,colunistaNome:"Ágatha Sirigni Nunes",titulo:"A construção histórica da monogamia como modelo dominante",editoria:"História e Memória Política",dataPublicacao:"2026-07-06",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"39_0"},
  {id:20070,colId:39,colunistaNome:"Ágatha Sirigni Nunes",titulo:"A ausência de referências LGBTQIAPN+ durante a infância",editoria:"História e Memória Política",dataPublicacao:"2026-07-24",dataEntrega:"2026-07-21",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"39_1"},
  {id:20071,colId:39,colunistaNome:"Ágatha Sirigni Nunes",titulo:"Por que os homens ocupam posição de sujeito nas narrativas sobre sexo",editoria:"História e Memória Política",dataPublicacao:"2026-08-12",dataEntrega:"2026-08-07",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"39_2"},
  {id:20072,colId:43,colunistaNome:"Amanda Alves Braga",titulo:"A comunidade queer é cronicamente online",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-06",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"43_0"},
  {id:20073,colId:43,colunistaNome:"Amanda Alves Braga",titulo:"O que o BDSM pode ensinar sobre comunicação e consentimento",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-24",dataEntrega:"2026-07-21",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"43_1"},
  {id:20074,colId:43,colunistaNome:"Amanda Alves Braga",titulo:"A linguagem queer secreta: códigos e encontros antes da era digital",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-12",dataEntrega:"2026-08-07",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"43_2"},
  {id:20075,colId:46,colunistaNome:"Maria Eduarda Neves Costa",titulo:"A ausência de lésbicas masc na dramaturgia brasileira",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-07",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"46_0"},
  {id:20076,colId:46,colunistaNome:"Maria Eduarda Neves Costa",titulo:"Novas possibilidades imagéticas da experiência lésbica",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-24",dataEntrega:"2026-07-21",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"46_1"},
  {id:20077,colId:46,colunistaNome:"Maria Eduarda Neves Costa",titulo:"Qual a conceptualização discursiva da mulher sáfica nas redes sociais",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-12",dataEntrega:"2026-08-07",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"46_2"},
  {id:20078,colId:52,colunistaNome:"Gabriel Jóia de Macedo",titulo:"Masculinidades trans em pauta: Como faz a barba",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-08",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"52_0"},
  {id:20079,colId:52,colunistaNome:"Gabriel Jóia de Macedo",titulo:"Existe amor para esse corpo trans",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-27",dataEntrega:"2026-07-24",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"52_1"},
  {id:20080,colId:52,colunistaNome:"Gabriel Jóia de Macedo",titulo:"Pode um homem trans ser jogador de futebol",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-13",dataEntrega:"2026-08-10",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"52_2"},
  {id:20081,colId:53,colunistaNome:"Débora Adones",titulo:"A vivência LGBTQ+ nas cidades de pequeno porte do Brasil",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-08",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"53_0"},
  {id:20082,colId:53,colunistaNome:"Débora Adones",titulo:"Como personagens explosivos fazem alusão à vivência queer no cinema",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-07-27",dataEntrega:"2026-07-24",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"53_1"},
  {id:20083,colId:53,colunistaNome:"Débora Adones",titulo:"A democratização da educação sexual LGBTQ+ pela internet",editoria:"Cultura Queer e Trans",dataPublicacao:"2026-08-14",dataEntrega:"2026-08-11",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"53_2"},
  {id:20084,colId:56,colunistaNome:"Lucas Brito",titulo:"Sexo em locais públicos como cartografia do desejo nas cidades",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-08",dataEntrega:"2026-07-03",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"56_0"},
  {id:20085,colId:56,colunistaNome:"Lucas Brito",titulo:"Sexo e o ambiente da política brasileira",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-07-27",dataEntrega:"2026-07-24",horario:"10:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"56_1"},
  {id:20086,colId:56,colunistaNome:"Lucas Brito",titulo:"Quanto mais sexo, menos sexo: jovens e a recessão sexual",editoria:"Práticas Sexuais, Corpo e Relacionamentos",dataPublicacao:"2026-08-14",dataEntrega:"2026-08-11",horario:"12:00",status:"Pendente",dataSubmissao:"14/06/2026",link:"",obs:"Tarefa do banco de ideias",briefing:"",key:"56_2"}
];



// ── Gestores ─────────────────────────────────────────────────────────────
const GESTORES = [
  {
    email: "criacao@ssexbbox.com",
    senha: "g3staoss3xbb0x",
    nome: "João Pedro Fontes",
    pronomes: "",
    foto: "",
    descricao: "",
    bioLink: "",
  },
  {
    email: "bertucci@ssexbbox.com",
    senha: "g3staoss3xbb0x",
    nome: "Lyon Adryan Ror",
    pronomes: "ILE/DILE ; ELE/DELE",
    foto: "https://ssexbbox.com/wp-content/uploads/2026/02/PRI-BERTUCCI.jpg",
    descricao: "Artista social, educadore e pesquisadore da área de diversidade há pelo menos duas décadas",
    bioLink: "",
  },
];
export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}