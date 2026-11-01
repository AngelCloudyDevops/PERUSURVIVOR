---
tipo: indice
archivos: [CLAUDE.md]
verificado: 2026-10-31
---
# Trampas conocidas

Una trampa por archivo: síntoma, causa, `archivo:línea`, cómo evitarla y cómo detectarla.
Trampa nueva → archivo `Gnnn-slug.md` con el siguiente número y una línea aquí.

1. [[gotchas/G001-src-data-ignorado]]: `data/` en `.gitignore` ignora `src/data/`; usar `git add -f`.
2. [[gotchas/G002-build-filtra-assets]]: `build.cjs` publica assets según strings de los renderers.
3. [[gotchas/G003-r-tres-sitios]]: la tecla R se despacha en 3 sitios de `runtime.js` + Marciano aparte.
4. [[gotchas/G004-listas-ids-personajes]]: listas de IDs de personajes copiadas en ~15 archivos.
5. [[gotchas/G005-source-owner]]: el dueño del daño es `ownerId`/`ownerSlot`, no `source.owner`.
6. [[gotchas/G006-tests-manuales]]: `npm test` lista tests a mano; 3 no corren nunca.
7. [[gotchas/G007-tests-cwd-dist]]: tests con rutas relativas al cwd o que necesitan `dist/`.
8. [[gotchas/G008-development-en-produccion]]: `src/development/` se publica en producción.
9. [[gotchas/G009-game-design-duplicado]]: `GAME_DESIGN.md` con secciones duplicadas y divergentes.
10. [[gotchas/G010-player-reemplazado-snapshot]]: en cooperativo `P.state.player` es un objeto nuevo en cada snapshot.
11. [[gotchas/G011-salas-por-ip]]: 2 salas por IP rompen la prueba en vivo de 3 mapas sin `COOP_FULL_RUN`.
12. [[gotchas/G012-object-assign-sobrescribe]]: archivos posteriores y el balance reescriben `P.Data`.
13. [[gotchas/G013-indices-roster]]: índices de personaje históricos y `shift()` de `zein`.
14. [[gotchas/G014-orden-envoltorios]]: el orden de carga decide qué envoltorio corre y cuál corta.
15. [[gotchas/G015-coop-active]]: mismo código en solitario, cliente coop y servidor.
16. [[gotchas/G016-vm-stubs-math]]: stubs del VM, `localStorage` devuelve `undefined`, `Math` compartido.
17. [[gotchas/G017-simulacion-sustituye-funciones]]: el VM reemplaza `Game.finish`, `Systems.levelup` y no usa `Game.update`.
18. [[gotchas/G018-check-solo-sintaxis]]: `npm run check` compila pero no ejecuta.
19. [[gotchas/G019-versiones-guardado]]: sobre de red versión 4 y progreso versión 5.
20. [[gotchas/G020-estado-nuevo-reset]]: claves de `P.state` que sobreviven entre partidas.
21. [[gotchas/G021-q-carga-causa-combo]]: La Q no se carga con `Ultimate.gain`.
22. [[gotchas/G022-kingteka-dos-escopetas]]: Kingteka tiene dos escopetas.
23. [[gotchas/G023-cirilo-catalogo-pisado]]: El catálogo de CiriloTV se sobrescribe.
24. [[gotchas/G024-r-depende-de-rareza]]: Algunas R dependen de la rareza de gacha.
25. [[gotchas/G025-skins-renombran]]: `character-skins.js` reescribe `c.name`.
26. [[gotchas/G026-portal-rapida-180]]: `Encounters.unlock` no abre el portal.
27. [[gotchas/G027-coop-caos-vs-tests-rapida]]: El servidor juega en Caos; los tests de `Simulation`, en rápida.
28. [[gotchas/G028-auditorias-roster-viejas]]: Tests que validan JSON de auditoría viejos.
29. [[gotchas/G029-mapevents-pausa-todo]]: Un evento de mapa activo pausa minijefes, zonas y barriles.
30. [[gotchas/G030-outgoing-multiplier]]: `outgoingMultiplier` de los jefes modifica el daño que reciben.
31. [[gotchas/G031-cache-scripts-simulacion]]: La simulación cachea scripts compilados por raíz.
32. [[gotchas/G032-dota-activos-doble]]: `hasActive`/`activate` de objetos Dota existen dos veces.
33. [[gotchas/G033-init-solo-con-dom]]: Varios `init` de red y UI solo corren con DOM.

Arquitectura relacionada: [[arquitectura/README]].
