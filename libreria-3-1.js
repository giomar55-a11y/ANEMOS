/* =====================================================
   ANEMOS 3.1
   LIBRERIA ANEMODROMI v1.0

   Archivio locale degli Anemodromi salvati.

   Principi:
   - la sequenza completa è la fonte originale
   - i motori possono essere ricalcolati
   - l'Intento è obbligatorio
   - prima versione basata su localStorage
===================================================== */


const ANEMOS_LIBRERIA_CHIAVE =
    "ANEMOS_LIBRERIA_3_1";

const ANEMOS_LIBRERIA_VERSIONE =
    1;


/* =====================================================
   LETTURA LIBRERIA
===================================================== */

function anemosLibreriaLeggi() {

    try {

        const dati =
            localStorage.getItem(
                ANEMOS_LIBRERIA_CHIAVE
            );

        if (!dati) {
            return [];
        }


        const libreria =
            JSON.parse(
                dati
            );


        if (
            !Array.isArray(libreria)
        ) {
            return [];
        }


        return libreria;

    } catch (errore) {

        return [];

    }
}


/* =====================================================
   SCRITTURA LIBRERIA
===================================================== */

function anemosLibreriaScrivi(
    libreria
) {

    if (
        !Array.isArray(libreria)
    ) {
        return false;
    }


    try {

        localStorage.setItem(
            ANEMOS_LIBRERIA_CHIAVE,
            JSON.stringify(
                libreria
            )
        );

        return true;

    } catch (errore) {

        return false;

    }
}


/* =====================================================
   COPIA INDIPENDENTE DELLA SEQUENZA

   Evita che successive modifiche nell'editor
   alterino l'Anemodromo già archiviato.
===================================================== */

function anemosLibreriaClona(
    valore
) {

    return JSON.parse(
        JSON.stringify(
            valore
        )
    );
}


/* =====================================================
   ID UNIVOCO
===================================================== */

function anemosLibreriaCreaId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        "anemos-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}

/* =====================================================
   SALVATAGGIO ANEMODROMO
===================================================== */

function anemosLibreriaSalva(
    sequenza,
    nome,
    intentoId,
    note = ""
) {

    const nomePulito =
        String(
            nome ?? ""
        ).trim();

    const intentoPulito =
        String(
            intentoId ?? ""
        ).trim();

    const notePulite =
        String(
            note ?? ""
        ).trim();


    /*
       Nome e Intento sono obbligatori.
    */

    if (
        !nomePulito ||
        !intentoPulito ||
        !sequenza
    ) {

        return {
            successo: false,
            motivo: "dati-mancanti"
        };

    }


    /*
       La sequenza deve contenere
       almeno un Anemomero.
    */

    const anemomeri =
        anemosLibreriaClona(
            sequenza
        );


    if (
        !Array.isArray(
            anemomeri.anemodromi
        ) ||
        anemomeri.anemodromi.length === 0
    ) {

        return {
            successo: false,
            motivo: "sequenza-vuota"
        };

    }


    const voce = {

        id:
            anemosLibreriaCreaId(),

        versione:
            ANEMOS_LIBRERIA_VERSIONE,

        creatoIl:
            new Date().toISOString(),

        nome:
            nomePulito,

        intento:
            intentoPulito,

        note:
            notePulite,

        sequenza:
            anemomeri

    };


    const libreria =
        anemosLibreriaLeggi();


    libreria.push(
        voce
    );


    const scritto =
        anemosLibreriaScrivi(
            libreria
        );


    if (!scritto) {

        return {
            successo: false,
            motivo: "errore-scrittura"
        };

    }


    return {
        successo: true,
        voce: voce
    };
}
