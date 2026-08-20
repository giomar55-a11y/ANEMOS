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
   NORMALIZZAZIONE CONTRIBUTO VOLUMETRICO
===================================================== */

/*
Converte la scala interna:

-2  ->   0
-1  ->  25
 0  ->  50
+1  ->  75
+2  -> 100
*/

function normalizzaContributoVolumetricoAnemoschesi(
    valore
) {

    if (
        typeof valore !== "number"
    ) {

        return null;

    }


    return Math.round(
        (
            (
                valore + 2
            ) /
            4
        ) *
        100
    );

}


/* =====================================================
   DATI VOLUMETRICI DEL SINGOLO SETTORE
===================================================== */

function analizzaSettoreVolumetricoAnemoschesi(
    sequenza,
    anemomero,
    settore,
    intentoId
) {

    if (
        !sequenza ||
        !anemomero ||
        !settore ||
        !intentoId
    ) {

        return null;

    }


    const livelloPrima =
        livelloSettorePrimaDi(
            sequenza,
            anemomero.id,
            settore.nome
        );


    const livelloDopo =
        livelloVolume(
            settore.volume
        );


    if (
        typeof livelloPrima !== "number" ||
        typeof livelloDopo !== "number"
    ) {

        return null;

    }


    const delta =
        livelloDopo -
        livelloPrima;


    const escursione =
        Math.abs(
            delta
        );


    let direzione =
        null;


    if (
        delta > 0
    ) {

        direzione =
            "espansione";

    }


    if (
        delta < 0
    ) {

        direzione =
            "depressione";

    }


    const valoreStato =
        ANEMOSCHESI_STATO_VOLUME_INTENTI[
            intentoId
        ]?.[
            settore.volume
        ];


    const valoreEscursione =
        ANEMOSCHESI_ESCURSIONE_INTENTI[
            intentoId
        ]?.[
            escursione
        ];


    const valoreDirezione =
        direzione
            ? ANEMOSCHESI_DIREZIONE_INTENTI[
                intentoId
            ]?.[
                direzione
            ]
            : null;


    return {

        settore:
            settore.nome,

        volumeFinale:
            settore.volume,

        livelloPrima:
            livelloPrima,

        livelloDopo:
            livelloDopo,

        delta:
            delta,

        escursione:
            escursione,

        direzione:
            direzione,

        stato:
            normalizzaContributoVolumetricoAnemoschesi(
                valoreStato
            ),

        punteggioEscursione:
            normalizzaContributoVolumetricoAnemoschesi(
                valoreEscursione
            ),

        punteggioDirezione:
            normalizzaContributoVolumetricoAnemoschesi(
                valoreDirezione
            )

    };

}


/* =====================================================
   RICONOSCIMENTO DELLA DISTRIBUZIONE
===================================================== */

function riconosciDistribuzioneVolumetricaAnemoschesi(
    analisiSettori
) {

    if (
        !Array.isArray(
            analisiSettori
        ) ||
        analisiSettori.length === 0
    ) {

        return null;

    }


    const escursioni =
        analisiSettori.map(
            analisi =>
                analisi.escursione
        );


    /*
    Un solo settore coinvolto.
    */

    if (
        analisiSettori.length === 1
    ) {

        return "selettiva";

    }


    const massimo =
        Math.max(
            ...escursioni
        );


    const minimo =
        Math.min(
            ...escursioni
        );


    /*
    Tutti e tre i settori partecipano
    con escursione importante.
    */

    if (
        analisiSettori.length === 3 &&
        minimo >= 2
    ) {

        return "globale";

    }


    /*
    Partecipazione simile.
    */

    if (
        massimo ===
        minimo
    ) {

        return "equilibrata";

    }


    /*
    Tre livelli progressivamente differenti.
    */

    if (
        analisiSettori.length === 3
    ) {

        const valoriDistinti =
            new Set(
                escursioni
            );


        if (
            valoriDistinti.size === 3
        ) {

            return "graduata";

        }

    }


    /*
    Negli altri casi esiste
    una prevalenza relativa.
    */

    return "prevalente";

}


/* =====================================================
   MEDIA DEI PUNTEGGI VOLUMETRICI
===================================================== */

function mediaPunteggiVolumetriciAnemoschesi(
    valori
) {

    const validi =
        valori.filter(
            valore =>
                typeof valore ===
                "number"
        );


    if (
        validi.length === 0
    ) {

        return null;

    }


    return (
        validi.reduce(
            (
                somma,
                valore
            ) =>
                somma +
                valore,
            0
        ) /
        validi.length
    );

}


/* =====================================================
   VALUTAZIONE DEL NUCLEO VOLUMETRICO
===================================================== */

function valutaNucleoVolumetricoAnemoschesi(
    sequenza,
    anemomero,
    intentoId
) {

    if (
        !sequenza ||
        !anemomero ||
        !intentoId ||
        !Array.isArray(
            anemomero.settori
        ) ||
        anemomero.settori.length === 0
    ) {

        return null;

    }


    const analisiSettori =
        anemomero.settori
            .map(
                settore =>
                    analizzaSettoreVolumetricoAnemoschesi(
                        sequenza,
                        anemomero,
                        settore,
                        intentoId
                    )
            )
            .filter(
                analisi =>
                    analisi !== null
            );


    if (
        analisiSettori.length === 0
    ) {

        return null;

    }


    const stato =
        mediaPunteggiVolumetriciAnemoschesi(
            analisiSettori.map(
                analisi =>
                    analisi.stato
            )
        );


    const escursione =
        mediaPunteggiVolumetriciAnemoschesi(
            analisiSettori.map(
                analisi =>
                    analisi.punteggioEscursione
            )
        );


    const direzione =
        mediaPunteggiVolumetriciAnemoschesi(
            analisiSettori.map(
                analisi =>
                    analisi.punteggioDirezione
            )
        );


    const categoriaDistribuzione =
        riconosciDistribuzioneVolumetricaAnemoschesi(
            analisiSettori
        );


    const valoreDistribuzione =
        ANEMOSCHESI_DISTRIBUZIONE_INTENTI[
            intentoId
        ]?.[
            categoriaDistribuzione
        ];


    const distribuzione =
        normalizzaContributoVolumetricoAnemoschesi(
            valoreDistribuzione
        );


   if (
    statoNucleoNonDisponibileAnemoschesi(
        stato,
        escursione,
        direzione,
        distribuzione
    )
) {

    return null;

}

    const pesi =
        ANEMOSCHESI_PESI_NUCLEO_VOLUMETRICO;


    const punteggio =
        Math.round(
            stato *
                pesi.stato +

            escursione *
                pesi.escursione +

            direzione *
                pesi.direzione +

            distribuzione *
                pesi.distribuzione
        );


    return {

        punteggio:
            punteggio,

        stato:
            Math.round(
                stato
            ),

        escursione:
            Math.round(
                escursione
            ),

        direzione:
            Math.round(
                direzione
            ),

        distribuzione:
            Math.round(
                distribuzione
            ),

        categoriaDistribuzione:
            categoriaDistribuzione,

        settori:
            analisiSettori

    };

}


/* =====================================================
   CONTROLLO COMPLETEZZA DEL NUCLEO
===================================================== */

function statoNucleoNonDisponibileAnemoschesi(
    stato,
    escursione,
    direzione,
    distribuzione
) {

    return (
        typeof stato !== "number" ||
        typeof escursione !== "number" ||
        typeof direzione !== "number" ||
        typeof distribuzione !== "number"
    );

}

/* =====================================================
   RICONOSCIMENTO DELLA FASCIA DI DURATA
===================================================== */

function riconosciFasciaDurataAnemoschesi(
    durata
) {

    if (
        typeof durata !== "number" ||
        durata < 1
    ) {

        return null;

    }


    if (
        durata <=
        ANEMOSCHESI_LIMITI_DURATA
            .breveMassimo
    ) {

        return ANEMOSCHESI_FASCE_DURATA
            .BREVE;

    }


    if (
        durata <=
        ANEMOSCHESI_LIMITI_DURATA
            .moderataMassimo
    ) {

        return ANEMOSCHESI_FASCE_DURATA
            .MODERATA;

    }


    if (
        durata <=
        ANEMOSCHESI_LIMITI_DURATA
            .lungaMassimo
    ) {

        return ANEMOSCHESI_FASCE_DURATA
            .LUNGA;

    }


    return ANEMOSCHESI_FASCE_DURATA
        .MOLTO_LUNGA;

}


/* =====================================================
   VALUTAZIONE DELLA DURATA
===================================================== */

function valutaDurataAnemomeroAnemoschesi(
    anemomero,
    intentoId
) {

    if (
        !anemomero ||
        !intentoId
    ) {

        return null;

    }


    const fascia =
        riconosciFasciaDurataAnemoschesi(
            anemomero.durata
        );


    if (
        !fascia
    ) {

        return null;

    }


    const valore =
        ANEMOSCHESI_DURATA_INTENTI[
            intentoId
        ]?.[
            anemomero.tipo
        ]?.[
            fascia
        ];


    if (
        typeof valore !== "number"
    ) {

        return null;

    }


    const punteggio =
        normalizzaContributoVolumetricoAnemoschesi(
            valore
        );


    return {

        durata:
            anemomero.durata,

        tipo:
            anemomero.tipo,

        fascia:
            fascia,

        valore:
            valore,

        punteggio:
            punteggio

    };

}
/* =====================================================
   VALUTAZIONE DEL FLUSSO
===================================================== */

function valutaFlussoAnemomeroAnemoschesi(
    anemomero,
    intentoId
) {

    if (
        !anemomero ||
        !intentoId ||
        !anemomero.flusso
    ) {

        return null;

    }


    const valore =
        ANEMOSCHESI_FLUSSO_INTENTI[
            intentoId
        ]?.[
            anemomero.flusso
        ];


    if (
        typeof valore !== "number"
    ) {

        return null;

    }


    const punteggio =
        normalizzaContributoVolumetricoAnemoschesi(
            valore
        );


    return {

        flusso:
            anemomero.flusso,

        valore:
            valore,

        punteggio:
            punteggio

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


   const valutazioneBase =
    valutaProfiloAnemomeroPerIntentoAnemoschesi(
        profiloAnemomero,
        intentoEffettivo
    );


if (
    !valutazioneBase ||
    !valutazioneBase.valido
) {

    return valutazioneBase;

}


const nucleoVolumetrico =
    valutaNucleoVolumetricoAnemoschesi(
        sequenza,
        anemomero,
        intentoEffettivo
    );

   const valutazioneDurata =
    valutaDurataAnemomeroAnemoschesi(
        anemomero,
        intentoEffettivo
    );
   
const valutazioneFlusso =
    valutaFlussoAnemomeroAnemoschesi(
        anemomero,
        intentoEffettivo
    );
   
/*
Se il nucleo volumetrico
non è ancora valutabile,
manteniamo il comportamento precedente.
*/

if (
    !nucleoVolumetrico ||
    typeof nucleoVolumetrico.punteggio !==
        "number"
) {

    return {

    ...valutazioneBase,

    nucleoVolumetrico:
        nucleoVolumetrico,

    valutazioneDurata:
        valutazioneDurata,

    valutazioneFlusso:
        valutazioneFlusso

};
}


/*
=====================================================
INTEGRAZIONE DEL NUCLEO VOLUMETRICO
=====================================================
*/


const punteggioBase =
    valutazioneBase.punteggio;


const punteggioVolumetrico =
    nucleoVolumetrico.punteggio;


/*
In questa fase transitoria:

55% = valutazione precedente
45% = nucleo volumetrico

Successivamente il 55% verrà
scomposto in:

- durata
- flusso
- percorso
*/

/*
=====================================================
INTEGRAZIONE VOLUME + DURATA
=====================================================
*/

/*
In questa fase:

30% = valutazione precedente residua
45% = nucleo volumetrico
25% = durata

Flusso e percorso verranno
separati nei passaggi successivi.
*/

const punteggioDurata =
    valutazioneDurata &&
    typeof valutazioneDurata.punteggio ===
        "number"

        ? valutazioneDurata.punteggio
        : punteggioBase;


const punteggioFlusso =
    valutazioneFlusso &&
    typeof valutazioneFlusso.punteggio ===
        "number"

        ? valutazioneFlusso.punteggio
        : punteggioBase;


const punteggioIntegrato =
    Math.round(
        (
            punteggioBase *
            0.10
        ) +
        (
            punteggioVolumetrico *
            ANEMOSCHESI_PESI_ANEMOMERO
                .volume
        ) +
        (
            punteggioDurata *
            ANEMOSCHESI_PESI_ANEMOMERO
                .durata
        ) +
        (
            punteggioFlusso *
            ANEMOSCHESI_PESI_ANEMOMERO
                .flusso
        )
    );
/*
=====================================================
SEMAFORO INTEGRATO
=====================================================
*/


let semaforoIntegrato =
    determinaSemaforoAnemoschesi(
        punteggioIntegrato
    );


/*
Il nucleo volumetrico ha funzione
strutturale e non può essere
completamente compensato
dagli altri parametri.

Nucleo < 30:
massimo risultato ROSSO.

Nucleo 30–49:
massimo risultato GIALLO.

Nucleo >= 50:
nessuna limitazione.
*/


if (
    punteggioVolumetrico <
    ANEMOSCHESI_DOMINANZA_VOLUMETRICA
        .massimoRossoSotto
) {

    semaforoIntegrato =
        "rosso";

} else if (
    punteggioVolumetrico <
    ANEMOSCHESI_DOMINANZA_VOLUMETRICA
        .massimoGialloSotto &&
    semaforoIntegrato ===
        "verde"
) {

    semaforoIntegrato =
        "giallo";

}


/*
Aggiorniamo anche la motivazione
in base al nuovo semaforo.
*/


const intento =
    trovaIntentoAnemoschesi(
        intentoEffettivo
    );


const motivazioneIntegrata =
    creaMotivazioneValutazioneAnemoschesi(
        semaforoIntegrato,
        intento,
        valutazioneBase.preferitiPresenti,
        valutazioneBase.sconsigliatiPresenti
    );


return {

    ...valutazioneBase,

    punteggioBase:
        punteggioBase,

    punteggio:
        punteggioIntegrato,

    semaforo:
        semaforoIntegrato,

    motivazione:
        motivazioneIntegrata,

    nucleoVolumetrico:
        nucleoVolumetrico,

    valutazioneDurata:
        valutazioneDurata,

    valutazioneFlusso:
        valutazioneFlusso

};
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
