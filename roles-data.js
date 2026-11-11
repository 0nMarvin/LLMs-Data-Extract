/* Papéis do jogo (antes data/roles.json). Edite aqui. */
const UW_ROLES = [
 {
  "name": "Alpha Wolf",
  "pt": "Lobo Alfa",
  "adj": -9,
  "grupo": "lobos",
  "tags": [
   "lobos_especiais"
  ],
  "max": 1,
  "acao": "Uma vez por jogo, escolhe alguém para virar lobo.",
  "conferir": true,
  "noite": {
   "ordem": 81,
   "quando": "once",
   "fala": "Lobo Alfa, abra os olhos; deseja transformar alguém em lobo?"
  },
  "detalhe": null,
  "variantes": [],
  "time": "lobos"
 },
 {
  "name": "Apprentice Seer",
  "pt": "Vidente Aprendiz",
  "adj": 4,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Se a Vidente morrer, vira a nova Vidente.",
  "conferir": false,
  "noite": {
   "ordem": 120,
   "quando": "trigger",
   "fala": "Aprendiz, abra os olhos: a Vidente morreu, você é a nova Vidente."
  },
  "detalhe": "Assume o papel de Vidente se ela for eliminada. Quando isso acontece, o narrador avisa com um toque no ombro durante a chamada da Vidente (se os papéis não forem revelados), e o Aprendiz passa a acordar no lugar dela.",
  "variantes": [
   "Além de herdar o papel, escolhe um jogador por noite, mas só descobre se é lobo depois de apontar a mesma pessoa duas vezes (exige mais anotações do narrador)."
  ],
  "ident": {
   "ordem": 8,
   "fala": "Vidente Aprendiz, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: quando a Vidente morrer, acorde-o na chamada dela e toque no ombro."
  },
  "time": "vila"
 },
 {
  "name": "Aura Seer",
  "pt": "Vidente de Aura",
  "adj": 3,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Toda noite, procura alguém que não seja vila comum nem lobo.",
  "conferir": false,
  "noite": {
   "ordem": 112,
   "quando": "every",
   "fala": "Vidente de Aura, abra os olhos e aponte um jogador."
  },
  "detalhe": "Procura jogadores com poder especial, ou seja, que não sejam Aldeões comuns nem Lobisomens comuns. Quanto mais papéis especiais na vila, mais forte ela fica. Inclua ao menos um papel especial do lado inimigo (como a Feiticeira) para ela não virar só um detector de vila.",
  "variantes": [
   "Descobre se o alvo é do time da vila; só use com muitos papéis não-aldeões (pelo menos 3, além dos lobos comuns). Amaldiçoado, Doppelganger e Bêbado aparecem no time em que estão no momento."
  ],
  "time": "vila"
 },
 {
  "name": "Bodyguard",
  "pt": "Guarda-costas",
  "adj": 3,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Toda noite, escolhe um jogador que não poderá ser eliminado naquela noite.",
  "conferir": false,
  "noite": {
   "ordem": 40,
   "quando": "every",
   "fala": "Guarda-costas, abra os olhos e escolha quem proteger."
  },
  "detalhe": "Protege um jogador por noite, diferente do da noite anterior; o protegido não pode ser eliminado naquela noite. Não pode proteger a si mesmo.",
  "variantes": [
   "Não pode proteger a mesma pessoa duas vezes no jogo todo.",
   "O protegido não pode ser eliminado no dia seguinte."
  ],
  "time": "vila"
 },
 {
  "name": "Cult Leader",
  "pt": "Líder de Culto",
  "adj": 1,
  "grupo": "culto",
  "tags": [
   "culto"
  ],
  "max": 1,
  "acao": "Toda noite, escolhe alguém para entrar no culto. Vence se todos os jogadores forem do culto.",
  "conferir": false,
  "noite": {
   "ordem": 70,
   "quando": "every",
   "fala": "Líder de Culto, abra os olhos e escolha um novo membro."
  },
  "detalhe": "Escolhe um jogador por noite para entrar no culto (o escolhido não sabe). Só vence se todos os jogadores vivos forem do culto, não sendo obrigatório incluí-lo. As condições de vitória dos outros times continuam valendo. O narrador mantém a lista de membros.",
  "variantes": [
   "Se o Líder morrer, o primeiro membro recrutado vira o novo Líder (toque no ombro) e segue recrutando, sem perder seu outro papel. Vence junto com os líderes anteriores, só se restarem apenas membros do culto."
  ],
  "time": "culto"
 },
 {
  "name": "Cupid",
  "pt": "Cupido",
  "adj": -3,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Na 1ª noite, escolhe dois jogadores. Se um for eliminado, o outro também será.",
  "conferir": false,
  "noite": {
   "ordem": 20,
   "quando": "first",
   "fala": "Cupido, abra os olhos e escolha os dois amantes."
  },
  "detalhe": "Acorda na 1ª noite e aponta dois jogadores (pode se incluir). O narrador toca neles para se reconhecerem. Se um morrer, o outro morre na hora. Se ambos forem da vila, vencem com a vila; se ambos forem lobos, com os lobos; em times diferentes, formam um time próprio e só vencem sendo os dois últimos vivos. Ser amante prevalece sobre as vitórias de Lobo Solitário, Tanner e Arruaceiro, e o papel original de cada um continua.",
  "variantes": [
   "Cupido é uma carta extra no baralho: depois de escolher, recebe a carta que sobrou e assume esse papel.",
   "O narrador escolhe os amantes (ao acaso ou de propósito), e só eles sabem."
  ],
  "time": "vila"
 },
 {
  "name": "Cursed",
  "pt": "Amaldiçoado",
  "adj": -3,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "É do time da vila até ser alvo dos lobos; então passa para o time deles.",
  "conferir": false,
  "detalhe": "É da vila, a menos que os lobos o escolham: nesse caso ele passa para o time dos lobos em vez de morrer. O narrador o acorda toda noite para avisar se já trocou de time, e continua acordando depois da troca para ninguém perceber.",
  "variantes": [],
  "noite": {
   "ordem": 75,
   "quando": "every",
   "fala": "Amaldiçoado, abra os olhos. (Avise com um toque se já virou lobo.)"
  },
  "time": "vila"
 },
 {
  "name": "Diseased",
  "pt": "Doente",
  "adj": 3,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Se for eliminado pelos lobos, eles não matam ninguém na noite seguinte.",
  "conferir": false,
  "detalhe": "Se os lobos o eliminarem, eles ficam doentes e perdem o alvo da noite seguinte. Sem revelação de papéis, os lobos ainda escolhem, mas o alvo não morre. Com revelação, eles nem escolhem.",
  "variantes": [],
  "ident": {
   "ordem": 2,
   "fala": "Doente, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: se os lobos o eliminarem, aplique a regra da doença na noite seguinte."
  },
  "time": "vila"
 },
 {
  "name": "Doppelganger",
  "pt": "Doppelganger",
  "adj": -2,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Na 1ª noite escolhe um jogador; quando ele for eliminado, vira aquele papel.",
  "conferir": false,
  "noite": {
   "ordem": 10,
   "quando": "first",
   "fala": "Doppelganger, abra os olhos e escolha um jogador."
  },
  "detalhe": "Na 1ª noite escolhe um jogador; quando ele for eliminado, ela assume o papel dele em segredo (o narrador avisa com um toque no ombro). Até lá é da vila e a Vidente a vê como Aldeã; depois, aparece com o novo papel. Se virar lobo, passa para o time dos lobos.",
  "variantes": [
   "Vira o papel do alvo imediatamente (os dois ficam com ele). Precisa ser chamada toda noite para usar o poder, mesmo sem poder, e pode desequilibrar bastante o jogo."
  ],
  "time": "vila"
 },
 {
  "name": "Drunk",
  "pt": "Bêbado",
  "adj": 4,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "É vila até a 3ª noite, quando o narrador revela sua função real.",
  "conferir": false,
  "noite": {
   "ordem": 36,
   "quando": "n3",
   "fala": "(3ª noite) Bêbado, abra os olhos: esta é a sua função de verdade."
  },
  "detalhe": "Acha que é Aldeão nos dois primeiros dias; na 3ª noite o narrador o acorda e mostra o papel real. A Vidente já o enxerga pelo papel real. No preparo, misture um Lobisomem, um Aldeão e a maioria dos papéis especiais e tire uma carta às escuras: esse é o papel do Bêbado.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Ghost",
  "pt": "Fantasma",
  "adj": 2,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "O primeiro jogador a morrer vira fantasma; toda noite se comunica escrevendo uma letra.",
  "conferir": false,
  "detalhe": "Na sua lista, o primeiro jogador a morrer vira Fantasma e mantém o time de origem. Sem revelação de papéis, os jogadores têm de adivinhar o time dele. Ele se comunica escrevendo uma letra por noite.",
  "variantes": [
   "Versão do manual: o Fantasma é eliminado na 1ª noite e escreve 10 letras (sem identificar ninguém por nome ou inicial). A cada manhã o narrador revela uma letra, em ordem."
  ],
  "time": "vila"
 },
 {
  "name": "Hoodlum",
  "pt": "Arruaceiro",
  "adj": 0,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Na 1ª noite escolhe dois jogadores. Se forem eliminados e ele sobreviver até o fim, vence.",
  "conferir": false,
  "noite": {
   "ordem": 30,
   "quando": "first",
   "fala": "Arruaceiro, abra os olhos e aponte dois jogadores."
  },
  "detalhe": "Aponta dois jogadores na 1ª noite. Só vence se os dois forem eliminados e ele ainda estiver vivo. As condições dos outros times seguem valendo, então na prática precisa que a vila vença.",
  "variantes": [
   "Escolhe quatro jogadores; se todos morrerem com o Arruaceiro vivo, o jogo acaba e ele vence na hora (só o Líder de Culto pode escapar da derrota)."
  ],
  "time": "vila"
 },
 {
  "name": "Hunter",
  "pt": "Caçador",
  "adj": 3,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Se morrer, leva alguém junto.",
  "conferir": false,
  "detalhe": "Quando é eliminado (de dia ou de noite), atira em um jogador, que é eliminado. Pode atirar para cima, sem matar ninguém. Ninguém fala enquanto ele escolhe. Se morrer à noite, atira na manhã seguinte.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Huntress",
  "pt": "Caçadora",
  "adj": 3,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Uma vez por jogo, durante a noite, pode eliminar um jogador.",
  "conferir": false,
  "noite": {
   "ordem": 107,
   "quando": "once",
   "fala": "Caçadora, abra os olhos; deseja eliminar alguém esta noite?"
  },
  "detalhe": null,
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Lone Wolf",
  "pt": "Lobo Solitário",
  "adj": -5,
  "grupo": "lobos",
  "tags": [
   "lobos_especiais"
  ],
  "max": 1,
  "acao": "Toda noite acorda com os lobos. Só vence se for o último jogador.",
  "conferir": false,
  "noite": {
   "ordem": 80,
   "quando": "every",
   "fala": "Lobos, abram os olhos e escolham a vítima."
  },
  "detalhe": "Acorda com os lobos toda noite para escolher a vítima. Só vence se for o último em pé (ou empatar com a vila tendo apenas mais um não-lobo vivo). Funciona melhor entrando no baralho ao acaso, para ninguém ter certeza de que existe.",
  "variantes": [],
  "time": "lobos"
 },
 {
  "name": "Lycan",
  "pt": "Licano",
  "adj": -1,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "É vila, mas aparece como lobo para a Vidente.",
  "conferir": false,
  "detalhe": "É da vila, mas a Vidente o enxerga como lobo. Também funciona melhor sendo incluído ao acaso.",
  "variantes": [
   "Em jogos com revelação de papéis, é mostrado como lobo ao ser eliminado."
  ],
  "ident": {
   "ordem": 1,
   "fala": "Licano, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: se a Vidente apontar para ele, mostre o sinal de lobo."
  },
  "time": "vila"
 },
 {
  "name": "Mad Bomber",
  "pt": "Homem-Bomba",
  "adj": -2,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Se for eliminado, os jogadores ao seu lado também são eliminados.",
  "conferir": false,
  "detalhe": null,
  "variantes": [],
  "ident": {
   "ordem": 3,
   "fala": "Homem-Bomba, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: se ele for eliminado, os dois vizinhos também são."
  },
  "time": "vila"
 },
 {
  "name": "Mason",
  "pt": "Maçom",
  "adj": 2,
  "grupo": "macons",
  "tags": [
   "macons"
  ],
  "max": 3,
  "acao": "Acordam na 1ª noite e se reconhecem. Quem falar de maçonaria ou sociedade secreta é eliminado. Nunca só 1.",
  "conferir": false,
  "noite": {
   "ordem": 50,
   "quando": "first",
   "fala": "Maçons, abram os olhos e reconheçam-se."
  },
  "detalhe": "Na 1ª noite o narrador acorda os Maçons para se reconhecerem. Ninguém pode falar sobre eles, direta ou indiretamente: quem falar é eliminado à noite pela sociedade secreta e perde mesmo se estiver no time vencedor. O narrador usa bom senso; o ideal é o assunto nunca surgir. Quem comete essa gafe só o faz uma vez.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Mayor",
  "pt": "Prefeito",
  "adj": 2,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Voto conta dobrado.",
  "conferir": false,
  "detalhe": "Seu voto vale dobrado; o narrador conta em segredo (por isso acorda o Prefeito na 1ª noite para saber quem é). Pode ser uma carta normal ou escolhido por votação no 1º dia; se morrer, os jogadores elegem outro.",
  "variantes": [],
  "ident": {
   "ordem": 6,
   "fala": "Prefeito, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: o voto dele vale dobrado."
  },
  "time": "vila"
 },
 {
  "name": "Mentalist",
  "pt": "Mentalista",
  "adj": 6,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Toda noite aponta dois jogadores e descobre se são do mesmo time.",
  "conferir": false,
  "noite": {
   "ordem": 114,
   "quando": "every",
   "fala": "Mentalista, abra os olhos e aponte dois jogadores."
  },
  "detalhe": null,
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Minion",
  "pt": "Lacaio (Minion)",
  "adj": -6,
  "grupo": "lobos",
  "tags": [
   "lobos_especiais"
  ],
  "max": 1,
  "acao": "Na 1ª noite os lobos escolhem um jogador para ser o Lacaio: ele sabe quem são os lobos, mas não acorda com eles.",
  "conferir": false,
  "noite": {
   "ordem": 82,
   "quando": "first",
   "fala": "Lobos, apontem quem será o Lacaio. Lacaio, abra os olhos e veja os lobos."
  },
  "detalhe": "Não precisa de carta. Na 1ª noite, os lobos escolhem um jogador, que passa a ser o Lacaio e entra no time dos lobos. Ele descobre quem são os lobos, mas não acorda com eles. A Vidente o vê como Aldeão. Se tiver outro papel especial, mantém esse papel (pode haver um Vidente Lacaio, por exemplo).",
  "variantes": [
   "Distribuído como carta normal: o Lacaio vê os lobos e os lobos veem o Lacaio. Assim ele não acumula outro papel.",
   "Com Vampiros e Lobisomens no jogo, cada time pode ter um Lacaio."
  ],
  "time": "lobos"
 },
 {
  "name": "Mystic Seer",
  "pt": "Vidente Mística",
  "adj": 9,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Toda noite aponta alguém e descobre a função exata da pessoa.",
  "conferir": false,
  "noite": {
   "ordem": 115,
   "quando": "every",
   "fala": "Vidente Mística, abra os olhos e aponte um jogador."
  },
  "detalhe": null,
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Old Hag",
  "pt": "Velhota",
  "adj": 1,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Toda noite escolhe alguém para deixar a vila durante o dia. Não pode ser ela mesma nem repetir a pessoa.",
  "conferir": false,
  "noite": {
   "ordem": 60,
   "quando": "every",
   "fala": "Velhota, abra os olhos e escolha quem sai da vila amanhã."
  },
  "detalhe": "Toda noite coloca uma 'praga' em alguém, que deve sair da área de jogo por um dia: não participa de discussão, votação nem de nada do dia, e fica a salvo do Caçador. Não pode escolher a si mesma nem a mesma pessoa duas vezes no jogo.",
  "variantes": [
   "Depois de voltar, o alvo escolhe quem recebe a próxima praga. Se o amaldiçoado morrer à noite, a Velhota escolhe outro na noite seguinte."
  ],
  "time": "vila"
 },
 {
  "name": "P.I.",
  "pt": "Agente Sobrenatural",
  "adj": 3,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Uma noite por jogo escolhe um jogador; o narrador diz se ele ou seus vizinhos são lobos.",
  "conferir": false,
  "noite": {
   "ordem": 116,
   "quando": "once",
   "fala": "Agente, abra os olhos; deseja investigar alguém?"
  },
  "detalhe": "Uma vez por jogo aponta um jogador. O narrador diz se pelo menos um entre o alvo e seus vizinhos imediatos (esquerda e direita) é lobo, sem dizer qual deles.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Pacifist",
  "pt": "Pacifista",
  "adj": -1,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Sempre vota contra a eliminação.",
  "conferir": false,
  "detalhe": "Sempre vota para que ninguém seja eliminado, o que ajuda os lobos. Funciona melhor incluído ao acaso, para ninguém ter certeza de que existe.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Priest",
  "pt": "Padre",
  "adj": 3,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Uma vez por jogo, protege um jogador (não a si): a próxima tentativa de eliminação falha. A bênção continua se o Padre morrer.",
  "conferir": false,
  "noite": {
   "ordem": 45,
   "quando": "once",
   "fala": "Padre, abra os olhos; deseja proteger alguém?"
  },
  "detalhe": "Uma vez por jogo escolhe um jogador (não pode ser ele mesmo) para ser protegido: a próxima tentativa de eliminação, por qualquer meio, falha. Se o Padre morrer depois de abençoar alguém, a proteção continua.",
  "variantes": [
   "Uma vez por jogo descobre o papel de um jogador eliminado (só no modo 'sem revelação')."
  ],
  "time": "vila"
 },
 {
  "name": "Prince",
  "pt": "Príncipe",
  "adj": 3,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Se for votado para eliminação, revela a carta e continua em jogo.",
  "conferir": false,
  "detalhe": "Se for votado para eliminação durante o dia, revela-se Príncipe e não é eliminado. A vila dorme logo em seguida, como se a eliminação tivesse acontecido.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Revealer",
  "pt": "Revelador",
  "adj": 4,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Toda noite pode apontar alguém. Se for lobo, ele é eliminado; se não, o Revelador é eliminado.",
  "conferir": false,
  "noite": {
   "ordem": 109,
   "quando": "every",
   "fala": "Revelador, abra os olhos; deseja apontar alguém?"
  },
  "detalhe": null,
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Seer",
  "pt": "Vidente",
  "adj": 7,
  "grupo": "info",
  "tags": [],
  "max": 1,
  "acao": "Toda noite escolhe alguém para saber se é vila ou lobo.",
  "conferir": false,
  "noite": {
   "ordem": 113,
   "quando": "every",
   "fala": "Vidente, abra os olhos e aponte um jogador."
  },
  "detalhe": "Toda noite aponta um jogador e o narrador mostra 'V' (Aldeão) ou 'W' (lobo). Para deixar bem claro que é lobo, o narrador pode usar garras e um rosnado.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Sorcerer",
  "pt": "Feiticeira",
  "adj": -3,
  "grupo": "lobos",
  "tags": [
   "lobos_especiais"
  ],
  "max": 1,
  "acao": "Toda noite procura pela Vidente.",
  "conferir": false,
  "noite": {
   "ordem": 105,
   "quando": "every",
   "fala": "Feiticeira, abra os olhos e aponte quem acha ser a Vidente."
  },
  "detalhe": "Procura a Vidente toda noite (o narrador mostra polegar para cima se ela acertar). Os lobos não sabem quem ela é, e ela não sabe quem são os lobos. A Vidente a enxerga como Aldeã.",
  "variantes": [
   "Na 1ª noite a Feiticeira vê quem são os lobos (grande vantagem para o time deles)."
  ],
  "time": "lobos"
 },
 {
  "name": "Spellcaster",
  "pt": "Conjurador",
  "adj": 1,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Toda noite escolhe um jogador que não poderá falar durante o dia.",
  "conferir": false,
  "noite": {
   "ordem": 65,
   "quando": "every",
   "fala": "Conjurador, abra os olhos e aponte um jogador."
  },
  "detalhe": "Toda noite pode silenciar um jogador no dia seguinte (ele não fala, mas pode se comunicar de outras formas). Pode silenciar a si mesmo, mas não repetir o mesmo jogador no jogo.",
  "variantes": [
   "Deve silenciar alguém toda noite."
  ],
  "time": "vila"
 },
 {
  "name": "Tanner",
  "pt": "Tanner",
  "adj": -2,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Se for eliminado, vence.",
  "conferir": false,
  "detalhe": "Só vence se for eliminado. As condições dos outros times seguem valendo e o jogo continua depois da vitória dele.",
  "variantes": [
   "Se o Tanner vencer, todos os outros times perdem."
  ],
  "time": "vila"
 },
 {
  "name": "Tough Guy",
  "pt": "Cara Durão",
  "adj": 3,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Se os lobos tentarem eliminá-lo, só morre na noite seguinte.",
  "conferir": false,
  "detalhe": "Se os lobos o escolherem, ele só morre na noite seguinte; de manhã ninguém morre. Na noite seguinte podem morrer duas ou mais pessoas. O narrador o acorda na 1ª noite para saber quem é.",
  "variantes": [],
  "ident": {
   "ordem": 7,
   "fala": "Cara Durão, abra os olhos só para o narrador saber quem você é. Pode fechar.",
   "nota": "Anote quem é: se os lobos o escolherem, ele só morre na noite seguinte."
  },
  "time": "vila"
 },
 {
  "name": "Troublemaker",
  "pt": "Barraqueira",
  "adj": -3,
  "grupo": "caos",
  "tags": [],
  "max": 1,
  "acao": "Uma vez por jogo, pode pedir duas eliminações no dia seguinte.",
  "conferir": false,
  "detalhe": "Uma vez por jogo pode pedir duas eliminações no dia seguinte. Até usar o poder, o narrador a acorda toda noite.",
  "variantes": [],
  "noite": {
   "ordem": 66,
   "quando": "every",
   "fala": "Barraqueira, abra os olhos; quer usar o poder amanhã?"
  },
  "time": "vila"
 },
 {
  "name": "Vampire",
  "pt": "Vampiro",
  "adj": -7,
  "grupo": "vampiros",
  "tags": [
   "vampiros"
  ],
  "max": 8,
  "acao": "Toda noite escolhem um alvo; se ele for a votação durante o dia, morre na hora. Lobos não podem matar vampiros.",
  "conferir": false,
  "noite": {
   "ordem": 90,
   "quando": "every",
   "fala": "Vampiros, abram os olhos e escolham o alvo."
  },
  "detalhe": "Terceiro time do jogo. Escolhem um alvo por noite, além do dos lobos; o alvo não é revelado e morre quando houver uma acusação no dia. Lobos não podem eliminar vampiros. Com três times, um deles precisa eliminar os outros dois para vencer. Em grupos grandes e experientes, troque lobos por vampiros mantendo o mesmo total. Papéis que procuram lobos (Vidente, P.I. etc.) também podem apontar vampiros, a critério do narrador, sem distinguir os dois times.",
  "variantes": [],
  "time": "vampiros"
 },
 {
  "name": "Village Idiot",
  "pt": "Idiota da Vila",
  "adj": 2,
  "grupo": "extra",
  "tags": [],
  "max": 1,
  "acao": "Sempre vota a favor da eliminação.",
  "conferir": false,
  "detalhe": "Sempre vota contra a eliminação. Funciona melhor incluído ao acaso.",
  "variantes": [
   "Não distribua a carta: sorteie quem será o Idiota. Ele não sabe, e seu voto é sempre registrado como contra."
  ],
  "time": "vila"
 },
 {
  "name": "Villager",
  "pt": "Vila",
  "adj": 1,
  "grupo": "vila",
  "tags": [],
  "max": 15,
  "acao": "Encontre os lobisomens e elimine-os.",
  "conferir": false,
  "detalhe": "Só precisa achar e eliminar os lobos. Inclua sempre Aldeões comuns: eles dão base ao jogo. Com revelação total de papéis, use mais Aldeões; senão todos da vila revelam o papel e os lobos ficam expostos.",
  "variantes": [],
  "time": "vila"
 },
 {
  "name": "Werewolf",
  "pt": "Lobisomem",
  "adj": -6,
  "grupo": "lobos",
  "tags": [],
  "max": 12,
  "acao": "Toda noite acordam com os lobos e escolhem alguém para eliminar.",
  "conferir": false,
  "noite": {
   "ordem": 80,
   "quando": "every",
   "fala": "Lobos, abram os olhos e escolham a vítima."
  },
  "detalhe": "Conhecem-se na 1ª noite. Nas noites seguintes precisam concordar num alvo; se passarem de 1 minuto, perdem o alvo daquela noite. Não podem escolher outro lobo e escondem a identidade durante o dia.",
  "variantes": [],
  "time": "lobos"
 },
 {
  "name": "Witch",
  "pt": "Bruxa",
  "adj": 4,
  "grupo": "prot",
  "tags": [],
  "max": 1,
  "acao": "Uma vez por jogo, de noite, pode usar a poção da vida ou da morte.",
  "conferir": false,
  "noite": {
   "ordem": 108,
   "quando": "every",
   "fala": "Bruxa, abra os olhos; esta é a vítima. Quer usar uma poção?"
  },
  "detalhe": "Tem duas habilidades de uso único: salvar quem os lobos escolheram e eliminar um jogador à sua escolha. O narrador a chama toda noite e pergunta se quer usar alguma, mesmo que já tenha usado. Pode usar as duas na mesma noite.",
  "variantes": [
   "Só pode usar uma das duas habilidades no jogo inteiro, à escolha dela."
  ],
  "time": "vila"
 },
 {
  "name": "Wolf Cub",
  "pt": "Filhote de Lobo",
  "adj": -8,
  "grupo": "lobos",
  "tags": [
   "lobos_especiais"
  ],
  "max": 1,
  "acao": "Se for eliminado, os lobisomens eliminam dois jogadores na noite seguinte.",
  "conferir": false,
  "noite": {
   "ordem": 80,
   "quando": "every",
   "fala": "Lobos, abram os olhos e escolham a vítima."
  },
  "detalhe": "É lobo e acorda com eles. Se for eliminado, os lobos eliminam dois jogadores na noite seguinte.",
  "variantes": [],
  "time": "lobos"
 }
];
