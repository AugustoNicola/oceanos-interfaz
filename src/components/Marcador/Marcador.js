const COLORES_JUGADORES = [
  ["text-red-400", "text-blue-400"],
  ["text-red-400", "text-green-400", "text-blue-400"],
  ["text-red-400", "text-green-400", "text-blue-400", "text-purple-400"]
]

const PUNTAJE_PARA_GANAR = [40, 35, 30]


export default function Marcador({
  nombresJugadores,
  puntajes
}) {
  
  return (
    <div className="mb-3">
      { nombresJugadores.length == 0 &&
      <div>
      <img className="m-auto w-[60%]" src="/cover.png" />
      </div>
      }
      
      { nombresJugadores.length > 0 &&
      <div>
      {
        nombresJugadores.map( (nombre, indiceJugador) => (
          <div key={indiceJugador} className="flex flex-row justify-between text-3xl font-bold" >
            <p className={COLORES_JUGADORES[puntajes.length - 2][indiceJugador]}>{nombre}</p>
            <p className={COLORES_JUGADORES[puntajes.length - 2][indiceJugador]}>{puntajes[indiceJugador]}/{PUNTAJE_PARA_GANAR[puntajes.length - 2]}</p>
          </div>
        ))
      }
      </div>
      }
    </div>
  );
}
