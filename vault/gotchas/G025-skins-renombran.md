---
tipo: gotcha
id: G025
archivos: [src/systems/character-skins.js]
verificado: 2026-10-31
---
# G025 · `character-skins.js` reescribe `c.name`

- **Síntoma:** buscar un personaje por nombre falla, o aparece «Base · Versión».
- **Causa:** `P.CharacterSkins.init` (`src/systems/character-skins.js:21`) cambia `c.name` a `baseName + " · " + título` en los 11 personajes con versión (`characterId` en `src/systems/character-skins.js`: alan, alberto, chamelin, cuy, keiko, kingteka, makanaky, marciano, ollanta, paloma, sideral).
- **Cómo evitarla:** identifica personajes siempre por `id`, nunca por `name`.
- **Cómo detectarla:** `grep -rn ".name===" src`.
- Más: [[sistemas/gacha-meta/README]].
