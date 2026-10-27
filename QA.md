# QA — Islas de Tinta

## Verificado en este entorno

- `npm run check`: 13/13 pruebas y sintaxis.
- Los seis puzzles tienen exactamente una solución: búsqueda exhaustiva de todas las filas permitidas y restricciones de columnas.
- DOM **simulado**: manejadores, estado, seis victorias, recarga, confirmaciones, navegación de teclado, almacenamiento bloqueado y eventos entre pestañas.
- No se afirma QA de navegador real desde estas pruebas: layout, diálogos nativos, activación de botones mediante Intro/Espacio y lectores de pantalla requieren un navegador real. El agente de publicación realiza esa revisión aparte.

## Soluciones deterministas

Usar modo Tinta (`#ink`), entrar en cada isla mediante `#levels.children[indice]` y pulsar las casillas siguientes (índices base cero, de izquierda a derecha y de arriba abajo). No hace falta marcar los vacíos. Partir de cuadrícula vacía.

### 1. La semilla

Casillas: #cell-2, #cell-6, #cell-7, #cell-8, #cell-10, #cell-11, #cell-12, #cell-13, #cell-14, #cell-16, #cell-17, #cell-18, #cell-22

```text
· · ■ · ·
· ■ ■ ■ ·
■ ■ ■ ■ ■
· ■ ■ ■ ·
· · ■ · ·
```

### 2. El abrazo

Casillas: #cell-0, #cell-4, #cell-5, #cell-6, #cell-8, #cell-9, #cell-10, #cell-11, #cell-12, #cell-13, #cell-14, #cell-16, #cell-17, #cell-18, #cell-22

```text
■ · · · ■
■ ■ · ■ ■
■ ■ ■ ■ ■
· ■ ■ ■ ·
· · ■ · ·
```

### 3. La vela

Casillas: #cell-2, #cell-6, #cell-7, #cell-8, #cell-12, #cell-13, #cell-14, #cell-15, #cell-16, #cell-17, #cell-18, #cell-19, #cell-21, #cell-22, #cell-23

```text
· · ■ · ·
· ■ ■ ■ ·
· · ■ ■ ■
■ ■ ■ ■ ■
· ■ ■ ■ ·
```

### 4. El arrecife

Casillas: #cell-1, #cell-2, #cell-3, #cell-5, #cell-6, #cell-8, #cell-9, #cell-10, #cell-14, #cell-15, #cell-16, #cell-18, #cell-19, #cell-21, #cell-22, #cell-23

```text
· ■ ■ ■ ·
■ ■ · ■ ■
■ · · · ■
■ ■ · ■ ■
· ■ ■ ■ ·
```

### 5. La marea

Casillas: #cell-0, #cell-1, #cell-2, #cell-3, #cell-5, #cell-10, #cell-11, #cell-12, #cell-15, #cell-20, #cell-21, #cell-22, #cell-23, #cell-24

```text
■ ■ ■ ■ ·
■ · · · ·
■ ■ ■ · ·
■ · · · ·
■ ■ ■ ■ ■
```

### 6. La fuente

Casillas: #cell-0, #cell-1, #cell-2, #cell-3, #cell-4, #cell-5, #cell-7, #cell-9, #cell-12, #cell-17, #cell-21, #cell-22, #cell-23

```text
■ ■ ■ ■ ■
■ · ■ · ■
· · ■ · ·
· · ■ · ·
· ■ ■ ■ ·
```

## Revisión real recomendada

Desktop y móvil: revisar sin desbordamientos; pulsar Tinta/Vacío; deshacer; cancelar y confirmar reinicio; abrir/cerrar ayuda; usar Tab, flechas, Intro y Espacio; resolver las seis; recargar; comparar catálogo; recibir un cambio en segunda pestaña; cancelar y confirmar borrado total; verificar sin errores de consola ni solicitudes ajenas al origen.

## Navegador real · 27 oct 2026

Publicación `00e7d185ef1975eada0fd7cb4920ec0d8b50dd18`, Chromium de escritorio sobre GitHub Pages. Se resolvieron las seis islas mediante clics en sus controles: progreso 1/6 a 6/6 y mensaje de archipiélago completo. Recarga conservó 6/6. Se verificaron notas Vacío, deshacer, T y flecha derecha, activación con Intro, cancelación por Escape y reinicio confirmado, apertura/cierre de ayuda. Inspección visual de escritorio realizada; no se afirma prueba móvil, táctil ni lector de pantalla. No se usaron DevTools.

También verificados: cancelación de borrado total conservó 6/6; borrado confirmado actualizó ambas pestañas a 0/6; Espacio activó una casilla. Los mensajes de error observados procedían de la extensión del navegador (`Error sending browser metadata to extension`), no del código del juego. La vista de escritorio no mostró solapamientos. Móvil/táctil siguen sin verificar.
