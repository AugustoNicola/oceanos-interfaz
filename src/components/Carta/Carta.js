const SPRITE_WIDTH = 7450;
const SPRITE_HEIGHT = 7280;
//const CARD_WIDTH = 724;
//const CARD_HEIGHT = 1037;
const CARD_WIDTH = 7450 / 10;
const CARD_HEIGHT = 7280 / 7;

const CARD_OFFSETS = {
  "CANGREJO" : {
    "AZUL" : [2, 0],
		"CELESTE" : [4, 2],
		"NEGRO" : [9,3],
		"AMARILLO" : [4, 3],
		"VERDE" : [9, 4],
		"GRIS" : [7, 0]
  },
  "BARCO" : {
    "AZUL": [5, 0],
    "CELESTE": [8, 1],
    "NEGRO": [0, 0],
    "AMARILLO": [5, 1]
  },
  "PEZ" : {
    "AZUL": [1, 2],
    "CELESTE": [0, 2],
    "NEGRO": [6, 1],
    "AMARILLO": [3, 4],
    "VERDE": [0, 4]
  },
  "NADADOR" : {
    "AZUL": [6, 0],
    "CELESTE": [1, 6],
    "NEGRO": [1, 5],
    "AMARILLO": [7, 1],
    "NARANJA_CLARO": [9, 1]
  },
  "TIBURÓN" : {
    "AZUL": [8, 3],
    "CELESTE": [8, 5],
    "NEGRO": [6, 2],
    "VERDE": [6, 3],
    "VIOLETA": [5, 2]
  },
  "CONCHA" : {
    "AZUL": [9, 0],
    "CELESTE": [5, 3],
    "NEGRO": [1, 4],
    "AMARILLO": [9, 2],
    "VERDE": [4, 0],
    "GRIS": [6, 5]
  },
  "PULPO" : {
    "CELESTE": [4, 1],
    "AMARILLO": [7, 5],
    "VERDE": [3, 0],
    "VIOLETA": [4, 1],
    "GRIS": [0, 3]
  },
  "PINGUINO" : {
    "VIOLETA": [0, 5],
    "NARANJA_CLARO": [3, 1],
    "ROSA": [5, 4]
  },
  "ANCLA" : {
    "ROSA": [8, 2],
    "NARANJA": [2, 3]
  },
  "COLONIA" : {
    "VERDE": [1, 3]
  },
  "FARO" : {
    "VIOLETA": [7, 4]
  },
  "CARDUMEN" : {
    "GRIS": [1, 1]
  },
  "CAPITÁN" : {
    "NARANJA_CLARO": [0, 6]
  },
  "SIRENA" : {
    "BLANCO": [2, 1]
  },
  "DORSO": {
    "GRIS": [9, 6]
  }
}

export default function Carta({
  type = "DORSO",
  color = "GRIS",
  scale = 0.15
}) {
  const renderWidth = CARD_WIDTH * scale;
  const renderHeight = CARD_HEIGHT * scale;
  
  if (CARD_OFFSETS[type][color] === undefined){
    throw new Error(`CARD_OFFSET not found: ${type} ${color}`);
  }
  
  const [widthOffset, heightOffset] = CARD_OFFSETS[type][color];
  
  return (
    <div
      style={{
        width: `${renderWidth}px`,
        height: `${renderHeight}px`,
        backgroundImage: `url("/cartas.png")`,
        backgroundRepeat: "no-repeat",
        // Scale entire sprite
        backgroundSize: `${SPRITE_WIDTH * scale}px ${SPRITE_HEIGHT * scale}px`,
        // Shift to the card's position (scaled)
        backgroundPosition: `-${CARD_WIDTH * widthOffset * scale}px -${CARD_HEIGHT * heightOffset * scale}px`,
      }}
    />
  );
}