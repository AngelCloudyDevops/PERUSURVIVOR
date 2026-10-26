'use strict';
// Uso administrativo local al VPS. Nunca se expone como endpoint ni se distribuye en dist.
const {DatabaseSync}=require('node:sqlite');
const [filename,username,action]=process.argv.slice(2);
if(!filename||!username||!['grant','revoke'].includes(action))throw Error('Uso: node set-account-role.cjs DB USUARIO grant|revoke');
const db=new DatabaseSync(filename);db.exec('PRAGMA foreign_keys=ON');
const user=db.prepare('SELECT id,username FROM users WHERE username=?').get(username.toLowerCase());
if(!user)throw Error('El usuario debe registrarse primero. No se crea una cuenta ni se cambia su contraseña.');
if(action==='grant')db.prepare("INSERT INTO user_roles VALUES(?,'admin') ON CONFLICT(user_id) DO NOTHING").run(user.id);
else db.prepare('DELETE FROM user_roles WHERE user_id=?').run(user.id);
db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
console.log('Rol actualizado para '+user.username+'. Inicia sesión de nuevo.');db.close();
