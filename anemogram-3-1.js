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

let anemogrammaEsecuzione =
    0;
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
   ICONA SETTORE — SAGOMA UMANA
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
        "0 0 64 92"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    svg.classList.add(
        "anemogramma-icona-settore"
    );


    /*
    =====================================================
    COLORI DEI TRE SETTORI
    =====================================================
    */

    const coloriSettori = {

        torace_superiore:
            "#35C6E8",

        torace_inferiore:
            "#9B51E0",

        addome:
            "#2457D6"

    };


    /*
    =====================================================
    TESTA
    =====================================================
    */

    const testa =
        document.createElementNS(
            ns,
            "circle"
        );


    testa.setAttribute(
        "cx",
        "32"
    );

    testa.setAttribute(
        "cy",
        "8"
    );

    testa.setAttribute(
        "r",
        "5.5"
    );

    testa.setAttribute(
        "fill",
        "#F7F7F7"
    );

    testa.setAttribute(
        "stroke",
        "#333"
    );

    testa.setAttribute(
        "stroke-width",
        "1.7"
    );


    svg.appendChild(
        testa
    );


    /*
    =====================================================
    COLLO
    =====================================================
    */

    const collo =
        document.createElementNS(
            ns,
            "path"
        );


    collo.setAttribute(
        "d",
        "M29 13 L29 18 M35 13 L35 18"
    );

    collo.setAttribute(
        "fill",
        "none"
    );

    collo.setAttribute(
        "stroke",
        "#333"
    );

    collo.setAttribute(
        "stroke-width",
        "1.7"
    );

    collo.setAttribute(
        "stroke-linecap",
        "round"
    );


    svg.appendChild(
        collo
    );


    /*
    =====================================================
    BRACCIA PIEGATE — MANI AI FIANCHI
    =====================================================
    */

    const braccia =
        document.createElementNS(
            ns,
            "path"
        );


    braccia.setAttribute(
        "d",
        [
            "M22 22",
            "Q17 23 14 29",
            "L10 40",
            "Q9 44 13 47",
            "L24 51",

            "M42 22",
            "Q47 23 50 29",
            "L54 40",
            "Q55 44 51 47",
            "L40 51"
        ].join(" ")
    );

    braccia.setAttribute(
        "fill",
        "none"
    );

    braccia.setAttribute(
        "stroke",
        "#333"
    );

    braccia.setAttribute(
        "stroke-width",
        "3"
    );

    braccia.setAttribute(
        "stroke-linecap",
        "round"
    );

    braccia.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        braccia
    );


    /*
    =====================================================
    TRE SETTORI RESPIRATORI
    =====================================================
    */

    const parti = [

        {
            nome:
                "torace_superiore",

            d:
                "M22 22 Q26 18 32 18 Q38 18 42 22 L40 34 Q36 36 32 36 Q28 36 24 34 Z"
        },

        {
            nome:
                "torace_inferiore",

            d:
                "M24 34 Q28 36 32 36 Q36 36 40 34 L39 47 Q36 49 32 49 Q28 49 25 47 Z"
        },

        {
            nome:
                "addome",

            d:
                "M25 47 Q28 49 32 49 Q36 49 39 47 L40 60 Q36 63 32 63 Q28 63 24 60 Z"
        }

    ];


    parti.forEach(
        function(parte) {

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
                    ? coloriSettori[
                        parte.nome
                    ]
                    : "#F7F7F7"
            );


            path.setAttribute(
                "stroke",
                "#333"
            );


            path.setAttribute(
                "stroke-width",
                "1.7"
            );


            path.setAttribute(
                "stroke-linejoin",
                "round"
            );


            svg.appendChild(
                path
            );

        }
    );


    /*
    =====================================================
    BACINO
    =====================================================
    */

    const bacino =
        document.createElementNS(
            ns,
            "path"
        );


    bacino.setAttribute(
        "d",
        "M24 60 Q28 63 32 63 Q36 63 40 60 L39 68 Q36 71 32 71 Q28 71 25 68 Z"
    );

    bacino.setAttribute(
        "fill",
        "#F7F7F7"
    );

    bacino.setAttribute(
        "stroke",
        "#333"
    );

    bacino.setAttribute(
        "stroke-width",
        "1.7"
    );

    bacino.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        bacino
    );


    /*
    =====================================================
    GAMBE
    =====================================================
    */

    const gambe =
        document.createElementNS(
            ns,
            "path"
        );


    gambe.setAttribute(
        "d",
        [
            "M27 68",
            "L25 85",
            "L23 89",
            "L29 89",
            "L32 71",

            "M37 68",
            "L39 85",
            "L41 89",
            "L35 89",
            "L32 71"
        ].join(" ")
    );

    gambe.setAttribute(
        "fill",
        "#F7F7F7"
    );

    gambe.setAttribute(
        "stroke",
        "#333"
    );

    gambe.setAttribute(
        "stroke-width",
        "1.7"
    );

    gambe.setAttribute(
        "stroke-linejoin",
        "round"
    );

    gambe.setAttribute(
        "stroke-linecap",
        "round"
    );


    svg.appendChild(
        gambe
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

    const ns =
        "http://www.w3.org/2000/svg";

    const svg =
        document.createElementNS(
            ns,
            "svg"
        );

    svg.setAttribute(
        "viewBox",
        "0 0 64 64"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
    LIVELLO DEL VOLUME
    */

    let percentuale = 0;

    if (
        volume ===
        ANEMOS_VOLUMI.SCARSO
    ) {
        percentuale = 25;
    }

    if (
        volume ===
        ANEMOS_VOLUMI.CONFORTEVOLE
    ) {
        percentuale = 50;
    }

    if (
        volume ===
        ANEMOS_VOLUMI.ABBONDANTE
    ) {
        percentuale = 75;
    }

    if (
        volume ===
        ANEMOS_VOLUMI.PIENO
    ) {
        percentuale = 100;
    }


    /*
    FORMA FISSA DEI POLMONI
    */

    const polmoneSinistro =
        "M29 18 C25 16 21 17 18 21 C14 27 12 36 13 46 C14 53 18 57 23 56 C27 55 29 50 29 44 Z";

    const polmoneDestro =
        "M35 18 C39 16 43 17 46 21 C50 27 52 36 51 46 C50 53 46 57 41 56 C37 55 35 50 35 44 Z";


    /*
    BASE CHIARA
    */

    [
        polmoneSinistro,
        polmoneDestro
    ].forEach(function(d) {

        const path =
            document.createElementNS(
                ns,
                "path"
            );

        path.setAttribute("d", d);
        path.setAttribute(
            "fill",
            "#F1F1F1"
        );
        path.setAttribute(
            "stroke",
            "#555"
        );
        path.setAttribute(
            "stroke-width",
            "2"
        );
        path.setAttribute(
            "stroke-linejoin",
            "round"
        );

        svg.appendChild(path);

    });


    /*
    RIEMPIMENTO GRIGIO
    DAL BASSO VERSO L'ALTO
    */

    const altezzaMassima = 40;

    const altezza =
        altezzaMassima *
        percentuale /
        100;

    const y =
        57 - altezza;

    const defs =
        document.createElementNS(
            ns,
            "defs"
        );

    const clip =
        document.createElementNS(
            ns,
            "clipPath"
        );

    const clipId =
        "anemos-volume-" +
        Math.random()
            .toString(36)
            .slice(2);

    clip.setAttribute(
        "id",
        clipId
    );

    const rettangolo =
        document.createElementNS(
            ns,
            "rect"
        );

    rettangolo.setAttribute(
        "x",
        "10"
    );

    rettangolo.setAttribute(
        "y",
        String(y)
    );

    rettangolo.setAttribute(
        "width",
        "44"
    );

    rettangolo.setAttribute(
        "height",
        String(altezza)
    );

    clip.appendChild(
        rettangolo
    );

    defs.appendChild(
        clip
    );

    svg.appendChild(
        defs
    );


    [
        polmoneSinistro,
        polmoneDestro
    ].forEach(function(d) {

        const path =
            document.createElementNS(
                ns,
                "path"
            );

        path.setAttribute("d", d);

        path.setAttribute(
            "fill",
            "#777"
        );

        path.setAttribute(
            "clip-path",
            "url(#" +
            clipId +
            ")"
        );

        svg.appendChild(path);

    });


    /*
    TRACHEA E BRONCHI
    */

    const vieAeree =
        document.createElementNS(
            ns,
            "path"
        );

    vieAeree.setAttribute(
        "d",
        "M32 7 L32 25 M32 25 L25 32 M32 25 L39 32"
    );

    vieAeree.setAttribute(
        "fill",
        "none"
    );

    vieAeree.setAttribute(
        "stroke",
        "#555"
    );

    vieAeree.setAttribute(
        "stroke-width",
        "2.5"
    );

    vieAeree.setAttribute(
        "stroke-linecap",
        "round"
    );

    svg.appendChild(
        vieAeree
    );


    contenitore.appendChild(
        svg
    );

    return contenitore;

}/* =====================================================
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
    elemento,
    esecuzione
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
        ) * 1000;


    const avanzamenti =
        [];


    settori.forEach(
        settore => {

            const avanzamento =
                settore.querySelector(
                    ".anemogramma-avanzamento"
                );


            if (!avanzamento) {

                return;

            }


            avanzamento.style.transition =
                "none";


            avanzamento.style.height =
                "0%";

            avanzamenti.push(
                avanzamento
            );

        }
    );


    const intervallo =
        30;


    let trascorso =
        0;


    while (
        trascorso < durata
    ) {
        if (
            esecuzione !==
            anemogrammaEsecuzione
        ) {

            return;

        }
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


        trascorso =
            Math.min(
                trascorso + intervallo,
                durata
            );


        const percentuale =
            durata > 0
                ? (
                    trascorso /
                    durata
                ) * 100
                : 100;


        avanzamenti.forEach(
            avanzamento => {

                avanzamento.style.height =
                     percentuale + "%";

            }
        );


        await new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    intervallo
                );

            }
        );

    }


    avanzamenti.forEach(
        avanzamento => {

            avanzamento.style.height =
                "100%";

        }
    );

}
/* =====================================================
   ANIMA APNEA
===================================================== */

async function animaApneaAnemogramma(
    elemento,
    esecuzione
) {

    centraElementoAttivoAnemogramma(
        elemento
    );


    const durata =
        Number(
            elemento.dataset.durata
        ) * 1000;


    const intervallo =
        30;


    let trascorso =
        0;


    elemento.classList.remove(
        "apnea-attiva"
    );


    elemento.style.setProperty(
        "--avanzamento-apnea",
        "0%"
    );


    while (
        trascorso < durata
    ) {

        if (
            esecuzione !==
            anemogrammaEsecuzione
        ) {

            elemento.style.setProperty(
                "--avanzamento-apnea",
                "0%"
            );

            return;

        }


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


        trascorso =
            Math.min(
                trascorso + intervallo,
                durata
            );


        const percentuale =
            durata > 0
                ? (
                    trascorso /
                    durata
                ) * 100
                : 100;


        elemento.style.setProperty(
            "--avanzamento-apnea",
            percentuale + "%"
        );


        await new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    intervallo
                );

            }
        );

    }

}
   
/* =====================================================
   AZZERA ANEMOGRAMMA
===================================================== */

function azzeraAnemogramma(
    contenuto
) {

    const avanzamenti =
        contenuto.querySelectorAll(
            ".anemogramma-avanzamento"
        );


    avanzamenti.forEach(
        avanzamento => {

            avanzamento.style.transition =
                "none";

           avanzamento.style.height =
                "0%";
        }
    );


    const apnee =
        contenuto.querySelectorAll(
            ".anemogramma-apnea"
        );


    apnee.forEach(
    apnea => {

        apnea.classList.remove(
            "apnea-attiva"
        );


        apnea.style.setProperty(
            "--avanzamento-apnea",
            "0%"
        );

    }
);
}
/* =====================================================
   ESEGUE TIMELINE
===================================================== */

async function eseguiTimelineAnemogramma(
    contenuto,
    esecuzione
) {

    const elementi =
        contenuto.children;


    while (
        esecuzione ===
        anemogrammaEsecuzione
    ) {

        /*
        Ogni nuovo ciclo riparte
        dall'Anemogramma vuoto.
        */

        azzeraAnemogramma(
            contenuto
        );


        for (
            const elemento
            of elementi
        ) {

            if (
                esecuzione !==
                anemogrammaEsecuzione
            ) {

                return;

            }


            /*
            Se siamo in pausa,
            il ciclo rimane esattamente
            nel punto raggiunto.
            */

            await attendiPausaAnemogramma();


            if (
                esecuzione !==
                anemogrammaEsecuzione
            ) {

                return;

            }


            if (
                elemento.classList.contains(
                    "anemogramma-anemomero"
                )
            ) {

                await animaAnemomeroAnemogramma(
                    elemento,
                    esecuzione
                );

            }


            if (
                elemento.classList.contains(
                    "anemogramma-apnea"
                )
            ) {

                await animaApneaAnemogramma(
                    elemento,
                    esecuzione
                );

            }

        }


        /*
        Fine Anemodromo:
        il while ricomincia automaticamente
        dal primo elemento.
        */

    }

}
function creaPannelloAnemogramma(
    sequenza = anemos31
) {
   
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
   const reset =
    document.createElement(
        "button"
    );


reset.type =
    "button";


reset.textContent =
    "↺";


reset.setAttribute(
    "aria-label",
    "Riavvia Anemogramma"
);


reset.style.fontSize =
    "24px";


reset.style.border =
    "0";


reset.style.background =
    "transparent";


reset.style.cursor =
    "pointer";
     
reset.addEventListener(
    "click",
    function () {

        /*
        Invalida immediatamente
        l'esecuzione corrente e crea
        l'identificatore della nuova.
        */

        const nuovaEsecuzione =
            ++anemogrammaEsecuzione;


        /*
        Dopo Reset l'Anemogramma
        deve restare fermo.
        */

        anemogrammaInPausa =
            true;


        /*
        Azzera tutte le barre.
        */

        azzeraAnemogramma(
            contenuto
        );


        /*
        Riporta lo scroll all'inizio.
        */

        pannello.scrollTo({

            top:
                0,

            behavior:
                "smooth"

        });


        /*
        Mostra PLAY perché
        siamo fermi.
        */

        playPausa.textContent =
            "▶";


        playPausa.setAttribute(
            "aria-label",
            "Avvia Anemogramma"
        );


        /*
        Prepara una nuova timeline
        dall'inizio, ma essendo in pausa
        resterà ferma finché non si
        preme PLAY.
        */

        eseguiTimelineAnemogramma(
            contenuto,
            nuovaEsecuzione
        );

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
    reset
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
        sequenza
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

        const esecuzione =
            ++anemogrammaEsecuzione;


        eseguiTimelineAnemogramma(
            contenuto,
            esecuzione
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
