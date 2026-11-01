---
tipo: indice
archivos: [src/systems/ability-cards.js, src/systems/passives.js, src/data/character-contract.js]
verificado: 2026-10-31
---
# Índice de poderes

Pasiva, Q (ulti) y R (dominio) de cada personaje. Títulos medidos con
`P.CharacterProfiles.kitAudit` sobre `backend/simulation.cjs` el 2026-10-31.
Las cartas de Q y R viven en `P.AbilityCards.entries` (`src/systems/ability-cards.js:12-24`);
los kits añaden las suyas en su propio archivo. El detalle (carga, duración, cooperativo,
movimiento reducido) está en `personajes/<id>/poderes.md`.

Mecánica común: [[sistemas/pasivas/README]], [[sistemas/ulti/README]],
[[sistemas/dominios/README]]. La Q suele cargarse por `P.CausaCombo`, no por
`Ultimate.gain` ([[gotchas/G021-q-carga-causa-combo]]). La R se despacha en varios
sitios ([[gotchas/G003-r-tres-sitios]]). Algunas R exigen rareza UR
([[gotchas/G024-r-depende-de-rareza]]).

## Por personaje
| Personaje | Pasiva | Q (ulti) | R (dominio) |
|---|---|---|---|
| [[personajes/cristorata/poderes\|cristorata]] | De ida y de vuelta (`src/systems/cristorata-kit.js:36`) | Invocación de dragón (`src/systems/ability-cards.js:16`) | El Coliseo del Dragón (`src/systems/cristorata-kit.js:41`) |
| [[personajes/cuy/poderes\|cuy]] | — | Estampida Suprema (`src/systems/ability-cards.js:17`) | — |
| [[personajes/paloma/poderes\|paloma]] | — | Bandada del Centro (`src/systems/ability-cards.js:18`) | — |
| [[personajes/alberto/poderes\|alberto]] | — | Tribunal del Pueblo (`src/systems/ability-cards.js:15`) | — |
| [[personajes/kingteka/poderes\|kingteka]] | Instinto de expedición (`src/systems/passives.js:5`) | Gallinazos (`src/systems/ability-cards.js:13`) | Santuario del Reino Animal (`src/systems/ability-cards.js:14`) |
| [[personajes/cirilo/poderes\|cirilo]] | Persistencia maldita (`src/systems/cirilo-kit.js:47`) | ¡FULL MALDAD! (`src/systems/cirilo-kit.js:52`) | Audiencia del Demonio (`src/systems/ability-cards.js:22`) |
| [[personajes/makanaky/poderes\|makanaky]] | Racha de la Realeza (`src/systems/passives.js:6`) | Los Tres de la Realeza (`src/systems/ability-cards.js:19`) | La Realeza (`src/systems/ability-cards.js:20`) |
| [[personajes/sideral/poderes\|sideral]] | Sangre fría (`src/systems/sideral-kit.js:81`) | Despertar del Lagarto (`src/systems/sideral-kit.js:82`) | Vacío Sideral (`src/systems/ability-cards.js:21`) |
| [[personajes/chamelin/poderes\|chamelin]] | Presión acumulada (`src/systems/chamelin-kit.js:49`) | ¡SE TAPÓ TODO! (`src/systems/chamelin-kit.js:50`) | Baño de Trovo (`src/systems/ability-cards.js:23`) |
| [[personajes/marciano/poderes\|marciano]] | Expediente fosforescente (`src/systems/marciano-kit.js:56`) | Treinta intervenidos (`src/systems/marciano-kit.js:57`) | Disco-Bar Manhattan (`src/systems/marciano-kit.js:58`) |

Sin pasiva, Q ni R: alan, keiko, ollanta, shaka, najasor, fuzo, charles, axelbenba,
sustento, cevichero y g5. Su botón muestra «PRÓXIMAMENTE» (`src/systems/ultimate.js:26`).

## Otros poderes que no son de personaje
- Cartas de nivel y mejoras: [[sistemas/progresion-cartas/README]].
- Evoluciones de ataque: [[sistemas/evoluciones/README]].
- Objetos Dota con activo (Blink y 13 más, tecla E/F): [[sistemas/objetos-dota/README]].
- Reliquias de minijefe: [[eventos/minijefes/reliquias]].
- Ulti y dominio de los jefes (p. ej. el Gallinazo): [[eventos/README]].
