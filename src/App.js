import { useEffect, useState } from 'react';
import './App.css';
import Marcador from './components/Marcador/Marcador';
import Mano from './components/Mano/Mano';
import Mazo from './components/Mazo/Mazo';
import PilaDeDescarte from './components/PilaDeDescarte/PilaDeDescarte';
import ZonaDuos from './components/ZonaDuos/ZonaDuos';
import { llamarBackend } from './api/backend';
import Registro from './components/Registro/Registro';

function App() {
  let estadoInicial = {
    mazo: [],
    descarte: [
      [],
      []
    ],
    estadosDeJugadores: [
      {
        mano: [],
        duos: []
      },
      {
        mano: [],
        duos: []
      },
      {
        mano: [],
        duos: []
      },
      {
        mano: [],
        duos: []
      }
    ],
    puntajes: [0,0,0,0],
    deQuienEsTurno: 0
  }
  //let estadoInicialPoblado = {
  //  mazo: [{tipo: "SIRENA", color: "BLANCO"}],
  //  descarte: [
  //    [{tipo: "CANGREJO", color: "AMARILLO"}],
  //    [{tipo: "PINGUINO", color: "VIOLETA"}]
  //  ],
  //  estadosDeJugadores: [
  //    {
  //      mano: [
  //        {tipo: "SIRENA", color:"BLANCO"},
  //        {tipo: "BARCO", color:"NEGRO"},
  //        {tipo: "PEZ", color:"AZUL"}
  //      ],
  //      duos: [
  //        [{tipo: "BARCO", color: "AZUL"}, {tipo: "BARCO", color: "CELESTE"}]
  //      ]
  //    },
  //    {
  //      mano: [
  //      ],
  //      duos: [
  //        [{tipo: "PEZ", color: "AZUL"}, {tipo: "PEZ", color: "NEGRO"}],
  //        [{tipo: "BARCO", color: "CELESTE"}, {tipo: "BARCO", color: "CELESTE"}]
  //      ]
  //    },
  //    {
  //      mano: [
  //      {tipo: "PEZ", color:"VERDE"}
  //      ],
  //      duos: [
  //      ]
  //    },
  //    {
  //      mano: [
  //      {tipo: "CONCHA", color:"GRIS"},
  //      {tipo: "ANCLA", color:"NARANJA"},
  //      {tipo: "SIRENA", color:"BLANCO"},
  //      {tipo: "PEZ", color:"NEGRO"}
  //      ],
  //      duos: [
  //      ]
  //    }
  //  ],
  //  puntajes: [
  //    12, 4, 2, 7
  //  ],
  //  deQuienEsTurno: 0
  //}
  
  const [nombresJugadores, setNombresJugadores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [modoEspectador, setModoEspectador] = useState(true);
  const [índiceActivo, setÍndiceActivo] = useState(null);
  const [estado, setEstado] = useState(estadoInicial);
  const [entradasRegistro, setEntradasRegistro] = useState([]);
  const [faseActual, setFaseActual] = useState("INICIAR_PARTIDA");
  const [idPartida, setIdPartida] = useState(null);
  
  
  const handleInicializarPartida = async (datosJugadores) => {
    setCargando(true);
    setError(null);
    
    setNombresJugadores(datosJugadores.map(jugador => jugador.nombre));
    
    const búsquedaÍndiceActivo = datosJugadores.findIndex(jugador => jugador.tipo === "ACTIVO");
    if (búsquedaÍndiceActivo != -1) {
      setÍndiceActivo(búsquedaÍndiceActivo);
      setModoEspectador(false);
    }
    
    try {
      const data = await llamarBackend("crear_partida", {
        "jugadores": datosJugadores.map(jugador => jugador.tipo === "ACTIVO" ? "decisiones_cacheadas" : jugador.tipo),
        "posición_jugador_activo": búsquedaÍndiceActivo
      });
      setEstado(data?.estado);
      setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_COMIENZO_RONDA", "jugador_inicial": 0}]);
      setFaseActual("FASE_ROBO");
      setIdPartida(data?.id_partida);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleAvanzar = async () => {
    setCargando(true);
    setError(null);
    
    if (estado?.fase === "RONDA_TERMINADA") {
      setEntradasRegistro([]);
      setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_COMIENZO_RONDA", "jugador_inicial": estado?.deQuienEsTurno}]);
    }
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/ok`, {});
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
      
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleRobarDelDescarte = async (descarteElegido) => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_robo`, {
        "acción_robo_elegida": "descarte",
        "pila_descarte_robada": descarteElegido
      });
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleCómoRobarDelMazo = async (cartaElegida, pilaDescarteElegida) => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_robo`, {
        "acción_robo_elegida": "mazo",
        "carta_elegida": cartaElegida,
        "pila_descarte_elegida": pilaDescarteElegida
      });
      setEstado(data?.estado);
      
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleJugarDúo = async (body) => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_duos_o_fin`, body);
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handlePasarDeTurno = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_duos_o_fin`, {
        "acción_elegida": "pasar"
      });
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleDecirBasta = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_duos_o_fin`, {
        "acción_elegida": "basta"
      });
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  const handleDecirÚltimaChance = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await llamarBackend(`partida/${idPartida}/accion_duos_o_fin`, {
        "acción_elegida": "última_chance"
      });
      setEstado(data?.estado);
      if (data?.evento != null) {
        setEntradasRegistro(entradas => [...entradas, data?.evento]);
      }
      if (data?.estado?.fase == "PARTIDA_TERMINADA") {
        setEntradasRegistro(entradas => [...entradas, {"acción": "ESPECIAL_PARTIDA_TERMINADA", "jugador_ganador": estado?.puntajes.indexOf(Math.max(...estado?.puntajes)), "ganó_por_sirena": Math.max(...estado?.puntajes) === 999}]);
      }
      setFaseActual(data?.estado?.fase);
    } catch (err) {
      setError(err.message ?? "¡Error desconocido!");
    } finally {
      setCargando(false);
    }
  };
  
  
  return (
    <div className="w-screen h-screen flex flex-1 flex-row flex-nowrap">
      {/* Tablero */}
      <div className="basis-8/12 relative App bg-yellow-100 w-full h-full p-6 flex justify-center items-center">
        {/* Centro */}
        <div className="flex flex-row flex-nowrap justify-around gap-7">
          {/* Descarte */}
          <div className="flex flex-row flex-nowrap justify-around gap-3">
            <PilaDeDescarte cartas={estado.descarte[0]} />
            <PilaDeDescarte cartas={estado.descarte[1]} />
          </div>
          {/* Mazo */}
          <Mazo cartas={estado.mazo} />
        </div>
        
        {/* Mano Jugador Abajo */}
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] bg-red-400'>
          <Mano mano={estado.estadosDeJugadores[0].mano} oculta={faseActual != "RONDA_TERMINADA" && faseActual != "PARTIDA_TERMINADA" && !modoEspectador && índiceActivo != 0} />
        </div>
        {/* ZonaDuos Jugador Abajo */}
        <div className='absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[600px] bg-red-200'>
          <ZonaDuos duos={estado.estadosDeJugadores[0].duos} />
        </div>
        
        
        
        {/* Mano Jugador Arriba */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 rotate-180 w-[600px] bg-blue-400'>
          <Mano mano={estado.estadosDeJugadores[estado.puntajes.length === 2 ? 1 : 2].mano} oculta={faseActual != "RONDA_TERMINADA" && faseActual != "PARTIDA_TERMINADA" && !modoEspectador && índiceActivo != (estado.puntajes.length === 2 ? 1 : 2)} />
        </div>
        {/* ZonaDuos Jugador Arriba */}
        <div className='absolute top-[18%] left-1/2 -translate-x-1/2 rotate-180 w-[600px] bg-blue-200'>
          <ZonaDuos duos={estado.estadosDeJugadores[estado.puntajes.length === 2 ? 1 : 2].duos} />
        </div>
        
        
        {/* Mano Jugador Izquierda */}
        { estado.puntajes.length > 2 &&
        <div className='absolute top-1/2 left-[-18%] -translate-y-1/2 rotate-90 w-[600px] bg-green-400'>
          <Mano mano={estado.estadosDeJugadores[1].mano} oculta={faseActual != "RONDA_TERMINADA" && faseActual != "PARTIDA_TERMINADA" && !modoEspectador && índiceActivo != 1} />
        </div>
        }
        
        {/* ZonaDuos Jugador Izquierda */}
        { estado.puntajes.length > 2 &&
        <div className='absolute top-1/2 left-[-5%] -translate-y-1/2 rotate-90 w-[600px] bg-green-200'>
          <ZonaDuos duos={estado.estadosDeJugadores[1].duos} />
        </div>
        }
        
        {/* Mano Jugador Derecha */}
        { estado.puntajes.length === 4 &&
        <div className='absolute top-1/2 left-[70%] -translate-y-1/2 -rotate-90 w-[600px] bg-purple-400'>
          <Mano mano={estado.estadosDeJugadores[3].mano} oculta={faseActual != "RONDA_TERMINADA" && faseActual != "PARTIDA_TERMINADA" && !modoEspectador && índiceActivo != 3} />
        </div>
        }
        {/* ZonaDuos Jugador Derecha */}
        { estado.puntajes.length === 4 &&
        <div className='absolute top-1/2 left-[57%] -translate-y-1/2 -rotate-90 w-[600px] bg-purple-200'>
          <ZonaDuos duos={estado.estadosDeJugadores[3].duos} />
        </div>
        }
        
      </div>
      {/* Sideboard */}
      <div className="bg-gray-200 basis-4/12 w-full h-full px-5 py-3 flex flex-col flex-1">
        {/* Marcador */}
        {nombresJugadores.length > 0 &&
        <Marcador
          nombresJugadores={nombresJugadores}
          puntajes={estado.puntajes}
        />
        }
        {/* Registro */}
        <Registro
          entradasRegistro={entradasRegistro}
          faseActual={faseActual}
          índiceActivo={índiceActivo}
          modoEspectador={modoEspectador}
          setFaseActual={setFaseActual}
          estado={estado}
          onInicializarPartida={handleInicializarPartida}
          onAvanzar={handleAvanzar}
          onRobarDelDescarte={handleRobarDelDescarte}
          onCómoRobarDelMazo={handleCómoRobarDelMazo}
          onJugarDúo={handleJugarDúo}
          onPasarDeTurno={handlePasarDeTurno}
          onDecirBasta={handleDecirBasta}
          onDecirÚltimaChance={handleDecirÚltimaChance}
          cargando={cargando}
          error={error}
          nombresJugadores={nombresJugadores}
        />
      </div>
    </div>
  );
}

export default App;
