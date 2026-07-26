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
        creaElementoAnemogramma(
            "div",
            "anemogramma-volume",
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
        creaElementoAnemogramma(
            "div",
            "anemogramma-percorso",
            dati.percorso
        );


    const flusso =
        creaElementoAnemogramma(
            "div",
            "anemogramma-flusso",
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
