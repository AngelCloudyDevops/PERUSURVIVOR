---
tipo: personaje
id: sideral
archivos: [public/assets/characters, public/assets/cards, src/rendering/sideral-art.js, src/rendering/sideral-lagarto.js, src/systems/sideral-domain.js, src/ui/screens.js]
verificado: 2026-11-01
---
# Sideral · assets

No usa atlas ni marchas de `P.WalkArt`: `walk-art.js:33-34` lo excluye de la precarga (`['sideral','chamelin']`), y `P.SideralArt` envuelve `P.Sprites.draw` y `P.PlayerAttackArt.draw` (`src/rendering/sideral-art.js:14-15`). Prueba: `tests/friends.test.cjs:24` (no pide atlas inexistentes).

| Archivo | Qué es | Cargado por |
|---|---|---|
| `public/assets/characters/sideral-ur-v1.webp` | Cuerpo, ataque y marcha | `src/rendering/sideral-art.js:5` |
| `public/assets/characters/sideral-lagarto-motion-v2.webp` | Maestro histórico de la forma Lagarto; no se distribuye | `scripts/build.cjs` |
| `public/assets/characters/sideral-tail-attack-v2.webp` | Colazo humano unido al cuerpo (seis poses) | `src/rendering/sideral-lagarto.js` |
| `public/assets/characters/sideral-transform-motion-v2.webp` | Transformación humana → Lagarto (ocho etapas) | `src/rendering/sideral-lagarto.js` |
| `public/assets/characters/sideral-breath-motion-v2.webp` | Aliento Lagarto con apoyos y recuperación (ocho poses) | `src/rendering/sideral-lagarto.js` |
| `public/assets/characters/sideral-domain-v3.png` | Figura del dominio | `src/systems/sideral-domain.js:8` |
| `public/assets/characters/sideral-domain-room-v1.jpg` | Habitación del dominio | `src/systems/sideral-domain.js:8` |
| `public/assets/cards/sideral-character-fullart-v1.webp` | Carta de personaje | `src/ui/reference-menus.js:36` |
| `public/assets/cards/sideral-{fear,tail,egg}-fullart-v1.webp` | Cartas de técnica | `src/ui/screens.js:44` |
| `public/assets/cards/sideral-{forbidden-face,ancestral-tail,forbidden-nest}-fullart-v1.webp` | Cartas de evolución | `src/ui/screens.js:44` |
| `public/assets/cards/sideral-lagarto-ultimate-fullart-v1.webp` | Carta de Q | `src/systems/sideral-kit.js:83` |
| `public/assets/cards/sideral-domain-fullart-v1.webp` | Carta de R | `src/systems/ability-cards.js:21` |
- Sin referencia directa en `src/` (sin verificar uso externo): `sideral-ur-v1.json`, `sideral-attack-v1.webp`, `sideral-domain-v1.png`, `sideral-domain-v2.png`.
- Los `.prompt.txt` y `.png` maestros de las cartas son fuentes; el paquete público debe llevar solo los `.webp` (`tests/build.test.cjs:120`).
- El cliente cooperativo espera `P.SideralArt` listo antes de entrar (`src/network/cooperative.js:13`).
