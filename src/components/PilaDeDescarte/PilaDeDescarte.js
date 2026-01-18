import Carta from "../Carta/Carta";

export default function PilaDeDescarte({
  cartas = []
}) {
  
  return cartas.length === 0 ? (<div className="invisible"><Carta /></div>) : (
    <Carta type={cartas[cartas.length - 1].tipo} color={cartas[cartas.length - 1].color} />
  );
}
