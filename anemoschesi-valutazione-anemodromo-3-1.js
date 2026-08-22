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
   MATRICE TEMPORALE DELL'ANEMODROMO
===================================================== */

/*
Descrive la distribuzione temporale interna
dell'Anemodromo come matrice unica.

NON interpreta l'Anemodromo come ciclo
da ripetere.

Le componenti sono:

IN  = tempo inspiratorio
AIN = apnea successiva a IN
ES  = tempo espiratorio
AES = apnea successiva a ES
*/

function analizzaMatriceTemporaleAnemodromoAnemoschesi(
    sequenza
) {

    if (
        !sequenza
    ) {

        return null;

    }


    const anemomeri =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    let durataIN =
        0;

    let durataAIN =
        0;

    let durataES =
        0;

    let durataAES =
        0;


    anemomeri.forEach(
        anemomero => {

            const durata =
                Number(
                    anemomero.durata
                );


            if (
                !Number.isFinite(
                    durata
                ) ||
                durata <= 0
            ) {

                return;

            }


            if (
                anemomero.tipo ===
                ANEMOS_TIPI.IN
            ) {

                durataIN +=
                    durata;

            }


            if (
                anemomero.tipo ===
                ANEMOS_TIPI.ES
            ) {

                durataES +=
                    durata;

            }

        }
    );


    if (
        Array.isArray(
            sequenza.apnee
        )
    ) {

        sequenza.apnee.forEach(
            apnea => {

                const precedente =
                    trovaAnemodromo(
                        sequenza,
                        apnea.precedente
                    );


                const durata =
                    Number(
                        apnea.durata
                    );


                if (
                    !precedente ||
                    !Number.isFinite(
                        durata
                    ) ||
                    durata <= 0
                ) {

                    return;

                }


                if (
                    precedente.tipo ===
                    ANEMOS_TIPI.IN
                ) {

                    durataAIN +=
                        durata;

                }


                if (
                    precedente.tipo ===
                    ANEMOS_TIPI.ES
                ) {

                    durataAES +=
                        durata;

                }

            }
        );

    }


    const durataTotale =
        durataIN +
        durataAIN +
        durataES +
        durataAES;


    if (
        durataTotale <= 0
    ) {

        return null;

    }


    return {

        durataTotale:
            durataTotale,

        durataIN:
            durataIN,

        durataAIN:
            durataAIN,

        durataES:
            durataES,

        durataAES:
            durataAES,

        quotaIN:
            durataIN /
            durataTotale,

        quotaAIN:
            durataAIN /
            durataTotale,

        quotaES:
            durataES /
            durataTotale,

        quotaAES:
            durataAES /
            durataTotale

    };

}

/* =====================================================
   RAPPORTO TEMPORALE IN / ES
===================================================== */

function valutaRapportoTemporaleAnemodromoAnemoschesi(
    sequenza,
    intentoId
) {

    if (
        !sequenza ||
        !intentoId
    ) {

        return null;

    }


    const anemomeri =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    if (
        !Array.isArray(
            anemomeri
        ) ||
        anemomeri.length === 0
    ) {

        return null;

    }


    let durataIN =
        0;

    let durataES =
        0;


    anemomeri.forEach(
        anemomero => {

            const durata =
                Number(
                    anemomero.durata
                );


            if (
                !Number.isFinite(
                    durata
                ) ||
                durata <= 0
            ) {

                return;

            }


            if (
                anemomero.tipo ===
                ANEMOS_TIPI.IN
            ) {

                durataIN +=
                    durata;

            }


            if (
                anemomero.tipo ===
                ANEMOS_TIPI.ES
            ) {

                durataES +=
                    durata;

            }

        }
    );


    /*
    Il rapporto IN/ES può essere valutato
    soltanto quando entrambe le componenti
    sono presenti.
    */

    if (
        durataIN <= 0 ||
        durataES <= 0
    ) {

        return null;

    }


    const rapporto =
        durataES /
        durataIN;


    let classe;


    if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_RAPPORTO_TEMPORALE
            .inPrevalenteForteMassimo
    ) {

        classe =
            ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE
                .IN_PREVALENTE_FORTE;

    } else if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_RAPPORTO_TEMPORALE
            .inPrevalenteMassimo
    ) {

        classe =
            ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE
                .IN_PREVALENTE;

    } else if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_RAPPORTO_TEMPORALE
            .equilibratoMassimo
    ) {

        classe =
            ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE
                .EQUILIBRATO;

    } else if (
        rapporto <=
        ANEMOSCHESI_SOGLIE_RAPPORTO_TEMPORALE
            .esPrevalenteMassimo
    ) {

        classe =
            ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE
                .ES_PREVALENTE;

    } else {

        classe =
            ANEMOSCHESI_CLASSI_RAPPORTO_TEMPORALE
                .ES_PREVALENTE_FORTE;

    }


    const valore =
        ANEMOSCHESI_RAPPORTO_TEMPORALE_INTENTI[
            intentoId
        ]?.[
            classe
        ];


    if (
        typeof valore !==
        "number"
    ) {

        return null;

    }


    const punteggio =
        normalizzaContributoVolumetricoAnemoschesi(
            valore
        );


    return {

        durataIN:
            durataIN,

        durataES:
            durataES,

        rapporto:
            Number(
                rapporto.toFixed(
                    2
                )
            ),

        classe:
            classe,

        valore:
            valore,

        punteggio:
            punteggio

    };

}

/* =====================================================
   ANALISI DELLE APNEE DELL'ANEMODROMO
===================================================== */

function analizzaApneeAnemodromoAnemoschesi(
    sequenza
) {

    if (
        !sequenza ||
        !Array.isArray(
            sequenza.apnee
        ) ||
        sequenza.apnee.length === 0
    ) {

        return [];

    }


    return sequenza.apnee
        .map(
            apnea => {

                const precedente =
                    trovaAnemodromo(
                        sequenza,
                        apnea.precedente
                    );


                if (
                    !precedente
                ) {

                    return null;

                }


                return analizzaApneaAnemoschesi(
                    apnea,
                    precedente
                );

            }
        )
        .filter(
            Boolean
        );

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

   const matriceTemporale =
    analizzaMatriceTemporaleAnemodromoAnemoschesi(
        sequenza
    );

   const rapportoBlocchiTemporali =
    matriceTemporale
        ? calcolaRapportoBlocchiTemporaliAnemoschesi(
            matriceTemporale
        )
        : null;

   const classeRapportoBlocchiTemporali =
    rapportoBlocchiTemporali
        ? classificaRapportoBlocchiTemporaliAnemoschesi(
            rapportoBlocchiTemporali
        )
        : null;
   
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

   const valutazioneTemporale =
    valutaRapportoTemporaleAnemodromoAnemoschesi(
        sequenza,
        intentoEffettivo
    );


const punteggioTemporale =
    valutazioneTemporale &&
    typeof valutazioneTemporale.punteggio ===
        "number"

        ? valutazioneTemporale.punteggio
        : punteggioSequenza;

   const analisiApnee =
    analizzaApneeAnemodromoAnemoschesi(
        sequenza
    );

   const valutazioniApnee =
    analisiApnee
        .map(
            analisi =>
                valutaApneaPerIntentoAnemoschesi(
                    analisi,
                    intentoEffettivo
                )
        )
        .filter(
            Boolean
        );


const punteggioApnee =
    valutazioniApnee.length > 0

        ? mediaValoriAnemoschesi(
            valutazioniApnee.map(
                valutazione =>
                    valutazione.punteggio
            )
        )

        : punteggioSequenza;

   const valutazioniFisiologicheApnee =
    analisiApnee
        .map(
            analisi =>
                valutaFisiologiaApneaAnemoschesi(
                    analisi
                )
        )
        .filter(
            Boolean
        );


const ordineGravitaFisiologiaApnee = {

    valido:
        0,

    attenzione:
        1,

    critico:
        2,

    errore:
        3

};


const fisiologiaApnee =
    valutazioniFisiologicheApnee.length > 0

        ? valutazioniFisiologicheApnee.reduce(
            (
                peggiore,
                valutazione
            ) => {

                if (
                    ordineGravitaFisiologiaApnee[
                        valutazione.livello
                    ] >
                    ordineGravitaFisiologiaApnee[
                        peggiore.livello
                    ]
                ) {

                    return valutazione;

                }


                return peggiore;

            },
            valutazioniFisiologicheApnee[0]
        )

        : null;

    const punteggioComplessivo =
    Math.round(
        (
            punteggioAnemomeri *
            0.60
        ) +
        (
            punteggioSequenza *
            (
                0.40 -
                ANEMOSCHESI_PESO_TEMPORALE_ANEMODROMO -
                ANEMOSCHESI_PESO_APNEE_ANEMODROMO
            )
        ) +
        (
            punteggioTemporale *
            ANEMOSCHESI_PESO_TEMPORALE_ANEMODROMO
        ) +
        (
            punteggioApnee *
            ANEMOSCHESI_PESO_APNEE_ANEMODROMO
        )
    );
   
    let semaforo =
    determinaSemaforoAnemoschesi(
        punteggioComplessivo
    );


if (
    fisiologiaApnee
) {

    if (
        fisiologiaApnee.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ATTENZIONE &&
        semaforo ===
            "verde"
    ) {

        semaforo =
            "giallo";

    }


    if (
        fisiologiaApnee.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .CRITICO ||
        fisiologiaApnee.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE
    ) {

        semaforo =
            "rosso";

    }

}

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

valutazioneTemporale:
    valutazioneTemporale,

punteggioTemporale:
    punteggioTemporale,

       matriceTemporale:
    matriceTemporale,

       rapportoBlocchiTemporali:
    rapportoBlocchiTemporali,

       classeRapportoBlocchiTemporali:
    classeRapportoBlocchiTemporali,

       analisiApnee:
    analisiApnee,

       valutazioniApnee:
    valutazioniApnee,

punteggioApnee:
    punteggioApnee,

       valutazioniFisiologicheApnee:
    valutazioniFisiologicheApnee,

fisiologiaApnee:
    fisiologiaApnee,

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
