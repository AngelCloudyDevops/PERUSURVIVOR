const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

test('La temporada global decide el mapa real en solitario y cooperativo', () => {
  const source = fs.readFileSync(path.join(root, 'src/ui/lobby-complete.js'), 'utf8');
  const cooperative = fs.readFileSync(path.join(root, 'src/network/cooperative.js'), 'utf8');
  const randomMath = Object.create(Math);
  const P = {
    Maps: {
      seasonMap: 'navidad',
      catalog: [{ id: 'campo' }, { id: 'plaza' }, { id: 'navidad' }, { id: 'halloween' }],
    },
  };
  randomMath.random = () => 0;

  vm.runInNewContext(source, {
    P,
    Math: randomMath,
    localStorage: { getItem() { return null; }, setItem() {} },
  });

  assert.equal(P.LobbyComplete.publicMap(), 'navidad');
  P.Maps.seasonMap = 'halloween';
  assert.equal(P.LobbyComplete.publicMap(), 'halloween');
  P.Maps.seasonMap = 'none';
  assert.equal(P.LobbyComplete.publicMap(), 'campo');
  assert.match(source, /const map=this\.publicMap\(\)/);
  assert.match(cooperative, /P\.LobbyComplete\.publicMap\(\)/);
  assert.match(cooperative, /seasonMap==='none'/);
});
