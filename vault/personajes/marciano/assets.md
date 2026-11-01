---
tipo: personaje
id: marciano
archivos: [public/assets/walks, public/assets/aim, public/assets/characters/marciano-police-escort-v1.webp, public/assets/cards, src/rendering/walk-art.js, src/rendering/marciano-kit-art.js, src/ui/screens.js]
verificado: 2026-10-31
---
# Marciano · assets

No tiene atlas ni `spriteRow` (`src/data/powers.js:109`): se dibuja solo con `P.WalkArt` (`src/rendering/sprites.js:14`). `tests/gameplay.test.cjs:267-268` lo excluye de la comprobación de dibujo por atlas.

| Archivo | Qué es | Cargado por |
|---|---|---|
| `public/assets/walks/marciano-walk-v2.webp` | Marcha | `P.WalkArt.url`, personaje autorado (`src/rendering/walk-art.js:32`) |
| `public/assets/aim/marciano-aim-v1.webp` | Ataque direccional | `attack-marciano`; está en `directionalIds` (`walk-art.js:16`) |
| `public/assets/characters/marciano-police-escort-v1.webp` | Cuadrícula 6×2: escolta y policías del dominio | `src/rendering/marciano-kit-art.js:3-6` |
| `public/assets/cards/marciano-character-fullart-v1.webp` | Carta de personaje | `src/ui/reference-menus.js:36` |
| `public/assets/cards/marciano-{cosmic-dust,confiscated-box,police-spotlight}-fullart-v1.webp` | Cartas de técnica | `src/ui/screens.js:44` |
| `public/assets/cards/marciano-{phosphorescent-cloud,station-transfer,curfew}-fullart-v1.webp` | Cartas de evolución | `src/ui/screens.js:44` |
| `public/assets/cards/marciano-intervenidos-ultimate-fullart-v1.webp` | Carta de Q | `src/systems/marciano-kit.js:57` |
| `public/assets/cards/marciano-manhattan-domain-fullart-v1.webp` | Carta de R | `src/systems/marciano-kit.js:58` |
- Existen también `marciano-walk-v1.*` y `marciano-attack-v1.*`; `walk-art.js:32` no los pide para un personaje direccional y autorado (sin verificar otros usos).
- El aro del dominio y el letrero «EXPANSIÓN DE DOMINIO» se dibujan por código (`marciano-kit-art.js:7-8`, enganchado en `P.World.render`). El radio también figura en la lista de aros de `src/rendering/world.js:9`.
- `tests/build.test.cjs:121` exige que las ocho cartas de técnica, evolución, Q y R lleguen a `dist` en copias compactas; `tests/progressive-combat.test.cjs:29` comprueba el mapeo carta ↔ técnica.
- Los `.png` maestros y `.prompt.txt` no se cargan.
