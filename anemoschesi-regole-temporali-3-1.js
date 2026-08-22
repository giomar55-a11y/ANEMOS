/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE TEMPORALI DELL'ANEMODROMO
=========================================================

Contiene i dati iniziali utilizzati
per valutare la relazione temporale
tra gli Anemomeri di un Anemodromo.

In questa prima versione vengono considerate:

- proporzione tra durata IN ed ES
- equilibrio temporale
- prevalenza inspiratoria
- prevalenza espiratoria
- rapporto temporale rispetto all'Intento

Questo file NON esegue ancora
la valutazione dell'Anemodromo.

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_TEMPORALI_VERSIONE =
    "0.1";


/* =====================================================
   CLASSI DI RAPPORTO IN / ES
===================================================== */

/*
Il rapporto viene espresso come:

durata ES / durata IN

Esempi:

IN 4 — ES 4  -> 1.00
IN 4 — ES 6  -> 1.50
IN 4 — ES 8  -> 2.00
IN 6 — ES 3  -> 0.50
*/

const ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE = {

    IN_PREVALENTE_FORTE:
        "in_prevalente_forte",

    IN_PREVALENTE:
        "in_prevalente",

    EQUILIBRATO:
        "equilibrato",

    ES_PREVALENTE:
        "es_prevalente",

    ES_PREVALENTE_FORTE:
        "es_prevalente_forte"

};


/* =====================================================
   SOGLIE DEL RAPPORTO TEMPORALE
===================================================== */

const ANEMOSCHESI_SOGLIE_RAPPORTO_TEMPORALE = {

    inPrevalenteForteMassimo:
        0.65,

    inPrevalenteMassimo:
        0.90,

    equilibratoMassimo:
        1.15,

    esPrevalenteMassimo:
        2.00

};


/* =====================================================
   RAPPORTO TEMPORALE × INTENTO
===================================================== */

/*
Scala qualitativa:

+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole
*/

const ANEMOSCHESI_RAPPORTO_TEMPORALE_INTENTI = {

    calmare: {

        in_prevalente_forte:
            -2,

        in_prevalente:
            -1,

        equilibrato:
            1,

        es_prevalente:
            2,

        es_prevalente_forte:
            1

    },


    scaricare: {

        in_prevalente_forte:
            -1,

        in_prevalente:
            0,

        equilibrato:
            1,

        es_prevalente:
            2,

        es_prevalente_forte:
            2

    },


    recuperare: {

        in_prevalente_forte:
            -2,

        in_prevalente:
            -1,

        equilibrato:
            2,

        es_prevalente:
            2,

        es_prevalente_forte:
            1

    },


    riposare: {

        in_prevalente_forte:
            -2,

        in_prevalente:
            -1,

        equilibrato:
            1,

        es_prevalente:
            2,

        es_prevalente_forte:
            2

    },


    percepire: {

        in_prevalente_forte:
            0,

        in_prevalente:
            1,

        equilibrato:
            2,

        es_prevalente:
            1,

        es_prevalente_forte:
            0

    },


    coordinare: {

        in_prevalente_forte:
            -1,

        in_prevalente:
            1,

        equilibrato:
            2,

        es_prevalente:
            1,

        es_prevalente_forte:
            -1

    },


    mobilizzare: {

        in_prevalente_forte:
            1,

        in_prevalente:
            2,

        equilibrato:
            2,

        es_prevalente:
            1,

        es_prevalente_forte:
            0

    },


    stabilizzare: {

        in_prevalente_forte:
            -1,

        in_prevalente:
            1,

        equilibrato:
            2,

        es_prevalente:
            1,

        es_prevalente_forte:
            -1

    },


    attivare: {

        in_prevalente_forte:
            2,

        in_prevalente:
            2,

        equilibrato:
            1,

        es_prevalente:
            0,

        es_prevalente_forte:
            -1

    },


    potenziare: {

        in_prevalente_forte:
            2,

        in_prevalente:
            2,

        equilibrato:
            1,

        es_prevalente:
            0,

        es_prevalente_forte:
            -1

    },


    resistere: {

        in_prevalente_forte:
            -1,

        in_prevalente:
            1,

        equilibrato:
            2,

        es_prevalente:
            2,

        es_prevalente_forte:
            1

    },


    performare: {

        in_prevalente_forte:
            2,

        in_prevalente:
            2,

        equilibrato:
            1,

        es_prevalente:
            0,

        es_prevalente_forte:
            -1

    }

};


/* =====================================================
   PESO DELLA COMPONENTE TEMPORALE
===================================================== */

/*
Il peso definitivo verrà integrato
successivamente nella valutazione
dell'Anemodromo.

Per ora viene definito come dato separato.
*/

const ANEMOSCHESI_PESO_TEMPORALE_ANEMODROMO =
    0.20;


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole temporali caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_TEMPORALI_VERSIONE,

        intenti:
            Object.keys(
                ANEMOSCHESI_RAPPORTO_TEMPORALE_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE TEMPORALI DELL'ANEMODROMO
=========================================================
*/
