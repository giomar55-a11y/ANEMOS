/*
=========================================================
ANEMOS 3.1
MODELLO DATI
=========================================================

ANEMODROMO
- tipo: inspiratorio / espiratorio
- durata: secondi interi
- percorso
- flusso
- settori attivi
- volume percettivo indipendente per ogni settore

APNEA
- elemento temporale separato
- può essere inserita tra due Anemodromi
- durata espressa in secondi interi

=========================================================
*/


/* =====================================================
   TIPO DI ANEMODROMO
===================================================== */

const ANEMOS_TIPI = {
    IN: "IN",
    ES: "ES"
};



/* =====================================================
   PERCORSO DELL'ARIA
===================================================== */

const ANEMOS_PERCORSI = {
    NARICE_DESTRA: "narice_destra",
    NARICE_SINISTRA: "narice_sinistra",
    ENTRAMBE_NARICI: "entrambe_narici",
    BOCCA: "bocca"
};



/* =====================================================
   FLUSSO
===================================================== */

const ANEMOS_FLUSSI = {
    TRATTENUTO: "trattenuto",
    DELICATO: "delicato",
    SPONTANEO: "spontaneo",
    FORZATO: "forzato"
};


const ANEMOS_ICONE_FLUSSO = {
    trattenuto: "🕸️",
    delicato: "☁️",
    spontaneo: "💨",
    forzato: "🌪️"
};



/* =====================================================
   SETTORI RESPIRATORI
===================================================== */

const ANEMOS_SETTORI = {
    ADDOME: "addome",
    TORACE_INFERIORE: "torace_inferiore",
    TORACE_SUPERIORE: "torace_superiore"
};



/* =====================================================
   VOLUME PERCETTIVO
===================================================== */

/*
Il VOLUME non rappresenta una quantità numerica
di aria.

Rappresenta la condizione percettiva verso cui
viene portato il singolo settore.

INSPIRAZIONE:

BASSO
= riempimento volutamente contenuto.

CONFORTEVOLE
= riempimento fino a una sensazione confortevole.

PIENO
= riempimento fino alla sensazione di massima
  espansione raggiungibile.


ESPIRAZIONE:

BASSO
= svuotamento volutamente contenuto.

CONFORTEVOLE
= svuotamento fino a una sensazione confortevole.

VUOTO
= svuotamento fino alla sensazione di massimo
  svuotamento raggiungibile.
*/


const ANEMOS_VOLUMI = {

    BASSO: "basso",

    CONFORTEVOLE: "confortevole",

    PIENO: "pieno",

    VUOTO: "vuoto"

};



/* =====================================================
   VOLUMI DISPONIBILI SECONDO IL TIPO
===================================================== */

function ottieniVolumiPerTipo(tipo) {

    if (tipo === ANEMOS_TIPI.ES) {

        return [
            ANEMOS_VOLUMI.BASSO,
            ANEMOS_VOLUMI.CONFORTEVOLE,
            ANEMOS_VOLUMI.VUOTO
        ];

    }


    return [
        ANEMOS_VOLUMI.BASSO,
        ANEMOS_VOLUMI.CONFORTEVOLE,
        ANEMOS_VOLUMI.PIENO
    ];

}



/* =====================================================
   VOLUME PREDEFINITO
===================================================== */

function volumePredefinitoPerTipo(tipo) {

    return ANEMOS_VOLUMI.CONFORTEVOLE;

}



/* =====================================================
   CONTROLLO VALIDITÀ VOLUME
===================================================== */

function volumeValidoPerTipo(
    tipo,
    volume
) {

    return ottieniVolumiPerTipo(tipo)
        .includes(volume);

}



/* =====================================================
   UTILITÀ
===================================================== */

function creaId(prefisso = "elemento") {

    return (
        prefisso +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}



function normalizzaSecondi(
    valore,
    minimo = 0
) {

    const numero = Number(valore);

    if (!Number.isFinite(numero)) {
        return minimo;
    }

    return Math.max(
        minimo,
        Math.round(numero)
    );

}



/* =====================================================
   SETTORE RESPIRATORIO
===================================================== */

function creaSettore(
    nome,
    volume = ANEMOS_VOLUMI.CONFORTEVOLE
) {

    return {
        nome: nome,
        volume: volume
    };

}



/* =====================================================
   ANEMODROMO
===================================================== */

function creaAnemodromo(
    tipo = ANEMOS_TIPI.IN
) {

    return {

        id: creaId(
            "anemodromo"
        ),

        tipo: tipo,

        durata: 1,

        percorso:
            ANEMOS_PERCORSI
                .ENTRAMBE_NARICI,

        flusso:
            ANEMOS_FLUSSI
                .SPONTANEO,

        settori: []

    };

}



/* =====================================================
   GESTIONE SETTORI
===================================================== */

function settoreAttivo(
    anemodromo,
    nomeSettore
) {

    return anemodromo
        .settori
        .some(
            settore =>
                settore.nome ===
                nomeSettore
        );

}



function attivaSettore(
    anemodromo,
    nomeSettore,
    volume = null
) {

    if (
        settoreAttivo(
            anemodromo,
            nomeSettore
        )
    ) {

        return anemodromo;

    }


    const volumeIniziale =
        volume ||
        volumePredefinitoPerTipo(
            anemodromo.tipo
        );


    anemodromo.settori.push(

        creaSettore(
            nomeSettore,
            volumeIniziale
        )

    );


    return anemodromo;

}



function disattivaSettore(
    anemodromo,
    nomeSettore
) {

    anemodromo.settori =
        anemodromo.settori.filter(
            settore =>
                settore.nome !==
                nomeSettore
        );


    return anemodromo;

}



/* =====================================================
   MODIFICA VOLUME DEL SETTORE
===================================================== */

function impostaVolumeSettore(
    anemodromo,
    nomeSettore,
    volume
) {

    if (
        !volumeValidoPerTipo(
            anemodromo.tipo,
            volume
        )
    ) {

        return false;

    }


    const settore =
        anemodromo.settori.find(
            elemento =>
                elemento.nome ===
                nomeSettore
        );


    if (!settore) {
        return false;
    }


    settore.volume =
        volume;


    return true;

}



/* =====================================================
   MODIFICA TIPO
===================================================== */

/*
Quando un Anemodromo cambia da IN a ES
o viceversa, eventuali valori incompatibili
vengono convertiti.

PIENO → VUOTO
quando IN diventa ES.

VUOTO → PIENO
quando ES diventa IN.

BASSO e CONFORTEVOLE restano invariati.
*/

function impostaTipo(
    anemodromo,
    tipo
) {

    const vecchioTipo =
        anemodromo.tipo;


    if (vecchioTipo === tipo) {

        return anemodromo;

    }


    anemodromo.tipo =
        tipo;


    anemodromo.settori.forEach(
        settore => {

            if (
                tipo ===
                    ANEMOS_TIPI.ES &&
                settore.volume ===
                    ANEMOS_VOLUMI.PIENO
            ) {

                settore.volume =
                    ANEMOS_VOLUMI.VUOTO;

            }


            if (
                tipo ===
                    ANEMOS_TIPI.IN &&
                settore.volume ===
                    ANEMOS_VOLUMI.VUOTO
            ) {

                settore.volume =
                    ANEMOS_VOLUMI.PIENO;

            }

        }
    );


    return anemodromo;

}



/* =====================================================
   DURATA
===================================================== */

function impostaDurata(
    anemodromo,
    secondi
) {

    anemodromo.durata =
        normalizzaSecondi(
            secondi,
            1
        );


    return anemodromo;

}



/* =====================================================
   PERCORSO
===================================================== */

function impostaPercorso(
    anemodromo,
    percorso
) {

    anemodromo.percorso =
        percorso;


    return anemodromo;

}



/* =====================================================
   FLUSSO
===================================================== */

function impostaFlusso(
    anemodromo,
    flusso
) {

    anemodromo.flusso =
        flusso;


    return anemodromo;

}



/* =====================================================
   APNEA
===================================================== */

function creaApnea(
    anemodromoPrecedenteId,
    anemodromoSuccessivoId,
    durata = 1
) {

    return {

        id:
            creaId(
                "apnea"
            ),

        precedente:
            anemodromoPrecedenteId,

        successivo:
            anemodromoSuccessivoId,

        durata:
            normalizzaSecondi(
                durata,
                1
            )

    };

}



/* =====================================================
   SEQUENZA ANEMOS
===================================================== */

function creaSequenzaAnemos() {

    return {

        id:
            creaId(
                "sequenza"
            ),

        anemodromi: [],

        ordine: [],

        apnee: []

    };

}



/* =====================================================
   AGGIUNTA ANEMODROMO
===================================================== */

function aggiungiAnemodromo(
    sequenza,
    anemodromo
) {

    sequenza.anemodromi.push(
        anemodromo
    );

    sequenza.ordine.push(
        anemodromo.id
    );


    return anemodromo;

}



/* =====================================================
   RICERCA ANEMODROMO
===================================================== */

function trovaAnemodromo(
    sequenza,
    id
) {

    return (
        sequenza.anemodromi.find(
            anemodromo =>
                anemodromo.id === id
        ) || null
    );

}



/* =====================================================
   RICERCA APNEA
===================================================== */

function trovaApneaTra(
    sequenza,
    precedenteId,
    successivoId
) {

    return (
        sequenza.apnee.find(
            apnea =>
                apnea.precedente ===
                    precedenteId &&
                apnea.successivo ===
                    successivoId
        ) || null
    );

}



/* =====================================================
   INSERIMENTO APNEA
===================================================== */

function inserisciApnea(
    sequenza,
    precedenteId,
    successivoId,
    durata = 1
) {

    const esistente =
        trovaApneaTra(
            sequenza,
            precedenteId,
            successivoId
        );


    if (esistente) {

        esistente.durata =
            normalizzaSecondi(
                durata,
                1
            );


        return esistente;

    }


    const apnea =
        creaApnea(
            precedenteId,
            successivoId,
            durata
        );


    sequenza.apnee.push(
        apnea
    );


    return apnea;

}



/* =====================================================
   RIMOZIONE APNEA
===================================================== */

function rimuoviApnea(
    sequenza,
    precedenteId,
    successivoId
) {

    sequenza.apnee =
        sequenza.apnee.filter(
            apnea =>
                !(
                    apnea.precedente ===
                        precedenteId &&
                    apnea.successivo ===
                        successivoId
                )
        );

}



/* =====================================================
   ELIMINAZIONE ANEMODROMO
===================================================== */

function eliminaAnemodromo(
    sequenza,
    anemodromoId
) {

    sequenza.anemodromi =
        sequenza.anemodromi.filter(
            elemento =>
                elemento.id !==
                anemodromoId
        );


    sequenza.ordine =
        sequenza.ordine.filter(
            id =>
                id !==
                anemodromoId
        );


    sequenza.apnee =
        sequenza.apnee.filter(
            apnea =>
                apnea.precedente !==
                    anemodromoId &&
                apnea.successivo !==
                    anemodromoId
        );

}



/* =====================================================
   ANEMODROMI ORDINATI
===================================================== */

function ottieniAnemodromiOrdinati(
    sequenza
) {

    return sequenza.ordine

        .map(
            id =>
                trovaAnemodromo(
                    sequenza,
                    id
                )
        )

        .filter(Boolean);

}



/* =====================================================
   VALIDAZIONE ANEMODROMO
===================================================== */

function validaAnemodromo(
    anemodromo
) {

    const errori = [];


    if (
        anemodromo.tipo !==
            ANEMOS_TIPI.IN &&
        anemodromo.tipo !==
            ANEMOS_TIPI.ES
    ) {

        errori.push(
            "Tipo di Anemodromo non valido."
        );

    }


    if (
        !Number.isInteger(
            anemodromo.durata
        ) ||
        anemodromo.durata < 1
    ) {

        errori.push(
            "La durata deve essere espressa in secondi interi."
        );

    }


    if (
        anemodromo.settori.length ===
        0
    ) {

        errori.push(
            "Deve essere selezionato almeno un settore."
        );

    }


    anemodromo.settori.forEach(
        settore => {

            if (
                !volumeValidoPerTipo(
                    anemodromo.tipo,
                    settore.volume
                )
            ) {

                errori.push(
                    "Volume non compatibile con il tipo di Anemodromo."
                );

            }

        }
    );


    return {

        valido:
            errori.length === 0,

        errori:
            errori

    };

}



/* =====================================================
   STATO INIZIALE
===================================================== */

const anemos31 =
    creaSequenzaAnemos();



/*
=========================================================
FINE MODELLO ANEMOS 3.1
=========================================================
*/
