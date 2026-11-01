---
tipo: sistema
id: evoluciones
archivos: [src/systems/evolutions.js, src/systems/progression.js, tests/evolutions.test.cjs]
verificado: 2026-10-31
---
# Evoluciones

Al rango 5 del arma principal y nivel 8, el ataque se sustituye por un perfil evolucionado. Ver [[sistemas/progresion-cartas/README]] y [[sistemas/combate/README]].

## Qué hace
- `P.Evolutions.profiles[id]` (`src/systems/evolutions.js:4-25`): un perfil serializable por personaje (nombre, `kind`, `count`, `range`, `arc`, `shape`, `color`...). Claves: chamelin, makanaky, sideral, cristorata, cuy, paloma, alan, alberto, keiko, ollanta, kingteka, shaka, najasor, cirilo, fuzo, charles, axelbenba, cerdito, sustento, cevichero, g5, marciano.
- El ataque conserva el ID original (para el sprite); el perfil se fusiona: `{...base,...profile}` (`attack(p)`, `:28`).
- Condición: `p.evolved.primary` (se marca en `Progression.apply` al elegir `evolve:primary`, `src/systems/progression.js:76`).

## API pública
- `P.Evolutions.profile(p)` `:27`: kingteka y makanaky devuelven la evolución del arsenal activo (`KingtekaArsenal.evolution`, `MakanakyArsenal.evolution`).
- `P.Evolutions.attack(p)` `:28`: lo usa `P.Combat.cast` (`src/systems/combat.js:17`).
- `P.Evolutions.afterCast(p,a,target)` `:29`: efectos extra (cadena, remolino, zona de temblor...). Se llama solo con `mode==='play'`.
- `P.Evolutions.effect(ctx,e,t)` `:38`: dibujo; reduce movimiento con `P.Ambient.reduced` (ver [[sistemas/movimiento-reducido/README]]).
- `init/open/close/renderMenu` `:44-47`: panel de habilidades (`#skills-panel`), accesible con foco atrapado y Escape.

## Estado y reinicio
- `p.evolved` (primary, pulse, cards, orbit) y `p.<x>Arsenal.evolved[activa]`; los crea `Progression.init` y los kits (`sideralArsenal`, `ciriloArsenal`, `chamelinArsenal`, `cristorataArsenal`).
- Se pierde al reiniciar partida (jugador nuevo en `P.Game.start`).

## Envoltorios
- `P.Evolutions.attack/profile`: chamelin-kit:54-55, cirilo-kit:56-57, cirilo-ur:83, cristorata-kit:45-46, marciano-kit:71-72, sideral-kit:87-88.
- `P.Evolutions.afterCast`: chamelin-kit:56, cristorata-kit:47, marciano-kit:73.
- `P.Evolutions.renderMenu`: marciano-kit:87 (todo en `src/systems/`).

## Cooperativo
- Sin lógica propia; corre en la VM del servidor vía `Combat.cast`. `open()` se bloquea con `P.Coop.activityPending`/`reconnecting` (`:45`).

## Tests
- `tests/evolutions.test.cjs`, `skill-preview.test.cjs`, `progressive-combat.test.cjs`, `roster-balance.test.cjs` (en `package.json`).

## Qué no romper
- Añadir personaje: perfil en `profiles` con el mismo id del personaje, o `profile()` devuelve `undefined` y no evoluciona.
- No cambiar `attack` ID del perfil: lo usan sprites y muzzle.
- `makanaky` y `kingteka` leen el arsenal activo, no `profiles` directamente.
