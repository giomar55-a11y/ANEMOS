/* =====================================================
   ANEMOS 3.1
   ANEMOBAROS v0.2

   Indice automatico 0–100 del carico
   e della difficoltà esecutiva dell'Anemodromo.

   Componenti:
   - Durata                  max 25
   - Escursione volumetrica max 25
   - Flusso                 max 20
   - Apnee                  max 20
   - Percorso               max 10

   Correttore:
   - Accumulo del carico nel tempo

   ANEMOBAROS misura la difficoltà di esecuzione.
   Non misura:
   - complessità strutturale → ANEMOSINTHESIS
   - coerenza fisiologica/Intento → ANEMOSCHESI
===================================================== */

/* =====================================================
   1. DURATA IN / ES
   Carico del singolo Anemomero: 0–25
===================================================== */

function anemobarosCaricoDurata(
    tipo,
    durata
) {

    const secondi =
        Number(durata);

    if (
        !Number.isFinite(secondi) ||
        secondi <= 0
    ) {
        return 0;
    }


    /* -------------------------
       INSPIRAZIONE
    ------------------------- */

    if (tipo === "IN") {

        if (secondi <= 1) {
            return 8;
        }

        if (secondi <= 2) {
            return 4;
        }

        if (secondi <= 4) {
            return 2;
        }

        if (secondi <= 5) {
            return 4;
        }

        if (secondi <= 6) {
            return 7;
        }

        if (secondi <= 8) {
            return 11;
        }

        if (secondi <= 11) {
            return 16;
        }

        if (secondi <= 14) {
            return 21;
        }

        return 25;
    }


    /* -------------------------
       ESPIRAZIONE
    ------------------------- */

    if (tipo === "ES") {

        if (secondi <= 1) {
            return 8;
        }

        if (secondi <= 2) {
            return 4;
        }

        if (secondi <= 5) {
            return 2;
        }

        if (secondi <= 6) {
            return 3;
        }

        if (secondi <= 8) {
            return 5;
        }

        if (secondi <= 11) {
            return 9;
        }

        if (secondi <= 14) {
            return 14;
        }

        if (secondi <= 20) {
            return 19;
        }

        if (secondi <= 29) {
            return 23;
        }

        return 25;
    }


    return 0;
}
