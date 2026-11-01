---
tipo: evento
id: miniboss-relics
archivos: [src/systems/miniboss-relics.js, backend/activities.cjs, tests/miniboss-relics.test.cjs]
verificado: 2026-10-31
---
# Reliquias de minijefe (`P.Relics`)

Parte de [[eventos/minijefes/README]]. `src/systems/miniboss-relics.js:2`.

| Minijefe | Objeto | Efecto |
|---|---|---|
| Fiscalizador, Makanaky | `mini_whistle` Silbato del caos | cada 6 s empuja 55 a rivales comunes visibles a ≤150; no mueve jefes (`tick :9`) |
| Paloma Brava | `mini_feather` Pluma brava | cada ataque añade 2 plumas con 35 % de tu daño, atraviesan 3 (`afterCast :10`) |
| Huaco Renegado | `mini_heart` Corazón de barro | absorbe un golpe completo; vuelve a estar listo tras 10 s (`block :11`, `tick :9`) |

- Mapeo `ids`: `miniboss-relics.js:3`; textos y rareza `exclusive`: `:4`.
- Drop: `drop(e)` crea un cofre legendario `mini-reward:<mapa>:<id>` sin llave (`:5`). Sin espacio libre deja 50 monedas en el suelo.
- Elección: equipar (reemplaza el accesorio actual) o cobrar `coins:50` (`reveal :6`, `choose :7`).
- Cooperativo: cada jugador elige una vez; las monedas se suman al fondo común y el accesorio es personal (`backend/activities.cjs:87`). Test: `tests/miniboss-relics.test.cjs:17`.
- Tests: `tests/miniboss-relics.test.cjs:4,8,11,14`.
