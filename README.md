# oceanos-interfaz

![](public/partida.png)

## Qué es esto

Esta herramienta te permite jugar y visualizar partidas del Océanos para mayor claridad a la hora de probar tu bot y entender su comportamiento. Se conecta a tu [servidor local del juego](https://github.com/AugustoNicola/oceanos-juego), y lo único que hace esta interfaz es mostrar en pantalla la partida que se está jugando en tu compu, además de darte una manera más cómoda de jugar.

## Tutorial: ¿cómo uso esto?

1. Instalar localmente el repositorio de [oceanos-juego](https://github.com/AugustoNicola/oceanos-juego) (ver instrucciones en el README.md de ahí)
2. Iniciar el servidor local ejecutando `python -m uvicorn backend.main:app --reload --port 8321` desde la carpeta `src/`
3. Abrir la interfaz desde el navegador: https://augustonicola.github.io/oceanos-interfaz/
4. Desde la interfaz, seleccionar la cantidad de jugadores, sus nombres, y sus tipos de jugador (pueden ser cualquier bot que tengas localmente, además de la opción "Jugar por interfaz" para que las acciones de juego las tomes vos desde el navegador).
5. ¡Listo! Ahora el navegador va a mostrar todo sobre la partida, y si estás jugando por interfaz vas a tener las acciones de juego disponibles a la derecha.
