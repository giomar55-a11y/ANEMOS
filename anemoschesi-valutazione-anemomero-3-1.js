/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — VALUTAZIONE DELL'ANEMOMERO
=========================================================

Confronta il profilo reale di un Anemomero
con il profilo dell'Intento selezionato.

Produce:

- descrittori favorevoli presenti
- descrittori sconsigliati presenti
- descrittori preferiti mancanti
- punteggio di affinità
- semaforo
- motivazione sintetica
- indicazioni per migliorare la coerenza

Dipende da:

- anemoschesi-intenti-3-1.js
- anemoschesi-profili-intenti-3-1.js
- model-3-1.js
- anemoschesi-profilo-anemomero-3-1.js

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_VALUTAZIONE_ANEMOMERO_VERSIONE =
    "0.1";


/* =====================================================
   SOGLIE DEL SEMAFORO
===================================================== */

const ANEMOSCHESI_SOGLIE_VALUTAZIONE = {

    verdeMinimo:
        75,

    gialloMinimo:
        50

};


/* =====================================================
   INTERSEZIONE TRA ELENCHI
===================================================== */

function intersezioneDescrittoriAnemoschesi(
    primoElenco,
    secondoElenco
) {

    if (
        !Array.isArray(
            primoElenco
        ) ||
        !Array.isArray(
            secondoElenco
        )
    ) {

        return [];

    }


    return primoElenco.filter(
        descrittore =>
            secondoElenco.includes(
                descrittore
            )
    );

}


/* =====================================================
   DIFFERENZA TRA ELENCHI
===================================================== */

function differenzaDescrittoriAnemoschesi(
    elencoRichiesto,
    elencoPresente
) {

    if (
        !Array.isArray(
            elencoRichiesto
        )
    ) {

        return [];

    }


    const presenti =
        Array.isArray(
            elencoPresente
        )
            ? elencoPresente
            : [];


    return elencoRichiesto.filter(
        descrittore =>
            !presenti.includes(
                descrittore
            )
    );

}


/* =====================================================
   PUNTEGGIO DI AFFINITÀ
===================================================== */

function calcolaPunteggioAffinitaAnemoschesi(
    profiloAnemomero,
    profiloIntento
) {

    if (
        !profiloAnemomero ||
        !profiloIntento
    ) {

        return 0;

    }


    const descrittoriAnemomero =
        Array.isArray(
            profiloAnemomero.descrittori
        )
            ? profiloAnemomero.descrittori
            : [];


   /*
Descrittori che il profilo del singolo
Anemomero è realmente in grado di produrre.

Gli altri descrittori dell'Intento
saranno valutati successivamente
sull'intero Anemodromo.
*/

const descrittoriValutabiliAnemomero = [

    ANEMOSCHESI_DESCRITTORI.LENTO,

    ANEMOSCHESI_DESCRITTORI.RAPIDO,

    ANEMOSCHESI_DESCRITTORI.MODERATO,

    ANEMOSCHESI_DESCRITTORI.CONTINUO,

    ANEMOSCHESI_DESCRITTORI.INTERMITTENTE,

    ANEMOSCHESI_DESCRITTORI.DELICATO,

    ANEMOSCHESI_DESCRITTORI.INTENSO,

    ANEMOSCHESI_DESCRITTORI.LOCALIZZATO,

    ANEMOSCHESI_DESCRITTORI.REGIONALE,

    ANEMOSCHESI_DESCRITTORI.GLOBALE,

    ANEMOSCHESI_DESCRITTORI.ESPANSIVO,

    ANEMOSCHESI_DESCRITTORI.COMPRESSIVO,

    ANEMOSCHESI_DESCRITTORI.ECONOMICO,

    ANEMOSCHESI_DESCRITTORI.DISPENDIOSO,

    ANEMOSCHESI_DESCRITTORI.NEUTRO,

    ANEMOSCHESI_DESCRITTORI.SEMPLICE,

    ANEMOSCHESI_DESCRITTORI.COMPLESSO,

    ANEMOSCHESI_DESCRITTORI.EQUILIBRATO

];


const preferiti =
    Array.isArray(
        profiloIntento.preferiti
    )
        ? profiloIntento.preferiti.filter(
            descrittore =>
                descrittoriValutabiliAnemomero.includes(
                    descrittore
                )
        )
        : [];


const sconsigliati =
    Array.isArray(
        profiloIntento.sconsigliati
    )
        ? profiloIntento.sconsigliati.filter(
            descrittore =>
                descrittoriValutabiliAnemomero.includes(
                    descrittore
                )
        )
        : [];

    const preferitiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriAnemomero,
            preferiti
        );


    const sconsigliatiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriAnemomero,
            sconsigliati
        );


    const quotaPreferiti =
        preferiti.length > 0

            ? (
                preferitiPresenti.length /
                preferiti.length
            )

            : 0;


    const quotaSconsigliati =
        sconsigliati.length > 0

            ? (
                sconsigliatiPresenti.length /
                sconsigliati.length
            )

            : 0;


    /*
    Il punteggio parte dalla corrispondenza
    con i descrittori preferiti.

    Ogni descrittore sconsigliato presente
    riduce il risultato.
    */

    const punteggioPreferiti =
        quotaPreferiti *
        100;


    const penalitaSconsigliati =
        quotaSconsigliati *
        60;


    const punteggio =
        Math.round(
            punteggioPreferiti -
            penalitaSconsigliati
        );


    return Math.max(
        0,
        Math.min(
            100,
            punteggio
        )
    );

}


/* =====================================================
   SEMAFORO
===================================================== */

function determinaSemaforoAnemoschesi(
    punteggio
) {

    if (
        punteggio >=
        ANEMOSCHESI_SOGLIE_VALUTAZIONE
            .verdeMinimo
    ) {

        return "verde";

    }


    if (
        punteggio >=
        ANEMOSCHESI_SOGLIE_VALUTAZIONE
            .gialloMinimo
    ) {

        return "giallo";

    }


    return "rosso";

}


/* =====================================================
   MOTIVAZIONE SINTETICA
===================================================== */

function creaMotivazioneValutazioneAnemoschesi(
    semaforo,
    intento,
    preferitiPresenti,
    sconsigliatiPresenti
) {

    const nomeIntento =
        intento
            ? intento.nome
            : "selezionato";


    if (
        semaforo ===
        "verde"
    ) {

        return (
            "Anemomero coerente con l'Intento " +
            nomeIntento +
            "."
        );

    }


    if (
        semaforo ===
        "giallo"
    ) {

        if (
            sconsigliatiPresenti.length > 0
        ) {

            return (
                "Anemomero parzialmente coerente con l'Intento " +
                nomeIntento +
                ", ma presenta alcune caratteristiche poco favorevoli."
            );

        }


        return (
            "Anemomero parzialmente coerente con l'Intento " +
            nomeIntento +
            "."
        );

    }


    if (
        preferitiPresenti.length === 0
    ) {

        return (
            "Anemomero poco coerente con l'Intento " +
            nomeIntento +
            ": non emergono caratteristiche favorevoli sufficienti."
        );

    }


    return (
        "Anemomero poco coerente con l'Intento " +
        nomeIntento +
        "."
    );

}


/* =====================================================
   SUGGERIMENTI GENERALI
===================================================== */

function creaSuggerimentiAnemoschesi(
    preferitiMancanti,
    sconsigliatiPresenti
) {

    const suggerimenti =
        [];


    preferitiMancanti.forEach(
        descrittore => {

            suggerimenti.push(
                "Favorire una configurazione più " +
                descrittore +
                "."
            );

        }
    );


    sconsigliatiPresenti.forEach(
        descrittore => {

            suggerimenti.push(
                "Ridurre la componente " +
                descrittore +
                "."
            );

        }
    );


    return suggerimenti;

}


/* =====================================================
   VALUTAZIONE DI UN PROFILO
===================================================== */

function valutaProfiloAnemomeroPerIntentoAnemoschesi(
    profiloAnemomero,
    intentoId
) {

    if (
        !profiloAnemomero
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Profilo dell'Anemomero non disponibile."

        };

    }


    const intento =
        trovaIntentoAnemoschesi(
            intentoId
        );


    const profiloIntento =
        trovaProfiloIntentoAnemoschesi(
            intentoId
        );


    if (
        !intento ||
        !profiloIntento
    ) {

        return {

            valido:
                false,

            intentoId:
                intentoId ?? null,

            motivoErrore:
                "Intento o profilo dell'Intento non disponibile."

        };

    }


    const descrittoriAnemomero =
        Array.isArray(
            profiloAnemomero.descrittori
        )
            ? profiloAnemomero.descrittori
            : [];


    const preferitiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriAnemomero,
            profiloIntento.preferiti
        );


    const sconsigliatiPresenti =
        intersezioneDescrittoriAnemoschesi(
            descrittoriAnemomero,
            profiloIntento.sconsigliati
        );


    const preferitiMancanti =
        differenzaDescrittoriAnemoschesi(
            profiloIntento.preferiti,
            descrittoriAnemomero
        );


    const punteggio =
        calcolaPunteggioAffinitaAnemoschesi(
            profiloAnemomero,
            profiloIntento
        );


    const semaforo =
        determinaSemaforoAnemoschesi(
            punteggio
        );


    const motivazione =
        creaMotivazioneValutazioneAnemoschesi(
            semaforo,
            intento,
            preferitiPresenti,
            sconsigliatiPresenti
        );


    const suggerimenti =
        creaSuggerimentiAnemoschesi(
            preferitiMancanti,
            sconsigliatiPresenti
        );


    return {

        valido:
            true,

        anemomeroId:
            profiloAnemomero.anemomeroId,

        intentoId:
            intento.id,

        intentoNome:
            intento.nome,

        macroareaId:
            intento.macroareaId,

        macroareaNome:
            intento.macroareaNome,

        punteggio:
            punteggio,

        semaforo:
            semaforo,

        descrittoriAnemomero:
            descrittoriAnemomero,

        preferitiPresenti:
            preferitiPresenti,

        preferitiMancanti:
            preferitiMancanti,

        sconsigliatiPresenti:
            sconsigliatiPresenti,

        suggerimenti:
            suggerimenti,

        motivazione:
            motivazione

    };

}


/* =====================================================
   VALUTAZIONE DI UN ANEMOMERO REALE
===================================================== */

function valutaAnemomeroPerIntentoAnemoschesi(
    sequenza,
    anemomero,
    intentoId = null
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return {

            valido:
                false,

            motivoErrore:
                "Sequenza o Anemomero non disponibile."

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

            anemomeroId:
                anemomero.id,

            intentoId:
                null,

            motivoErrore:
                "Nessun Intento selezionato."

        };

    }


    const profiloAnemomero =
        creaProfiloAnemomeroAnemoschesi(
            sequenza,
            anemomero
        );


    return valutaProfiloAnemomeroPerIntentoAnemoschesi(
        profiloAnemomero,
        intentoEffettivo
    );

}


/* =====================================================
   VALUTAZIONE DI TUTTI GLI ANEMOMERI
===================================================== */

function valutaSequenzaPerIntentoAnemoschesi(
    sequenza,
    intentoId = null
) {

    if (
        !sequenza
    ) {

        return [];

    }


    const intentoEffettivo =
        intentoId ??
        ottieniIntento(
            sequenza
        );


    const anemomeri =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    return anemomeri.map(
        anemomero =>
            valutaAnemomeroPerIntentoAnemoschesi(
                sequenza,
                anemomero,
                intentoEffettivo
            )
    );

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Valutazione Anemomero caricata",
    {

        versione:
            ANEMOSCHESI_VALUTAZIONE_ANEMOMERO_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — VALUTAZIONE DELL'ANEMOMERO
=========================================================
*/
