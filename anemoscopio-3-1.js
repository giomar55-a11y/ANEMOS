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

const Y_VOLUME_ANEMOSCOPIO = {
    "PIENO": 0,
    "ABBONDANTE": 125,
    "CONFORTEVOLE": 250,
    "SCARSO": 375,
    "VUOTO": 500
};

function ottieniYVolumeAnemoscopio(
    volume
) {

    if (
        typeof volume !==
        "string"
    ) {
        return null;
    }

    const nomeVolume =
        volume
            .trim()
            .toUpperCase();

    return (
        Y_VOLUME_ANEMOSCOPIO[
            nomeVolume
        ] ?? null
    );
}

function ottieniEstremiVolumeAnemoscopio(
    settori
) {

    if (
        !Array.isArray(settori) ||
        settori.length === 0
    ) {
        return null;
    }

    const valori = [];

    settori.forEach(
        function (settore) {

            const volume =
                typeof settore === "string"
                    ? null
                    : settore.volume;

            const y =
                ottieniYVolumeAnemoscopio(
                    volume
                );

            if (y !== null) {
                valori.push(y);
            }
        }
    );

    if (valori.length === 0) {
        return null;
    }

    return {
        yMin: Math.min(...valori),
        yMax: Math.max(...valori)
    };
}
function ottieniYFinaleFaseAnemoscopio(
    dati
) {

    if (!dati) {
        return null;
    }

    const estremi =
        ottieniEstremiVolumeAnemoscopio(
            dati.settori
        );

    if (!estremi) {
        return null;
    }

    const fase =
        String(
            dati.fase || ""
        )
            .trim()
            .toUpperCase();

    if (fase === "IN") {
        return estremi.yMin;
    }

    if (fase === "ES") {
        return estremi.yMax;
    }

    return null;
}

function ottieniYInizialePrimaFaseAnemoscopio(
    dati
) {

    const yFinale =
        ottieniYFinaleFaseAnemoscopio(
            dati
        );

    if (yFinale === null) {
        return null;
    }

    const fase =
        String(
            dati.fase || ""
        )
            .trim()
            .toUpperCase();

    if (fase === "IN") {
        return Math.min(
            500,
            yFinale + 125
        );
    }

    if (fase === "ES") {
        return Math.max(
            0,
            yFinale - 125
        );
    }

    return null;
}
function ottieniNumeroLineeFlussoAnemoscopio(
    flusso
) {

    const nomeFlusso =
        String(flusso || "")
            .trim()
            .toLowerCase();

    if (nomeFlusso === "spontaneo") {
        return 2;
    }

    if (nomeFlusso === "forzato") {
        return 3;
    }

    return 1;
}

function ottieniOffsetLineeFlussoAnemoscopio(
    flusso
) {

    const numeroLinee =
        ottieniNumeroLineeFlussoAnemoscopio(
            flusso
        );

    if (numeroLinee === 2) {
        return [-5, 5];
    }

    if (numeroLinee === 3) {
        return [-8, 0, 8];
    }

    return [0];
}

function creaLineeFlussoAnemoscopio(
    xInizio,
    yInizio,
    xFine,
    yFine,
    flusso
) {

    const gruppo =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

    const offsets =
        ottieniOffsetLineeFlussoAnemoscopio(
            flusso
        );

    offsets.forEach(
        function (offset) {

            const linea =
                creaLineaRespiroAnemoscopio(
                    xInizio,
                    yInizio + offset,
                    xFine,
                    yFine + offset,
                    flusso
                );

            gruppo.appendChild(
                linea
            );
        }
    );

    return gruppo;
}
function ottieniLivelliPieniCursoreAnemoscopio(
    volume
) {

    const nomeVolume =
        String(volume || "")
            .trim()
            .toUpperCase();

    if (nomeVolume === "SCARSO") {
        return 1;
    }

    if (nomeVolume === "CONFORTEVOLE") {
        return 2;
    }

    if (nomeVolume === "ABBONDANTE") {
        return 3;
    }

    if (nomeVolume === "PIENO") {
        return 4;
    }

    return 0;
}
function creaCursoreAnemoscopio(
    volumeObiettivo
) {

    const cursore =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

    cursore.classList.add(
        "anemoscopio-cursore"
    );

    cursore.dataset.volumeObiettivo =
        String(
            volumeObiettivo || ""
        );

   const polmoneSinistro =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

polmoneSinistro.setAttribute(
    "d",
    "M29 18 C25 16 21 17 18 21 C14 27 12 36 13 46 C14 53 18 57 23 56 C27 55 29 50 29 44 Z"
);

polmoneSinistro.setAttribute(
    "fill",
    "#F1F1F1"
);

polmoneSinistro.setAttribute(
    "stroke",
    "#555"
);

polmoneSinistro.setAttribute(
    "stroke-width",
    "2"
);


const polmoneDestro =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

polmoneDestro.setAttribute(
    "d",
    "M35 18 C39 16 43 17 46 21 C50 27 52 36 51 46 C50 53 46 57 41 56 C37 55 35 50 35 44 Z"
);

polmoneDestro.setAttribute(
    "fill",
    "#F1F1F1"
);

polmoneDestro.setAttribute(
    "stroke",
    "#555"
);

polmoneDestro.setAttribute(
    "stroke-width",
    "2"
);
const clipPath =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath"
    );

const clipId =
    "anemoscopio-polmoni-" +
    Math.random()
        .toString(36)
        .slice(2);

clipPath.setAttribute(
    "id",
    clipId
);

const clipSinistro =
    polmoneSinistro.cloneNode();

const clipDestro =
    polmoneDestro.cloneNode();

clipSinistro.removeAttribute(
    "stroke"
);

clipDestro.removeAttribute(
    "stroke"
);

clipPath.appendChild(
    clipSinistro
);

clipPath.appendChild(
    clipDestro
);

cursore.appendChild(
    clipPath
);

const gruppoFasce =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
    );

gruppoFasce.setAttribute(
    "clip-path",
    "url(#" + clipId + ")"
);

cursore.appendChild(
    gruppoFasce
);
const livelliPieni =
    ottieniLivelliPieniCursoreAnemoscopio(
        volumeObiettivo
    );

const fasce = [
    { y: 47, h: 10 },
    { y: 37, h: 10 },
    { y: 27, h: 10 },
    { y: 17, h: 10 }
];

fasce.forEach(
    function (fascia, indice) {

        const banda =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            );

        banda.setAttribute(
            "x",
            "12"
        );

        banda.setAttribute(
            "y",
            fascia.y
        );

        banda.setAttribute(
            "width",
            "40"
        );

        banda.setAttribute(
            "height",
            fascia.h
        );

        banda.setAttribute(
            "fill",
            indice < livelliPieni
                ? "#777"
                : "#F1F1F1"
        );

        banda.setAttribute(
            "stroke",
            "#555"
        );

        banda.setAttribute(
            "stroke-width",
            "1.5"
        );

        gruppoFasce.appendChild(
    banda
);
    }
);
   
cursore.appendChild(
    polmoneSinistro
);

cursore.appendChild(
    polmoneDestro
);

    return cursore;
}

function creaLineaRespiroAnemoscopio(
    xInizio,
    yInizio,
    xFine,
    yFine,
    flusso
){

    const linea =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    linea.setAttribute(
        "x1",
        xInizio
    );

    linea.setAttribute(
        "y1",
        yInizio
    );

    linea.setAttribute(
        "x2",
        xFine
    );

    linea.setAttribute(
        "y2",
        yFine
    );

    linea.setAttribute(
        "stroke",
        "#000"
    );

    linea.setAttribute(
        "stroke-width",
        "4"
    );

    linea.setAttribute(
        "stroke-linecap",
        "round"
    );

   if (
    String(flusso || "")
        .trim()
        .toLowerCase() ===
        "trattenuto"
) {
    linea.setAttribute(
        "stroke-dasharray",
        "8 8"
    );
}

    linea.classList.add(
        "anemoscopio-linea-respiro"
    );

    return linea;
}

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

function creaBandeSettoriSimultaneiAnemoscopio(
    livelloSettori,
    settori,
    x,
    larghezza
) {

    if (
        !livelloSettori ||
        !Array.isArray(settori) ||
        settori.length === 0
    ) {
        return;
    }

    const altezzaTotale = 500;

    const altezzaBanda =
        altezzaTotale /
        settori.length;

    settori.forEach(
        function (settore, indice) {

            const nomeSettore =
                typeof settore === "string"
                    ? settore
                    : settore.settore;

            const banda =
                creaBandaSettoreAnemoscopio(
                    nomeSettore,
                    x,
                    larghezza,
                    indice * altezzaBanda,
                    altezzaBanda
                );

            if (banda) {

                livelloSettori.appendChild(
                    banda
                );
            }
        }
    );
}
function disegnaSettoriTimelineAnemoscopio(
    livelloSettori
) {

    if (
        !livelloSettori ||
        !Array.isArray(
            window.anemoscopioTimeline
        )
    ) {
        return;
    }

    const pixelPerSecondo = 50;

    let x = 0;

    window.anemoscopioTimeline.forEach(
    function (elemento) {

        if (
            elemento.tipo ===
            "apnea"
        ) {

            const durataApnea =
                Number(
                    elemento.durata
                ) || 0;

            x +=
                durataApnea *
                pixelPerSecondo;

            return;
        }

        if (
            elemento.tipo !==
            "anemomero"
        ) {
            return;
        }

        const dati =
            elemento.dati;
            const durata =
                Number(dati.durata) || 0;

            const larghezza =
                durata *
                pixelPerSecondo;

            creaBandeSettoriSimultaneiAnemoscopio(
                livelloSettori,
                dati.settori,
                x,
                larghezza
            );

            x += larghezza;
        }
    );
}

function creaTestoApneaAnemoscopio(
    x,
    larghezza,
    durata
) {

    const testo =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

    testo.setAttribute(
        "x",
        x + larghezza / 2
    );

    testo.setAttribute(
        "y",
        250
    );

    testo.setAttribute(
        "text-anchor",
        "middle"
    );

    testo.classList.add(
        "anemoscopio-countdown-apnea"
    );

    const numeri = [];

    for (
        let secondo = durata;
        secondo >= 1;
        secondo--
    ) {
        numeri.push(secondo);
    }

    testo.textContent =
        numeri.join(" · ");

    return testo;
}

function disegnaRespiroTimelineAnemoscopio(
    livelloRespiro
) {

    if (
        !livelloRespiro ||
        !Array.isArray(
            window.anemoscopioTimeline
        )
    ) {
        return;
    }

    const pixelPerSecondo = 50;

    let x = 0;

   let yPrecedente = null;

    window.anemoscopioTimeline.forEach(
        function (elemento) {

            if (
                elemento.tipo ===
                "apnea"
            ) {

                const durataApnea =
                    Number(
                        elemento.durata
                    ) || 0;

                const larghezzaApnea =
    durataApnea *
    pixelPerSecondo;

const testoApnea =
    creaTestoApneaAnemoscopio(
        x,
        larghezzaApnea,
        durataApnea
    );

livelloRespiro.appendChild(
    testoApnea
);

x += larghezzaApnea;

return;
            }

            if (
                elemento.tipo !==
                    "anemomero"
            ) {
                return;
            }

            const dati =
                elemento.dati;

            const durata =
                Number(
                    dati.durata
                ) || 0;

            const larghezza =
    durata *
    pixelPerSecondo;

const yFinale =
    ottieniYFinaleFaseAnemoscopio(
        dati
    );

if (yFinale !== null) {

    if (yPrecedente === null) {
        yPrecedente =
            ottieniYInizialePrimaFaseAnemoscopio(
                dati
            );
    }

    if (yPrecedente !== null)
    {
        const linee =
    creaLineeFlussoAnemoscopio(
        x,
        yPrecedente,
        x + larghezza,
        yFinale,
        dati.flusso
    );

livelloRespiro.appendChild(
    linee
);
    }

    yPrecedente = yFinale;
}

x += larghezza;
        }
    );
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

disegnaSettoriTimelineAnemoscopio(
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

disegnaRespiroTimelineAnemoscopio(
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
