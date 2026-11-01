---
tipo: personaje
id: marciano
archivos: [tests/marciano-kit.test.cjs, tests/gameplay.test.cjs, package.json]
verificado: 2026-10-31
---
# Marciano · tests

`tests/marciano-kit.test.cjs` está registrado en **`pretest`** de `package.json` (junto con otros seis), no en `test`. Corre con `npm test` porque npm ejecuta `pretest` antes; si lanzas `node --test` a mano o usas solo el script `test`, no se ejecuta.

## Propio (5 pruebas, `:6-14`)
- `:6` contrato 9/9 y tres técnicas con progresión independiente.
- `:8` pasiva: acta cada diez descargas y escolta exacta de 10 %.
- `:10` Q y R cargan aparte, no inmoviliza y limita a treinta impactos.
- `:12` Manhattan: solo transforma minions, contrapone daño y restaura estadísticas.
- `:14` cooperativo: input cambia arsenal, activa R y serializa el dominio.

## Que lo cubren de paso (en el script `test`)
- `tests/gameplay.test.cjs:13-16,267-268`: nombre, categoría, rareza, versión de piel `2021`, perfil y evolución, exclusión del atlas.
- `tests/evolutions.test.cjs:4`, `tests/progressive-combat.test.cjs:29` (arte propio de técnicas, Q y R), `tests/build.test.cjs:60,121` (cartas empaquetadas), `tests/lab-equipment.test.cjs:12`, `tests/lobby.test.cjs:3`.
