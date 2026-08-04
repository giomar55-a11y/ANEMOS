/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — INTENTI
=========================================================

Contiene la prima struttura stabile degli Intenti
organizzati nelle tre macroaree RESPLORA:

- Armonia
- Equalizzazione
- Espansione

Versione iniziale: 0.1

Questo file contiene esclusivamente dati.
Non modifica:
- modello respiratorio
- sequenza corrente
- Anemografo
- Anemogramma
- laboratorio ANEMOSCHESI
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_INTENTI_VERSIONE =
    "0.1";


/* =====================================================
   MACROAREE E INTENTI
===================================================== */

const ANEMOSCHESI_INTENTI = {

    armonia: {

        id:
            "armonia",

        nome:
            "Armonia",

        intenti: [

            {

                id:
                    "calmare",

                nome:
                    "Calmare"

            },

            {

                id:
                    "scaricare",

                nome:
                    "Scaricare"

            },

            {

                id:
                    "recuperare",

                nome:
                    "Recuperare"

            },

            {

                id:
                    "riposare",

                nome:
                    "Riposare"

            }

        ]

    },


    equalizzazione: {

        id:
            "equalizzazione",

        nome:
            "Equalizzazione",

        intenti: [

            {

                id:
                    "percepire",

                nome:
                    "Percepire"

            },

            {

                id:
                    "coordinare",

                nome:
                    "Coordinare"

            },

            {

                id:
                    "mobilizzare",

                nome:
                    "Mobilizzare"

            },

            {

                id:
                    "stabilizzare",

                nome:
                    "Stabilizzare"

            }

        ]

    },


    espansione: {

        id:
            "espansione",

        nome:
            "Espansione",

        intenti: [

            {

                id:
                    "attivare",

                nome:
                    "Attivare"

            },

            {

                id:
                    "potenziare",

                nome:
                    "Potenziare"

            },

            {

                id:
                    "resistere",

                nome:
                    "Resistere"

            },

            {

                id:
                    "performare",

                nome:
                    "Performare"

            }

        ]

    }

};


/* =====================================================
   ELENCO DELLE MACROAREE
===================================================== */

const ANEMOSCHESI_ELENCO_MACROAREE =
    Object.values(
        ANEMOSCHESI_INTENTI
    );


/* =====================================================
   ELENCO COMPLETO DEGLI INTENTI
===================================================== */

const ANEMOSCHESI_ELENCO_INTENTI =
    ANEMOSCHESI_ELENCO_MACROAREE
        .flatMap(
            macroarea =>
                macroarea.intenti.map(
                    intento => ({

                        ...intento,

                        macroareaId:
                            macroarea.id,

                        macroareaNome:
                            macroarea.nome

                    })
                )
        );


/* =====================================================
   RICERCA DI UNA MACROAREA
===================================================== */

function trovaMacroareaAnemoschesi(
    macroareaId
) {

    return (
        ANEMOSCHESI_INTENTI[
            macroareaId
        ]
        ||
        null
    );

}


/* =====================================================
   RICERCA DI UN INTENTO
===================================================== */

function trovaIntentoAnemoschesi(
    intentoId
) {

    return (
        ANEMOSCHESI_ELENCO_INTENTI
            .find(
                intento =>
                    intento.id ===
                    intentoId
            )
        ||
        null
    );

}


/* =====================================================
   CONTROLLO DI ESISTENZA DI UN INTENTO
===================================================== */

function intentoAnemoschesiValido(
    intentoId
) {

    return (
        trovaIntentoAnemoschesi(
            intentoId
        ) !== null
    );

}


/* =====================================================
   CONTROLLO DELLA STRUTTURA
===================================================== */

console.log(
    "ANEMOSCHESI — Intenti caricati",
    {

        versione:
            ANEMOSCHESI_INTENTI_VERSIONE,

        macroaree:
            ANEMOSCHESI_ELENCO_MACROAREE
                .length,

        intenti:
            ANEMOSCHESI_ELENCO_INTENTI
                .length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — INTENTI
=========================================================
*/
