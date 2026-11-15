'use strict';
// Cadenas de fuente para ctx.font: el canvas usa las mismas letras que la interfaz (Luckiest Guy y Nunito).
P.Font={
 title:px=>px+'px "Luckiest Guy", "Arial Black", sans-serif',
 text:(px,weight='800')=>weight+' '+px+'px Nunito, "Trebuchet MS", sans-serif'
};
