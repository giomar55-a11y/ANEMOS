/*
=====================================================
ANEMOS 3.1
LABORATORIO MOTORE DI COERENZA
=====================================================

Modulo sperimentale indipendente.

Non modifica:
- Anemografo
- Anemogramma
- modello respiratorio
- sequenza corrente

Serve esclusivamente per sviluppare
e verificare il calcolo della coerenza.
=====================================================
*/


/* =====================================================
   STATO MODULO
===================================================== */

const ANEMOS_MOTORE_TEST = {

    versione:
        "0.1",

    attivo:
        true

};


console.log(
    "Motore di Coerenza ANEMOS - laboratorio caricato",
    ANEMOS_MOTORE_TEST
);
/* =====================================================
   VALORI NUMERICI DEI VOLUMI
===================================================== */

const ANEMOS_VALORI_VOLUME = {

    vuoto:
        0,

    scarso:
        1,

    confortevole:
        2,

    abbondante:
        3,

    pieno:
        4

};

/* =====================================================
   MATRICE DEGLI OBIETTIVI DI FLUSSO

   Valori sperimentali provvisori.

   ideale:
   valore atteso dell'Indice ANEMOS.

   lento:
   tolleranze quando l'indice reale
   è inferiore all'ideale.

   rapido:
   tolleranze quando l'indice reale
   è superiore all'ideale.
===================================================== */

const ANEMOS_MATRICE_FLUSSI = {

    trattenuto: {

        ideale:
            0.175,

        lento: {

            verde:
                0.125,

            giallo:
                0.175

        },

        rapido: {

            verde:
                0.125,

            giallo:
                0.250

        }

    },


    delicato: {

        ideale:
            0.45,

        lento: {

            verde:
                0.25,

            giallo:
                0.40

        },

        rapido: {

            verde:
                0.25,

            giallo:
                0.50

        }

    },


    spontaneo: {

        ideale:
            1.00,

        lento: {

            verde:
                0.50,

            giallo:
                0.80

        },

        rapido: {

            verde:
                0.50,

            giallo:
                1.00

        }

    },


    forzato: {

        ideale:
            2.60,

        lento: {

            verde:
                0.80,

            giallo:
                1.60

        },

        rapido: {

            verde:
                1.40,

            giallo:
                2.80

        }

    }

};


/* =====================================================
   CALCOLO CARICO RESPIRATORIO
===================================================== */

function calcolaCaricoRespiratorio(
    settori
) {

    let carico =
        0;


    settori.forEach(
        settore => {

            const iniziale =
                ANEMOS_VALORI_VOLUME[
                    settore.iniziale
                ];


            const finale =
                ANEMOS_VALORI_VOLUME[
                    settore.finale
                ];


            carico +=
                Math.abs(
                    finale -
                    iniziale
                );

        }
    );


    return carico;

}


/* =====================================================
   CALCOLO INDICE ANEMOS
===================================================== */

function calcolaIndiceAnemos(
    carico,
    durata
) {

    if (
        durata <= 0
    ) {

        return 0;

    }


    return Number(
        (
            carico /
            durata
        ).toFixed(2)
    );

}

/* =====================================================
   VALUTAZIONE COERENZA DEL FLUSSO
===================================================== */

function valutaCoerenzaFlusso(
    indice,
    flusso
) {

    const obiettivo =
        ANEMOS_MATRICE_FLUSSI[
            flusso
        ];


    if (!obiettivo) {

        return {

            valido:
                false,

            punteggio:
                0,

            semaforo:
                "rosso",

            motivazione:
                "Flusso non riconosciuto."

        };

    }


    const ideale =
        obiettivo.ideale;


    const errore =
        indice -
        ideale;


    let direzione =
        "coerente";


    if (
        errore < 0
    ) {

        direzione =
            "lento";

    }


    if (
        errore > 0
    ) {

        direzione =
            "rapido";

    }


    const scostamento =
        Math.abs(
            errore
        );


    const profilo =
        errore <= 0

            ? obiettivo.lento

            : obiettivo.rapido;


    const tolleranzaVerde =
        profilo.verde;


    const tolleranzaGialla =
        profilo.giallo;


    let punteggio =
        0;


    let semaforo =
        "rosso";


    if (
        scostamento <=
        tolleranzaVerde
    ) {

        const rapporto =
            tolleranzaVerde > 0

                ? scostamento /
                    tolleranzaVerde

                : 0;


        punteggio =
            Math.round(
                100 -
                rapporto * 20
            );


        semaforo =
            "verde";

    } else if (
        scostamento <=
        tolleranzaGialla
    ) {

        const ampiezzaGialla =
            tolleranzaGialla -
            tolleranzaVerde;


        const rapporto =
            ampiezzaGialla > 0

                ? (
                    scostamento -
                    tolleranzaVerde
                ) /
                    ampiezzaGialla

                : 1;


        punteggio =
            Math.round(
                79 -
                rapporto * 19
            );


        semaforo =
            "giallo";

    } else {

        const eccesso =
            scostamento -
            tolleranzaGialla;


        const rapporto =
            tolleranzaGialla > 0

                ? eccesso /
                    tolleranzaGialla

                : 1;


        punteggio =
            Math.max(
                0,
                Math.round(
                    59 -
                    rapporto * 59
                )
            );


        semaforo =
            "rosso";

    }


    let motivazione =
        "Indice coerente con l'obiettivo del flusso.";


    if (
        semaforo ===
            "giallo" &&
        direzione ===
            "lento"
    ) {

        motivazione =
            "Movimento leggermente più lento rispetto all'obiettivo del flusso.";

    }


    if (
        semaforo ===
            "giallo" &&
        direzione ===
            "rapido"
    ) {

        motivazione =
            "Movimento leggermente più rapido rispetto all'obiettivo del flusso.";

    }


    if (
        semaforo ===
            "rosso" &&
        direzione ===
            "lento"
    ) {

        motivazione =
            "Movimento molto più lento rispetto all'obiettivo del flusso.";

    }


    if (
        semaforo ===
            "rosso" &&
        direzione ===
            "rapido"
    ) {

        motivazione =
            "Movimento molto più rapido rispetto all'obiettivo del flusso.";

    }


    return {

        valido:
            true,

        indice:
            indice,

        flusso:
            flusso,

        ideale:
            ideale,

        errore:
            Number(
                errore.toFixed(3)
            ),

        direzione:
            direzione,

        scostamento:
            Number(
                scostamento.toFixed(3)
            ),

        punteggio:
            punteggio,

        semaforo:
            semaforo,

        motivazione:
            motivazione

    };

}

/* =====================================================
   TEST CARICO RESPIRATORIO
===================================================== */
const testCarico =
    calcolaCaricoRespiratorio([

        {
            iniziale: "vuoto",
            finale: "confortevole"
        },

        {
            iniziale: "scarso",
            finale: "abbondante"
        }

    ]);


console.log(
    "Carico respiratorio:",
    testCarico
);
/* =====================================================
   TEST INDICE ANEMOS
===================================================== */

const testIndice =
    calcolaIndiceAnemos(
        testCarico,
        4
    );


console.log(
    "Indice ANEMOS:",
    testIndice
);
/* =====================================================
   TEST COERENZA FLUSSO
===================================================== */

const testCoerenza =
    valutaCoerenzaFlusso(
        testIndice,
        "spontaneo"
    );


console.log(
    "Valutazione coerenza:",
    testCoerenza
);
/* =====================================================
   STRUMENTO DI TEST DEL MOTORE
===================================================== */

function eseguiTestMotore(
    configurazione
) {

    const indice =
        calcolaIndiceAnemos(
            configurazione.carico,
            configurazione.durata
        );


    const valutazione =
        valutaCoerenzaFlusso(
            indice,
            configurazione.flusso
        );


    console.log(
        "--------------------------------"
    );


    console.log(
        configurazione.nome
    );


    console.log(
        "Carico:",
        configurazione.carico
    );


    console.log(
        "Durata:",
        configurazione.durata
    );


    console.log(
        "Flusso:",
        configurazione.flusso
    );


    console.log(
        "Indice:",
        indice
    );


    console.log(
        "Valutazione:",
        valutazione
    );


    return valutazione;

}
/* =====================================================
   TEST FLUSSO SPONTANEO
===================================================== */

eseguiTestMotore({

    nome:
        "Spontaneo ideale",

    carico:
        4,

    durata:
        6,

    flusso:
        "spontaneo"

});


eseguiTestMotore({

    nome:
        "Spontaneo lento",

    carico:
        4,

    durata:
        8,

    flusso:
        "spontaneo"

});


eseguiTestMotore({

    nome:
        "Spontaneo rapido",

    carico:
        4,

    durata:
        2,

    flusso:
        "spontaneo"

});
eseguiTestMotore({

    nome:
        "Spontaneo molto lento",

    carico:
        4,

    durata:
        16,

    flusso:
        "spontaneo"

});


eseguiTestMotore({

    nome:
        "Spontaneo molto rapido",

    carico:
        4,

    durata:
        1,

    flusso:
        "spontaneo"

});

/* =====================================================
   LETTURA DELLA SEQUENZA CREATA IN ANEMOS 3.1
===================================================== */

function caricaSequenzaSalvata() {

    const datiSalvati =
        localStorage.getItem(
            "ANEMOS_SEQUENZA_TEST"
        );


    if (!datiSalvati) {

        console.log(
            "Nessuna sequenza ANEMOS salvata."
        );


        return creaSequenzaAnemos();

    }


    try {

        const sequenza =
            JSON.parse(
                datiSalvati
            );


        const strutturaValida =
            sequenza &&
            Array.isArray(
                sequenza.anemodromi
            ) &&
            Array.isArray(
                sequenza.ordine
            ) &&
            Array.isArray(
                sequenza.apnee
            );


        if (!strutturaValida) {

            console.log(
                "La sequenza salvata non è valida."
            );


            return creaSequenzaAnemos();

        }


        return sequenza;

    } catch (errore) {

        console.log(
            "Errore nella lettura della sequenza salvata:",
            errore
        );


        return creaSequenzaAnemos();

    }

}


const sequenzaTest =
    caricaSequenzaSalvata();


console.log(
    "Sequenza reale:",
    sequenzaTest
);

/* =====================================================
   VALUTA UN ANEMOMERO REALE DELLA SEQUENZA
===================================================== */

function valutaAnemomeroReale(
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


    let variazioneTotale =
        0;


    const variazioniSettori =
        [];


    anemomero.settori.forEach(
        settore => {

            const livelloIniziale =
                statoIniziale[
                    settore.nome
                ];


            const livelloFinale =
                statoFinale[
                    settore.nome
                ];


            const variazione =
                Math.abs(
                    livelloFinale -
                    livelloIniziale
                );


            variazioneTotale +=
                variazione;


            variazioniSettori.push({

                settore:
                    settore.nome,

                iniziale:
                    livelloIniziale,

                finale:
                    livelloFinale,

                variazione:
                    variazione

            });

        }
    );


    const indice =
        calcolaIndiceAnemos(
            variazioneTotale,
            anemomero.durata
        );


    const valutazione =
        valutaCoerenzaFlusso(
            indice,
            anemomero.flusso
        );


    return {

        id:
            anemomero.id,

        tipo:
            anemomero.tipo,

        durata:
            anemomero.durata,

        percorso:
            anemomero.percorso,

        flusso:
            anemomero.flusso,

        variazioneTotale:
            variazioneTotale,

        variazioniSettori:
            variazioniSettori,

        ...valutazione

    };

}
/* =====================================================
   VALUTA TUTTI GLI ANEMOMERI DELLA SEQUENZA
===================================================== */

function valutaSequenzaReale(
    sequenza
) {

    const anemomeri =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    return anemomeri.map(
        anemomero =>
            valutaAnemomeroReale(
                sequenza,
                anemomero
            )
    );

}
/* =====================================================
   TEST DELL'INTERA SEQUENZA REALE
===================================================== */

const valutazioniSequenzaTest =
    valutaSequenzaReale(
        sequenzaTest
    );


valutazioniSequenzaTest.forEach(
    valutazione => {

        console.log(
            "Valutazione:",
            valutazione
        );


        console.log(
            "================================"
        );


        console.log(
            "Anemodromo:",
            valutazione.id
        );


        console.log(
            valutazione.tipo,
            "-",
            valutazione.durata + " s",
            "-",
            valutazione.flusso
        );


        valutazione.variazioniSettori.forEach(
            settore => {

                const segno =
                    settore.finale >
                    settore.iniziale

                        ? "+"

                        : settore.finale <
                          settore.iniziale

                            ? "-"

                            : "=";


                console.log(
                    settore.settore + ":",
                    settore.iniziale +
                        " → " +
                        settore.finale,
                    "(" +
                        segno +
                        settore.variazione +
                        ")"
                );

            }
        );


        console.log(
            "Carico:",
            valutazione.variazioneTotale
        );


        console.log(
            "Indice:",
            valutazione.indice
        );


        console.log(
            "Semaforo:",
            valutazione.semaforo
        );


        console.log(
            "Punteggio:",
            valutazione.punteggio
        );

    }
);
