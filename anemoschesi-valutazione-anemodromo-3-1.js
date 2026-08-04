/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — VALUTAZIONE DELL'ANEMODROMO
=========================================================

Valuta la coerenza dell'intero Anemodromo
rispetto all'Intento selezionato.

Integra:

- valutazioni dei singoli Anemomeri
- andamento complessivo della sequenza
- omogeneità
- variabilità
- progressione
- continuità
- dinamismo
- carattere rilassante o attivante

Dipende da:

- anemoschesi-intenti-3-1.js
- anemoschesi-profili-intenti-3-1.js
- model-3-1.js
- anemoschesi-profilo-anemomero-3-1.js
- anemoschesi-valutazione-anemomero-3-1.js

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_VALUTAZIONE_ANEMODROMO_VERSIONE =
    "0.1";


/* =====================================================
   MEDIA NUMERICA
===================================================== */

function mediaValoriAnemoschesi(
    valori
) {

    if (
        !Array.isArray(
            valori
        ) ||
        valori.length === 0
    ) {

        return 0;

    }


    const totale =
        valori.reduce(
            (
                somma,
                valore
            ) =>
                somma +
                valore,
            0
        );


    return Number(
        (
            totale /
            valori.length
        ).toFixed(
            2
        )
    );

}


/* =====================================================
   VARIAZIONE TRA VALORI
===================================================== */

function escursioneValoriAnemoschesi(
    valori
) {

    if (
        !Array.isArray(
            valori
        ) ||
        valori.length === 0
    ) {

        return 0;

    }


    return (
        Math.max(
            ...valori
        ) -
        Math.min(
            ...valori
        )
    );

}


/* =====================================================
   DESCRITTORI DELLA SEQUENZA
===================================================== */

function descriviAndamentoAnemodromoAnemoschesi(
    profiliAnemomeri
) {

    if (
        !Array.isArray(
            profiliAnemomeri
        ) ||
        profiliAnemomeri.length === 0
    ) {

        return [];

    }


    const descrittori =
        [];


    const indici =
        profiliAnemomeri.map(
            profilo =>
                profilo.indice
        );


    const carichi =
        profiliAnemomeri.map(
            profilo =>
                profilo.carico
        );


    const durate =
        profiliAnemomeri.map(
            profilo =>
                profilo.durata
        );


    const escursioneIndici =
        escursioneValoriAnemoschesi(
            indici
        );


    const escursioneCarichi =
        escursioneValoriAnemoschesi(
            carichi
        );


    const escursioneDurate =
        escursioneValoriAnemoschesi(
            durate
        );


    if (
        escursioneIndici <= 0.25 &&
        escursioneCarichi <= 1 &&
        escursioneDurate <= 1
    ) {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .OMOGENEO
        );


        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .RIPETITIVO
        );

    } else {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .VARIABILE
        );

    }


    let progressivo =
        true;


    for (
        let i = 1;
        i < carichi.length;
        i++
    ) {

        if (
            carichi[i] <
            carichi[i - 1]
        ) {

            progressivo =
                false;

            break;

        }

    }


    if (
        progressivo &&
        carichi.length > 1
    ) {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .PROGRESSIVO
        );

    }


    const presentaApnee =
        profiliAnemomeri.some(
            profilo =>
                profilo
                    .apneeAdiacenti
                    .presente
        );


    descrittori.push(
        presentaApnee
            ? ANEMOSCHESI_DESCRITTORI
                .INTERMITTENTE
            : ANEMOSCHESI_DESCRITTORI
                .CONTINUO
    );


    const mediaIndice =
        mediaValoriAnemoschesi(
            indici
        );


    const mediaCarico =
        mediaValoriAnemoschesi(
            carichi
        );


    if (
        mediaIndice <= 0.75 &&
        mediaCarico <= 2
    ) {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .RILASSANTE
        );

    }


    if (
        mediaIndice >= 1.25 ||
        mediaCarico >= 4
    ) {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .ATTIVANTE
        );

    }


    if (
        escursioneIndici >= 0.75 ||
        escursioneCarichi >= 2
    ) {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .DINAMICO
        );

    } else {

        descrittori.push(
            ANEMOSCHESI_DESCRITTORI
                .FLUIDO
        );

    }


    return [
        ...new Set(
            descrittori
        )
    ];

}


/* =====================================================
   VALUTAZIONE COMPLESSIVA
===================================================== */

function valutaAnemodromoPerIntentoAnemoschesi(
    sequenza,
    intentoId = null
) {

    if (
        !sequenza
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Sequenza non disponibile."

        };

    }


    const intentoEffettivo =
        intentoId ??
        ottieniIntento(
            sequenza
        );


    if (
        !intentoEffettivo
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Nessun Intento selezionato."

        };

    }


    const intento =
        trovaIntentoAnemoschesi(
            intentoEffettivo
        );


    const profiloIntento =
        trovaProfiloIntentoAnemoschesi(
            intentoEffettivo
        );


    if (
        !intento ||
        !profiloIntento
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Intento o profilo non disponibile."

        };

    }


    const profiliAnemomeri =
        creaProfiliSequenzaAnemoschesi(
            sequenza
        );


    if (
        profiliAnemomeri.length === 0
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Nessun Anemomero presente."

        };

    }


    const valutazioniAnemomeri =
        valutaSequenzaPerIntentoAnemoschesi(
            sequenza,
            intentoEffettivo
        );


    const punteggiValidi =
        valutazioniAnemomeri
            .filter(
                valutazione =>
                    valutazione.valido
            )
            .map(
                valutazione =>
                    valutazione.punteggio
            );


    const punteggioAnemomeri =
        mediaValoriAnemoschesi(
            punteggiValidi
        );


    const descrittoriSequenza =
        descriviAndamentoAnemodromoAnemoschesi(
            profiliAnemomeri
        );


    const preferitiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriSequenza,
            profiloIntento.preferiti
        );


    const sconsigliatiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriSequenza,
            profiloIntento.sconsigliati
        );


    const quotaPreferiti =
        profiloIntento.preferiti.length > 0

            ? (
                preferitiPresenti.length /
                profiloIntento.preferiti.length
            )

            : 0;


    const quotaSconsigliati =
        profiloIntento.sconsigliati.length > 0

            ? (
                sconsigliatiPresenti.length /
                profiloIntento.sconsigliati.length
            )

            : 0;


    const punteggioSequenza =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    quotaPreferiti *
                    100 -
                    quotaSconsigliati *
                    60
                )
            )
        );


    const punteggioComplessivo =
        Math.round(
            (
                punteggioAnemomeri *
                0.60
            ) +
            (
                punteggioSequenza *
                0.40
            )
        );


    const semaforo =
        determinaSemaforoAnemoschesi(
            punteggioComplessivo
        );


    return {

        valido:
            true,

        intentoId:
            intento.id,

        intentoNome:
            intento.nome,

        macroareaId:
            intento.macroareaId,

        macroareaNome:
            intento.macroareaNome,

        punteggioAnemomeri:
            punteggioAnemomeri,

        punteggioSequenza:
            punteggioSequenza,

        punteggioComplessivo:
            punteggioComplessivo,

        semaforo:
            semaforo,

        descrittoriSequenza:
            descrittoriSequenza,

        preferitiPresenti:
            preferitiPresenti,

        sconsigliatiPresenti:
            sconsigliatiPresenti,

        valutazioniAnemomeri:
            valutazioniAnemomeri

    };

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Valutazione Anemodromo caricata",
    {

        versione:
            ANEMOSCHESI_VALUTAZIONE_ANEMODROMO_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — VALUTAZIONE DELL'ANEMODROMO
=========================================================
*/
