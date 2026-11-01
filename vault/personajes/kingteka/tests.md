---
tipo: personaje
id: kingteka
archivos: [tests/kingteka-arsenal.test.cjs, tests/kingteka-domain.test.cjs, package.json]
verificado: 2026-10-31
---
# Kingteka · tests

Volver: [[personajes/kingteka/README]]. Los tests usan `new Simulation('campo',[0,1])` de `backend/simulation.cjs` (los scripts reales del cliente en `node:vm`).

## Específicos
| Archivo | Qué cubre |
|---|---|
| `tests/kingteka-arsenal.test.cjs:6-16` | perfiles distintos (escopeta 4 perdigones, 0,92 s, alcance 260), desbloqueos por nivel, pasiva Instinto, evoluciones independientes, Escopeta Contra, HUD de 3 slots |
| `tests/kingteka-domain.test.cjs:5-9` | es UR, Q/R con cargas separadas, oleadas y curación, serialización en cooperativo y carta pública |

## Otros que lo tocan
- `tests/gameplay.test.cjs:143` — la escopeta lanza 4 proyectiles `BULLET` (confirma que manda el arsenal).
- `tests/player-feedback.test.cjs:9-13` — poses de impacto, derrota, armas, Gallinazo v2 y caminar.
- `tests/ultimate-comic.test.cjs:15` — bandada de la práctica.
- `tests/lobby.test.cjs:8,58,65,103` — práctica de Kingteka, evolución, ficha con Base/Cerdito.
- `tests/character-balance.test.cjs:26` — intervalo y alcance por arma.
- `tests/gacha.test.cjs:5`, `tests/meta-progress.test.cjs:7` — crecimiento ×1,12 de UR.
- Otros que lo nombran: `attributes`, `build`, `card-gallery`, `causa-combo`, `cinematic-upgrades`, `combat-balance`, `cooperative`, `directional-aim`, `domain`, `evolutions`, `frame-budget`, `lab-equipment` (rueda del arsenal), `meta-migrations`, `meta-progress-ids`, `miniboss-phase`, `muzzle`, `progressive-combat`, `roster-balance`, `shotgun-miniboss-balance`, `stats`, `trio-balance`, `walk-art` (todos en `tests/*.test.cjs`).

## Registro en `package.json`
- Todos los de arriba están en el script `test` (`package.json:13`) salvo uno.
- **No registrado, no corre**: `tests/character-variants.test.cjs` (nombra a Kingteka/Cerdito). No aparece en `test` ni en `pretest` (`package.json:12-13`).
- Antes de confiar en un cambio de skin o variante, correrlo a mano: `node --test tests/character-variants.test.cjs`.
