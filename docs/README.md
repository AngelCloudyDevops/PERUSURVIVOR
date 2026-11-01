# Documentación de PERUSURVIVOR

Índice de `docs/` para personas. Para agentes de IA, la base de conocimiento está en
`vault/` (empieza por `vault/00-MOC.md`).

**Ante una contradicción entre estos documentos y el código, manda el código** (`src/`,
`backend/`, `tests/`). Varios informes son históricos: lo indican con un aviso al inicio.

## Carpetas

| Carpeta | Qué contiene | Para quién |
|---|---|---|
| [`diseno/`](diseno/) | Reglas del juego y personajes: `GAME_DESIGN.md`, `CHARACTER_PROFILES.md`, kits completos (`CHAMELIN_KIT`, `CIRILO_KIT`, `CRISTORATA_KIT`, `SIDERAL_KIT`), `DOTA_ITEM_CATALOG.md`, `VISUAL_CONTRACT.md`, `KINGTEKA_PRACTICE.md` | Diseño, quien añade personajes o reglas |
| [`arquitectura/`](arquitectura/) | Cómo está hecho: `ARCHITECTURE.md`, `RELEASE_ARCHITECTURE.md`, `ACCOUNTS.md`, `ASSETS.md` | Programación |
| [`arquitectura/datos/`](arquitectura/datos/) | Evidencia técnica: `reorganization-baseline.json` (hashes de la reorganización), `coop-network-audit.json` (medición de red del cooperativo) | Programación |
| [`operacion/`](operacion/) | Publicar y colaborar: `DEPLOYMENT.md`, `MANUAL_DEL_PROPIETARIO.md`, `GUIA_PARA_COLABORADORES.md`, `CONTRIBUTING.md` | Propietario, colaboradores |
| [`balance/`](balance/) | Informes de balance y auditorías de combate (`*_BALANCE.md`, `*_AUDIT.md`, `WAVE_PRESSURE.md`, `CAUSA_COMBO.md`, `MINIBOSS_COMBAT_REVIEW.md`) | Diseño y balance |
| [`balance/datos/`](balance/datos/) | JSON de auditorías y mediciones que escriben `scripts/*-audit.cjs`, `scripts/*-measure.cjs` y `scripts/summarize-*.cjs`; varios los leen los tests | Balance (no editar a mano) |
| [`arte/`](arte/) | Briefs de arte: `*_ART.md`, `*_LANDMARKS.md`, `NATURE_ART.md`, `MACHU_STONE.md`, `PATH_FINISH.md`, `STREET_FURNITURE.md`, `TREES_PLANTERS.md`, `KINGTEKA_COMIC.md` | Arte |
| [`arte/prompts/`](arte/prompts/) | `*-prompts.json`: prompts con que se generaron los sprites | Arte |
| [`arte/auditorias/`](arte/auditorias/) | Auditorías de arte (`*-audit.json`: hashes, tamaños, celdas), más `asset-optimization.json` (lo escribe `scripts/optimize-assets.py`) y `music-assets.json` | Arte (no editar a mano) |
| [`manual/`](manual/) | `PERUSURVIVOR_Manual_Maestro_de_Creacion_v1.pdf` | Todos |

## Criterio de reparto

- Regla de juego o personaje → `diseno/`. Cómo funciona el código → `arquitectura/`.
- Informe que mide o compara partidas → `balance/`; su JSON → `balance/datos/`.
- Brief visual → `arte/`; su prompt → `arte/prompts/`; su auditoría → `arte/auditorias/`.
- Varios JSON los leen los tests o los reescriben los scripts: si mueves uno, actualiza su ruta en
  `scripts/` y `tests/` en el mismo cambio (`grep -rn "nombre.json" scripts tests`).
