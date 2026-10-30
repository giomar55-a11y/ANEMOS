"use strict";

/* =================================================
   ANEMOS 3.1
   ANEMOSCOPIO
   Guida visiva dinamica della respirazione
================================================= */
/* =================================================
   APERTURA E CHIUSURA
================================================= */

const anemoscopio =
    document.getElementById("anemoscopio");

const chiudiAnemoscopio =
    document.getElementById("chiudi-anemoscopio");

const anemoscopioDisplay =
    document.getElementById("anemoscopio-display");

/* =================================================
   DISPLAY
================================================= */
const COLORI_SETTORI_ANEMOSCOPIO = {
    "Addome": "#2457D6",
    "Torace inferiore": "#9B51E0",
    "Torace superiore": "#35C6E8"
};
function creaBandaSettoreAnemoscopio(
    nomeSettore,
    x,
    larghezza,
    y,
    altezza
) {

    const colore =
        COLORI_SETTORI_ANEMOSCOPIO[
            nomeSettore
        ];

    if (!colore) {
        return null;
    }

    const banda =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

    banda.setAttribute("x", x);
    banda.setAttribute("y", y);

    banda.setAttribute(
        "width",
        larghezza
    );

    banda.setAttribute(
        "height",
        altezza
    );

    banda.setAttribute(
        "fill",
        colore
    );

    banda.setAttribute(
        "fill-opacity",
        "0.16"
    );

    banda.classList.add(
        "anemoscopio-banda-settore"
    );

    return banda;
}
function preparaDisplayAnemoscopio() {

    if (!anemoscopioDisplay) {
        return;
    }

    anemoscopioDisplay.innerHTML = "";

    const scalaVolume =
        document.createElement(
            "div"
        );

    scalaVolume.className =
        "anemoscopio-scala-volume";


    const volumi = [
    {
        nome: "PIENO",
        simbolo: "●"
    },
    {
        nome: "ABBONDANTE",
        simbolo: "◕"
    },
    {
        nome: "CONFORTEVOLE",
        simbolo: "☯"
    },
    {
        nome: "SCARSO",
        simbolo: "◔"
    },
    {
        nome: "VUOTO",
        simbolo: "○"
    }
];

    volumi.forEach(
        function (volume) {

            const livello =
                document.createElement(
                    "div"
                );

            livello.className =
                "anemoscopio-livello-volume";

            livello.dataset.volume =
    volume.nome;

const simbolo =
    document.createElement(
        "span"
    );

simbolo.className =
    "anemoscopio-simbolo-volume";

simbolo.textContent =
    volume.simbolo;

livello.appendChild(
    simbolo
);

scalaVolume.appendChild(
    livello
);
        }
    );


    anemoscopioDisplay.appendChild(
        scalaVolume
    );
const campoTraiettoria =
    document.createElement(
        "div"
    );

campoTraiettoria.className =
    "anemoscopio-campo-traiettoria";
const pianoTraiettoria =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

pianoTraiettoria.classList.add(
    "anemoscopio-piano-traiettoria"
);

pianoTraiettoria.setAttribute(
    "viewBox",
    "0 0 1000 500"
);

pianoTraiettoria.setAttribute(
    "preserveAspectRatio",
    "none"
);

const livelloSettori =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
    );

livelloSettori.classList.add(
    "anemoscopio-livello-settori"
);

pianoTraiettoria.appendChild(
    livelloSettori
);

const livelloRespiro =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
    );

livelloRespiro.classList.add(
    "anemoscopio-livello-respiro"
);

pianoTraiettoria.appendChild(
    livelloRespiro
);   
   
campoTraiettoria.appendChild(
    pianoTraiettoria
);
anemoscopioDisplay.appendChild(
    campoTraiettoria
);
   
}

function apriAnemoscopio(
    timeline = null
) {

    if (!anemoscopio) {
        return;
    }

    if (
        Array.isArray(
            timeline
        )
    ) {

        window.anemoscopioTimeline =
            timeline;

    } else if (
        typeof ottieniTimelineAnemogramma ===
            "function" &&
        typeof anemos31 !==
            "undefined"
    ) {

        window.anemoscopioTimeline =
            ottieniTimelineAnemogramma(
                anemos31
            );

    } else {

        window.anemoscopioTimeline =
            [];

    }

        preparaDisplayAnemoscopio();

    anemoscopio.hidden = false;
}

function chiudiAnemoscopioVisuale() {

    if (!anemoscopio) {
        return;
    }

    anemoscopio.hidden = true;
}


if (chiudiAnemoscopio) {

    chiudiAnemoscopio.addEventListener(
        "click",
        chiudiAnemoscopioVisuale
    );
}


window.apriAnemoscopio =
    apriAnemoscopio;

window.chiudiAnemoscopio =
    chiudiAnemoscopioVisuale;
