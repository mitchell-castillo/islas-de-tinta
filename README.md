# Islas de Tinta

Un pequeño archipiélago de lógica, edición del 27 de octubre de 2026. Seis dibujos originales de 5 × 5, con pistas de longitud de grupos (nonogramas). HTML, CSS y módulos JavaScript nativos. Sin dependencias, fuentes remotas, analítica, cuentas ni solicitudes a servicios externos.

## Jugar

Sirve esta carpeta por HTTP (por ejemplo `python3 -m http.server 8080`) y abre `http://localhost:8080`. Los módulos ES requieren HTTP; no abrir `index.html` como `file://`.

Cada número indica un grupo consecutivo de tinta. Los grupos de una misma fila o columna se separan por al menos una casilla vacía. Tinta rellena, Vacío pone una × como nota opcional. Repetir una acción la borra. Solo se comprueban casillas rellenas: no hay que marcar todas las vacías para ganar. Las pistas verdes señalan que los grupos de esa línea coinciden, no que todas sus posiciones sean correctas.

Todas las islas están abiertas. Sin temporizador ni penalización. Deshacer conserva hasta 100 cambios de la isla actual; navegar, recargar o recibir cambios de otra pestaña limpia ese historial. Reiniciar una isla conserva su logro. Borrar todo elimina cuadrículas y logros tras confirmación.

### Accesibilidad

Botones nativos y controles con nombre; foco visible; cuadrícula con un único punto de tabulación y navegación con flechas (cíclica); Intro/Espacio activan la casilla; T/X dentro de la cuadrícula cambian de herramienta. Los cambios de estado se anuncian mediante región viva. Ayuda desplegable, confirmaciones con `<dialog>`, respeto a `prefers-reduced-motion`. Español, diseño adaptable desde 320 px.

## Datos locales

Clave: `daily-games:islas-de-tinta:v1`. Esquema compatible con el catálogo:

```js
{version:1, currentLevel:0, completed:{"0":{bestMoves:13}},
 run:{boards:[/* seis arrays de 25 valores: 0 indeciso, 1 tinta, 2 vacío */], moves:[0,0,0,0,0,0]},
 updatedAt:"2026-10-27T00:00:00.000Z"}
```

`run:null` se acepta como partida vacía. Las entradas corruptas no bloquean el juego; acceso a localStorage denegado se degrada a memoria con aviso. Se reconcilian pestañas mediante eventos `storage` y lectura antes de mutaciones. Resolución por última escritura de documento completo (no colaboración simultánea por casilla); eventos atrasados se ignoran, eliminaciones externas reinician y una confirmación abierta se cancela ante un cambio externo. El contador `bestMoves` sirve al catálogo; no es un límite ni una penalización.

## Verificar

`npm run check` — Node 20+, sin instalación. Sintaxis y 13 pruebas: unicidad exhaustiva de cada puzzle, lógica y almacenamiento defensivo, partida completa a través de manejadores DOM simulados, recarga, notas, deshacer, teclado, confirmaciones, sincronización y almacenamiento bloqueado. CI ejecuta la misma comprobación en Node 22.

Ver `QA.md` para alcance y acciones deterministas. La búsqueda de soluciones enumera las 32 posibilidades de cada fila, descarta las incompatibles con las pistas y poda por prefijos de columnas; al terminar, comprueba todas las combinaciones compatibles. No confía solo en el dibujo de referencia.

## Estructura

- `src/logic.js`: seis patrones originales, pistas derivadas, solver, reglas y esquema.
- `src/app.js`: interfaz, eventos y persistencia.
- `assets/cover.svg`: ilustración vectorial original, también favicon.
- `game.json`: manifiesto del juego.
- `.nojekyll`: distribución estática compatible con GitHub Pages.

No se requiere compilación. Publicar la raíz de este repositorio con un servidor estático. No incluye mecanismos de publicación automática.
