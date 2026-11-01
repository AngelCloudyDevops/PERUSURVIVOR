---
tipo: personaje
id: paloma
archivos: [src/data/catalog.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Paloma · ataques
Solo existe un ataque (slots 2 y 3 `reserved`, `src/data/powers.js:51`).

## 1. Ráfaga de la plaza (`feathers`)
- `kind spread`, `range 650`, `cooldown 0.8` (`src/data/catalog.js:17`). Sin `powerScale`: 17 de daño por pluma.
- **5 plumas** por abanico: el 5 está escrito a mano por id (`p.attack==='feathers'?5`, `src/systems/combat.js:22`; copia en `src/data/powers.js:55` `base()`).
- Separación 0,18 rad entre plumas, velocidad 470, 1 objetivo por pluma (`combat.js:22`, `remaining=(a.pierce||1)+primaryPierce`).
- Vida de la pluma = `range·reach / speed` (`combat.js:22`), sin retorno.

## Evolución «Corona de plumas» (`evolutions.js:9`)
- Perfil: `count 12`, `radial:true`, `pierce 2` (+2 de `primaryPierce` = 4 rivales; el texto dice «cuatro», fijado en `tests/evolutions.test.cjs`), sin `damageScale` ni extra. Las 12 plumas salen en círculo desde la orientación del tiro (`combat.js:22`, `a.radial`).
- `count` del perfil sustituye al 5 de `feathers`; los proyectiles extra de rangos posteriores se suman al evolucionar (`progression.js:78`).
- Daño por pluma 17 (×1,6 de poder al evolucionar, `progression.js:78`).

## Progresión del ataque principal
- Rangos 1→5: +18 % daño, +8 % alcance, intervalo ×0,94; **+1 pluma** en los rangos 3 y 5 (`progression.js:78`).
- Evolución: rango 5 y nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce=2` (`progression.js:62,78`).

Volver a [[personajes/paloma/README]] · [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
