---
tipo: gotcha
id: G003
archivos: [src/core/runtime.js, src/systems/marciano-kit.js]
verificado: 2026-10-31
---
# G003 · La tecla R (dominios) se despacha en varios sitios con listas distintas

- **Síntoma:** un dominio nuevo funciona con clic en el botón pero no con R, o con
  R mantenida pero no con R pulsada (o al revés).
- **Causa:** tres manejadores en `src/core/runtime.js` y uno más en un kit:
  - Clic en `#domain-ability` (`src/core/runtime.js:22`): Marciano, Cristorata,
    Cirilo UR, Kingteka, Chamelín, Makanaky (`P.Domain`), Sideral.
  - `keydown` R (`src/core/runtime.js:24`): arranca el temporizador de «vistazo»
    (mantener) y activa Chamelín, `P.Domain` y Sideral.
  - `keyup` R (`src/core/runtime.js:25`): pulsación corta; Cristorata, Cirilo UR,
    Kingteka, Chamelín, `P.Domain`, Sideral. **No incluye Marciano.**
  - Marciano tiene su propio `keyup` R en `src/systems/marciano-kit.js:66`.
- **Cómo evitarla:** al añadir un dominio, revisa los tres sitios de `runtime.js` y
  decide si va ahí o en un `addEventListener` propio del kit (como Marciano).
- **Cómo detectarla:** `grep -n "domain-ability\|=='r'" src/core/runtime.js` y
  `grep -rn "toLowerCase()==='r'" src`. Probar clic, R corta y R mantenida.
- Sistema: [[sistemas/dominios/README]].
