---
tipo: indice
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/gacha.js, src/data/character-contract.js]
verificado: 2026-10-31
---
# Personajes jugables (21)

El roster se arma en tres pasos:
1. `src/data/catalog.js:3-11` define 8 personajes; `catalog.js:32` saca a `zein` con
   `shift()` y lo convierte en el jefe final `P.Data.boss` (ElZeein **no** es jugable).
2. `src/data/catalog.js:33` añade 7 streamers.
3. `src/data/powers.js:74-109` añade sustento, cevichero, g5, makanaky, sideral, chamelin
   y marciano. `src/data/powers.js:72-73` cambia ataque y atlas de 5 streamers.

El **índice** importa: salas y repeticiones usan posiciones, no ids
([[gotchas/G013-indices-roster]]). Un personaje nuevo va **al final**
(`src/data/powers.js:108`).

Rareza: `src/systems/gacha.js:4` (`common`=C, `rare`=R, `epic`=SR, `legendary`=SSR,
`ultra`=UR). Kit «9/9» = 3 ataques + 3 evoluciones + pasiva + Q + R, medido con
`P.CharacterContract.describe` (`src/data/character-contract.js`) el 2026-10-31.
Nombres mostrados: `src/systems/character-skins.js:21` les añade la versión
([[gotchas/G025-skins-renombran]]).

| # | id | Nombre | Rareza | Kit |
|---|---|---|---|---|
| 0 | [[personajes/cristorata/README\|cristorata]] | Cristorata | C | 9/9 |
| 1 | [[personajes/cuy/README\|cuy]] | Cuy Supremo | C | incompleto (ataque, evolución, Q) |
| 2 | [[personajes/paloma/README\|paloma]] | Paloma del Centro | C | incompleto (ataque, evolución, Q) |
| 3 | [[personajes/alan/README\|alan]] | Alan García | SR | incompleto (ataque, evolución) |
| 4 | [[personajes/alberto/README\|alberto]] | Alberto Fujimori | SSR | incompleto (ataque, evolución, Q) |
| 5 | [[personajes/keiko/README\|keiko]] | Keiko Fujimori | SSR | incompleto (ataque, evolución) |
| 6 | [[personajes/ollanta/README\|ollanta]] | Ollanta Humala | SR | incompleto (ataque, evolución) |
| 7 | [[personajes/kingteka/README\|kingteka]] | Kingteka | UR | 9/9 |
| 8 | [[personajes/shaka/README\|shaka]] | Shakadoto | SR | incompleto (ataque, evolución) |
| 9 | [[personajes/najasor/README\|najasor]] | Najasor | R | incompleto (ataque, evolución) |
| 10 | [[personajes/cirilo/README\|cirilo]] | CiriloTV | UR | 9/9 |
| 11 | [[personajes/fuzo/README\|fuzo]] | Fuzo | R | incompleto (ataque, evolución) |
| 12 | [[personajes/charles/README\|charles]] | Charles | R | incompleto (ataque, evolución) |
| 13 | [[personajes/axelbenba/README\|axelbenba]] | Axel Benba | C | incompleto (ataque, evolución) |
| 14 | [[personajes/sustento/README\|sustento]] | Sustento | R | incompleto (ataque, evolución) |
| 15 | [[personajes/cevichero/README\|cevichero]] | Cevichero | C | incompleto (ataque, evolución) |
| 16 | [[personajes/g5/README\|g5]] | La G5 | R | incompleto (ataque, evolución) |
| 17 | [[personajes/makanaky/README\|makanaky]] | Makanaky · La Realeza | UR | 9/9 |
| 18 | [[personajes/sideral/README\|sideral]] | Sideral · Espantaminions | UR | 9/9 |
| 19 | [[personajes/chamelin/README\|chamelin]] | Chamelín Trovo | UR | 9/9 |
| 20 | [[personajes/marciano/README\|marciano]] | Marciano de SJL · El Polvito | UR | 9/9 |

Desbloqueados de inicio: el cliente lista cristorata, cuy, paloma, makanaky y sideral
(`src/systems/meta-progress.js:21`); el servidor solo cristorata, cuy, paloma y makanaky
(`backend/accounts.cjs:78`). Falta sideral en el servidor (sin verificar si es intencional).

## Cada carpeta
`README` (identidad, estadísticas, kit, archivos) · `ataques` · `poderes` · `assets` ·
`tests` · `gotchas` (si aplica).

## Al añadir o cambiar un personaje
- Busca todas las listas de ids: [[gotchas/G004-listas-ids-personajes]].
- Revisa sobrescrituras posteriores: [[gotchas/G012-object-assign-sobrescribe]].
- Actualiza [[poderes/README]] si cambia una pasiva, Q o R.
