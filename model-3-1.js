/*
=========================================================
ANEMOS 3.1
MODELLO DATI
=========================================================

Struttura fondamentale:

ANEMODROMO
- tipo: inspiratorio / espiratorio
- durata: secondi interi
- percorso
- flusso
- settori attivi
- volume indipendente per ogni settore

APNEA
- elemento temporale separato
- può essere inserita tra due Anemodromi
- durata espressa in secondi interi

=========================================================
*/


/* =====================================================
   VALORI DISPONIBILI
===================================================== */


/*
TIPO DI ANEMODROMO
*/

const ANEMOS_TIPI = {
    IN: "IN",
    ES: "ES"
};


/*
PERCORSO DELL'ARIA

IN:
indica da dove entra l'aria.

ES:
indica da dove esce l'aria.
*/

const ANEMOS_PERCORSI = {
    NARICE_DESTRA: "narice_destra",
    NARICE_SINISTRA: "narice_sinistra",
    ENTRAMBE_NARICI: "entrambe_narici",
    BOCCA: "bocca"
};


/*
FLUSSO

Il flusso è unico per tutto l'Anemodromo
e quindi comune a tutti i settori attivi.
*/

const ANEMOS_FLUSSI = {
    TRATTENUTO: "trattenuto",
    DELICATO: "delicato",
    SPONTANEO: "spontaneo",
    FORZATO: "forzato"
};


/*
ICONE UFFICIALI DEL FLUSSO
*/

const ANEMOS_ICONE_FLUSSO = {
    trattenuto: "🕸️",
    delicato: "☁️",
    spontaneo: "💨",
    forzato: "🌪️"
};


/*
SETTORI RESPIRATORI
*/

const ANEMOS_SETTORI = {
    ADDOME: "addome",
    TORACE_INFERIORE: "torace_inferiore",
    TORACE_SUPERIORE: "torace_superiore"
};


/*
VOLUME

Il volume appartiene al singolo settore.

Settori differenti dello stesso Anemodromo
possono quindi avere volumi differenti.
*/

const ANEMOS_VOLUMI = {
    RIDOTTO: "ridotto",
    NATURALE: "naturale",
    COMPLETO: "completo"
};



/* =====================================================
   UTILITÀ
===================================================== */


/*
Genera un identificatore semplice.

Serve per distinguere Anemodromi e apnee
anche quando vengono spostati o modificati.
*/

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


/*
Converte un valore in secondi interi.

Non sono ammesse frazioni di secondo.
*/

function normalizzaSecondi(valore, minimo = 0) {

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


/*
Crea un settore attivo.

Ogni settore possiede il proprio volume.
*/

function creaSettore(
    nome,
    volume = ANEMOS_VOLUMI.NATURALE
) {

    return {
        nome: nome,
        volume: volume
    };

}



/* =====================================================
   ANEMODROMO
===================================================== */


/*
Crea un nuovo Anemodromo.

Non imponiamo settori di default:
sarà l'utente a scegliere quali settori
devono partecipare all'Anemodromo.

La durata minima è 1 secondo.
*/

function creaAnemodromo(
    tipo = ANEMOS_TIPI.IN
) {

    return {

        id: creaId("anemodromo"),

        tipo: tipo,

        durata: 1,

        percorso:
            ANEMOS_PERCORSI.ENTRAMBE_NARICI,

        flusso:
            ANEMOS_FLUSSI.SPONTANEO,

        settori: []

    };

}



/* =====================================================
   GESTIONE SETTORI DELL'ANEMODROMO
===================================================== */


/*
Verifica se un settore è già attivo.
*/

function settoreAttivo(
    anemodromo,
    nomeSettore
) {

    return anemodromo.settori.some(
        settore =>
            settore.nome === nomeSettore
    );

}


/*
Attiva un settore.

Se il settore è già presente
non viene duplicato.
*/

function attivaSettore(
    anemodromo,
    nomeSettore,
    volume = ANEMOS_VOLUMI.NATURALE
) {

    if (
        settoreAttivo(
            anemodromo,
            nomeSettore
        )
    ) {
        return anemodromo;
    }

    anemodromo.settori.push(
        creaSettore(
            nomeSettore,
            volume
        )
    );

    return anemodromo;

}


/*
Disattiva un settore.
*/

function disattivaSettore(
    anemodromo,
    nomeSettore
) {

    anemodromo.settori =
        anemodromo.settori.filter(
            settore =>
                settore.nome !== nomeSettore
        );

    return anemodromo;

}


/*
Imposta il volume di un singolo settore.

Il volume degli altri settori
rimane invariato.
*/

function impostaVolumeSettore(
    anemodromo,
    nomeSettore,
    volume
) {

    const settore =
        anemodromo.settori.find(
            elemento =>
                elemento.nome === nomeSettore
        );

    if (!settore) {
        return false;
    }

    settore.volume = volume;

    return true;

}



/* =====================================================
   MODIFICA ANEMODROMO
===================================================== */


function impostaTipo(
    anemodromo,
    tipo
) {

    anemodromo.tipo = tipo;

    return anemodromo;

}


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


function impostaPercorso(
    anemodromo,
    percorso
) {

    anemodromo.percorso =
        percorso;

    return anemodromo;

}


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


/*
L'apnea NON è contenuta nell'Anemodromo.

È un elemento temporale autonomo
posto tra due Anemodromi.

Questo permette sequenze come:

IN
IN
APNEA
IN
ES
APNEA
ES

senza imporre automaticamente
la classica sequenza respiratoria.
*/

function creaApnea(
    anemodromoPrecedenteId,
    anemodromoSuccessivoId,
    durata = 1
) {

    return {

        id: creaId("apnea"),

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


/*
La sequenza mantiene separati:

1. gli Anemodromi
2. il loro ordine
3. le eventuali apnee tra essi

Questa separazione sarà utile soprattutto
per la timeline grafica di ANEMOS 3.1.
*/

function creaSequenzaAnemos() {

    return {

        id: creaId("sequenza"),

        anemodromi: [],

        ordine: [],

        apnee: []

    };

}



/* =====================================================
   AGGIUNTA ANEMODROMI ALLA SEQUENZA
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
   APNEA TRA DUE ANEMODROMI
===================================================== */


/*
Trova l'eventuale apnea già presente
tra due Anemodromi.
*/

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


/*
Inserisce un'apnea.

Tra la stessa coppia di Anemodromi
può esistere una sola apnea.
*/

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



/*
Rimuove l'apnea tra due Anemodromi.

I due Anemodromi restano direttamente
consecutivi.
*/

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

    /*
    Rimuove l'Anemodromo.
    */

    sequenza.anemodromi =
        sequenza.anemodromi.filter(
            elemento =>
                elemento.id !==
                anemodromoId
        );


    /*
    Rimuove l'Anemodromo dall'ordine.
    */

    sequenza.ordine =
        sequenza.ordine.filter(
            id =>
                id !==
                anemodromoId
        );


    /*
    Elimina automaticamente eventuali
    apnee collegate all'Anemodromo.
    */

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
   LETTURA DELLA SEQUENZA
===================================================== */


/*
Restituisce gli Anemodromi
nell'ordine corretto.
*/

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
   VALIDAZIONE
===================================================== */


/*
Controlla che un Anemodromo
sia completo e utilizzabile.
*/

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
        anemodromo.settori.length === 0
    ) {

        errori.push(
            "Deve essere selezionato almeno un settore."
        );

    }


    return {

        valido:
            errori.length === 0,

        errori:
            errori

    };

}



/* =====================================================
   STATO INIZIALE ANEMOS 3.1
===================================================== */


/*
Creiamo una sequenza vuota.

Non aggiungiamo automaticamente
alcun Anemodromo:

sarà l'interfaccia a decidere
quando crearne il primo.
*/

const anemos31 =
    creaSequenzaAnemos();



/*
=========================================================
FINE MODELLO ANEMOS 3.1
=========================================================
*/
