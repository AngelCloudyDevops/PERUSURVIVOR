---
tipo: gotcha
id: G005
archivos: [src/data/attributes.js, src/systems/dota-equipment.js, src/systems/combat.js]
verificado: 2026-10-31
---
# G005 · `source.owner` casi nunca existe: el dueño va en `ownerId`/`ownerSlot`

- **Síntoma:** un efecto «al golpear» (robo de vida, objeto, pasiva) nunca se aplica, o
  en cooperativo se aplica al jugador equivocado.
- **Causa:** las fuentes de daño guardan `ownerId` (id del personaje) y `ownerSlot`
  (0/1 en cooperativo), no una referencia al jugador.
- **Dónde:** `P.Attributes.owner(source)` (`src/data/attributes.js:12`) busca en
  `P.Combat.party` (o `P.Court.players()`, o `[P.state.player]`) el jugador con
  `id===source.ownerId` y `slot===source.ownerSlot`. `P.DotaEquipment.owner`
  (`src/systems/dota-equipment.js:37`) lo reutiliza.
- **Cómo evitarla:** usa siempre `P.Attributes.owner(source)`. Comparar con
  `P.state.player` falla en cooperativo: ver [[gotchas/G010-player-reemplazado-snapshot]].
- **Cómo detectarla:** `grep -rn "source.owner\b" src` (hoy sin usos). Probar el efecto
  en cooperativo con los dos slots.
