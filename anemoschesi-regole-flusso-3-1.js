/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE DEL FLUSSO
=========================================================

Contiene esclusivamente i DATI utilizzati
per interpretare il flusso dell'Anemomero
rispetto agli Intenti.

Questo file NON esegue valutazioni.

Flussi:

- trattenuto
- delicato
- spontaneo
- forzato

Scala qualitativa:

+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole

Queste regole descrivono la relazione
tra il tipo di flusso e l'Intento.

La plausibilità fisiologica del rapporto
tra flusso, durata e variazione di volume
resta invece responsabilità di:

anemoschesi-regole-fisiologiche-3-1.js

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_FLUSSO_VERSIONE =
    "0.1";


/* =====================================================
   FLUSSO × INTENTO
===================================================== */

const ANEMOSCHESI_FLUSSO_INTENTI = {


    /* =================================================
       ARMONIA — CALMARE
    ================================================= */

    calmare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            1,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            1,

        [ANEMOS_FLUSSI.FORZATO]:
            -2

    },


    /* =================================================
       ARMONIA — SCARICARE
    ================================================= */

    scaricare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            0,

        [ANEMOS_FLUSSI.DELICATO]:
            1,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            1

    },


    /* =================================================
       ARMONIA — RECUPERARE
    ================================================= */

    recuperare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            1,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            -2

    },


    /* =================================================
       ARMONIA — RIPOSARE
    ================================================= */

    riposare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            1,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            1,

        [ANEMOS_FLUSSI.FORZATO]:
            -2

    },


    /* =================================================
       EQUALIZZAZIONE — PERCEPIRE
    ================================================= */

    percepire: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            2,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            1,

        [ANEMOS_FLUSSI.FORZATO]:
            -1

    },


    /* =================================================
       EQUALIZZAZIONE — COORDINARE
    ================================================= */

    coordinare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            1,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            0

    },


    /* =================================================
       EQUALIZZAZIONE — MOBILIZZARE
    ================================================= */

    mobilizzare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            -1,

        [ANEMOS_FLUSSI.DELICATO]:
            1,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            1

    },


    /* =================================================
       EQUALIZZAZIONE — STABILIZZARE
    ================================================= */

    stabilizzare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            2,

        [ANEMOS_FLUSSI.DELICATO]:
            2,

        [ANEMOS_FLUSSI.SPONTANEO]:
            1,

        [ANEMOS_FLUSSI.FORZATO]:
            -1

    },


    /* =================================================
       ESPANSIONE — ATTIVARE
    ================================================= */

    attivare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            -2,

        [ANEMOS_FLUSSI.DELICATO]:
            0,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            2

    },


    /* =================================================
       ESPANSIONE — POTENZIARE
    ================================================= */

    potenziare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            -1,

        [ANEMOS_FLUSSI.DELICATO]:
            0,

        [ANEMOS_FLUSSI.SPONTANEO]:
            1,

        [ANEMOS_FLUSSI.FORZATO]:
            2

    },


    /* =================================================
       ESPANSIONE — RESISTERE
    ================================================= */

    resistere: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            1,

        [ANEMOS_FLUSSI.DELICATO]:
            1,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            0

    },


    /* =================================================
       ESPANSIONE — PERFORMARE
    ================================================= */

    performare: {

        [ANEMOS_FLUSSI.TRATTENUTO]:
            -1,

        [ANEMOS_FLUSSI.DELICATO]:
            0,

        [ANEMOS_FLUSSI.SPONTANEO]:
            2,

        [ANEMOS_FLUSSI.FORZATO]:
            2

    }

};


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole flusso caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_FLUSSO_VERSIONE,

        intenti:
            Object.keys(
                ANEMOSCHESI_FLUSSO_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE DEL FLUSSO
=========================================================
*/
