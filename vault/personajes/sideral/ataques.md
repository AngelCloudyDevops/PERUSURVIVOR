---
tipo: personaje
id: sideral
archivos: [src/systems/sideral-kit.js, src/data/powers.js, src/systems/evolutions.js]
verificado: 2026-10-31
---
# Sideral · ataques

`P.SideralArsenal` (`src/systems/sideral-kit.js:3`). Teclas 1/2/3 (`src/core/runtime.js:24`); cambio con 0,3 s de enfriamiento (`sideral-kit.js:21`). Daño real = `power` 27 × `damageScale` (ver trampa de `powerScale` en [[personajes/sideral/gotchas]]).

| # | Técnica | Tipo | cd (s) | alcance | daño (rango 1) | Extra | Línea |
|---|---|---|---|---|---|---|---|
| 1 | Mirada Sideral (`sideralFear`) | especial, cono 1,55 rad | 1,35 | 270 | 27 | empuje 8; miedo 0,9 s, reaplica tras 2,5 s | `sideral-kit.js:7`; base `powers.js:98` |
| 2 | Colazo del Lagarto (`sideralTail`) | físico, melee, arco 135° | 1,65 | 125 | 33,75 (×1,25) | empuje 34 | `sideral-kit.js:8` |
| 3 | Huevo sospechoso (`sideralEgg`) | especial, nido | 2,1 | 340 | 44,55 por lagartito (×1,65) | abre a los 0,8 s | `sideral-kit.js:9` |
- Duración del miedo: 0,9 s a minions; jefes 0,18 s, minijefes 0,28 s, pesados 0,55 s (`sideral-kit.js:35`). El minion huye con carga a 230 u/s (150 si es pesado).
- Huevo: máximo 3 a la vez (`sideral-kit.js:37`); el lagartito corre a 580 u/s durante 0,38 s, se frena ante sólidos y no persigue tras salir (`sideral-kit.js:44-60`). Un rival recibe como máximo `maxHits` impactos por huevo.
- Los ataques también dañan props destructibles (`sideral-kit.js:38`).

## Evoluciones (`sideral-kit.js:12-14`)
- Rostro prohibido (Mirada): alcance 340, arco 2,05, ×1,15 (31,05), miedo 1,25 s. Hereda `P.Evolutions.profiles.sideral` (`evolutions.js:6`).
- Latigazo ancestral (Colazo): alcance 145, ×1,45 (39,15), empuje 40, más onda a 650 u/s de 280 u de alcance con 0,65× de poder, 3 impactos (`sideral-kit.js:13,40`).
- Nido prohibido (Huevo): ×1,2, 3 lagartitos en abanico, máximo 2 impactos por rival y huevo.

## Progresión de cada técnica
- Desbloqueo: Colazo en nivel 2, Huevo en nivel 4 (`sideral-kit.js:22`).
- Rangos 2 a 5 en niveles 6, 8, 10, 12 (`gates`, `sideral-kit.js:4`). Cada rango: +14 % daño, +5 % alcance, cadencia ×0,96 (`sideral-kit.js:18`).
- Evolución: rango 5 y nivel 14, por técnica (`sideral-kit.js:22`). La Mirada también evoluciona con `p.evolved.primary` (`sideral-kit.js:18`).
- Efectos de «Sangre fría» preparada sobre cada técnica: ver [[personajes/sideral/poderes]].
- Ver [[sistemas/combate/README]] y [[sistemas/evoluciones/README]].
