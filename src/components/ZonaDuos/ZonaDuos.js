import Carta from "../Carta/Carta";

export default function ZonaDuos({
  duos = []
}) {
  return (
    <div className="flex flex-row justify-around h-[156px]">
      {duos.map( (duo, indice) => (
        <div key={indice} className="flex flex-row justify-start overflow-hidden w-[200px]">
          <div>
            <Carta type={duo[0].tipo} color={duo[0].color}  />
          </div>
          <div className="-translate-x-2/3">
            <Carta type={duo[1].tipo} color={duo[1].color}  />
          </div>
        </div>
      ) )}
    </div>
  );
}
