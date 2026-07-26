/*
=====================================================
ANEMOS 3.1
ANEMOGRAMMA
=====================================================

Rappresentazione grafica dell'anemodromo.

Modulo indipendente dall'Anemografo:
legge i dati senza modificarli.
=====================================================
*/


/* =====================================================
   ELEMENTO BASE
===================================================== */

function creaElementoAnemogramma(
    tag,
    classe,
    testo = ""
) {

    const elemento =
        document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (testo !== "") {
        elemento.textContent = testo;
    }

    return elemento;

}
/* =====================================================
   ICONA PERCORSO
===================================================== */

function creaIconaPercorsoAnemogramma(
    percorso
) {

    const icona =
        creaElementoAnemogramma(
            "div",
            "anemogramma-icona-parametro"
        );


    const simboli = {

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            "👃 Dx",

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            "👃 Sn",

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            "👃",

        [ANEMOS_PERCORSI.BOCCA]:
            "👄"

    };


    icona.textContent =
        simboli[percorso] || "";


    return icona;

}


/* =====================================================
   ICONA FLUSSO
===================================================== */

function creaIconaFlussoAnemogramma(
    flusso
) {

    const icona =
        creaElementoAnemogramma(
            "div",
            "anemogramma-icona-parametro"
        );


    icona.textContent =
        ANEMOS_ICONE_FLUSSO[
            flusso
        ] || "";


    return icona;

}

/* =====================================================
   ICONA SETTORE
===================================================== */

function creaIconaSettoreAnemogramma(
    settore
) {
    const ns =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            ns,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 48 60"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    svg.classList.add(
        "anemogramma-icona-settore"
    );


    const parti = [

        {
            nome:
                "torace_superiore",

            d:
                "M12 5 C16 2 32 2 36 5 L40 18 L8 18 Z"
        },

        {
            nome:
                "torace_inferiore",

            d:
                "M8 18 L40 18 L37 36 L11 36 Z"
        },

        {
            nome:
                "addome",

            d:
                "M11 36 L37 36 L34 55 L14 55 Z"
        }

    ];


    parti.forEach(
        parte => {

            const path =
                document.createElementNS(
                    ns,
                    "path"
                );


            path.setAttribute(
                "d",
                parte.d
            );


            path.setAttribute(
                "fill",
                parte.nome === settore
                    ? "#000"
                    : "#fff"
            );


            path.setAttribute(
                "stroke",
                "#000"
            );


            path.setAttribute(
                "stroke-width",
                "1.8"
            );


            path.setAttribute(
                "stroke-linejoin",
                "round"
            );


            svg.appendChild(path);

        }
    );


    return svg;

}
/* =====================================================
   ICONA VOLUME
===================================================== */

function creaIconaVolumeAnemogramma(
    volume
) {

    const livelli = {

        [ANEMOS_VOLUMI.VUOTO]:
            0,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            3,

        [ANEMOS_VOLUMI.PIENO]:
            4

    };


    const livello =
        livelli[volume] ?? 0;


    const contenitore =
        creaElementoAnemogramma(
            "span",
            "anemogramma-icona-volume"
        );


    const svgNS =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 40 40"
    );


    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    const raggi = [
        4,
        9,
        14,
        19
    ];


    raggi.forEach(
        (
            raggio,
            indice
        ) => {

            const cerchio =
                document.createElementNS(
                    svgNS,
                    "circle"
                );


            cerchio.setAttribute(
                "cx",
                "20"
            );


            cerchio.setAttribute(
                "cy",
                "20"
            );


            cerchio.setAttribute(
                "r",
                raggio
            );


            cerchio.setAttribute(
                "fill",
                "none"
            );


            cerchio.setAttribute(
                "stroke",
                "currentColor"
            );


            cerchio.setAttribute(
                "stroke-width",
                indice < livello
                    ? "5"
                    : "1.3"
            );


            svg.appendChild(
                cerchio
            );

        }
    );


    contenitore.appendChild(
        svg
    );


    return contenitore;

}


/* =====================================================
   SINGOLO SETTORE + VOLUME
===================================================== */

function creaSettoreAnemogramma(
    configurazione
) {

    const contenitore =
        creaElementoAnemogramma(
            "div",
            "anemogramma-settore"
        );


    const icona =
        creaIconaSettoreAnemogramma(
            configurazione.settore
        );


    const volume =
    creaIconaVolumeAnemogramma(
        configurazione.volume
    );

    contenitore.appendChild(
        icona
    );


    contenitore.appendChild(
        volume
    );


    return contenitore;

}


/* =====================================================
   BLOCCO SETTORI

   simultaneo  = verticale
   sequenziale = orizzontale
===================================================== */

function creaSettoriAnemogramma(
    settori,
    modalita
) {

    const contenitore =
        creaElementoAnemogramma(
            "div",
            "anemogramma-settori"
        );


    if (
        modalita ===
        "simultaneo"
    ) {

        contenitore.classList.add(
            "simultaneo"
        );

    }


    if (
        modalita ===
        "sequenziale"
    ) {

        contenitore.classList.add(
            "sequenziale"
        );

    }


    settori.forEach(
        settore => {

            contenitore.appendChild(
                creaSettoreAnemogramma(
                    settore
                )
            );

        }
    );


    return contenitore;

}


/* =====================================================
   SINGOLO ANEMOMERO
===================================================== */

function creaAnemomeroAnemogramma(
    dati
) {

    const scheda =
        creaElementoAnemogramma(
            "div",
            "anemogramma-anemomero"
        );


    /*
    -----------------------------------------
    RIGA 1
    FASE + TEMPO
    -----------------------------------------
    */

    const rigaPrincipale =
        creaElementoAnemogramma(
            "div",
            "anemogramma-riga-principale"
        );


    const fase =
        creaElementoAnemogramma(
            "div",
            "anemogramma-fase",
            dati.fase
        );


    const tempo =
        creaElementoAnemogramma(
            "div",
            "anemogramma-tempo",
            dati.tempo
        );


    rigaPrincipale.appendChild(
        fase
    );


    rigaPrincipale.appendChild(
        tempo
    );


    scheda.appendChild(
        rigaPrincipale
    );


    /*
    -----------------------------------------
    RIGA 2
    PERCORSO + FLUSSO
    -----------------------------------------
    */

    const rigaSecondaria =
        creaElementoAnemogramma(
            "div",
            "anemogramma-riga-secondaria"
        );


    const percorso =
    creaIconaPercorsoAnemogramma(
        dati.percorso
    );


const flusso =
    creaIconaFlussoAnemogramma(
        dati.flusso
    );

    rigaSecondaria.appendChild(
        percorso
    );


    rigaSecondaria.appendChild(
        flusso
    );


    scheda.appendChild(
        rigaSecondaria
    );


    /*
    -----------------------------------------
    SETTORI + VOLUMI
    -----------------------------------------
    */

    scheda.appendChild(
        creaSettoriAnemogramma(
            dati.settori,
            dati.modalitaSettori
        )
    );


    return scheda;

}
/* =====================================================
   TRADUZIONE DATI REALI -> ANEMOGRAMMA
===================================================== */

function traduciAnemomeroPerAnemogramma(
    anemomero
) {

    return {

        fase:
            anemomero.tipo,

        tempo:
            anemomero.durata + " s",

        percorso:
            anemomero.percorso,

        flusso:
            anemomero.flusso,

        modalitaSettori:
            "simultaneo",

        settori:
            anemomero.settori.map(
                settore => {

                    return {

                        settore:
                            settore.nome,

                        volume:
                            settore.volume

                    };

                }
            )

    };

}


/* =====================================================
   ANEMOMERI ORDINATI DELL'ANEMODROMO
===================================================== */

function ottieniAnemomeriPerAnemogramma(
    sequenza
) {

    return ottieniAnemodromiOrdinati(
        sequenza
    )
    .map(
        anemomero =>
            traduciAnemomeroPerAnemogramma(
                anemomero
            )
    );

}
/* =====================================================
   PANNELLO ANEMOGRAMMA
===================================================== */

function creaPannelloAnemogramma() {

    const esistente =
        document.getElementById(
            "pannello-anemogramma"
        );


    if (esistente) {

        esistente.remove();

    }


    const pannello =
        document.createElement(
            "div"
        );


    pannello.id =
        "pannello-anemogramma";


    /*
    Stile provvisorio.
    Verrà successivamente spostato nel CSS.
    */

    pannello.style.position =
        "fixed";

    pannello.style.inset =
        "0";

    pannello.style.background =
        "#ffffff";

    pannello.style.zIndex =
        "9999";

    pannello.style.overflowY =
        "auto";

    pannello.style.padding =
        "20px";


    /* =================================================
       INTESTAZIONE
    ================================================= */

    const intestazione =
        document.createElement(
            "div"
        );


    intestazione.style.display =
        "flex";

    intestazione.style.alignItems =
        "center";

    intestazione.style.justifyContent =
        "space-between";

    intestazione.style.marginBottom =
        "24px";


    const titolo =
        document.createElement(
            "h2"
        );


    titolo.textContent =
        "Anemogramma";


    const chiudi =
        document.createElement(
            "button"
        );


    chiudi.type =
        "button";

    chiudi.textContent =
        "×";

    chiudi.setAttribute(
        "aria-label",
        "Chiudi Anemogramma"
    );


    chiudi.style.fontSize =
        "28px";

    chiudi.style.border =
        "0";

    chiudi.style.background =
        "transparent";

    chiudi.style.cursor =
        "pointer";


    chiudi.addEventListener(
        "click",
        function () {

            pannello.remove();

        }
    );


    intestazione.appendChild(
        titolo
    );


    intestazione.appendChild(
        chiudi
    );


    pannello.appendChild(
        intestazione
    );


    /* =================================================
       CONTENUTO
    ================================================= */

    const contenuto =
        document.createElement(
            "div"
        );


    contenuto.id =
        "contenuto-anemogramma";


    const anemomeri =
        ottieniAnemomeriPerAnemogramma(
            anemos31
        );


    if (
        anemomeri.length === 0
    ) {

        const vuoto =
            document.createElement(
                "p"
            );


        vuoto.textContent =
            "Nessun anemomero presente.";


        contenuto.appendChild(
            vuoto
        );

    } else {

        anemomeri.forEach(
            dati => {

                contenuto.appendChild(
                    creaAnemomeroAnemogramma(
                        dati
                    )
                );

            }
        );

    }


    pannello.appendChild(
        contenuto
    );


    document.body.appendChild(
        pannello
    );

}


/* =====================================================
   COMANDO AVVIA
===================================================== */

function inizializzaAnemogramma() {

    const pulsanteAvvia =
        document.getElementById(
            "avvia-anemos"
        );


    if (!pulsanteAvvia) {

        return;

    }


    pulsanteAvvia.addEventListener(
        "click",
        function () {

            creaPannelloAnemogramma();

        }
    );

}


/* =====================================================
   AVVIO MODULO ANEMOGRAMMA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    inizializzaAnemogramma
);
