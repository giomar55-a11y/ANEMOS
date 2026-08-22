/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE DELLE APNEE
=========================================================

Definisce il primo livello di interpretazione
delle apnee presenti nell'Anemodromo.

Considera:

- posizione dell'apnea
- durata assoluta
- rapporto con la durata dell'Anemomero precedente
- carico relativo iniziale

Questo file NON modifica ancora
il punteggio ANEMOSCHESI.

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_APNEE_VERSIONE =
    "0.1";


/* =====================================================
   POSIZIONI DELL'APNEA
===================================================== */

const ANEMOSCHESI_POSIZIONI_APNEA = {

    POST_IN:
        "post_in",

    POST_ES:
        "post_es",

    NON_DETERMINATA:
        "non_determinata"

};


/* =====================================================
   CLASSI DI DURATA RELATIVA
===================================================== */

/*
Rapporto:

durata apnea / durata Anemomero precedente

Esempi:

Anemomero 4 s + apnea 2 s -> 0.50
Anemomero 4 s + apnea 4 s -> 1.00
Anemomero 4 s + apnea 8 s -> 2.00
*/

const ANEMOSCHESI_CLASSI_APNEA_RELATIVA = {

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
   SOGLIE RELATIVE
===================================================== */

const ANEMOSCHESI_SOGLIE_APNEA_RELATIVA = {

    breveMassimo:
        0.50,

    moderataMassimo:
        1.00,

    lungaMassimo:
        1.75

};


/* =====================================================
   CLASSIFICAZIONE DELLA DURATA RELATIVA
===================================================== */

function classificaDurataRelativaApneaAnemoschesi(
    rapporto
) {

    if (
        typeof rapporto !== "number" ||
        !Number.isFinite(
            rapporto
        ) ||
        rapporto < 0
    ) {

        return null;

    }


    if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_APNEA_RELATIVA
            .breveMassimo
    ) {

        return ANEMOSCHESI_CLASSI_APNEA_RELATIVA
            .BREVE;

    }


    if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_APNEA_RELATIVA
            .moderataMassimo
    ) {

        return ANEMOSCHESI_CLASSI_APNEA_RELATIVA
            .MODERATA;

    }


    if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_APNEA_RELATIVA
            .lungaMassimo
    ) {

        return ANEMOSCHESI_CLASSI_APNEA_RELATIVA
            .LUNGA;

    }


    return ANEMOSCHESI_CLASSI_APNEA_RELATIVA
        .MOLTO_LUNGA;

}


/* =====================================================
   RICONOSCIMENTO POSIZIONE
===================================================== */

function riconosciPosizioneApneaAnemoschesi(
    anemomeroPrecedente
) {

    if (
        !anemomeroPrecedente
    ) {

        return ANEMOSCHESI_POSIZIONI_APNEA
            .NON_DETERMINATA;

    }


    if (
        anemomeroPrecedente.tipo ===
        ANEMOS_TIPI.IN
    ) {

        return ANEMOSCHESI_POSIZIONI_APNEA
            .POST_IN;

    }


    if (
        anemomeroPrecedente.tipo ===
        ANEMOS_TIPI.ES
    ) {

        return ANEMOSCHESI_POSIZIONI_APNEA
            .POST_ES;

    }


    return ANEMOSCHESI_POSIZIONI_APNEA
        .NON_DETERMINATA;

}


/* =====================================================
   ANALISI DI UNA SINGOLA APNEA
===================================================== */

function analizzaApneaAnemoschesi(
    apnea,
    anemomeroPrecedente
) {

    if (
        !apnea ||
        !anemomeroPrecedente
    ) {

        return null;

    }


    const durataApnea =
        Number(
            apnea.durata
        );


    const durataPrecedente =
        Number(
            anemomeroPrecedente.durata
        );


    if (
        !Number.isFinite(
            durataApnea
        ) ||
        !Number.isFinite(
            durataPrecedente
        ) ||
        durataApnea < 0 ||
        durataPrecedente <= 0
    ) {

        return null;

    }


    const rapporto =
        durataApnea /
        durataPrecedente;


    const posizione =
        riconosciPosizioneApneaAnemoschesi(
            anemomeroPrecedente
        );


    const classeRelativa =
        classificaDurataRelativaApneaAnemoschesi(
            rapporto
        );


    return {

        apneaId:
            apnea.id ?? null,

        anemomeroPrecedenteId:
            anemomeroPrecedente.id ?? null,

        posizione:
            posizione,

        durataApnea:
            durataApnea,

        durataPrecedente:
            durataPrecedente,

        rapporto:
            Number(
                rapporto.toFixed(
                    2
                )
            ),

        classeRelativa:
            classeRelativa

    };

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole apnee caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_APNEE_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE DELLE APNEE
=========================================================
*/
