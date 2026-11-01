---
tipo: personaje
id: makanaky
archivos: [src/systems/makanaky-arsenal.js, src/data/powers.js, src/systems/passives.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Makanaky · ataques

Tres técnicas en `P.MakanakyArsenal` (`src/systems/makanaky-arsenal.js`). Teclas 1/2/3 (`src/core/runtime.js:24`); cambio con 0,3 s de enfriamiento (`makanaky-arsenal.js:16`). Daño base = `power` 30 × `damageScale` × (1 + 0,14 por rango extra).

| # | Técnica | Tipo | cd (s) | alcance | daño (rango 1) | Extra | Línea |
|---|---|---|---|---|---|---|---|
| 1 | Puño de la Realeza (`royalEcho`) | físico, melee, arco 120° | 0,6 | 100 | 30 | empuje 22 | `makanaky-arsenal.js:5` |
| 2 | Mete cabezazos como yo (`makanakyHeadbutt`) | físico, un objetivo, arco 45° | 1,15 | 78 | 54 (×1,8) | 10 % aturdir 0,65 s, empuje 18 | `:6` |
| 3 | GAA (`makanakyGaaaa`) | especial, proyectil sin perforar | 1,3 | 380 (vel. 470) | 34,5 (×1,15) | ralentiza 30 % 2 s | `:7` |
- `P.Data.attacks.royalEcho` duplica el perfil 1 en `src/data/powers.js:95`.

## Evoluciones (`makanaky-arsenal.js:10-12`)
- Combo de la Realeza: arco 145°, alcance 125, ×1,25 (37,5), empuje 32.
- Cabeza de concreto: alcance 90, ×2,15 (64,5), 18 % de aturdir 0,8 s.
- GAAAA sin escapatoria: alcance 460, ×1,45 (43,5), guiado, ralentiza 40 % 2,5 s y enraíza 0,5 s si ya estaba ralentizado.
- El dato de respaldo `P.Evolutions.profiles.makanaky` (`src/systems/evolutions.js:5`, arco 150°, ×1,35) **no se usa** mientras exista el arsenal (`evolutions.js:27`).

## Progresión de cada técnica
- Desbloqueo: Cabezazo en nivel 2, GAA en nivel 4 (`makanaky-arsenal.js:17`).
- Rangos 2 a 5 en niveles 6, 8, 10 y 12 (`gates`, `makanaky-arsenal.js:3`). Cada rango: +14 % daño, +5 % alcance, cadencia ×0,96 (`makanaky-arsenal.js:15`), empuje +3 (salvo GAA).
- Evolución: rango 5 y nivel 14, por técnica (`makanaky-arsenal.js:17-18`).
- El Puño es el slot «principal»: `p.evolved.primary` también lo evoluciona (`makanaky-arsenal.js:15`).
- Estados (`applyStatus`, `makanaky-arsenal.js:19`): jefes y minijefes solo se interrumpen 0,22 s; no se aturden.

## Modificadores de la pasiva
Golpe Real: Puño ×1,35 y empuje ×1,4; Cabezazo ×1,6 con aturdimiento garantizado (`src/systems/passives.js:6,35`). Detalle en [[personajes/makanaky/poderes]]. Ver [[sistemas/combate/README]].
