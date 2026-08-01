/*
=====================================================
ANEMOS 3.1
LABORATORIO MOTORE DI COERENZA
=====================================================

Modulo sperimentale indipendente.

Non modifica:
- Anemografo
- Anemogramma
- modello respiratorio
- sequenza corrente

Serve esclusivamente per sviluppare
e verificare il calcolo della coerenza.
=====================================================
*/


/* =====================================================
   STATO MODULO
===================================================== */

const ANEMOS_MOTORE_TEST = {

    versione:
        "0.1",

    attivo:
        true

};


console.log(
    "Motore di Coerenza ANEMOS - laboratorio caricato",
    ANEMOS_MOTORE_TEST
);
/* =====================================================
   VALORI NUMERICI DEI VOLUMI
===================================================== */

const ANEMOS_VALORI_VOLUME = {

    vuoto:
        0,

    scarso:
        1,

    confortevole:
        2,

    abbondante:
        3,

    pieno:
        4

};
/* =====================================================
   CALCOLO CARICO RESPIRATORIO
===================================================== */

function calcolaCaricoRespiratorio(
    settori
) {

    let carico =
        0;


    settori.forEach(
        settore => {

            const iniziale =
                ANEMOS_VALORI_VOLUME[
                    settore.iniziale
                ];


            const finale =
                ANEMOS_VALORI_VOLUME[
                    settore.finale
                ];


            carico +=
                Math.abs(
                    finale -
                    iniziale
                );

        }
    );


    return carico;

}
/* =====================================================
   TEST CARICO RESPIRATORIO
===================================================== */

const testCarico =
    calcolaCaricoRespiratorio([

        {
            iniziale: "vuoto",
            finale: "confortevole"
        },

        {
            iniziale: "scarso",
            finale: "abbondante"
        }

    ]);


console.log(
    "Carico respiratorio:",
    testCarico
);
