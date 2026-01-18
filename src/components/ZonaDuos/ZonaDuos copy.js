import Carta from "../Carta/Carta";

export default function ZonaDuos() {
  return (
    <div className="flex justify-around w-full h-full">
      <Duo />
      
      <Duo />
      <Duo />
      
    </div>
  );
}


function Duo() {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0">
        <Carta type={"BARCO"} color={"NEGRO"} scale={0.2} />
      </div>
      <div className="absolute top-0 left-[47px]">
        <Carta type={"BARCO"} color={"AZUL"} scale={0.2} />
      </div>
    </div>
  )
}