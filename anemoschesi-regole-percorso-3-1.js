/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE DEL PERCORSO
=========================================================

Contiene esclusivamente i DATI utilizzati
per interpretare il percorso dell'Anemomero
rispetto agli Intenti.

Questo file NON esegue valutazioni.

Percorsi:

- entrambe le narici
- narice destra
- narice sinistra
- bocca

Scala qualitativa:

+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_PERCORSO_VERSIONE =
    "0.1";


/* =====================================================
   PERCORSO × INTENTO
===================================================== */

const ANEMOSCHESI_PERCORSO_INTENTI = {


    /* =================================================
       ARMONIA — CALMARE
    ================================================= */

    calmare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            0,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            -1

    },


    /* =================================================
       ARMONIA — SCARICARE
    ================================================= */

    scaricare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            1,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            0,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            2

    },


    /* =================================================
       ARMONIA — RECUPERARE
    ================================================= */

    recuperare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            0,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            -1

    },


    /* =================================================
       ARMONIA — RIPOSARE
    ================================================= */

    riposare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            -1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            2,

        [ANEMOS_PERCORSI.BOCCA]:
            -1

    },


    /* =================================================
       EQUALIZZAZIONE — PERCEPIRE
    ================================================= */

    percepire: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            0

    },


    /* =================================================
       EQUALIZZAZIONE — COORDINARE
    ================================================= */

    coordinare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            0

    },


    /* =================================================
       EQUALIZZAZIONE — MOBILIZZARE
    ================================================= */

    mobilizzare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            1,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            2

    },


    /* =================================================
       EQUALIZZAZIONE — STABILIZZARE
    ================================================= */

    stabilizzare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            0

    },


    /* =================================================
       ESPANSIONE — ATTIVARE
    ================================================= */

    attivare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            1,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            2,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            0,

        [ANEMOS_PERCORSI.BOCCA]:
            2

    },


    /* =================================================
       ESPANSIONE — POTENZIARE
    ================================================= */

    potenziare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            1,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            2,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            0,

        [ANEMOS_PERCORSI.BOCCA]:
            2

    },


    /* =================================================
       ESPANSIONE — RESISTERE
    ================================================= */

    resistere: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            2,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            1,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            1,

        [ANEMOS_PERCORSI.BOCCA]:
            0

    },


    /* =================================================
       ESPANSIONE — PERFORMARE
    ================================================= */

    performare: {

        [ANEMOS_PERCORSI.ENTRAMBE_NARICI]:
            1,

        [ANEMOS_PERCORSI.NARICE_DESTRA]:
            2,

        [ANEMOS_PERCORSI.NARICE_SINISTRA]:
            0,

        [ANEMOS_PERCORSI.BOCCA]:
            2

    }

};


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole percorso caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_PERCORSO_VERSIONE,

        intenti:
            Object.keys(
                ANEMOSCHESI_PERCORSO_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE DEL PERCORSO
=========================================================
*/
