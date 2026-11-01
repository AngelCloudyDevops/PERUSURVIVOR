---
tipo: personaje
id: cristorata
archivos: [src/systems/cristorata-kit.js, src/systems/dragon-ultimate.js, src/systems/causa-combo.js, backend/simulation.cjs, src/network/cooperative.js]
verificado: 2026-10-31
---
# Cristorata · pasiva, Q y R

## Pasiva «De ida y de vuelta»
- Definición: `src/systems/cristorata-kit.js:40`. Estado `p.cristorataPassive {stacks, lastVolley}` (`:24`).
- Carga: un impacto de ida y otro de regreso del micrófono al **mismo rival** = +1 carga, máx. una por lanzamiento (`:25`). Se engancha en `Entities.hurt` con `source.glyph==='MIC'` (`:50`).
- Con 3 cargas, el siguiente ataque personal válido las gasta: +20 % daño, +15 % alcance (`:10,48`).
- Sin curación ni invulnerabilidad. Morir pone las cargas a 0 (`:35`). HUD `#passive-hud` (`:36`).

## Q · Invocación de dragón (`P.DragonUltimate`)
- Carta: `src/systems/ability-cards.js:16`. Tecla Q.
- **Carga**: no es por bajas. Usa las tres cartas del Combo del Causa; `CausaCombo.enabled` incluye a `cristorata` (`dragon-ultimate.js:35`). Cada carta sube solo con enemigos en pantalla: Caos 100/60 s, Aguante 100/55 s, Hazaña 100/60 s más 0,35 o 0,6 por segundo bajo presión (`src/systems/causa-combo.js:13`). Listo con las tres en 100 (`:10`). Test: 55–60 s (`tests/causa-combo.test.cjs:5`).
- **Activación** (`dragon-ultimate.js:23`): exige carga 100, sin `court` ni `domain`; consume las cartas. Duración total = intro + 8 s (`:3`). Intro cinematográfica 1,3 s + 4,2 s (6,4 s si es el secreto); modo dinámico 3,4 s (3,9 s secreto) (`:3,8`).
- **Variantes**: Jade (veneno), Brasa (llama), Trueno (rayo), Tricéfalo secreto con 5 % (`:3-4,9`).
- **Daño** especial cada 0,25 s a rivales a ≤230 u en un cono (`dot>0.78`) (`:24,26-27`). Veneno 0,18·poder + DoT 0,22 cada 0,5 s durante 1,5 s; llama 0,35 con foco hasta ×2; rayo 0,4 con 3 saltos (140 u, ×0,65) (`:27`). El secreto limita el golpe a jefes al 1 % de su vida máx. (`:27`).
- Montado: velocidad ×1,6; entrada protegida (`:16,30`). Cancela derrape y estelas (`cristorata-kit.js:55`).

## R · El Coliseo del Dragón
- Carta `cristorata-kit.js:41`. Tecla R. Carga propia `ultimate.cristorataDomainCharge` (0–100), separada de Q.
- Carga por baja vía `Ultimate.gain`: normal +4, pesado +8, minijefe +20, jefe +30; no carga con la Q activa ni con daño de Q (`:32,51`).
- Activar (`:33`): carga 100, sin otro dominio ni Q activa; crea 3 sellos a 170 u del jugador (separados ≥80 u, sobre suelo libre) o no se gasta nada. Dura 8 s, radio 360 u.
- Cada sello, al **entrar** a ≤34 u y tras 1,5 s de reposo, dispara a un objetivo a ≤500 u: especial, 1,3×poder, 2 impactos (`:34`).
- Termina si el dueño muere, sale del radio+40 o cambia la escena (`:34`). Estado global único `P.state.cristorataDomain`.
- Bloquea Q y otros dominios, y viceversa (`:54-57`).

## Cooperativo
- Se simula en el VM del servidor. `input.domain` → `CristorataKit.activateDomain`; `input.ultimate` → `P.Ultimate.activate` (más `dragonSpin`) (`backend/simulation.cjs:41`).
- Estado por jugador en `p.ultimate` (carga, `cristorataDomainCharge`, `dragon`); `P.state.cristorataDomain` es compartido y se limpia al terminar (`simulation.cjs:22,31,60`).
- Cliente: `requestDomain` usa la carga propia (`src/network/cooperative.js:17`); `activate` de Q envía la presentación elegida (`cooperative.js:6`).
- Tests: `tests/cristorata-kit.test.cjs:16-17,19`, `tests/dragon-ultimate.test.cjs:8`.

## Movimiento reducido
- Solo afecta al dibujo; el daño y los tiempos no cambian. `P.Motion.reduced()` en `src/rendering/ambient.js:3`.
- Dragón: `src/rendering/dragon-art.js` y `dragon-epic.js` leen `reduced` (tests `dragon-ultimate.test.cjs:15,50`). Evoluciones: `P.Ambient.reduced` (`evolutions.js:38`). Derrape sin inclinación (`src/rendering/cristorata-kit-art.js:10`).
- La presentación cinemática o dinámica del dragón es otra opción (`localStorage perusurvivor-option-domain-dynamic`, `dragon-ultimate.js:7`).

Ver [[sistemas/movimiento-reducido/README]] · [[personajes/cristorata/README]].
