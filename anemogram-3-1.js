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
        "0 0 100 160"
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
    COLORI SETTORI
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
    Grande cerchio separato
    =====================================================
    */

    const testa =
        document.createElementNS(
            ns,
            "circle"
        );


    testa.setAttribute(
        "cx",
        "50"
    );

    testa.setAttribute(
        "cy",
        "17"
    );

    testa.setAttribute(
        "r",
        "14"
    );

    testa.setAttribute(
        "fill",
        "#fff"
    );

    testa.setAttribute(
        "stroke",
        "#000"
    );

    testa.setAttribute(
        "stroke-width",
        "3"
    );


    svg.appendChild(
        testa
    );


    /*
    =====================================================
    BRACCIO SINISTRO
    Spalla larga, gomito piegato,
    mano verso il fianco
    =====================================================
    */

    const braccioSinistro =
        document.createElementNS(
            ns,
            "path"
        );


    braccioSinistro.setAttribute(
        "d",
        [
            "M49 39",
            "C42 34 35 34 28 37",
            "C21 40 13 45 6 51",
            "C2 55 2 60 5 64",
            "L18 81",
            "C21 85 27 85 30 81",
            "C33 77 32 72 30 68",
            "L19 54",
            "L27 49",
            "C31 47 34 49 36 53"
        ].join(" ")
    );


    braccioSinistro.setAttribute(
        "fill",
        "none"
    );

    braccioSinistro.setAttribute(
        "stroke",
        "#000"
    );

    braccioSinistro.setAttribute(
        "stroke-width",
        "3"
    );

    braccioSinistro.setAttribute(
        "stroke-linecap",
        "round"
    );

    braccioSinistro.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        braccioSinistro
    );


    /*
    =====================================================
    BRACCIO DESTRO
    Simmetrico
    =====================================================
    */

    const braccioDestro =
        document.createElementNS(
            ns,
            "path"
        );


    braccioDestro.setAttribute(
        "d",
        [
            "M51 39",
            "C58 34 65 34 72 37",
            "C79 40 87 45 94 51",
            "C98 55 98 60 95 64",
            "L82 81",
            "C79 85 73 85 70 81",
            "C67 77 68 72 70 68",
            "L81 54",
            "L73 49",
            "C69 47 66 49 64 53"
        ].join(" ")
    );


    braccioDestro.setAttribute(
        "fill",
        "none"
    );

    braccioDestro.setAttribute(
        "stroke",
        "#000"
    );

    braccioDestro.setAttribute(
        "stroke-width",
        "3"
    );

    braccioDestro.setAttribute(
        "stroke-linecap",
        "round"
    );

    braccioDestro.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        braccioDestro
    );


    /*
    =====================================================
    TRE MODULI RESPIRATORI
    Identici nella forma.
    Cambia soltanto il settore evidenziato.
    =====================================================
    */

    const moduli = [

        {
            nome:
                "torace_superiore",

            x:
                34,

            y:
                39,

            width:
                32,

            height:
                19
        },

        {
            nome:
                "torace_inferiore",

            x:
                34,

            y:
                60,

            width:
                32,

            height:
                19
        },

        {
            nome:
                "addome",

            x:
                34,

            y:
                81,

            width:
                32,

            height:
                19
        }

    ];


    moduli.forEach(
        function(modulo) {

            const rettangolo =
                document.createElementNS(
                    ns,
                    "rect"
                );


            rettangolo.setAttribute(
                "x",
                String(
                    modulo.x
                )
            );

            rettangolo.setAttribute(
                "y",
                String(
                    modulo.y
                )
            );

            rettangolo.setAttribute(
                "width",
                String(
                    modulo.width
                )
            );

            rettangolo.setAttribute(
                "height",
                String(
                    modulo.height
                )
            );

            rettangolo.setAttribute(
                "rx",
                "5"
            );

            rettangolo.setAttribute(
                "ry",
                "5"
            );


            rettangolo.setAttribute(
                "fill",
                modulo.nome === settore
                    ? coloriSettori[
                        modulo.nome
                    ]
                    : "#fff"
            );


            rettangolo.setAttribute(
                "stroke",
                "#000"
            );

            rettangolo.setAttribute(
                "stroke-width",
                "3"
            );


            svg.appendChild(
                rettangolo
            );

        }
    );


    /*
    =====================================================
    GAMBA SINISTRA
    =====================================================
    */

    const gambaSinistra =
        document.createElementNS(
            ns,
            "path"
        );


    gambaSinistra.setAttribute(
        "d",
        [
            "M34 100",
            "L34 146",
            "C34 153 38 157 44 157",
            "C48 157 50 154 50 149",
            "L50 100",
            "Z"
        ].join(" ")
    );


    gambaSinistra.setAttribute(
        "fill",
        "#fff"
    );

    gambaSinistra.setAttribute(
        "stroke",
        "#000"
    );

    gambaSinistra.setAttribute(
        "stroke-width",
        "3"
    );

    gambaSinistra.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        gambaSinistra
    );


    /*
    =====================================================
    GAMBA DESTRA
    =====================================================
    */

    const gambaDestra =
        document.createElementNS(
            ns,
            "path"
        );


    gambaDestra.setAttribute(
        "d",
        [
            "M50 100",
            "L50 149",
            "C50 154 52 157 56 157",
            "C62 157 66 153 66 146",
            "L66 100",
            "Z"
        ].join(" ")
    );


    gambaDestra.setAttribute(
        "fill",
        "#fff"
    );

    gambaDestra.setAttribute(
        "stroke",
        "#000"
    );

    gambaDestra.setAttribute(
        "stroke-width",
        "3"
    );

    gambaDestra.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        gambaDestra
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
