function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function textualizarCarta(carta) {
  return `Carta de ${capitalizar(carta["tipo"].toLowerCase())} ${capitalizar(carta["color"].toLowerCase()).replaceAll("_", " ")}`
}

export default function EntradaRegistro({
  data,
  nombresJugadores,
  índiceActivo,
  modoEspectador,
}) {
  
  const coloresEntradaJugadores = [
    ["bg-red-200", "bg-blue-200"],
    ["bg-red-200", "bg-green-200", "bg-blue-200"],
    ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-purple-200"]
  ];
  
  let textoEntrada = nombresJugadores[data["jugador"]];
  let colorEntrada = "bg-gray-300";
  if (data["jugador"] !== undefined) { colorEntrada = coloresEntradaJugadores[nombresJugadores.length - 2][data["jugador"]]; }
  let mostrarPuntajesRonda = false;
  
  const mostrarInfoSensible = modoEspectador || (data["jugador"] === índiceActivo);
  
  switch (data["acción"]) {
    case "ROBO_DEL_MAZO":
      textoEntrada += ` roba del mazo ${mostrarInfoSensible ? "una " + textualizarCarta(data["parámetros"]["_cartaRobada"]) : ""} y descarta en la pila ${data["parámetros"]["pilaDondeDescartó"] === 0 ? "izquierda" : "derecha"} una ${textualizarCarta(data["parámetros"]["cartaDescartada"])}.`
      break;
    case "ROBO_DEL_DESCARTE_0":
      textoEntrada += ` roba del descarte izquierdo una ${textualizarCarta(data["parámetros"]["cartaRobada"])}.`
      break;
    case "ROBO_DEL_DESCARTE_1":
      textoEntrada += ` roba del descarte izquierdo una ${textualizarCarta(data["parámetros"]["cartaRobada"])}.`
      break;
    case "DÚO_JUGAR_PECES":
      textoEntrada += ` juega un dúo de peces y roba del mazo ${mostrarInfoSensible ? "una " + textualizarCarta(data["parámetros"]["_cartaRobada"]) : ""}.`
      break;
    case "DÚO_JUGAR_BARCOS":
      textoEntrada += ` juega un dúo de barcos y juega un turno extra.`
      break;
    case "DÚO_JUGAR_CANGREJOS":
      textoEntrada += ` juega un dúo de cangrejos y roba del descarte ${data["parámetros"]["pilaDondeRobó"] === 0 ? "izquierdo" : "derecho"}${mostrarInfoSensible ? " una " + textualizarCarta(data["parámetros"]["_cartaRobada"]) : ""}.`
      break;
    case "DÚO_JUGAR_NADADOR_Y_TIBURON":
      textoEntrada += ` juega un dúo de nadador y tiburón y le roba a ${nombresJugadores[data["parámetros"]["jugadorRobado"]]}${mostrarInfoSensible ? " una " + textualizarCarta(data["parámetros"]["_cartaRobada"]) : ""}.`
      break;
    case "FIN_PASAR_TURNO":
      switch (data["parámetros"]["estadoRonda"]) {
        case "EN_CURSO":
          textoEntrada += ` pasa de turno.`
          break;
        case "ANULADA_MAZO_VACÍO":
          textoEntrada +=  ` pasa de turno.\nComo el mazo está vacío, ¡la ronda se anula!`
          colorEntrada = "bg-gray-300";
          break;
        case "ÚLTIMA_CHANCE_GANADA":
          textoEntrada +=  ` pasa de turno. ¡La apuesta de última chance fue ganada! El jugador de la apuesta anota sus puntos de ronda más bonificación por color, y el resto anota solo bonificación por color:`
          mostrarPuntajesRonda = true;
          colorEntrada = "bg-gray-300";
          break;
        case "ÚLTIMA_CHANCE_PERDIDA":
          textoEntrada +=  ` pasa de turno. ¡La apuesta de última chance fue perdida! El jugador de la apuesta anota solo bonificación por color, y el resto anota sus puntos de ronda:`
          mostrarPuntajesRonda = true;
          colorEntrada = "bg-gray-300";
          break;
        default:
          break;
      }
      break;
    case "FIN_DECIR_BASTA":
      textoEntrada += ` dice ¡Basta!\nTodos los jugadores anotan sus puntos de ronda:`
      mostrarPuntajesRonda = true;
      colorEntrada = "bg-gray-300";
      break;
    case "FIN_DECIR_ULTIMA_CHANCE":
      textoEntrada += ` dice ¡Última Chance!`
      break;
    case "ESPECIAL_COMIENZO_RONDA":
      textoEntrada = `¡Comienza la ronda! Empieza jugando ${nombresJugadores[data["jugador_inicial"]]}.`
      break;
    case "ESPECIAL_PARTIDA_TERMINADA":
      textoEntrada = `¡Partida terminada! ¡El ganador es ${nombresJugadores[data["jugador_ganador"]]}!`
      colorEntrada = "bg-gray-300";
      break;
    default:
      break;
  }
  
  return (
    <div className={`w-full text-lg py-2 px-1 rounded-md ${colorEntrada}`}>
      <p>{textoEntrada}</p>
      { mostrarPuntajesRonda &&
      <div className="w-full flex flex-col flex-nowrap gap-1 pt-2 justify-start">
        {nombresJugadores.map((nombre, índice) => (
          <p key={índice}>{nombre}: {data["parámetros"]["puntajesRonda"][índice]}</p>
        ))}
      </div>
      }
    </div>
  );
}
