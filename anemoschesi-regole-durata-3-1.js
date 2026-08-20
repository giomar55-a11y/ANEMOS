/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE DELLA DURATA
=========================================================

Contiene esclusivamente i DATI utilizzati
per interpretare la durata dell'Anemomero
rispetto agli Intenti.

Questo file NON esegue valutazioni.

La durata viene interpretata distinguendo:

- IN
- ES

e quattro fasce:

- breve       = 1–2 s
- moderata    = 3–4 s
- lunga       = 5–6 s
- molto_lunga = 7 s o più

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

const ANEMOSCHESI_REGOLE_DURATA_VERSIONE =
    "0.1";


/* =====================================================
   FASCE DI DURATA
===================================================== */

const ANEMOSCHESI_FASCE_DURATA = {

    BREVE:
        "breve",

    MODERATA:
        "moderata",

    LUNGA:
        "lunga",

    MOLTO_LUNGA:
        "molto_lunga"

};


/* =====================================================
   LIMITI DELLE FASCE
===================================================== */

const ANEMOSCHESI_LIMITI_DURATA = {

    breveMassimo:
        2,

    moderataMassimo:
        4,

    lungaMassimo:
        6

};


/* =====================================================
   DURATA × INTENTO × TIPO
===================================================== */

const ANEMOSCHESI_DURATA_INTENTI = {


    /* =================================================
       ARMONIA — CALMARE
    ================================================= */

    calmare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                -1,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                -2,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                2

        }

    },


    /* =================================================
       ARMONIA — SCARICARE
    ================================================= */

    scaricare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                0,

            moderata:
                1,

            lunga:
                1,

            molto_lunga:
                0

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                -1,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                2

        }

    },


    /* =================================================
       ARMONIA — RECUPERARE
    ================================================= */

    recuperare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                -1,

            moderata:
                2,

            lunga:
                2,

            molto_lunga:
                1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                -1,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                2

        }

    },


    /* =================================================
       ARMONIA — RIPOSARE
    ================================================= */

    riposare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                -2,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                -2,

            moderata:
                1,

            lunga:
                2,

            molto_lunga:
                2

        }

    },


    /* =================================================
       EQUALIZZAZIONE — PERCEPIRE
    ================================================= */

    percepire: {

        [ANEMOS_TIPI.IN]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                2,

            molto_lunga:
                1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                2,

            molto_lunga:
                1

        }

    },


    /* =================================================
       EQUALIZZAZIONE — COORDINARE
    ================================================= */

    coordinare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                0

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                0

        }

    },


    /* =================================================
       EQUALIZZAZIONE — MOBILIZZARE
    ================================================= */

    mobilizzare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                0

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                0

        }

    },


    /* =================================================
       EQUALIZZAZIONE — STABILIZZARE
    ================================================= */

    stabilizzare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                -1,

            moderata:
                2,

            lunga:
                2,

            molto_lunga:
                1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                -1,

            moderata:
                2,

            lunga:
                2,

            molto_lunga:
                1

        }

    },


    /* =================================================
       ESPANSIONE — ATTIVARE
    ================================================= */

    attivare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                2,

            moderata:
                2,

            lunga:
                0,

            molto_lunga:
                -1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                2,

            moderata:
                1,

            lunga:
                -1,

            molto_lunga:
                -2

        }

    },


    /* =================================================
       ESPANSIONE — POTENZIARE
    ================================================= */

    potenziare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                -1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                0,

            molto_lunga:
                -1

        }

    },


    /* =================================================
       ESPANSIONE — RESISTERE
    ================================================= */

    resistere: {

        [ANEMOS_TIPI.IN]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                -1

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                0,

            moderata:
                2,

            lunga:
                1,

            molto_lunga:
                -1

        }

    },


    /* =================================================
       ESPANSIONE — PERFORMARE
    ================================================= */

    performare: {

        [ANEMOS_TIPI.IN]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                0,

            molto_lunga:
                -2

        },

        [ANEMOS_TIPI.ES]: {

            breve:
                1,

            moderata:
                2,

            lunga:
                0,

            molto_lunga:
                -2

        }

    }

};


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole durata caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_DURATA_VERSIONE,

        intenti:
            Object.keys(
                ANEMOSCHESI_DURATA_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE DELLA DURATA
=========================================================
*/
