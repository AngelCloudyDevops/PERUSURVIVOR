# Práctica pública de Kingteka

Destino: https://perusurvivor.michitech.tech. En el menú, «Probar ulti de Kingteka · Gallinazos y sonidos» inicia la práctica individual invencible con ocho objetivos resistentes y carga al 100 %. Q activa; «Recargar ulti» permite repetir; «Reponer objetivos» coloca blancos cerca y «Salir de práctica» vuelve al menú. Recargar durante el efecto conserva el remate DENUNCIADO y prepara la siguiente activación. No guarda récord ni progresa el reloj del mapa.

Implementación autocontenida: src/scenes/practice.js se carga después del arranque del juego y adapta sus puntos de entrada conservando los métodos normales. No modifica combate, sonidos, sprites ni cooperativo. Los controles son una función pública solicitada; los servidores locales de QA siguen sin distribuirse.
