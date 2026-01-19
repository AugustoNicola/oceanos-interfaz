import { useState } from "react";
import Carta from "../Carta/Carta";

export default function Acciones({
  índiceActivo=0,
  faseActual="FASE_ROBO",
  setFaseActual,
  estado = {},
  nombresJugadores = ["Rojo", "Verde", "Azul", "Violeta"],
  onInicializarPartida,
  onAvanzar,
  onRobarDelDescarte,
  onCómoRobarDelMazo,
  onJugarDúo,
  onPasarDeTurno,
  onDecirBasta,
  onDecirÚltimaChance,
  cargando,
  error
}) {
  
  const [cartaRoboElegida, setCartaRoboElegida] = useState(null);
  const [tipoDúo, setTipoDúo] = useState(null);
  const [cartasDúoElegidas, setCartasDúoElegidas] = useState([]);
  const [parDúo, setParDúo] = useState([]);
  const [pilaDescarteDúoCangrejos, setPilaDescarteDúoCangrejos] = useState(null);
  const [cartaDúoCangrejosElegida, setCartaDúoCangrejosElegida] = useState(null);
  const [jugadoresARobar, setJugadoresARobar] = useState([]);
  
  const colorTipoDúo = {
    "PECES": "bg-green-400",
    "BARCOS": "bg-blue-400",
    "CANGREJOS": "bg-red-400",
    "NADADOR_Y_TIBURÓN": "bg-orange-400"
  }
  const filtroTipoDúo = {
    "PECES": (carta) => carta.tipo == "PEZ",
    "BARCOS": (carta) => carta.tipo == "BARCO",
    "CANGREJOS": (carta) => carta.tipo == "CANGREJO",
    "NADADOR_Y_TIBURÓN": (carta) => (carta.tipo == "NADADOR" || carta.tipo == "TIBURÓN")
  }
  const tipoDúoBackend = {
    "PECES": "dúo_peces",
    "BARCOS": "dúo_barcos",
    "CANGREJOS": "dúo_cangrejos",
    "NADADOR_Y_TIBURÓN": "dúo_nadador_tiburón",
  }
  
  const elegirCartaRobo = (índiceElegido) => {
    setCartaRoboElegida(índiceElegido);
  };
  
  const elegirDescarteParaRobo = (índiceElegido) => {
    if (cartaRoboElegida === null) { return; }
    onCómoRobarDelMazo(cartaRoboElegida, índiceElegido);
    setCartaRoboElegida(null);
  };
  
  const elegirCartasDúo = () => {
    if (cartasDúoElegidas.reduce((prev, curr) => (prev + curr)) != 2) { return; }
    
    // TODO: esto se setea la segunda vez!
    let manoFiltrada = estado.estadosDeJugadores[índiceActivo].mano.filter(filtroTipoDúo[tipoDúo]);
    
    let índicesElegidos = cartasDúoElegidas
      .map((elegido, índice) => elegido ? índice : null)
      .filter(índice => índice !== null);
    
    
    const parDúoJugado = [
      {"tipo": manoFiltrada[índicesElegidos[0]].tipo, "color": manoFiltrada[índicesElegidos[0]].color},
      {"tipo": manoFiltrada[índicesElegidos[1]].tipo, "color": manoFiltrada[índicesElegidos[1]].color}
    ]
    setParDúo(parDúoJugado);
    
    switch (tipoDúo) {
      case "PECES":
      case "BARCOS":
        onJugarDúo({
          "acción_elegida": tipoDúoBackend[tipoDúo],
          "cartas_jugadas": parDúoJugado
        });
        //setTipoDúo(null);
        //setCartasDúoElegidas([]);
        //setParDúo([]);
        break;
      case "CANGREJOS":
        // paso de elección de pila de descarte
        setFaseActual("ESPECIAL_CANGREJOS_ELEGIR_PILA");
        break;
      case "NADADOR_Y_TIBURÓN":
        // paso de elección de jugador a robar
        setFaseActual("ESPECIAL_NADADOR_Y_TIBURÓN_ELEGIR_JUGADOR");
        const aux = [nombresJugadores[1], nombresJugadores[2], nombresJugadores[3]];
        setJugadoresARobar(aux);
        break;
      default:
        throw new Error("Tipo de dúo ilegal");
    }
  };
  
  const elegirDescarteParaDúoCangrejos = (índiceElegido) => {
    setPilaDescarteDúoCangrejos(índiceElegido);
    setFaseActual("ESPECIAL_CANGREJOS_ELEGIR_CARTA");
  };
  
  const elegirCartaDúoCangrejos = (índiceElegido) => {
    setCartaDúoCangrejosElegida(índiceElegido);
  };
  
  const confirmarDúoCangrejos = () => {
    if (cartaDúoCangrejosElegida === null) { return; }
    onJugarDúo({
      "acción_elegida": tipoDúoBackend["CANGREJOS"],
      "cartas_jugadas": parDúo,
      "pila_descarte_elegida": pilaDescarteDúoCangrejos,
      "carta_descarte_robada": cartaDúoCangrejosElegida
    });
    // TODO: ver si puedo borrar estas cosas
    //setTipoDúo(null);
    //setCartasDúoElegidas([]);
    //setParDúo([]);
    //setPilaDescarteDúoCangrejos(null);
    //setCartaDúoCangrejosElegida(null);
  };
  
  const elegirJugadorParaDúoNadadorTiburón = (índiceElegido) => {
    onJugarDúo({
      "acción_elegida": tipoDúoBackend["NADADOR_Y_TIBURÓN"],
      "cartas_jugadas": parDúo,
      "jugador_elegido": índiceElegido
    });
    // TODO: ver si puedo borrar estas cosas
    //setTipoDúo(null);
    //setCartasDúoElegidas([]);
    //setParDúo([]);
  };
  
  const cartasVálidasParaNadadorTiburón = () => {
    let manoFiltrada = estado.estadosDeJugadores[índiceActivo].mano.filter(filtroTipoDúo[tipoDúo]);
    
    return manoFiltrada.some((carta, índice) => (cartasDúoElegidas[índice] && carta.tipo === "NADADOR")) && manoFiltrada.some((carta, índice) => (cartasDúoElegidas[índice] && carta.tipo === "TIBURÓN"))
  };
  
  const inicializarElegirCartasDúo = (tipo) => {
    setCartasDúoElegidas(estado.estadosDeJugadores[índiceActivo].mano.filter(filtroTipoDúo[tipo]).map(_ => false));
  }
  
  return (
    <div className="w-full flex flex-col flex-nowrap gap-3 justify-start items-center border-t-2 border-gray-400 pt-4 mt-2">
      {/* Crear Partida */}
      { faseActual === "INICIAR_PARTIDA" && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-green-300 hover:bg-green-400"
        onClick={onInicializarPartida} disabled={cargando}>
        {cargando ? "Cargando..." : "Crear Partida"}
      </button>
      }
      
      {/* Avanzar (OK) */}
      { estado != {} && estado.deQuienEsTurno !== índiceActivo && faseActual !== "RONDA_TERMINADA" && faseActual !== "INICIAR_PARTIDA" && faseActual !== "PARTIDA_TERMINADA" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        onClick={onAvanzar} disabled={cargando}>
        {cargando ? "Cargando..." : "Avanzar"}
      </button>
      }
      
      {/* Terminar Ronda (OK) */}
      { estado != {} && faseActual === "RONDA_TERMINADA" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        onClick={onAvanzar} disabled={cargando}>
        {cargando ? "Cargando..." : "Terminar ronda"}
      </button>
      }
      
      {/* Robar del mazo */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "FASE_ROBO" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-yellow-300 hover:bg-yellow-400"
        onClick={() => {setFaseActual("ESPECIAL_ELEGIR_ROBO")}} disabled={cargando}>
        {cargando ? "Cargando..." : "Robar del mazo"}
      </button>
      }
      
      {/* Elegir opciones de robo */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "ESPECIAL_ELEGIR_ROBO" &&
      <div className="w-full text-xl font-bold py-2 rounded-md bg-gray-400">
        <p className="pb-2 text-center">Elegí qué carta querés llevarte y dónde descartar la otra</p>
        <div className="flex flex-row flex-nowrap justify-around items-center">
            <div className="flex flex-row flex-nowrap justify-around gap-5">
              <button
                className={`${cartaRoboElegida === 0 ? "brightness-100" : "brightness-75"}`}
                onClick={() => {elegirCartaRobo(0)}}
              >
                <Carta type={estado.mazo[estado.mazo.length - 1].tipo} color={estado.mazo[estado.mazo.length - 1].color} />
              </button>
              <button
                className={`${cartaRoboElegida === 1 ? "brightness-100" : "brightness-75"}`}
                onClick={() => {elegirCartaRobo(1)}}
              >
                <Carta type={estado.mazo[estado.mazo.length - 2].tipo} color={estado.mazo[estado.mazo.length - 2].color} />
              </button>
            </div>
            <div className="flex flex-col flex-nowrap gap-6">
              <button
                onClick={() => {elegirDescarteParaRobo(0)}}
                className="w-full text-xl font-bold p-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100"
                disabled={cartaRoboElegida === null || (estado.descarte[0].length !== 0 && estado.descarte[1].length === 0)}
              >
                Descartar a la izquierda
              </button>
              <button
                onClick={() => {elegirDescarteParaRobo(1)}}
                className="w-full text-xl font-bold py-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100" disabled={cartaRoboElegida === null || (estado.descarte[1].length !== 0 && estado.descarte[0].length === 0)}
              >
                Descartar a la derecha
              </button>
            </div>
        </div>
        
      </div>
      }
      
      {/* Robar del descarte izquierdo */}
      { estado != {} && estado?.deQuienEsTurno === índiceActivo && faseActual === "FASE_ROBO" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-red-300 hover:bg-red-400"
        onClick={() => {onRobarDelDescarte(0)}} disabled={cargando}>
        {cargando ? "Cargando..." : "Robar del descarte izquierdo"}
      </button>
      }
      
      {/* Robar del descarte derecho */}
      { estado != {} && estado?.deQuienEsTurno === índiceActivo && faseActual === "FASE_ROBO" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-red-300 hover:bg-red-400"
        onClick={() => {onRobarDelDescarte(1)}} disabled={cargando}>
        {cargando ? "Cargando..." : "Robar del descarte derecho"}
      </button>
      }
      
      {/* Jugar dúo de Peces */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && estado.estadosDeJugadores[índiceActivo].mano.reduce((prev, carta) => (prev + (carta.tipo === "PEZ")), 0) >= 2 && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-green-300 hover:bg-green-400"
        onClick={() => {setFaseActual("ESPECIAL_ELEGIR_CARTAS_DÚO"); setTipoDúo("PECES"); inicializarElegirCartasDúo("PECES")}} disabled={cargando}>
        {cargando ? "Cargando..." : "Jugar dúo de peces"}
      </button>
      }
      
      {/* Jugar dúo de Barcos */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && estado.estadosDeJugadores[índiceActivo].mano.reduce((prev, carta) => (prev + (carta.tipo === "BARCO")), 0) >= 2 && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-blue-300 hover:bg-blue-400"
        onClick={() => {setFaseActual("ESPECIAL_ELEGIR_CARTAS_DÚO"); setTipoDúo("BARCOS"); inicializarElegirCartasDúo("BARCOS")}} disabled={cargando}>
        {cargando ? "Cargando..." : "Jugar dúo de barcos"}
      </button>
      }
      
      {/* Jugar dúo de Cangrejos */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && estado.estadosDeJugadores[índiceActivo].mano.reduce((prev, carta) => (prev + (carta.tipo === "CANGREJO")), 0) >= 2 && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-red-300 hover:bg-red-400"
        onClick={() => {setFaseActual("ESPECIAL_ELEGIR_CARTAS_DÚO"); setTipoDúo("CANGREJOS"); inicializarElegirCartasDúo("CANGREJOS")}} disabled={cargando}>
        {cargando ? "Cargando..." : "Jugar dúo de cangrejos"}
      </button>
      }
      
      {/* Jugar dúo de Nadador y Tiburón */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && estado.estadosDeJugadores[índiceActivo].mano.some(carta => (carta.tipo == "NADADOR")) && estado.estadosDeJugadores[índiceActivo].mano.some(carta => (carta.tipo == "TIBURÓN")) &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-orange-300 hover:bg-orange-400"
        onClick={() => {setFaseActual("ESPECIAL_ELEGIR_CARTAS_DÚO"); setTipoDúo("NADADOR_Y_TIBURÓN"); inicializarElegirCartasDúo("NADADOR_Y_TIBURÓN")}} disabled={cargando}>
        {cargando ? "Cargando..." : "Jugar dúo de nadador y tiburón"}
      </button>
      }
      
      {/* Elegir cartas dúo */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "ESPECIAL_ELEGIR_CARTAS_DÚO" &&
      <div className={`w-full text-xl font-bold py-2 rounded-md flex flex-col justify-center items-center ${colorTipoDúo[tipoDúo]}`}>
        <p className="pb-2 text-center">Elegí qué cartas jugar en tu dúo</p>
        <div className="flex flex-row flex-nowrap justify-around gap-5">
          
          {estado.estadosDeJugadores[índiceActivo].mano.filter(filtroTipoDúo[tipoDúo]).map((carta, índice) => (
            <button
              key={índice}
              className={`${cartasDúoElegidas[índice] ? "brightness-100" : "brightness-75"}`}
              onClick={() => {setCartasDúoElegidas(cartasElegidas => {const nuevo = [...cartasElegidas]; nuevo[índice] = !nuevo[índice]; return nuevo;});}}
            >
              <Carta type={carta.tipo} color={carta.color} />
            </button>
          ))}
        </div>
        <div className="w-full px-3">
          <button
            onClick={elegirCartasDúo}
            className="w-full text-xl font-bold py-2 mr-6 mt-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100"
            disabled={cartasDúoElegidas.reduce((prev, curr) => (prev + curr)) != 2 || (tipoDúo == "NADADOR_Y_TIBURÓN" && !cartasVálidasParaNadadorTiburón())}
          >
            Confirmar
          </button>
        </div>
      </div>
      }
      
      {/* Elegir pila de descarte para dúo cangrejos */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "ESPECIAL_CANGREJOS_ELEGIR_PILA" &&
      <div className="w-full text-xl font-bold py-2 rounded-md bg-red-400">
        <p className="pb-2 text-center">Elegí qué pila de descarte querés robar</p>
        <div className="flex flex-row flex-nowrap justify-around items-center gap-8 px-8 pb-1">
          <button
            onClick={() => {elegirDescarteParaDúoCangrejos(0)}}
            className="w-full text-xl font-bold p-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100"
            disabled={estado.descarte[0].length === 0}
          >
            Descarte izquierdo
          </button>
          <button
            onClick={() => {elegirDescarteParaDúoCangrejos(1)}}
            className="w-full text-xl font-bold py-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100" disabled={estado.descarte[1].length === 0}
          >
            Descarte derecho
          </button>
        </div>
        
      </div>
      }
      
      {/* Elegir carta del descarte para dúo cangrejos */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "ESPECIAL_CANGREJOS_ELEGIR_CARTA" &&
      <div className="w-full text-xl font-bold py-2 rounded-md bg-red-400">
        <p className="pb-2 text-center">Elegí qué carta querés llevarte</p>
        <div className="flex flex-row flex-wrap justify-around gap-5">
          
          {estado.descarte[pilaDescarteDúoCangrejos].map((carta, índice) => (
            <button
            key={índice}
            className={`${índice === cartaDúoCangrejosElegida ? "brightness-100" : "brightness-75"}`}
            onClick={() => {elegirCartaDúoCangrejos(índice)}}
            >
              <Carta type={carta.tipo} color={carta.color} />
            </button>
          ))}
        </div>
        <div className="w-full px-3">
          <button
            onClick={confirmarDúoCangrejos}
            className="w-full text-xl font-bold py-2 mr-6 mt-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100"
            disabled={cartaDúoCangrejosElegida === null}
          >
            Confirmar
          </button>
        </div>
      </div>
      }
      
      {/* Elegir jugador a robar para dúo nadador y tiburón */}
      { estado != {} && estado.deQuienEsTurno === índiceActivo && faseActual === "ESPECIAL_NADADOR_Y_TIBURÓN_ELEGIR_JUGADOR" &&
      <div className="w-full text-xl font-bold py-2 rounded-md bg-orange-400">
        <p className="pb-2 text-center">Elegí a qué jugador robar</p>
        <div className="flex flex-col flex-nowrap justify-around items-center gap-3 px-3 pb-1">
          
          {jugadoresARobar.map((nombre, índice) => (
            <button
              key={índice}
              onClick={() => {elegirJugadorParaDúoNadadorTiburón(índice + 1)}}
              className="w-full text-xl font-bold p-2 rounded-md bg-yellow-300 hover:bg-yellow-400 disabled:bg-yellow-100"
              
            >
              {nombre}
            </button>
          ))}
        </div>
        
      </div>
      }
      
      {/* Pasar de turno */}
      { estado != {} && estado?.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" &&
      <button className="w-full text-xl font-bold py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        onClick={onPasarDeTurno} disabled={cargando}>
        {cargando ? "Cargando..." : "Pasar de turno"}
      </button>
      }
      
      {/* Decir ¡Basta! */}
      { estado != {} && estado?.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && (!estado?.últimaChanceEnCurso) && estado?.puntajesRonda[índiceActivo] >= 7 && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-blue-300 hover:bg-blue-400"
        onClick={onDecirBasta} disabled={cargando}>
        {cargando ? "Cargando..." : "¡Basta!"}
      </button>
      }
      
      {/* Decir ¡Última chance! */}
      { estado != {} && estado?.deQuienEsTurno === índiceActivo && faseActual === "FASE_DÚOS" && (!estado?.últimaChanceEnCurso) && estado?.puntajesRonda[índiceActivo] >= 7 && 
      <button className="w-full text-xl font-bold py-2 rounded-md bg-purple-300 hover:bg-purple-400"
        onClick={onDecirÚltimaChance} disabled={cargando}>
        {cargando ? "Cargando..." : "¡Última chance!"}
      </button>
      }
      
      
      
    </div>
    
  );
  
  
}
