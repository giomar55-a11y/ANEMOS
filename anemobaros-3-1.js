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

/* =====================================================
   4. APNEE
   Carico della singola apnea: 0–20

   Apnea alta = dopo IN
   Apnea bassa = dopo ES
===================================================== */

function anemobarosCaricoApnea(
    tipoPrecedente,
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


    let carico = 0;


    /* -------------------------
       DURATA DELL'APNEA
    ------------------------- */

    if (secondi <= 2) {
        carico = 3;
    } else if (secondi <= 4) {
        carico = 5;
    } else if (secondi <= 6) {
        carico = 8;
    } else if (secondi <= 8) {
        carico = 11;
    } else if (secondi <= 11) {
        carico = 14;
    } else if (secondi <= 14) {
        carico = 17;
    } else {
        carico = 20;
    }


    /* -------------------------
       APNEA BASSA

       Dopo ES aggiunge 3 punti
       rispetto all'apnea alta.
    ------------------------- */

    if (tipoPrecedente === "ES") {
        carico += 3;
    }


    return Math.min(
        carico,
        20
    );
}

/* =====================================================
   5. PERCORSO
   Carico del singolo Anemomero: 0–10
===================================================== */

function anemobarosCaricoPercorso(
    percorso
) {

    const testo =
        String(
            percorso ?? ""
        )
            .trim()
            .toLowerCase();

    if (testo === "bocca") {
        return 1;
    }

    if (
        testo === "entrambe le narici"
    ) {
        return 3;
    }

    if (
        testo === "narice destra" ||
        testo === "narice sinistra"
    ) {
        return 6;
    }

    return 0;
}

/* =====================================================
   6. FUNZIONI COMUNI
===================================================== */

function anemobarosLimita(
    valore,
    minimo,
    massimo
) {

    return Math.min(
        Math.max(
            valore,
            minimo
        ),
        massimo
    );
}


function anemobarosMedia(
    valori
) {

    if (
        !Array.isArray(valori) ||
        valori.length === 0
    ) {
        return 0;
    }

    return (
        valori.reduce(
            (somma, valore) =>
                somma + valore,
            0
        )
        /
        valori.length
    );
}


function anemobarosMediaPicco(
    valori
) {

    if (
        !Array.isArray(valori) ||
        valori.length === 0
    ) {
        return 0;
    }

    const media =
        anemobarosMedia(
            valori
        );

    const massimo =
        Math.max(
            ...valori
        );

    return (
        media * 0.70 +
        massimo * 0.30
    );
}


function anemobarosOttieniAnemomeriOrdinati(
    sequenza
) {

    if (!sequenza) {
        return [];
    }

    if (
        typeof ottieniAnemodromiOrdinati ===
        "function"
    ) {

        const ordinati =
            ottieniAnemodromiOrdinati(
                sequenza
            );

        if (
            Array.isArray(ordinati)
        ) {
            return ordinati;
        }
    }

    if (
        Array.isArray(sequenza)
    ) {
        return sequenza;
    }

    return [];
}

/* =====================================================
   7. ESCURSIONE VOLUMETRICA CICLICA

   Per ogni settore viene confrontato
   il volume corrente con l'ultimo volume
   assegnato allo stesso settore.

   La ricerca è ciclica:
   prima del primo Anemomero viene
   considerata la parte finale del ciclo.
===================================================== */

function anemobarosTrovaVolumePrecedente(
    anemomeri,
    indiceCorrente,
    nomeSettore
) {

    const totale =
        anemomeri.length;

    if (totale <= 1) {
        return null;
    }


    for (
        let passo = 1;
        passo < totale;
        passo++
    ) {

        const indice =
            (
                indiceCorrente -
                passo +
                totale
            )
            %
            totale;

        const precedente =
            anemomeri[indice];

        if (
            !precedente ||
            !Array.isArray(
                precedente.settori
            )
        ) {
            continue;
        }


        const settore =
            precedente.settori.find(
                elemento =>
                    elemento.nome ===
                    nomeSettore
            );


        if (settore) {
            return settore.volume;
        }
    }


    return null;
}


function anemobarosCarichiVolume(
    anemomeri
) {

    const carichi = [];


    anemomeri.forEach(
        (
            anemomero,
            indice
        ) => {

            if (
                !anemomero ||
                !Array.isArray(
                    anemomero.settori
                )
            ) {
                return;
            }


            anemomero.settori.forEach(
                settore => {

                    const precedente =
                        anemobarosTrovaVolumePrecedente(
                            anemomeri,
                            indice,
                            settore.nome
                        );


                    /*
                       Se il settore non possiede
                       uno stato precedente nel ciclo,
                       non possiamo calcolare
                       un'escursione attendibile.
                    */

                    if (
                        precedente === null ||
                        precedente === undefined
                    ) {
                        return;
                    }


                    const carico =
                        anemobarosCaricoEscursione(
                            anemomero.tipo,
                            precedente,
                            settore.volume
                        );


                    carichi.push(
                        carico
                    );
                }
            );
        }
    );


    return carichi;
}
