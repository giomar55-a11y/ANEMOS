/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — PROFILI DEGLI INTENTI
=========================================================

Definisce le caratteristiche respiratorie
associate alla prima versione degli Intenti.

Questo file non valuta ancora la respirazione
e non assegna punteggi.

Fornisce ad ANEMOSCHESI i profili
con cui confrontare Anemomeri e Anemodromi.

Dipende da:
anemoschesi-intenti-3-1.js

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_PROFILI_INTENTI_VERSIONE =
    "0.1";


/* =====================================================
   DESCRITTORI RESPIRATORI
===================================================== */

const ANEMOSCHESI_DESCRITTORI = {

    LENTO:
        "lento",

    RAPIDO:
        "rapido",

    CONTINUO:
        "continuo",

    INTERMITTENTE:
        "intermittente",

    DELICATO:
        "delicato",

    MODERATO:
        "moderato",

    INTENSO:
        "intenso",

    LOCALIZZATO:
        "localizzato",

    REGIONALE:
        "regionale",

    GLOBALE:
        "globale",

    ESPANSIVO:
        "espansivo",

    COMPRESSIVO:
        "compressivo",

    STABILIZZANTE:
        "stabilizzante",

    MOBILIZZANTE:
        "mobilizzante",

    ECONOMICO:
        "economico",

    DISPENDIOSO:
        "dispendioso",

    RILASSANTE:
        "rilassante",

    ATTIVANTE:
        "attivante",

    NEUTRO:
        "neutro",

    SEMPLICE:
        "semplice",

    COMPLESSO:
        "complesso",

    PROGRESSIVO:
        "progressivo",

    EQUILIBRATO:
        "equilibrato",

    SBILANCIATO:
        "sbilanciato",

    VARIABILE:
        "variabile",

    FLUIDO:
        "fluido",

    DINAMICO:
        "dinamico",
  
    STATICO:
    "statico",

    RIPETITIVO:
        "ripetitivo",

    OMOGENEO:
        "omogeneo"

};

/* =====================================================
   ANDAMENTI DELLE TRANSIZIONI
===================================================== */

/*
Descrive l'evoluzione di una grandezza
tra Anemomeri consecutivi.

Utilizzato per:

- carico
- durata
*/

const ANEMOSCHESI_ANDAMENTI_TRANSIZIONE = {

    CRESCENTE:
        "crescente",

    DECRESCENTE:
        "decrescente",

    STABILE:
        "stabile",

    VARIABILE:
        "variabile"

};

/* =====================================================
   TRANSIZIONI × INTENTO
===================================================== */

/*
Definisce gli andamenti di carico e durata
preferiti per ciascun Intento.

Questa prima versione viene introdotta
progressivamente, Intento per Intento.

Non assegna ancora punteggi.
*/

const ANEMOSCHESI_TRANSIZIONI_INTENTI = {

    calmare: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

    },

       scaricare: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

    },

       recuperare: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

   },

    riposare: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

    },

    percepire: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

    },

    coordinare: {

        carico: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .DECRESCENTE
            ]

        },

        durata: {

            preferiti: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .STABILE,

                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .CRESCENTE
            ],

            sconsigliati: [
                ANEMOSCHESI_ANDAMENTI_TRANSIZIONE
                    .VARIABILE
            ]

        }

    } 

};

/* =====================================================
   PROFILI DEGLI INTENTI
===================================================== */

const ANEMOSCHESI_PROFILI_INTENTI = {

    calmare: {

        intentoId:
            "calmare",

        macroareaId:
            "armonia",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.LENTO,

            ANEMOSCHESI_DESCRITTORI.CONTINUO,

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.ECONOMICO,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.SEMPLICE,

            ANEMOSCHESI_DESCRITTORI.FLUIDO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO,

            ANEMOSCHESI_DESCRITTORI.ATTIVANTE

        ]

    },


    scaricare: {

        intentoId:
            "scaricare",

        macroareaId:
            "armonia",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.MOBILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.PROGRESSIVO,

            ANEMOSCHESI_DESCRITTORI.FLUIDO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.INTERMITTENTE,

            ANEMOSCHESI_DESCRITTORI.COMPRESSIVO,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO

        ]

    },


    recuperare: {

        intentoId:
            "recuperare",

        macroareaId:
            "armonia",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.LENTO,

            ANEMOSCHESI_DESCRITTORI.CONTINUO,

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.ECONOMICO,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.EQUILIBRATO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO

        ]

    },


    riposare: {

        intentoId:
            "riposare",

        macroareaId:
            "armonia",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.LENTO,

            ANEMOSCHESI_DESCRITTORI.CONTINUO,

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.ECONOMICO,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.RIPETITIVO,

            ANEMOSCHESI_DESCRITTORI.OMOGENEO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.VARIABILE,

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.ATTIVANTE

        ]

    },


    percepire: {

        intentoId:
            "percepire",

        macroareaId:
            "equalizzazione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.LENTO,

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.LOCALIZZATO,

            ANEMOSCHESI_DESCRITTORI.REGIONALE,

            ANEMOSCHESI_DESCRITTORI.NEUTRO,

            ANEMOSCHESI_DESCRITTORI.SEMPLICE

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.COMPLESSO

        ]

    },


    coordinare: {

        intentoId:
            "coordinare",

        macroareaId:
            "equalizzazione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.REGIONALE,

            ANEMOSCHESI_DESCRITTORI.STABILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.PROGRESSIVO,

            ANEMOSCHESI_DESCRITTORI.EQUILIBRATO,

            ANEMOSCHESI_DESCRITTORI.FLUIDO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.INTERMITTENTE,

            ANEMOSCHESI_DESCRITTORI.SBILANCIATO

        ]

    },


    mobilizzare: {

        intentoId:
            "mobilizzare",

        macroareaId:
            "equalizzazione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.REGIONALE,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.ESPANSIVO,

            ANEMOSCHESI_DESCRITTORI.MOBILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.PROGRESSIVO,

            ANEMOSCHESI_DESCRITTORI.VARIABILE

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.COMPRESSIVO,

            ANEMOSCHESI_DESCRITTORI.RIPETITIVO

        ]

    },


    stabilizzare: {

        intentoId:
            "stabilizzare",

        macroareaId:
            "equalizzazione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.REGIONALE,

            ANEMOSCHESI_DESCRITTORI.STABILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.ECONOMICO,

            ANEMOSCHESI_DESCRITTORI.EQUILIBRATO,

            ANEMOSCHESI_DESCRITTORI.OMOGENEO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO,

            ANEMOSCHESI_DESCRITTORI.VARIABILE

        ]

    },


    attivare: {

        intentoId:
            "attivare",

        macroareaId:
            "espansione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.ESPANSIVO,

            ANEMOSCHESI_DESCRITTORI.ATTIVANTE,

            ANEMOSCHESI_DESCRITTORI.DINAMICO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.LENTO,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.RIPETITIVO

        ]

    },


    potenziare: {

        intentoId:
            "potenziare",

        macroareaId:
            "espansione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.ESPANSIVO,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO,

            ANEMOSCHESI_DESCRITTORI.ATTIVANTE,

            ANEMOSCHESI_DESCRITTORI.PROGRESSIVO,

            ANEMOSCHESI_DESCRITTORI.DINAMICO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.STATICO

        ]

    },


    resistere: {

        intentoId:
            "resistere",

        macroareaId:
            "espansione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.CONTINUO,

            ANEMOSCHESI_DESCRITTORI.MODERATO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.ECONOMICO,

            ANEMOSCHESI_DESCRITTORI.STABILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.RIPETITIVO,

            ANEMOSCHESI_DESCRITTORI.OMOGENEO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.INTERMITTENTE,

            ANEMOSCHESI_DESCRITTORI.DISPENDIOSO,

            ANEMOSCHESI_DESCRITTORI.VARIABILE

        ]

    },


    performare: {

        intentoId:
            "performare",

        macroareaId:
            "espansione",

        preferiti: [

            ANEMOSCHESI_DESCRITTORI.RAPIDO,

            ANEMOSCHESI_DESCRITTORI.INTENSO,

            ANEMOSCHESI_DESCRITTORI.GLOBALE,

            ANEMOSCHESI_DESCRITTORI.STABILIZZANTE,

            ANEMOSCHESI_DESCRITTORI.ATTIVANTE,

            ANEMOSCHESI_DESCRITTORI.COMPLESSO,

            ANEMOSCHESI_DESCRITTORI.DINAMICO

        ],

        sconsigliati: [

            ANEMOSCHESI_DESCRITTORI.RILASSANTE,

            ANEMOSCHESI_DESCRITTORI.DELICATO,

            ANEMOSCHESI_DESCRITTORI.STATICO

        ]

    }

};


/* =====================================================
   RICERCA DEL PROFILO DI UN INTENTO
===================================================== */

function trovaProfiloIntentoAnemoschesi(
    intentoId
) {

    return (
        ANEMOSCHESI_PROFILI_INTENTI[
            intentoId
        ]
        ||
        null
    );

}


/* =====================================================
   CONTROLLO DEL PROFILO
===================================================== */

function profiloIntentoAnemoschesiValido(
    intentoId
) {

    return (
        trovaProfiloIntentoAnemoschesi(
            intentoId
        ) !== null
    );

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Profili Intenti caricati",
    {

        versione:
            ANEMOSCHESI_PROFILI_INTENTI_VERSIONE,

        profili:
            Object.keys(
                ANEMOSCHESI_PROFILI_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — PROFILI DEGLI INTENTI
=========================================================
*/
