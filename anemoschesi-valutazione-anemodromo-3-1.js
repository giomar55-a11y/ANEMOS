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
   EFFETTO DELLE APNEE SULLA MATRICE TEMPORALE
===================================================== */

/*
Confronta:

ES / IN

con:

(ES + AES) / (IN + AIN)

per stabilire in quale direzione
le apnee modificano l'assetto temporale
dell'Anemodromo.

Non assegna punteggi.
*/

function analizzaEffettoApneeMatriceTemporaleAnemoschesi(
    valutazioneTemporale,
    rapportoBlocchiTemporali
) {

    if (
        !valutazioneTemporale ||
        !rapportoBlocchiTemporali
    ) {

        return null;

    }


    const rapportoRespiratorio =
        Number(
            valutazioneTemporale.rapporto
        );


    const rapportoBlocchi =
        Number(
            rapportoBlocchiTemporali.rapporto
        );


    if (
        !Number.isFinite(
            rapportoRespiratorio
        ) ||
        !Number.isFinite(
            rapportoBlocchi
        )
    ) {

        return null;

    }


    const differenza =
        rapportoBlocchi -
        rapportoRespiratorio;


    let direzione =
        "neutro";


    if (
        differenza > 0.05
    ) {

        direzione =
            "sposta_verso_es";

    }


    if (
        differenza < -0.05
    ) {

        direzione =
            "sposta_verso_in";

    }


    return {

        rapportoRespiratorio:
            rapportoRespiratorio,

        rapportoBlocchi:
            rapportoBlocchi,

        differenza:
            Number(
                differenza.toFixed(
                    2
                )
            ),

        direzione:
            direzione

    };

}

/* =====================================================
   DISTRIBUZIONE DELLE APNEE NELLA MATRICE TEMPORALE
===================================================== */

/*
Descrive come il tempo complessivo di apnea
si distribuisce tra:

AIN = apnea successiva a IN
AES = apnea successiva a ES

Non assegna punteggi.

Serve a distinguere se l'architettura
dell'Anemodromo utilizza prevalentemente
ritenzione post-inspiratoria,
ritenzione post-espiratoria
oppure entrambe.
*/

function analizzaDistribuzioneApneeMatriceTemporaleAnemoschesi(
    matriceTemporale
) {

    if (
        !matriceTemporale
    ) {

        return null;

    }


    const durataAIN =
        Number(
            matriceTemporale.durataAIN
        );


    const durataAES =
        Number(
            matriceTemporale.durataAES
        );


    if (
        !Number.isFinite(
            durataAIN
        ) ||
        !Number.isFinite(
            durataAES
        )
    ) {

        return null;

    }


    const durataApnee =
        durataAIN +
        durataAES;


    if (
        durataApnee <= 0
    ) {

        return {

            durataAIN:
                0,

            durataAES:
                0,

            durataApnee:
                0,

            quotaAIN:
                0,

            quotaAES:
                0,

            prevalenza:
            "nessuna",

            forzaPrevalenza:
            "nessuna"
           
        };

    }


    const quotaAIN =
        durataAIN /
        durataApnee;


    const quotaAES =
        durataAES /
        durataApnee;


    let prevalenza =
    "equilibrata";


let forzaPrevalenza =
    "equilibrata";


if (
    quotaAIN >= 0.60
) {

    prevalenza =
        "ain";

    forzaPrevalenza =
        quotaAIN >= 0.80
            ? "forte"
            : "moderata";

}


if (
    quotaAES >= 0.60
) {

    prevalenza =
        "aes";

    forzaPrevalenza =
        quotaAES >= 0.80
            ? "forte"
            : "moderata";

}


return {

    durataAIN:
        durataAIN,

    durataAES:
        durataAES,

    durataApnee:
        durataApnee,

    quotaAIN:
        Number(
            quotaAIN.toFixed(
                2
            )
        ),

    quotaAES:
        Number(
            quotaAES.toFixed(
                2
            )
        ),

    prevalenza:
        prevalenza,

    forzaPrevalenza:
        forzaPrevalenza

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
   TRANSIZIONI TRA ANEMOMERI
===================================================== */

/*
Analizza le relazioni tra Anemomeri consecutivi.

Per ogni transizione descrive:

- tipo di passaggio
- variazione del carico
- variazione della durata

Non assegna ancora punteggi.
*/

/* =====================================================
   ORDINE DEL FLUSSO NELLE TRANSIZIONI
===================================================== */

/*
Permette di confrontare il flusso
tra Anemomeri consecutivi.

Ordine crescente di intensità:

trattenuto
delicato
spontaneo
forzato
*/

function valoreFlussoTransizioneAnemoschesi(
    flusso
) {

    const valori = {

        trattenuto:
            1,

        delicato:
            2,

        spontaneo:
            3,

        forzato:
            4

    };


    return (
        typeof valori[
            flusso
        ] === "number"

            ? valori[
                flusso
            ]

            : null
    );

}

function classificaTransizionePercorsoAnemoschesi(
    percorsoPrecedente,
    percorsoSuccessivo
) {

    if (
        !percorsoPrecedente ||
        !percorsoSuccessivo
    ) {
        return null;
    }


    /*
    Stesso percorso:
    entrambe → entrambe
    destra → destra
    sinistra → sinistra
    bocca → bocca
    */

    if (
        percorsoPrecedente ===
        percorsoSuccessivo
    ) {
        return (
            ANEMOSCHESI_TRANSIZIONI_PERCORSO
                .STABILE
        );
    }


    /*
    Se il percorso cambia e almeno uno
    dei due utilizza la bocca,
    la transizione è ORALE.
    */

    if (
        percorsoPrecedente ===
            ANEMOS_PERCORSI.BOCCA ||
        percorsoSuccessivo ===
            ANEMOS_PERCORSI.BOCCA
    ) {
        return (
            ANEMOSCHESI_TRANSIZIONI_PERCORSO
                .ORALE
        );
    }


    /*
    Narice destra ↔ narice sinistra
    */

    if (
        (
            percorsoPrecedente ===
                ANEMOS_PERCORSI.NARICE_DESTRA &&
            percorsoSuccessivo ===
                ANEMOS_PERCORSI.NARICE_SINISTRA
        )
        ||
        (
            percorsoPrecedente ===
                ANEMOS_PERCORSI.NARICE_SINISTRA &&
            percorsoSuccessivo ===
                ANEMOS_PERCORSI.NARICE_DESTRA
        )
    ) {
        return (
            ANEMOSCHESI_TRANSIZIONI_PERCORSO
                .ALTERNATA
        );
    }


    /*
    Percorso unilaterale → entrambe le narici
    */

    if (
        (
            percorsoPrecedente ===
                ANEMOS_PERCORSI.NARICE_DESTRA ||
            percorsoPrecedente ===
                ANEMOS_PERCORSI.NARICE_SINISTRA
        )
        &&
        percorsoSuccessivo ===
            ANEMOS_PERCORSI.ENTRAMBE_NARICI
    ) {
        return (
            ANEMOSCHESI_TRANSIZIONI_PERCORSO
                .CONVERGENTE
        );
    }


    /*
    Entrambe le narici → percorso unilaterale
    */

    if (
        percorsoPrecedente ===
            ANEMOS_PERCORSI.ENTRAMBE_NARICI
        &&
        (
            percorsoSuccessivo ===
                ANEMOS_PERCORSI.NARICE_DESTRA ||
            percorsoSuccessivo ===
                ANEMOS_PERCORSI.NARICE_SINISTRA
        )
    ) {
        return (
            ANEMOSCHESI_TRANSIZIONI_PERCORSO
                .DIVERGENTE
        );
    }


    return null;

}

function analizzaTransizioniAnemomeriAnemoschesi(
    profiliAnemomeri
) {

    if (
        !Array.isArray(
            profiliAnemomeri
        ) ||
        profiliAnemomeri.length < 2
    ) {

        return [];

    }


    const transizioni =
        [];


    for (
        let i = 1;
        i < profiliAnemomeri.length;
        i++
    ) {

        const precedente =
            profiliAnemomeri[
                i - 1
            ];


        const successivo =
            profiliAnemomeri[
                i
            ];


        let andamentoCarico =
            "stabile";


        if (
            successivo.carico >
            precedente.carico
        ) {

            andamentoCarico =
                "crescente";

        }


        if (
            successivo.carico <
            precedente.carico
        ) {

            andamentoCarico =
                "decrescente";

        }


        let andamentoDurata =
            "stabile";


        if (
            successivo.durata >
            precedente.durata
        ) {

            andamentoDurata =
                "crescente";

        }


        if (
            successivo.durata <
            precedente.durata
        ) {

            andamentoDurata =
                "decrescente";

        }
       
        const valoreFlussoPrecedente =
            valoreFlussoTransizioneAnemoschesi(
                precedente.flusso
            );


        const valoreFlussoSuccessivo =
            valoreFlussoTransizioneAnemoschesi(
                successivo.flusso
            );


                let andamentoFlusso =
            null;


        if (
            typeof valoreFlussoPrecedente ===
                "number" &&
            typeof valoreFlussoSuccessivo ===
                "number"
        ) {

            andamentoFlusso =
                "stabile";


            if (
                valoreFlussoSuccessivo >
                valoreFlussoPrecedente
            ) {

                andamentoFlusso =
                    "crescente";

            }


            if (
                valoreFlussoSuccessivo <
                valoreFlussoPrecedente
            ) {

                andamentoFlusso =
                    "decrescente";

            }

        }

               const transizionePercorso =
            classificaTransizionePercorsoAnemoschesi(
                precedente.percorso,
                successivo.percorso
            );
        const tipoPassaggio =
            String(
                precedente.tipo
            ) +
            "_verso_" +
            String(
                successivo.tipo
            );


        transizioni.push(
            {

                indicePrecedente:
                    i - 1,

                indiceSuccessivo:
                    i,

                tipoPrecedente:
                    precedente.tipo,

                tipoSuccessivo:
                    successivo.tipo,

                tipoPassaggio:
                    tipoPassaggio,

                caricoPrecedente:
                    precedente.carico,

                caricoSuccessivo:
                    successivo.carico,

                andamentoCarico:
                    andamentoCarico,

                                durataPrecedente:
                    precedente.durata,

                durataSuccessiva:
                    successivo.durata,

                andamentoDurata:
                    andamentoDurata,

                flussoPrecedente:
                    precedente.flusso,

                flussoSuccessivo:
                    successivo.flusso,

                andamentoFlusso:
                    andamentoFlusso,

                percorsoPrecedente:
                    precedente.percorso,

                percorsoSuccessivo:
                    successivo.percorso,

                transizionePercorso:
                    transizionePercorso
            }
        );

    }


    return transizioni;

}

/* =====================================================
   ANDAMENTO COMPLESSIVO DELLE TRANSIZIONI
===================================================== */

/*
Riassume l'andamento delle transizioni
tra Anemomeri consecutivi.

Considera separatamente:

- andamento del carico
- andamento della durata
- andamento del flusso

Possibili esiti:

crescente
decrescente
stabile
variabile

Non assegna ancora punteggi.
*/

function descriviAndamentoTransizioniAnemoschesi(
    transizioni
) {

    if (
        !Array.isArray(
            transizioni
        ) ||
        transizioni.length === 0
    ) {

        return null;

    }


    function classificaAndamento(
        valori
    ) {

        const crescenti =
            valori.filter(
                valore =>
                    valore ===
                    "crescente"
            ).length;


        const decrescenti =
            valori.filter(
                valore =>
                    valore ===
                    "decrescente"
            ).length;


        const stabili =
            valori.filter(
                valore =>
                    valore ===
                    "stabile"
            ).length;


        if (
            stabili ===
            valori.length
        ) {

            return "stabile";

        }


        if (
            decrescenti === 0 &&
            crescenti > 0
        ) {

            return "crescente";

        }


        if (
            crescenti === 0 &&
            decrescenti > 0
        ) {

            return "decrescente";

        }


        return "variabile";

    }


    const andamentoCarichi =
        transizioni.map(
            transizione =>
                transizione
                    .andamentoCarico
        );


    const andamentoDurate =
        transizioni.map(
            transizione =>
                transizione
                    .andamentoDurata
        );


        const andamentoFlussi =
        transizioni
            .map(
                transizione =>
                    transizione
                        .andamentoFlusso
            )
            .filter(
                andamento =>
                    typeof andamento ===
                    "string"
            );
   
    return {

        numeroTransizioni:
            transizioni.length,

                carico:
            classificaAndamento(
                andamentoCarichi
            ),

        durata:
            classificaAndamento(
                andamentoDurate
            ),

                flusso:
            andamentoFlussi.length > 0
                ? classificaAndamento(
                    andamentoFlussi
                )
                : null
       
    };

}

/* =====================================================
   VALUTAZIONE DELLE TRANSIZIONI PER INTENTO
===================================================== */

/*
Confronta l'andamento complessivo
di carico, durata e flusso con le preferenze
definite per l'Intento.

Non modifica ancora il punteggio
complessivo dell'Anemodromo.

Possibili esiti:

- preferito
- neutro
- sconsigliato
*/

function valutaTransizioniPercorsoPerIntentoAnemoschesi(
    transizioni,
    intentoId
) {

    if (
        !Array.isArray(
            transizioni
        ) ||
        !intentoId
    ) {

        return null;

    }


    const regoleIntento =
        ANEMOSCHESI_TRANSIZIONI_PERCORSO_INTENTI[
            intentoId
        ];


    if (
        !regoleIntento
    ) {

        return null;

    }


    const valutazioni =
        transizioni
            .map(
                transizione => {

                    const categoria =
                        transizione
                            .transizionePercorso;


                    if (
                        !categoria
                    ) {

                        return null;

                    }


                    let esito =
                        "neutro";


                    if (
                        Array.isArray(
                            regoleIntento.preferiti
                        ) &&
                        regoleIntento
                            .preferiti
                            .includes(
                                categoria
                            )
                    ) {

                        esito =
                            "preferito";

                    }


                    if (
                        Array.isArray(
                            regoleIntento.sconsigliati
                        ) &&
                        regoleIntento
                            .sconsigliati
                            .includes(
                                categoria
                            )
                    ) {

                        esito =
                            "sconsigliato";

                    }


                    const punteggio =
                        esito === "preferito"
                            ? 100
                            : esito === "neutro"
                                ? 50
                                : 0;


                    return {

                        categoria:
                            categoria,

                        esito:
                            esito,

                        punteggio:
                            punteggio

                    };

                }
            )
            .filter(
                Boolean
            );


    if (
        valutazioni.length === 0
    ) {

        return null;

    }


    return {

        valutazioni:
            valutazioni,

        punteggio:
            mediaValoriAnemoschesi(
                valutazioni.map(
                    valutazione =>
                        valutazione.punteggio
                )
            )

    };

}

function valutaAndamentoTransizioniPerIntentoAnemoschesi(
    andamentoTransizioni,
    intentoId
) {

    if (
        !andamentoTransizioni ||
        !intentoId
    ) {

        return null;

    }


    const regoleIntento =
        ANEMOSCHESI_TRANSIZIONI_INTENTI[
            intentoId
        ];


    if (
        !regoleIntento
    ) {

        return null;

    }


    function valutaComponente(
        andamento,
        regole
    ) {

        if (
            !andamento ||
            !regole
        ) {

            return null;

        }


        if (
            Array.isArray(
                regole.preferiti
            ) &&
            regole.preferiti.includes(
                andamento
            )
        ) {

            return "preferito";

        }


        if (
            Array.isArray(
                regole.sconsigliati
            ) &&
            regole.sconsigliati.includes(
                andamento
            )
        ) {

            return "sconsigliato";

        }


        return "neutro";

    }


    return {

        carico: {

            andamento:
                andamentoTransizioni.carico,

            esito:
                valutaComponente(
                    andamentoTransizioni.carico,
                    regoleIntento.carico
                )

        },

                durata: {

            andamento:
                andamentoTransizioni.durata,

            esito:
                valutaComponente(
                    andamentoTransizioni.durata,
                    regoleIntento.durata
                )

        },

        flusso: {

            andamento:
                andamentoTransizioni.flusso,

            esito:
                valutaComponente(
                    andamentoTransizioni.flusso,
                    regoleIntento.flusso
                )

        }

    };
}

/* =====================================================
   PUNTEGGIO DELLE TRANSIZIONI
===================================================== */

/*
Converte gli esiti qualitativi delle transizioni
in un punteggio numerico.

preferito     = 100
neutro        = 50
sconsigliato  = 0

Il punteggio complessivo delle transizioni
è la media tra carico e durata.
*/

function calcolaPunteggioTransizioniAnemoschesi(
    valutazioneTransizioni,
    valutazioneTransizioniPercorso = null
) {
   
    if (
        !valutazioneTransizioni
    ) {

        return null;

    }


    function punteggioEsito(
        esito
    ) {

        if (
            esito ===
            "preferito"
        ) {

            return 100;

        }


        if (
            esito ===
            "neutro"
        ) {

            return 50;

        }


        if (
            esito ===
            "sconsigliato"
        ) {

            return 0;

        }


        return null;

    }


    const punteggioCarico =
        punteggioEsito(
            valutazioneTransizioni
                .carico
                ?.esito
        );


    const punteggioDurata =
        punteggioEsito(
            valutazioneTransizioni
                .durata
                ?.esito
        );

       const punteggioFlusso =
        punteggioEsito(
            valutazioneTransizioni
                .flusso
                ?.esito
        );

   const punteggioPercorso =
    typeof valutazioneTransizioniPercorso
        ?.punteggio === "number"
        ? valutazioneTransizioniPercorso
            .punteggio
        : null;

        const punteggiValidi =
    [
        punteggioCarico,
        punteggioDurata,
        punteggioFlusso,
        punteggioPercorso
    ].filter(
       punteggio =>
                typeof punteggio ===
                "number"
        );


    if (
        punteggiValidi.length === 0
    ) {

        return null;

    }


    return mediaValoriAnemoschesi(
        punteggiValidi
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

   const transizioniAnemomeri =
    analizzaTransizioniAnemomeriAnemoschesi(
        profiliAnemomeri
    );

   const andamentoTransizioni =
    descriviAndamentoTransizioniAnemoschesi(
        transizioniAnemomeri
    );

   const valutazioneTransizioni =
    valutaAndamentoTransizioniPerIntentoAnemoschesi(
        andamentoTransizioni,
        intentoEffettivo
    );

const valutazioneTransizioniPercorso =
    valutaTransizioniPercorsoPerIntentoAnemoschesi(
        transizioniAnemomeri,
        intentoEffettivo
    );
   
   const punteggioTransizioni =
    calcolaPunteggioTransizioniAnemoschesi(
        valutazioneTransizioni,
        valutazioneTransizioniPercorso
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

   const effettoApneeMatriceTemporale =
    analizzaEffettoApneeMatriceTemporaleAnemoschesi(
        valutazioneTemporale,
        rapportoBlocchiTemporali
    );

const distribuzioneApneeMatriceTemporale =
    analizzaDistribuzioneApneeMatriceTemporaleAnemoschesi(
        matriceTemporale
    );

const orientamentoApneeIntento =
    valutaOrientamentoApneePerIntentoAnemoschesi(
        distribuzioneApneeMatriceTemporale,
        intentoEffettivo
    );
   
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

   const valutazioneOrientamentoApnee =
    valutaPunteggioOrientamentoApneeAnemoschesi(
        orientamentoApneeIntento
    );


const punteggioOrientamentoApnee =
    valutazioneOrientamentoApnee &&
    typeof valutazioneOrientamentoApnee.punteggio ===
        "number"

        ? valutazioneOrientamentoApnee.punteggio
        : punteggioApnee;


const punteggioApneeComplessivo =
    Math.round(
        (
            punteggioApnee *
            0.70
        ) +
        (
            punteggioOrientamentoApnee *
            0.30
        )
    );

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

    const pesoTransizioni =
    0.05;


const punteggioTransizioniEffettivo =
    typeof punteggioTransizioni ===
        "number"

        ? punteggioTransizioni
        : punteggioSequenza;


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
                ANEMOSCHESI_PESO_APNEE_ANEMODROMO -
                pesoTransizioni
            )
        ) +
        (
            punteggioTemporale *
            ANEMOSCHESI_PESO_TEMPORALE_ANEMODROMO
        ) +
        (
            punteggioApneeComplessivo *
            ANEMOSCHESI_PESO_APNEE_ANEMODROMO
        ) +
        (
            punteggioTransizioniEffettivo *
            pesoTransizioni
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

       effettoApneeMatriceTemporale:
    effettoApneeMatriceTemporale,

       classeRapportoBlocchiTemporali:
    classeRapportoBlocchiTemporali,

       distribuzioneApneeMatriceTemporale:
    distribuzioneApneeMatriceTemporale,

       orientamentoApneeIntento:
    orientamentoApneeIntento,

       analisiApnee:
    analisiApnee,

       valutazioniApnee:
    valutazioniApnee,

punteggioApnee:
    punteggioApnee,

       valutazioneOrientamentoApnee:
    valutazioneOrientamentoApnee,

punteggioOrientamentoApnee:
    punteggioOrientamentoApnee,

punteggioApneeComplessivo:
    punteggioApneeComplessivo,

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

       transizioniAnemomeri:
    transizioniAnemomeri,

       andamentoTransizioni:
    andamentoTransizioni,

valutazioneTransizioni:
    valutazioneTransizioni,

valutazioneTransizioniPercorso:
    valutazioneTransizioniPercorso,

punteggioTransizioni:
    punteggioTransizioni,
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
