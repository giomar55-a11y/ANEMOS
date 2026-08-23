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
   APNEA × INTENTO
===================================================== */

/*
Scala qualitativa:

+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole

La valutazione dipende da:

- posizione dell'apnea
- classe di durata relativa
*/

const ANEMOSCHESI_APNEA_INTENTI = {

    calmare: {

        post_in: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        },

        post_es: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: -1
        }

    },


    scaricare: {

        post_in: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        },

        post_es: {
            breve: 1,
            moderata: 2,
            lunga: 2,
            molto_lunga: 1
        }

    },


    recuperare: {

        post_in: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        },

        post_es: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: -1
        }

    },


    riposare: {

        post_in: {
            breve: -1,
            moderata: -2,
            lunga: -2,
            molto_lunga: -2
        },

        post_es: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: -1
        }

    },


    percepire: {

        post_in: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        },

        post_es: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        }

    },


    coordinare: {

        post_in: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        },

        post_es: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        }

    },


    mobilizzare: {

        post_in: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        },

        post_es: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        }

    },


    stabilizzare: {

        post_in: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        },

        post_es: {
            breve: 1,
            moderata: 1,
            lunga: 0,
            molto_lunga: -1
        }

    },


    attivare: {

        post_in: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: -1
        },

        post_es: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        }

    },


    potenziare: {

        post_in: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        },

        post_es: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        }

    },


    resistere: {

        post_in: {
            breve: 1,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        },

        post_es: {
            breve: 1,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        }

    },


    performare: {

        post_in: {
            breve: 2,
            moderata: 2,
            lunga: 1,
            molto_lunga: 0
        },

        post_es: {
            breve: 0,
            moderata: -1,
            lunga: -2,
            molto_lunga: -2
        }

    }

};

/* =====================================================
   ORIENTAMENTO AIN / AES × INTENTO
===================================================== */

/*
Descrive quale distribuzione complessiva
delle apnee è maggiormente coerente
con ciascun Intento.

Questa regola NON assegna ancora punteggi.

Valori:

ain
aes
equilibrata

La scelta deriva dalla diversa funzione
delle apnee post-IN e post-ES già definita
nelle regole della singola apnea.
*/

const ANEMOSCHESI_ORIENTAMENTO_APNEE_INTENTI = {

    calmare:
        "aes",

    scaricare:
        "aes",

    recuperare:
        "aes",

    riposare:
        "aes",

    percepire:
        "equilibrata",

    coordinare:
        "equilibrata",

    mobilizzare:
        "equilibrata",

    stabilizzare:
        "ain",

    attivare:
        "ain",

    potenziare:
        "ain",

    resistere:
        "equilibrata",

    performare:
        "ain"

};

/* =====================================================
   COERENZA DISTRIBUZIONE AIN / AES × INTENTO
===================================================== */

/*
Confronta la prevalenza reale delle apnee:

ain
aes
equilibrata
nessuna

con l'orientamento preferito
dall'Intento.

Non assegna ancora punteggi.
*/

function valutaOrientamentoApneePerIntentoAnemoschesi(
    distribuzioneApnee,
    intentoId
) {

    if (
        !distribuzioneApnee ||
        !intentoId
    ) {

        return null;

    }


    const orientamentoPreferito =
        ANEMOSCHESI_ORIENTAMENTO_APNEE_INTENTI[
            intentoId
        ];


    if (
        !orientamentoPreferito
    ) {

        return null;

    }


    const prevalenzaReale =
        distribuzioneApnee.prevalenza;


    if (
        !prevalenzaReale
    ) {

        return null;

    }


    let esito =
        "neutro";


    if (
        prevalenzaReale ===
        "nessuna"
    ) {

        esito =
            "assenza_apnee";

    } else if (
        prevalenzaReale ===
        orientamentoPreferito
    ) {

        esito =
            "coerente";

    } else if (
        prevalenzaReale ===
        "equilibrata" ||
        orientamentoPreferito ===
        "equilibrata"
    ) {

        esito =
            "parzialmente_coerente";

    } else {

        esito =
            "opposto";

    }


    return {

        intentoId:
            intentoId,

        orientamentoPreferito:
            orientamentoPreferito,

        prevalenzaReale:
            prevalenzaReale,

        esito:
            esito

    };

}

/* =====================================================
   PESO DELLA COMPONENTE APNEA
===================================================== */

const ANEMOSCHESI_PESO_APNEE_ANEMODROMO =
    0.15;


/* =====================================================
   VALUTAZIONE QUALITATIVA DI UNA APNEA
===================================================== */

function valutaApneaPerIntentoAnemoschesi(
    analisiApnea,
    intentoId
) {

    if (
        !analisiApnea ||
        !intentoId
    ) {

        return null;

    }


    const valore =
        ANEMOSCHESI_APNEA_INTENTI[
            intentoId
        ]?.[
            analisiApnea.posizione
        ]?.[
            analisiApnea.classeRelativa
        ];


    if (
        typeof valore !== "number"
    ) {

        return null;

    }


    return {

        ...analisiApnea,

        intentoId:
            intentoId,

        valore:
            valore,

        punteggio:
            normalizzaContributoVolumetricoAnemoschesi(
                valore
            )

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
