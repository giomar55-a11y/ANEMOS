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
