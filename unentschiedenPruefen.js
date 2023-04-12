"use strict";
function unentschiedenPruefen() {
    //gehe alle Felder durch
    for (const feld of felder) {
        //pruefe ob Felder Frei sind
        if (!feld.classList.contains(spielerKlasse) &&
            !feld.classList.contains(gegnerKlasse)) {
            //kein nentschieden
            return false;
        }
    }
    //kein freies feld mehr -> unentscheiden!
    return true;
}
