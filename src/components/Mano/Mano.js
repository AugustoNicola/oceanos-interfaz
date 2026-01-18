import Carta from "../Carta/Carta";

export default function Mano({
  mano = [],
  oculta = false
}) {
  return (
    <div className="flex justify-around h-[156px]">
      {mano.map( (carta, indice) => (<Carta key={indice} type={oculta ? undefined : carta.tipo} color={oculta ? undefined : carta.color} />) )}
    </div>
  );
}
