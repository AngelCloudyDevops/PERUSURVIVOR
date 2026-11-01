---
tipo: personaje
id: cevichero
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# Cevichero

Disfraz parodia. Hostigador de enjambre con kit **2/9** (incompleto). Ver [[personajes/cevichero/ataques]], [[personajes/cevichero/poderes]], [[personajes/cevichero/assets]], [[personajes/cevichero/tests]].

## Identidad
- Nombre `Cevichero`, categoría `Disfraz · parodia`, `look:'headset'`, color `#6ea9f2` (`src/data/powers.js:76`).
- Posición 15 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`).
- Rol `skirmisher` + secundario `controller`, especie `human`, alcance `long`, daño `physical`, tags `mobility`, `area`, dificultad `intermediate` (`src/data/powers.js:28`).
- Texto de rol: «Hostigador de enjambre».

## Estadísticas efectivas
| hp | speed | power | cadencia |
|---|---|---|---|
| 115 | 190 | 24 | 0,62 s |
- hp/speed/power: `src/data/powers.js:76`; sin parches.
- `roachCast` recibe `powerScale 0,75` en `powers.js:92`, por lo que el daño por cucaracha es 24 × 0,75 = 18.
- `character-balance.js` solo guarda overrides de admin en ejecución (`character-balance.js:3`).

## Colección, atributo y canal
- Rareza: `C · Común` (`src/systems/gacha.js:4`, tier `common`; crecimiento ×1 en `gacha.js:5`).
- Atributo `Técnica`, canal `physical`; DEF física 100, DEF especial 95; ATQ físico 100, ATQ especial 85 (`src/data/attributes.js:5`, `:7`).
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 2/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`).
- Implementado: ataque 1 (`roachCast`) y evolución «Marea del enjambre» (`src/systems/evolutions.js:23`).
- Faltan: ataque 2, ataque 3, evolución 2, evolución 3, pasiva, Q, R.
- Sin pasiva ni cartas de ulti/dominio (`definition` devuelve `null`).

## Archivos que lo implementan
`grep -rln "'cevichero'" src`: `src/data/powers.js`, `src/systems/gacha.js`, `src/rendering/walk-art.js`, `src/rendering/companion-art.js`, `src/rendering/dragon-epic.js`. Además `src/systems/evolutions.js:23` y `src/data/attributes.js:5`.
