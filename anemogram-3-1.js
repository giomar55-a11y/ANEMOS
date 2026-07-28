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
   STATO RIPRODUZIONE ANEMOGRAMMA
===================================================== */

let anemogrammaInPausa =
    false;
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


    /*
    =====================================================
    CERCHIO BASE
    =====================================================
    */

    function creaCerchioBase(
        riempimento = "#fff"
    ) {

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
            "16"
        );

        cerchio.setAttribute(
            "fill",
            riempimento
        );

        cerchio.setAttribute(
            "stroke",
            "#000"
        );

        cerchio.setAttribute(
            "stroke-width",
            "2"
        );


        return cerchio;

    }


    /*
    =====================================================
    VUOTO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.VUOTO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );

    }


    /*
    =====================================================
    SCARSO
    1/4 NERO
    QUADRANTE INFERIORE DESTRO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.SCARSO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );


        const quarto =
            document.createElementNS(
                svgNS,
                "path"
            );


        quarto.setAttribute(
            "d",
            [
                "M 20 20",
                "L 36 20",
                "A 16 16 0 0 1 20 36",
                "Z"
            ].join(" ")
        );


        quarto.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            quarto
        );

    }


    /*
    =====================================================
    CONFORTEVOLE
    YIN-YANG
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.CONFORTEVOLE
    ) {

        /*
        Cerchio esterno.
        */

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );


        /*
        Metà destra nera.
        */

        const metaNera =
            document.createElementNS(
                svgNS,
                "path"
            );


        metaNera.setAttribute(
            "d",
            [
                "M 20 4",
                "A 16 16 0 0 1 20 36",
                "A 8 8 0 0 1 20 20",
                "A 8 8 0 0 0 20 4",
                "Z"
            ].join(" ")
        );


        metaNera.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            metaNera
        );


        /*
        Parte bianca superiore.
        */

        const biancoSuperiore =
            document.createElementNS(
                svgNS,
                "circle"
            );


        biancoSuperiore.setAttribute(
            "cx",
            "20"
        );

        biancoSuperiore.setAttribute(
            "cy",
            "12"
        );

        biancoSuperiore.setAttribute(
            "r",
            "8"
        );

        biancoSuperiore.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            biancoSuperiore
        );


        /*
        Parte nera inferiore.
        */

        const neroInferiore =
            document.createElementNS(
                svgNS,
                "circle"
            );


        neroInferiore.setAttribute(
            "cx",
            "20"
        );

        neroInferiore.setAttribute(
            "cy",
            "28"
        );

        neroInferiore.setAttribute(
            "r",
            "8"
        );

        neroInferiore.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            neroInferiore
        );


        /*
        Punto nero nella parte bianca.
        */

        const puntoNero =
            document.createElementNS(
                svgNS,
                "circle"
            );


        puntoNero.setAttribute(
            "cx",
            "20"
        );

        puntoNero.setAttribute(
            "cy",
            "12"
        );

        puntoNero.setAttribute(
            "r",
            "2.5"
        );

        puntoNero.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            puntoNero
        );


        /*
        Punto bianco nella parte nera.
        */

        const puntoBianco =
            document.createElementNS(
                svgNS,
                "circle"
            );


        puntoBianco.setAttribute(
            "cx",
            "20"
        );

        puntoBianco.setAttribute(
            "cy",
            "28"
        );

        puntoBianco.setAttribute(
            "r",
            "2.5"
        );

        puntoBianco.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            puntoBianco
        );

    }


    /*
    =====================================================
    ABBONDANTE
    3/4 NERO
    QUADRANTE SUPERIORE SINISTRO BIANCO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.ABBONDANTE
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#000"
            )
        );


        const quartoBianco =
            document.createElementNS(
                svgNS,
                "path"
            );


        quartoBianco.setAttribute(
            "d",
            [
                "M 20 20",
                "L 4 20",
                "A 16 16 0 0 1 20 4",
                "Z"
            ].join(" ")
        );


        quartoBianco.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            quartoBianco
        );

    }


    /*
    =====================================================
    PIENO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.PIENO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#000"
            )
        );

    }


    contenitore.appendChild(
        svg
    );


    return contenitore;

}

/* =====================================================
   SINGOLO SETTORE + VOLUME
===================================================== */

function creaSettoreAnemogramma(
    configurazione,
    fase,
    durata
) {
   
    const contenitore =
        creaElementoAnemogramma(
            "div",
            "anemogramma-settore"
        );
contenitore.dataset.fase =
    fase;


contenitore.dataset.durata =
    durata;


if (
    fase ===
    ANEMOS_TIPI.IN
) {

    contenitore.classList.add(
        "anemogramma-in"
    );

}


if (
    fase ===
    ANEMOS_TIPI.ES
) {

    contenitore.classList.add(
        "anemogramma-es"
    );

}

    /*
    Strato di avanzamento.

    Rimane dietro alle icone e verrà
    animato successivamente.
    */

    const avanzamento =
        creaElementoAnemogramma(
            "div",
            "anemogramma-avanzamento"
        );


    /*
    Contenuto visibile sopra
    allo strato colorato.
    */

    const contenuto =
        creaElementoAnemogramma(
            "div",
            "anemogramma-settore-contenuto"
        );


    const icona =
        creaIconaSettoreAnemogramma(
            configurazione.settore
        );


    const volume =
        creaIconaVolumeAnemogramma(
            configurazione.volume
        );


    contenuto.appendChild(
        icona
    );


    contenuto.appendChild(
        volume
    );


    contenitore.appendChild(
        avanzamento
    );


    contenitore.appendChild(
        contenuto
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
    modalita,
    fase,
    durata
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
    settore,
    fase,
    durata
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

    /*
-----------------------------------------
RIGA UNICA
FASE + TEMPO + PERCORSO + FLUSSO
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


const percorso =
    creaIconaPercorsoAnemogramma(
        dati.percorso
    );


const flusso =
    creaIconaFlussoAnemogramma(
        dati.flusso
    );


rigaPrincipale.appendChild(
    fase
);


rigaPrincipale.appendChild(
    tempo
);


rigaPrincipale.appendChild(
    percorso
);


rigaPrincipale.appendChild(
    flusso
);


scheda.appendChild(
    rigaPrincipale
);

    /*
    -----------------------------------------
    SETTORI + VOLUMI
    -----------------------------------------
    */

    scheda.appendChild(
    creaSettoriAnemogramma(
        dati.settori,
        dati.modalitaSettori,
        dati.fase,
        dati.durata
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
        durata:
            anemomero.durata, 
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
   TIMELINE COMPLETA ANEMOGRAMMA
   ANEMOMERI + APNEE
===================================================== */

function ottieniTimelineAnemogramma(
    sequenza
) {

    const timeline =
        [];


    const ordine =
        sequenza.ordine;


    ordine.forEach(
        (
            anemomeroId,
            indice
        ) => {

            const anemomero =
                trovaAnemodromo(
                    sequenza,
                    anemomeroId
                );


            if (!anemomero) {

                return;

            }


            /*
            Inserisce l'anemomero.
            */

            timeline.push({

                tipo:
                    "anemomero",

                dati:
                    traduciAnemomeroPerAnemogramma(
                        anemomero
                    ),

                originale:
                    anemomero

            });


            /*
            Cerca l'eventuale apnea
            immediatamente successiva.
            */

            const successivoId =
                indice <
                ordine.length - 1

                    ? ordine[
                        indice + 1
                    ]

                    : null;


            const apnea =
                sequenza.apnee.find(
                    elemento =>
                        elemento.precedente ===
                            anemomeroId &&
                        elemento.successivo ===
                            successivoId
                );


            if (apnea) {

                timeline.push({

                    tipo:
                        "apnea",

                    durata:
                        apnea.durata,

                    fasePrecedente:
                        anemomero.tipo,

                    originale:
                        apnea

                });

            }

        }
    );


    return timeline;

}
/* =====================================================
   PANNELLO ANEMOGRAMMA
===================================================== */
/* =====================================================
   BARRA APNEA
===================================================== */

function creaApneaAnemogramma(
    dati
) {

    const barra =
        creaElementoAnemogramma(
            "div",
            "anemogramma-apnea"
        );


    /*
    Memorizza durata e fase precedente.
    Serviranno per l'animazione.
    */

    barra.dataset.durata =
        dati.durata;


    barra.dataset.fasePrecedente =
        dati.fasePrecedente;


    if (
        dati.fasePrecedente ===
        ANEMOS_TIPI.IN
    ) {

        barra.classList.add(
            "apnea-dopo-in"
        );

    }


    if (
        dati.fasePrecedente ===
        ANEMOS_TIPI.ES
    ) {

        barra.classList.add(
            "apnea-dopo-es"
        );

    }


    const tempo =
        creaElementoAnemogramma(
            "div",
            "anemogramma-apnea-tempo",
            dati.durata + " s"
        );


    barra.appendChild(
        tempo
    );


    return barra;

}
function centraElementoAttivoAnemogramma(
    elemento
) {

    if (!elemento) {

        return;

    }


    const pannello =
        document.getElementById(
            "pannello-anemogramma"
        );


    if (!pannello) {

        return;

    }


    const rettangoloElemento =
        elemento.getBoundingClientRect();


    const rettangoloPannello =
        pannello.getBoundingClientRect();


    const posizioneElementoNelPannello =
        pannello.scrollTop +
        rettangoloElemento.top -
        rettangoloPannello.top;


    const posizioneTarget =
        posizioneElementoNelPannello -
        pannello.clientHeight * 0.28;


    pannello.scrollTo({

        top:
            Math.max(
                0,
                posizioneTarget
            ),

        behavior:
            "smooth"

    });

}
/* =====================================================
   ATTESA DURANTE PAUSA
===================================================== */

async function attendiPausaAnemogramma() {

    while (
        anemogrammaInPausa
    ) {

        await new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    50
                );

            }
        );

    }

}
/* =====================================================
   ATTESA
===================================================== */

async function attendiAnemogramma(
    millisecondi
) {

    const intervallo =
        50;


    let trascorso =
        0;


    while (
        trascorso <
        millisecondi
    ) {

        if (
            anemogrammaInPausa
        ) {

            await new Promise(
                resolve => {

                    setTimeout(
                        resolve,
                        intervallo
                    );

                }
            );


            continue;

        }


        await new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    intervallo
                );

            }
        );


        trascorso +=
            intervallo;

    }

}
/* =====================================================
   ANIMA ANEMOMERO
===================================================== */

async function animaAnemomeroAnemogramma(
    elemento
) {
   
centraElementoAttivoAnemogramma(
    elemento
);
   
    const settori =
        elemento.querySelectorAll(
            ".anemogramma-settore"
        );


    if (
        settori.length === 0
    ) {

        return;

    }


    const durata =
        Number(
            settori[0].dataset.durata
        );


    settori.forEach(
        settore => {

            const avanzamento =
                settore.querySelector(
                    ".anemogramma-avanzamento"
                );


            if (!avanzamento) {

                return;

            }


            avanzamento.style.transitionDuration =
                durata + "s";


            avanzamento.style.width =
                "0%";

        }
    );


    await attendiAnemogramma(
        30
    );


    settori.forEach(
        settore => {

            const avanzamento =
                settore.querySelector(
                    ".anemogramma-avanzamento"
                );


            if (avanzamento) {

                avanzamento.style.width =
                    "100%";

            }

        }
    );


    await attendiAnemogramma(
        durata * 1000
    );

}


/* =====================================================
   ANIMA APNEA
===================================================== */

async function animaApneaAnemogramma(
    elemento
) {
   
centraElementoAttivoAnemogramma(
    elemento
);
   
    const durata =
        Number(
            elemento.dataset.durata
        );


    elemento.style.setProperty(
        "--durata-apnea",
        durata + "s"
    );


    elemento.classList.add(
        "apnea-attiva"
    );


    await attendiAnemogramma(
        durata * 1000
    );

}


/* =====================================================
   ESEGUE TIMELINE
===================================================== */

async function eseguiTimelineAnemogramma(
    contenuto
) {

    const elementi =
        contenuto.children;


    for (
        const elemento
        of elementi
    ) {
        await attendiPausaAnemogramma();
        if (
            elemento.classList.contains(
                "anemogramma-anemomero"
            )
        ) {

            await animaAnemomeroAnemogramma(
                elemento
            );

        }


        if (
            elemento.classList.contains(
                "anemogramma-apnea"
            )
        ) {

            await animaApneaAnemogramma(
                elemento
            );

        }

    }

}
function creaPannelloAnemogramma() {
   
   anemogrammaInPausa =
        false;
   
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
intestazione.style.position =
    "sticky";


intestazione.style.top =
    "0";


intestazione.style.zIndex =
    "100";


intestazione.style.background =
    "#ffffff";


intestazione.style.padding =
    "8px 0";

    const titolo =
        document.createElement(
            "h2"
        );


    titolo.textContent =
        "Anemogramma";

const playPausa =
    document.createElement(
        "button"
    );


playPausa.type =
    "button";


playPausa.textContent =
    "⏸";


playPausa.setAttribute(
    "aria-label",
    "Pausa Anemogramma"
);


playPausa.style.fontSize =
    "24px";


playPausa.style.border =
    "0";


playPausa.style.background =
    "transparent";


playPausa.style.cursor =
    "pointer";


playPausa.addEventListener(
    "click",
    function () {

        anemogrammaInPausa =
            !anemogrammaInPausa;


        if (
            anemogrammaInPausa
        ) {

            playPausa.textContent =
                "▶";

            playPausa.setAttribute(
                "aria-label",
                "Riprendi Anemogramma"
            );

        } else {

            playPausa.textContent =
                "⏸";

            playPausa.setAttribute(
                "aria-label",
                "Pausa Anemogramma"
            );

        }

    }
);
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
    playPausa
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


    const timeline =
    ottieniTimelineAnemogramma(
        anemos31
    );

    if (
    timeline.length === 0
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

    timeline.forEach(
        elemento => {

            if (
                elemento.tipo ===
                "anemomero"
            ) {

                contenuto.appendChild(
                    creaAnemomeroAnemogramma(
                        elemento.dati
                    )
                );

            }


            if (
                elemento.tipo ===
                "apnea"
            ) {

                contenuto.appendChild(
                    creaApneaAnemogramma(
                        elemento
                    )
                );

            }

        }
    );

}

    pannello.appendChild(
        contenuto
    );


    document.body.appendChild(
        pannello
    );
requestAnimationFrame(
    function () {

        eseguiTimelineAnemogramma(
            contenuto
        );

    }
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
