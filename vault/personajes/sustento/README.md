---
tipo: personaje
id: sustento
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# Sustento

Streamer parodia. Tirador de cadencia con kit **2/9** (incompleto). Ver [[personajes/sustento/ataques]], [[personajes/sustento/poderes]], [[personajes/sustento/assets]], [[personajes/sustento/tests]].

## Identidad
- Nombre `Sustento`, categoría `Streamer · parodia`, `look:'headset'`, color `#a4c492` (`src/data/powers.js:75`).
- Posición 14 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`; no depende de código fijo).
- Rol `shooter`, sin secundario, especie `human`, alcance `long`, daño `physical`, tag `sustained`, dificultad `easy` (`src/data/powers.js:27`).
- Texto de rol: «Tirador de cadencia» (`P.CharacterProfiles.roles`, sin parches posteriores).

## Estadísticas efectivas
| hp | speed | power | cadencia |
|---|---|---|---|
| 105 | 190 | 12 | 0,22 s |
- hp/speed/power: `src/data/powers.js:75`. Sin parches posteriores (el parche de balance de `powers.js:82` solo toca cristorata, alberto y g5).
- Cadencia: definida 0,18 s en `powers.js:64` y **sobrescrita a 0,22 s** en `powers.js:91`.
- `src/systems/character-balance.js` no fija valores estáticos: solo guarda overrides de admin en tiempo de ejecución (`character-balance.js:3`, `apply`).

## Colección, atributo y canal
- Rareza: `R · Raro` (`src/systems/gacha.js:4`, tier `rare`).
- Atributo `Técnica`, canal de daño `physical`; DEF física 90, DEF especial 105; ATQ físico 100, ATQ especial 85 (`src/data/attributes.js:5` y `:7`).
- Crecimiento por rareza `rare`: ×1,03 (`gacha.js:5`); afecta bonos de estrellas y meta, no la base.
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 2/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`).
- Implementado: ataque 1 (`roachRifle`) y su evolución «Infestación veloz» (`src/systems/evolutions.js:22`).
- Faltan: ataque 2, ataque 3, evolución 2, evolución 3, pasiva, Q (ulti), R (dominio).
- Sin pasiva (`P.Passives.definition` devuelve `null`), sin carta de ulti ni de dominio (`P.AbilityCards.definition` devuelve `null`).
- La Q base de `P.Ultimate.activate` solo funciona con `kingteka` (`src/systems/ultimate.js:13`).

## Archivos que lo implementan
`grep -rln "'sustento'" src`:
- `src/data/powers.js`, `src/systems/gacha.js`
- `src/rendering/walk-art.js`, `src/rendering/companion-art.js`, `src/rendering/dragon-epic.js`
- Además `src/systems/evolutions.js:22` (clave sin comillas simples) y `src/data/attributes.js:5`.
