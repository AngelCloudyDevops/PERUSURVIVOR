---
tipo: personaje
id: chamelin
archivos: [src/systems/chamelin-kit.js, src/systems/chamelin.js, src/data/powers.js, src/systems/evolutions.js]
verificado: 2026-10-31
---
# Chamelín · ataques

`P.ChamelinArsenal` (`src/systems/chamelin-kit.js:3`). Teclas 1/2/3 (`src/core/runtime.js:24`); cambio con 0,3 s de enfriamiento (`chamelin-kit.js:13`). Todo es daño especial. Dentro del Baño de Trovo el arma activa se fuerza a la 1 (`chamelin-kit.js:12`).

| # | Técnica | cd (s) | alcance | daño (rango 1) | Efecto | Línea |
|---|---|---|---|---|---|---|
| 1 | Retaguardia de Trovo (`trovoShot`) | 0,8 | 420 (vel. 310) | 28 × 0,15 = 4,2 | charco 4 s, ralentiza 20 % (10 % a jefes), sin bajar defensas | `powers.js:105`; `chamelin-kit.js:5` |
| 2 | Escupitajo pegajoso (`trovoPegote`) | 1,25 | 440 (vel. 520) | 28 × 1,1 = 30,8 | 10 % de Pegote: −30 % velocidad 3 s | `chamelin-kit.js:6` |
| 3 | Pichi de Trovo (`trovoPichi`) | 1,6 | 380 (vel. 460) | 28 × 0,3 = 8,4 | charco 3 s propio; 15 % de resbalón (0,6 s) | `chamelin-kit.js:6` |
- Daño de proyectil: `power × powerScale × damageScale` (`src/systems/combat.js:22`). Para Chamelín la ficha también aplica `damageScale` (`powers.js:55`).
- Charcos de la técnica 1 (`P.Chamelin.puddle`, `src/systems/chamelin.js:12`): por pulso de 0,5 s hacen `poder × 0,30 × 0,5` = 4,2 (`chamelin.js:4`); máximo 48 charcos. Los proyectiles nacen detrás del jugador (`chamelin.js:25`).
- Pichi y Pegote: cada rival tira la probabilidad una sola vez por lanzamiento (`chamelin-kit.js:27`). Resbalón: protección de 4 s; jefes y minijefes solo reciben ralentización 15 % durante 1 s (`chamelin-kit.js:27-29`).
- Charcos de Pichi: `p.chamelinPools`, máximo 24, pulso 0,5 s a 0,5× de `poder × 0,18` (`chamelin-kit.js:35,40`). Sistema distinto del de la técnica 1 (ver [[personajes/chamelin/gotchas]]).

## Evoluciones
- Desastre de Trovo (técnica 1): 3 proyectiles, abanico 0,3 (`evolutions.js:4`; copiada en `chamelin-kit.js:7`).
- Pegote salpicón (técnica 2): salpica a 75 u con 60 % del daño; una tirada por rival (`chamelin-kit.js:7,35`).
- Barrido amarillo (técnica 3): 3 chorros en abanico 0,18, charcos de 5 s, sin subir el 15 % (`chamelin-kit.js:7`).

## Progresión de cada técnica
- Desbloqueo: Pegote en nivel 2, Pichi en nivel 4 (`chamelin-kit.js:14`).
- Rangos 2 a 5 en niveles 6, 8, 10 y 12 (`gates`, `chamelin-kit.js:4`). Cada rango: +14 % daño, +5 % alcance, cadencia ×0,96 (`chamelin-kit.js:10`).
- Evolución: rango 5 y nivel 14 por técnica; evolucionar la técnica 1 marca `p.evolved.primary` (`chamelin-kit.js:15`).
- «Presión acumulada» mejora el área del siguiente ataque: ver [[personajes/chamelin/poderes]].
- Ver [[sistemas/combate/README]] y [[sistemas/evoluciones/README]].
