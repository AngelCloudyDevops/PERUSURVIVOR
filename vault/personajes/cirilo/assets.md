---
tipo: personaje
id: cirilo
archivos: [src/systems/cirilo-ur.js, src/systems/cirilo-arena.js, src/rendering/cirilo-kit-art.js, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# CiriloTV · assets

Volver: [[personajes/cirilo/README]]. Todo bajo `public/assets/`.

| Uso | Archivo | Lo carga |
|---|---|---|
| Atlas de menú (fila 3) | `characters/streamers-atlas-v1.webp` (+ `streamers-atlas.json`) | `src/rendering/sprites.js:4` |
| Caminar (6 poses) | `walks/cirilo-walk-v2.webp` | `src/rendering/walk-art.js:32` |
| Apuntar/atacar direccional | `aim/cirilo-aim-v1.webp` | `walk-art.js:16,32` |
| Hoja de sprites del personaje UR (4×4; significado de cada fila sin verificar) | `characters/cirilo-ur-v1.png` | `src/systems/cirilo-ur.js:7` (`load`) |
| Transformación (12 cuadros, 4×3) | `characters/cirilo-domain-transform-v4.webp` | `cirilo-ur.js:8` |
| Primeros planos del sello (12 cuadros) | `characters/cirilo-domain-closeups-v1.webp` | `cirilo-ur.js:9` |
| Carga del dominio (4 cuadros) | `characters/cirilo-domain-charge-v1.webp` | `cirilo-ur.js:10` |
| Sello de manos (4 cuadros) | `characters/cirilo-domain-seal-v1.webp` | `cirilo-ur.js:11` |
| Vuelo (4 poses) | `characters/cirilo-domain-flight-v1.webp` | `cirilo-ur.js:12` |
| Fondo del tribunal | `scenarios/cirilo-midnight-court-v2.webp` | `src/systems/cirilo-arena.js:4` |
| Marco demoníaco de cartas y HUD | `ui/cirilo-domain-demon-frame-v1.webp` | `src/ui/styles.css:357,598,619,636,676,862,875`; marco `domain-demon` en `src/systems/ability-cards.js:6` |
| Compañero en coop | `companions/companions-streamers-v1.webp` (fila `cirilo`) | `src/rendering/companion-art.js:5`, `dragon-epic.js:33` |

## Cartas
- Personaje: `cards/cirilo-character-fullart-v1.webp` (`src/ui/reference-menus.js:36`).
- Q: `cards/cirilo-full-maldad-ultimate-fullart-v1.webp` (`src/systems/cirilo-kit.js:52`).
- R: `cards/cirilo-audiencia-domain-fullart-v1.webp` (`src/systems/ability-cards.js:22`).
- Taxi y Eco no tienen carta de mejora propia con arte (no hay `cirilo-taxi*` ni `cirilo-echo*` en `public/assets/cards/`).

## Se dibuja con canvas
- Taxi, humo y ruedas: `src/rendering/cirilo-kit-art.js:3`. Proyectiles `CIRILO_ECHO`, vómito y llamarada: `cirilo-kit-art.js:16`, `cirilo-ur.js:91`. Quemadura: `cirilo-ur.js:92`.
- Boca del arma: `P.Muzzle.point` propio (`cirilo-ur.js:90`); no hay entrada en `src/data/muzzle-anchors.js`.

## Sin uso en el código
- `attacks/cirilo-attack-v1.*` (`attack-cirilo` carga `aim/`), `scenarios/cirilo-midnight-court-v1.*` y los `cirilo-domain-transform-v1/v2.prompt.txt` no los pide ningún `src/`.
- Los `*.prompt.txt` son metadatos de autoría.
