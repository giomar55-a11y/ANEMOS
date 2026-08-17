/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE FISIOLOGICHE
=========================================================

Questo modulo introduce il primo livello
di controllo fisiologico dell'Anemomero.

Ordine logico:

1. plausibilità fisiologica
2. coerenza interna
3. valutazione rispetto all'Intento

Questo file NON assegna ancora punteggi
di coerenza con gli Intenti.

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_FISIOLOGICHE_VERSIONE =
    "0.1";


/* =====================================================
   LIVELLI DI ESITO
===================================================== */

const ANEMOSCHESI_ESITI_FISIOLOGICI = {

    VALIDO:
        "valido",

    ATTENZIONE:
        "attenzione",

    CRITICO:
        "critico",

    ERRORE:
        "errore"

};


/* =====================================================
   SOGLIE INIZIALI
===================================================== */

/*
ATTENZIONE:

Queste soglie sono volutamente raccolte
in un unico punto.

Non rappresentano ancora il modello
fisiologico definitivo.

Serviranno come base per costruire
le relazioni tra:

- durata
- tipo IN / ES
- flusso
- volume
- numero di settori
*/

const ANEMOSCHESI_SOGLIE_FISIOLOGICHE = {

    durata: {

        attenzione:
            8,

        critica:
            15,

        errore:
            30

    }

};


/* =====================================================
   COSTRUZIONE ESITO
===================================================== */

function creaEsitoFisiologicoAnemoschesi(
    livello,
    codice,
    messaggio
) {

    return {

        livello:
            livello,

        codice:
            codice,

        messaggio:
            messaggio

    };

}


/* =====================================================
   CONTROLLO DURATA ASSOLUTA
===================================================== */

function valutaDurataAssolutaAnemoschesi(
    anemomero
) {

    if (
        !anemomero
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "ANEMOMERO_ASSENTE",
            "Anemomero non disponibile."
        );

    }


    const durata =
        Number(
            anemomero.durata
        );


    if (
        !Number.isFinite(
            durata
        ) ||
        durata < 1
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "DURATA_NON_VALIDA",
            "Durata dell'Anemomero non valida."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .errore
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "DURATA_ESTREMA",
            "Durata fisiologicamente non plausibile."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .critica
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .CRITICO,
            "DURATA_CRITICA",
            "Durata molto elevata."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .attenzione
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ATTENZIONE,
            "DURATA_ELEVATA",
            "Durata elevata: valutare il rapporto con flusso e volume."
        );

    }


    return creaEsitoFisiologicoAnemoschesi(
        ANEMOSCHESI_ESITI_FISIOLOGICI
            .VALIDO,
        "DURATA_PLAUSIBILE",
        "Durata fisiologicamente plausibile."
    );

}


/* =====================================================
   VALUTAZIONE FISIOLOGICA DELL'ANEMOMERO
===================================================== */

function valutaFisiologiaAnemomeroAnemoschesi(
    anemomero
) {

    const controlli = [

        valutaDurataAssolutaAnemoschesi(
            anemomero
        )

    ];


    const ordineGravita = {

        valido:
            0,

        attenzione:
            1,

        critico:
            2,

        errore:
            3

    };


    const peggiore =
        controlli.reduce(
            (
                risultato,
                controllo
            ) => {

                if (
                    ordineGravita[
                        controllo.livello
                    ] >
                    ordineGravita[
                        risultato.livello
                    ]
                ) {

                    return controllo;

                }


                return risultato;

            },
            controlli[0]
        );


    return {

        valido:
            peggiore.livello !==
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,

        livello:
            peggiore.livello,

        esitoPrincipale:
            peggiore,

        controlli:
            controlli

    };

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole fisiologiche caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_FISIOLOGICHE_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE FISIOLOGICHE
=========================================================
*/
