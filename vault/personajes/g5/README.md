---
tipo: personaje
id: g5
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# La G5

Luchadora avatar, cuerpo a cuerpo. Kit **2/9** (incompleto). Ver [[personajes/g5/ataques]], [[personajes/g5/poderes]], [[personajes/g5/assets]], [[personajes/g5/tests]], [[personajes/g5/gotchas]].

## Identidad
- Nombre `La G5`, categoría `Luchadora · avatar`, `look:'cap'`, color `#8bc6ed` (`src/data/powers.js:77`).
- Posición 16 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`).
- Rol `vanguard` + secundario `skirmisher`, especie `human`, alcance `melee`, daño `physical`, tags `mobility`, `burst`, `area`, dificultad `intermediate` (`src/data/powers.js:29`).
- Texto de rol: «Luchadora móvil».

## Estadísticas efectivas
| hp | speed | power | cadencia |
|---|---|---|---|
| 135 | 195 | 36 | 0,68 s |
- Alta original 145 / 210 / 42 en `powers.js:77`; **sobrescrita** por el parche de balance `powers.js:82` (`g5:{hp:135,speed:195,power:36}`).
- Cadencia 0,62 en `powers.js:69`, sobrescrita a 0,68 en `powers.js:103`.
- `character-balance.js` solo guarda overrides de admin en ejecución (`character-balance.js:3`).

## Colección, atributo y canal
- Rareza: `R · Raro` (`src/systems/gacha.js:4`; crecimiento ×1,03 en `gacha.js:5`).
- Atributo `Fuerza`, canal `physical`; DEF física 105, DEF especial 90; ATQ físico 100, ATQ especial 85 (`src/data/attributes.js:5`, `:7`).
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 2/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`).
- Implementado: ataque 1 (`g5Kick`) y evolución «Huracán G5» (`src/systems/evolutions.js:24`).
- Faltan: ataque 2, ataque 3, evolución 2, evolución 3, pasiva, Q, R.
- Sin pasiva ni cartas de ulti/dominio.

## Archivos que lo implementan
`grep -rln "'g5'" src`: `src/data/powers.js`, `src/systems/gacha.js`, `src/rendering/walk-art.js`, `src/rendering/companion-art.js`, `src/rendering/dragon-epic.js`. Además `src/systems/evolutions.js:24` y `src/data/attributes.js:5`.
