/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — PROFILO DELL'ANEMOMERO
=========================================================

Traduce i dati reali di un Anemomero
in caratteristiche misurabili.

Analizza:

- tipo IN / ES
- durata
- flusso
- variazione dei volumi
- numero di settori coinvolti
- distribuzione dei settori
- presenza di apnee adiacenti

Non confronta ancora il profilo
con uno specifico Intento.

Dipende da:

- model-3-1.js
- anemoschesi-profili-intenti-3-1.js

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_PROFILO_ANEMOMERO_VERSIONE =
    "0.1";


/* =====================================================
   SOGLIE INIZIALI DI ANALISI
===================================================== */

/*
Le soglie sono sperimentali.

L'indice respiratorio è calcolato come:

variazione totale dei settori / durata
*/

const ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO = {

    indiceLentoMassimo:
        0.50,

    indiceRapidoMinimo:
        1.50,

    caricoDelicatoMassimo:
        1,

    caricoIntensoMinimo:
        4,

    indiceEconomicoMassimo:
        0.75,

    indiceDispendiosoMinimo:
        1.75

};


/* =====================================================
   CALCOLO DELLE VARIAZIONI DEI SETTORI
===================================================== */

function calcolaVariazioniAnemomeroAnemoschesi(
    sequenza,
    anemomero
) {

    const statoIniziale =
        statoSettoriPrimaDi(
            sequenza,
            anemomero.id
        );


    const statoFinale =
        applicaAnemodromoAlloStato(
            statoIniziale,
            anemomero
        );


    return ANEMOS_ELENCO_SETTORI.map(
        nomeSettore => {

            const iniziale =
                statoIniziale[
                    nomeSettore
                ];


            const finale =
                statoFinale[
                    nomeSettore
                ];


            return {

                settore:
                    nomeSettore,

                iniziale:
                    iniziale,

                finale:
                    finale,

                variazione:
                    Math.abs(
                        finale -
                        iniziale
                    )

            };

        }
    );

}


/* =====================================================
   CARICO COMPLESSIVO
===================================================== */

function calcolaCaricoAnemomeroAnemoschesi(
    variazioniSettori
) {

    return variazioniSettori.reduce(
        (
            totale,
            settore
        ) =>
            totale +
            settore.variazione,
        0
    );

}


/* =====================================================
   INDICE RESPIRATORIO
===================================================== */

function calcolaIndiceProfiloAnemomeroAnemoschesi(
    carico,
    durata
) {

    if (
        !Number.isFinite(
            durata
        ) ||
        durata <= 0
    ) {

        return 0;

    }


    return Number(
        (
            carico /
            durata
        ).toFixed(
            2
        )
    );

}


/* =====================================================
   APNEE ADIACENTI
===================================================== */

function trovaApneeAdiacentiAnemomeroAnemoschesi(
    sequenza,
    anemomero
) {

    const apneaPrecedente =
        sequenza.apnee.find(
            apnea =>
                apnea.successivo ===
                anemomero.id
        )
        ||
        null;


    const apneaSuccessiva =
        sequenza.apnee.find(
            apnea =>
                apnea.precedente ===
                anemomero.id
        )
        ||
        null;


    return {

        precedente:
            apneaPrecedente,

        successiva:
            apneaSuccessiva,

        presente:
            apneaPrecedente !== null ||
            apneaSuccessiva !== null

    };

}


/* =====================================================
   DESCRITTORE TEMPORALE
===================================================== */

function descriviTemporalitaAnemomeroAnemoschesi(
    indice
) {

    if (
        indice <=
        ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
            .indiceLentoMassimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .LENTO;

    }


    if (
        indice >=
        ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
            .indiceRapidoMinimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .RAPIDO;

    }


    return ANEMOSCHESI_DESCRITTORI
        .MODERATO;

}


/* =====================================================
   DESCRITTORE DELL'INTENSITÀ
===================================================== */

function descriviIntensitaAnemomeroAnemoschesi(
    carico,
    flusso
) {

    if (
        flusso ===
            ANEMOS_FLUSSI.TRATTENUTO ||
        flusso ===
            ANEMOS_FLUSSI.DELICATO ||
        carico <=
            ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
                .caricoDelicatoMassimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .DELICATO;

    }


    if (
        flusso ===
            ANEMOS_FLUSSI.FORZATO ||
        carico >=
            ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
                .caricoIntensoMinimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .INTENSO;

    }


    return ANEMOSCHESI_DESCRITTORI
        .MODERATO;

}


/* =====================================================
   DESCRITTORE DELLA DISTRIBUZIONE
===================================================== */

function descriviDistribuzioneAnemomeroAnemoschesi(
    numeroSettoriCoinvolti
) {

    if (
        numeroSettoriCoinvolti === 1
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .LOCALIZZATO;

    }


    if (
        numeroSettoriCoinvolti === 2
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .REGIONALE;

    }


    if (
        numeroSettoriCoinvolti >= 3
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .GLOBALE;

    }


    return ANEMOSCHESI_DESCRITTORI
        .NEUTRO;

}


/* =====================================================
   DESCRITTORE ENERGETICO
===================================================== */

function descriviEconomiaAnemomeroAnemoschesi(
    indice
) {

    if (
        indice <=
        ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
            .indiceEconomicoMassimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .ECONOMICO;

    }


    if (
        indice >=
        ANEMOSCHESI_SOGLIE_PROFILO_ANEMOMERO
            .indiceDispendiosoMinimo
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .DISPENDIOSO;

    }


    return ANEMOSCHESI_DESCRITTORI
        .NEUTRO;

}


/* =====================================================
   DESCRITTORE DELLA COMPLESSITÀ
===================================================== */

function descriviComplessitaAnemomeroAnemoschesi(
    numeroSettoriCoinvolti
) {

    if (
        numeroSettoriCoinvolti <= 1
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .SEMPLICE;

    }


    if (
        numeroSettoriCoinvolti >= 3
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .COMPLESSO;

    }


    return ANEMOSCHESI_DESCRITTORI
        .EQUILIBRATO;

}


/* =====================================================
   DESCRITTORE DELLA DIREZIONE
===================================================== */

function descriviDirezioneAnemomeroAnemoschesi(
    tipo
) {

    if (
        tipo ===
        ANEMOS_TIPI.IN
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .ESPANSIVO;

    }


    if (
        tipo ===
        ANEMOS_TIPI.ES
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .COMPRESSIVO;

    }


    return ANEMOSCHESI_DESCRITTORI
        .NEUTRO;

}


/* =====================================================
   DESCRITTORE DELLA CONTINUITÀ
===================================================== */

function descriviContinuitaAnemomeroAnemoschesi(
    apneeAdiacenti
) {

    if (
        apneeAdiacenti.presente
    ) {

        return ANEMOSCHESI_DESCRITTORI
            .INTERMITTENTE;

    }


    return ANEMOSCHESI_DESCRITTORI
        .CONTINUO;

}


/* =====================================================
   COSTRUZIONE DEL PROFILO DELL'ANEMOMERO
===================================================== */

function creaProfiloAnemomeroAnemoschesi(
    sequenza,
    anemomero
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return null;

    }


    const variazioniSettori =
        calcolaVariazioniAnemomeroAnemoschesi(
            sequenza,
            anemomero
        );


    const settoriCoinvolti =
        variazioniSettori.filter(
            settore =>
                settore.variazione > 0
        );


    const numeroSettoriCoinvolti =
        settoriCoinvolti.length;


    const carico =
        calcolaCaricoAnemomeroAnemoschesi(
            variazioniSettori
        );


    const indice =
        calcolaIndiceProfiloAnemomeroAnemoschesi(
            carico,
            anemomero.durata
        );


    const apneeAdiacenti =
        trovaApneeAdiacentiAnemomeroAnemoschesi(
            sequenza,
            anemomero
        );


    const descrittori = [

        descriviTemporalitaAnemomeroAnemoschesi(
            indice
        ),

        descriviIntensitaAnemomeroAnemoschesi(
            carico,
            anemomero.flusso
        ),

        descriviDistribuzioneAnemomeroAnemoschesi(
            numeroSettoriCoinvolti
        ),

        descriviEconomiaAnemomeroAnemoschesi(
            indice
        ),

        descriviComplessitaAnemomeroAnemoschesi(
            numeroSettoriCoinvolti
        ),

        descriviDirezioneAnemomeroAnemoschesi(
            anemomero.tipo
        ),

        descriviContinuitaAnemomeroAnemoschesi(
            apneeAdiacenti
        )

    ];


    const descrittoriUnici =
        [
            ...new Set(
                descrittori
            )
        ];


    return {

        anemomeroId:
            anemomero.id,

        tipo:
            anemomero.tipo,

        durata:
            anemomero.durata,

        percorso:
            anemomero.percorso,

        flusso:
            anemomero.flusso,

        carico:
            carico,

        indice:
            indice,

        numeroSettoriCoinvolti:
            numeroSettoriCoinvolti,

        settoriCoinvolti:
            settoriCoinvolti.map(
                settore =>
                    settore.settore
            ),

        variazioniSettori:
            variazioniSettori,

        apneeAdiacenti:
            apneeAdiacenti,

        descrittori:
            descrittoriUnici

    };

}


/* =====================================================
   PROFILI DI TUTTI GLI ANEMOMERI
===================================================== */

function creaProfiliSequenzaAnemoschesi(
    sequenza
) {

    if (
        !sequenza
    ) {

        return [];

    }


    const anemomeri =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    return anemomeri.map(
        anemomero =>
            creaProfiloAnemomeroAnemoschesi(
                sequenza,
                anemomero
            )
    );

}


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Profilo Anemomero caricato",
    {

        versione:
            ANEMOSCHESI_PROFILO_ANEMOMERO_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — PROFILO DELL'ANEMOMERO
=========================================================
*/
