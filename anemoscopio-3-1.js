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
