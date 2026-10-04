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
