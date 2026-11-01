---
tipo: evento
id: minibosses-campo
archivos: [src/systems/minibosses.js, tests/miniboss-phase.test.cjs]
verificado: 2026-10-31
---
# El Fiscalizador (`campo`)

Parte de [[eventos/minijefes/README]]. Definición: `src/systems/minibosses.js:6` (vida 460, radio 31, velocidad 68, físico, `statusResistance .15`). Mapas: `campo` y `halloween` (`miniboss:'campo'`).

## Ataques (`nextAttack :75`, ciclo `charge → cones → citations`)
- Embestida (`charge`): aviso 0,9 s, velocidad 360 (`warn :32`, `move :76`). Defensa frontal: ×0,5 de daño recibido si miras al frente de la carga (`hurt :88`). Un cono de cerco rompe la carga y le quita 3 % de vida (`move :76`).
- Cerco municipal (`cones`): 5 conos en abanico (2 filas en fase II) que bloquean unos 4-5 s (`fireBarrier :39`).
- Papeletas (`citations`): el dado `fineRoll 1..6` define la multa `fineRoll×2` (2-12 monedas); fija 3 zonas de radio 60, daño 10 (`warn :32`, `fireCitations :37`). Si te alcanza te cobra monedas (`dangerHit :74`).

## Pasiva: Recaudación coactiva
- Guarda hasta 24 monedas cobradas (`revenue`, `dangerHit :74`). El primer golpe de cada recuperación le arranca la mitad como botín (`hurt :88`).

## Fase II y Operativo de clausura
- Cada 4.º ataque: `shutdown` (aviso 1,35 s). Anillo de 12 proyectiles con 2 salidas opuestas (verde/celeste): olas de radio 260 (daño 12) y 170 (daño 14), 2,8 s, y embestida final (`fireShutdown :40`, `shutdownWave :41`, `shutdownTick :42`).
- Entrada de la fase: `beginFury :28` (aviso «FISCALIZACIÓN INTENSIVA»).

## Tests
`tests/miniboss-phase.test.cjs:44` (papeleta y cobro), `:52` (cerco y operativo), `:60`, `:64`.
