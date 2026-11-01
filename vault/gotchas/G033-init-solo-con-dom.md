---
tipo: gotcha
id: G033
archivos: [src/network/account.js, src/network/live-gifts.js]
verificado: 2026-10-31
---
# G033 · Varios `init` de red y UI solo corren con DOM

- **Síntoma:** `P.Account`, regalos o bandeja no están inicializados en un test o en el VM del servidor.
- **Causa:** arrancan con `if(typeof Image!=='undefined')` (p. ej. `src/network/account.js:30`). El VM y los tests sin DOM no definen `Image`.
- **Cómo evitarla:** no dependas de esos `init` en lógica de gameplay; en tests, inicializa a mano lo que necesites.
- **Cómo detectarla:** `grep -rn "typeof Image" src`.
- Más: [[sistemas/cuentas/README]], [[gotchas/G016-vm-stubs-math]].
