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

/* =====================================================
   2. ESCURSIONE VOLUMETRICA
   Carico della singola escursione: 0–25
===================================================== */

function anemobarosLivelloVolume(
    volume
) {

    const testo =
        String(
            volume ?? ""
        )
            .trim()
            .toLowerCase();

    const mappa = {
        vuoto: 0,
        scarso: 1,
        confortevole: 2,
        abbondante: 3,
        pieno: 4
    };

    if (
        Object.prototype.hasOwnProperty.call(
            mappa,
            testo
        )
    ) {
        return mappa[testo];
    }

    const numero =
        Number(volume);

    if (
        Number.isFinite(numero) &&
        numero >= 0 &&
        numero <= 4
    ) {
        return numero;
    }

    return null;
}


function anemobarosCaricoEscursione(
    tipo,
    volumePartenza,
    volumeArrivo
) {

    const partenza =
        anemobarosLivelloVolume(
            volumePartenza
        );

    const arrivo =
        anemobarosLivelloVolume(
            volumeArrivo
        );

    if (
        partenza === null ||
        arrivo === null
    ) {
        return 0;
    }


    const escursione =
        Math.abs(
            arrivo - partenza
        );


    let carico = 0;

    if (escursione === 1) {
        carico = 4;
    }

    if (escursione === 2) {
        carico = 9;
    }

    if (escursione === 3) {
        carico = 15;
    }

    if (escursione >= 4) {
        carico = 21;
    }


    /*
       Raggiungimento dell'estremo.

       IN verso Pieno:
       maggiore richiesta inspiratoria.

       ES verso Vuoto:
       maggiore richiesta espiratoria.
    */

    if (
        tipo === "IN" &&
        arrivo === 4
    ) {
        carico += 3;
    }

    if (
        tipo === "ES" &&
        arrivo === 0
    ) {
        carico += 4;
    }


    return Math.min(
        carico,
        25
    );
}

/* =====================================================
   3. FLUSSO
   Carico del singolo Anemomero: 0–20
===================================================== */

function anemobarosCaricoFlusso(
    flusso
) {

    const testo =
        String(
            flusso ?? ""
        )
            .trim()
            .toLowerCase();

    const mappa = {
        spontaneo: 2,
        delicato: 5,
        trattenuto: 11,
        forzato: 17
    };

    if (
        Object.prototype.hasOwnProperty.call(
            mappa,
            testo
        )
    ) {
        return mappa[testo];
    }

    return 0;
}

