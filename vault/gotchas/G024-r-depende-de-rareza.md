---
tipo: gotcha
id: G024
archivos: [src/systems/kingteka-domain.js, src/systems/cirilo-ur.js, src/systems/gacha.js]
verificado: 2026-10-31
---
# G024 · Algunas R dependen de la rareza de gacha

- **Síntoma:** al cambiar la rareza de Kingteka o CiriloTV desaparece su R sin error.
- **Causa:** `P.KingtekaDomain.eligible` (`src/systems/kingteka-domain.js:6`) y `P.CiriloUR.eligible` (`src/systems/cirilo-ur.js:3`) exigen `P.Gacha.tier(id)==='ultra'`. Las rarezas viven en `src/systems/gacha.js:4`.
- **Cómo evitarla:** no cambies la rareza de un personaje sin revisar sus `eligible`.
- **Cómo detectarla:** `grep -rn "tier(" src/systems`.
- Más: [[sistemas/gacha-meta/README]], [[sistemas/dominios/README]].
