---
tipo: gotcha
id: makanaky
archivos: [src/systems/minibosses.js, src/systems/passives.js, src/systems/domain.js, src/systems/evolutions.js, backend/accounts.cjs]
verificado: 2026-10-31
---
# Makanaky · trampas

- **Mismo id, dos actores.** `makanaky` es jugable (`src/data/powers.js:96`) y minijefe (`src/systems/minibosses.js:5`). Todo código del jugable debe excluir `p.miniboss` (`passives.js:9`, `makanaky-ultimate.js:5`). El minijefe toma su tipo de `src/data/attributes.js:8` (`makanaky:0`), no de la ficha jugable.
- **Q no carga por bajas.** Para Makanaky `P.Ultimate.gain` solo suma a `domainCharge` (`src/systems/domain.js:60`). La Q se carga por golpes de Puño o Cabezazo y por daño recibido. Prueba: `tests/makanaky-kit.test.cjs:10`.
- **La pasiva exige `actor.attack==='royalEcho'` y `kind==='melee'`** (`passives.js:9`). Cambiar el ataque base o el tipo de una técnica desactiva la racha sin error.
- **Evolución duplicada.** `P.Evolutions.profiles.makanaky` (`evolutions.js:5`) solo es respaldo; la evolución real está en `makanaky-arsenal.js:10`. Editar la primera no cambia el juego.
- **Propiedad gratuita en tres sitios:** `src/systems/meta-progress.js:21`, `backend/accounts.cjs:78` y `tests/gacha.test.cjs:35`. Quitarla en uno la deja incoherente.
- **R no activa si el arte de intro no cargó**: `domain.js:16` llama a `P.DomainIntro.load()` y devuelve `false` en navegador.
- Ver [[gotchas/README]].
