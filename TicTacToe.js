"use strict";

const spielFeldKlasse = "spielfeld";
const spielAnzeigeKlasse = "spielanzeige";
const feldKlasse = "feld";
const spielerKlasse = "spieler";
const gegnerKlasse = "gegner";

const overlayKlasse = "overlay";
const overlayTextKlasse = "overlayText";
const overlayButtonKlasse = "overlayButton";
const sichtbarKlasse = "sichtbar";

const spielfeld = document.querySelector("." + spielFeldKlasse);
const spielanzeige = document.querySelector("." + spielAnzeigeKlasse); 

const overlay = document.querySelector("." + overlayKlasse)
const overlayText = document.querySelector("." + overlayTextKlasse)
const overlayButton = document.querySelector("." + overlayButtonKlasse)

const felder = document.querySelectorAll("." + feldKlasse)

//voraussetzungen fuer Sieg festlegen
const siegKombinationen = [
    [felder[0], felder[1], felder[2]],
    [felder[3], felder[4], felder[5]],
    [felder[6], felder[7], felder[8]],
    [felder[0], felder[3], felder[6]],
    [felder[1], felder[4], felder[7]],
    [felder[2], felder[5], felder[8]],
    [felder[0], felder[4], felder[8]],
    [felder[2], felder[4], felder[6]]
];

overlayButton.addEventListener("click", spielStarten)

let aktuelleKlasse;

spielStarten();


function spielStarten() {
    //Das Overlay wieder verstecken, falls es sichtbar ist
    overlay.classList.remove(sichtbarKlasse);
    // Klasse dces letzten Spielers vom Overlaytext entfernen
    overlayText.classList.remove(spielerKlasse, gegnerKlasse);
    // die aktuelleKlasse leeren, um zufallsPrinzip zu ermoeglichen
    aktuelleKlasse = null;
    // Liste der felder durchgehen
    for (const feld of felder) {

        //Spielsteine der vorherigen runde entfernen
        feld.classList.remove(spielerKlasse, gegnerKlasse);

        //deaktivierte Felder wieder aktivieren
        feld.disabled = false;

        // jedem Feld ein Ereignis zuweisen das beim Klick sarauf ausgeloest wird
        feld.addEventListener("click", klickVerarbeiten);
    }

    //Festlegen wer beginnt
    zugBeenden();
}
function klickVerarbeiten(ereignis) {
    // verhindern, dass waehrend computerzug geklickt wird
    if (aktuelleKlasse === gegnerKlasse) {
        return;
    }
    // ermitteln, welches Feld geklickt wurde
    const feld = ereignis.target;
    //auf dieses Feld setzen
    if (spielsteinSetzen(feld) === true) {
        //beendet Zug nach erfolgreichem setzen
        zugBeenden();
    }
}

function spielsteinSetzen(feld) {
    // prueft ob Feld frei ist 
    if (
        feld.classList.contains(spielerKlasse) ||
        feld.classList.contains(gegnerKlasse)
    ) {
        // Verhindert setzen
        return false;
    }

    // dem Feld die Klasse des Spielers zuweisen, der am Zug ist
    feld.classList.add(aktuelleKlasse);
    // nach setzen, Feld deaktivieren
    feld.disabled = true;
    //Signal, dass der zug beendet wurde
    return true;
}
function zugBeenden() {
    // Pruefen ob der Spieler der am Zug ist gewonnen hat
   
    if (siegPruefen() === true) {
        // ist das der Fall ist das Spiel beendet
         spielBeenden(false);
         return;
    } 

    //Pruefen ob unentscheiden entstanden ist 
    if(unentschiedenPruefen() === true) {
        spielBeenden(true);
        return;
    }



    // Pruefen ob der Spieler der am Zug ist gewonnen hat 
    if (aktuelleKlasse === spielerKlasse) {
         // Spieler beendet seinen Zug -> wechsel zum Gegner
        aktuelleKlasse = gegnerKlasse;
    } else if (aktuelleKlasse === gegnerKlasse) {
        //Gegner beentet seinen Zug -> wechsel zum Spieler
        aktuelleKlasse = spielerKlasse;
    } else {
        // Es ist noch niemand am Zug -> auswuerfeln wer beginnt
        aktuelleKlasse = Math.random() < 0.5 ? spielerKlasse : gegnerKlasse;
    } 
    spielanzeigeAktualisieren();
    // ist dr Gegner an der reihe -> computerzug
    if (aktuelleKlasse === gegnerKlasse) {
        setTimeout(computerzugAusfuehren, 500);
    }
}



function siegPruefen() {
    //gehe alle Siegeskombinationen durch
    for (const kombination of siegKombinationen) {
    //pruefe ob alle 3 felder der gleichen Klasse angehoeren
        const gewonnen = kombination.every(function (feld) {
            return feld.classList.contains(aktuelleKlasse);
    });

        if (gewonnen === true) {
            return true;
        }
    }

    return false;
}
    
function spielBeenden(unentschieden) {
    //Text fuer Overlay festlegen
    if(unentschieden === true){
        overlayText.innertext = "Unentschieden!";
    } else if (aktuelleKlasse === spielerKlasse) {
    overlayText.innerText = "Du hast gewonnen!";
    overlayText.classList.add(spielerKlasse);
    } else {
    overlayText.innerText = "Du hast Verloren!";
    overlayText.classList.add(gegnerKlasse);
    }
    //das Overlay sichtbar machen
    overlay.classList.add(sichtbarKlasse);
}

function spielanzeigeAktualisieren() {
    //veraltete spieleranzeige entfernen 
    spielanzeige.classList.remove(spielerKlasse, gegnerKlasse);

    //Spielanzeige auf aktuellen spieler anpassen
    if (aktuelleKlasse === spielerKlasse) {
        spielanzeige.innerText = "Du bist am Zug.";
    } else {
        spielanzeige.innerText = "Der Gegner ist am Zug.";
    }
    spielanzeige.classList.add(aktuelleKlasse);
}
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

function computerzugAusfuehren() {
 // per Zufall ein Feld aussuchen
    const zufallsIndex = Math.floor(Math.random() * 9);
 // Spielstein dorthin setzen
    if (spielsteinSetzen(felder[zufallsIndex]) === true) {
        zugBeenden();
    } else {
        computerzugAusfuehren();
    }
}
