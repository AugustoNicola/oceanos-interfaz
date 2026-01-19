import { useEffect, useRef } from "react";
import Acciones from "../Acciones/Acciones";
import EntradaRegistro from "../EntradaRegistro/EntradaRegistro";

export default function Registro({
  entradasRegistro = [],
  faseActual = "INICIAR_PARTIDA",
  setFaseActual,
  índiceActivo,
  modoEspectador,
  estado = {},
  onInicializarPartida,
  onAvanzar,
  onRobarDelDescarte,
  onRobarDelMazo,
  onCómoRobarDelMazo,
  onJugarDúo,
  onPasarDeTurno,
  onDecirBasta,
  onDecirÚltimaChance,
  cargando,
  error,
  setError,
  nombresJugadores
}) {
  
  const bottomRef = useRef(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"})
  }, [entradasRegistro, faseActual, estado]);
  
  return (
    <div className="h-full pt-6 pr-2 overflow-y-scroll flex flex-col flex-nowrap gap-3 justify-start items-center">
      {entradasRegistro.map((entrada, índice) => (
        <EntradaRegistro key={índice} data={entrada} nombresJugadores={nombresJugadores} índiceActivo={índiceActivo} modoEspectador={modoEspectador} />
      ))}
      
      <Acciones
        faseActual={faseActual}
        setFaseActual={setFaseActual}
        índiceActivo={índiceActivo}
        estado={estado}
        nombresJugadores={nombresJugadores}
        onInicializarPartida={onInicializarPartida}
        onAvanzar={onAvanzar}
        onRobarDelDescarte={onRobarDelDescarte}
        onRobarDelMazo={onRobarDelMazo}
        onCómoRobarDelMazo={onCómoRobarDelMazo}
        onJugarDúo={onJugarDúo}
        onPasarDeTurno={onPasarDeTurno}
        onDecirBasta={onDecirBasta}
        onDecirÚltimaChance={onDecirÚltimaChance}
        cargando={cargando}
        setError={setError}
      />
      
      { error &&
      <div className="w-full text-lg py-2 px-2 rounded-md bg-red-700 text-white font-bold">
        <p>{error}</p>
      </div>
      }
      
      <div ref={bottomRef} />
    </div>
  );
}