import Carta from "../Carta/Carta";

export default function Mazo({
  cartas = []
}) {
  
  return cartas.length == 0 ? (<div className="invisible"><Carta /></div>) : (<Carta />);
}
