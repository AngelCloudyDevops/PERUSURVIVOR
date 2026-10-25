// Compatibilidad con el comando histórico; las pruebas viven en tests/.
require('./scripts/build.cjs').build();
const {spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,['--test','tests/build.test.cjs','tests/gameplay.test.cjs','tests/server.test.cjs'],{cwd:__dirname,stdio:'inherit'});process.exit(result.status??1);
