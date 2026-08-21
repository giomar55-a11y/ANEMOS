/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE FISIOLOGICHE
=========================================================

Questo modulo introduce il primo livello
di controllo fisiologico dell'Anemomero.

Ordine logico:

1. plausibilità fisiologica
2. coerenza interna
3. valutazione rispetto all'Intento

Questo file NON assegna ancora punteggi
di coerenza con gli Intenti.

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_FISIOLOGICHE_VERSIONE =
    "0.1";


/* =====================================================
   LIVELLI DI ESITO
===================================================== */

const ANEMOSCHESI_ESITI_FISIOLOGICI = {

    VALIDO:
        "valido",

    ATTENZIONE:
        "attenzione",

    CRITICO:
        "critico",

    ERRORE:
        "errore"

};


/* =====================================================
   SOGLIE INIZIALI
===================================================== */

/*
ATTENZIONE:

Queste soglie sono volutamente raccolte
in un unico punto.

Non rappresentano ancora il modello
fisiologico definitivo.

Serviranno come base per costruire
le relazioni tra:

- durata
- tipo IN / ES
- flusso
- volume
- numero di settori
*/

const ANEMOSCHESI_SOGLIE_FISIOLOGICHE = {

    durata: {

        attenzione:
            8,

        critica:
            15,

        errore:
            30

    }

};


/* =====================================================
   COSTRUZIONE ESITO
===================================================== */

function creaEsitoFisiologicoAnemoschesi(
    livello,
    codice,
    messaggio
) {

    return {

        livello:
            livello,

        codice:
            codice,

        messaggio:
            messaggio

    };

}


/* =====================================================
   CONTROLLO DURATA ASSOLUTA
===================================================== */

function valutaDurataAssolutaAnemoschesi(
    anemomero
) {

    if (
        !anemomero
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "ANEMOMERO_ASSENTE",
            "Anemomero non disponibile."
        );

    }


    const durata =
        Number(
            anemomero.durata
        );


    if (
        !Number.isFinite(
            durata
        ) ||
        durata < 1
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "DURATA_NON_VALIDA",
            "Durata dell'Anemomero non valida."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .errore
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,
            "DURATA_ESTREMA",
            "Durata fisiologicamente non plausibile."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .critica
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .CRITICO,
            "DURATA_CRITICA",
            "Durata molto elevata."
        );

    }


    if (
        durata >=
        ANEMOSCHESI_SOGLIE_FISIOLOGICHE
            .durata
            .attenzione
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ATTENZIONE,
            "DURATA_ELEVATA",
            "Durata elevata: valutare il rapporto con flusso e volume."
        );

    }


    return creaEsitoFisiologicoAnemoschesi(
        ANEMOSCHESI_ESITI_FISIOLOGICI
            .VALIDO,
        "DURATA_PLAUSIBILE",
        "Durata fisiologicamente plausibile."
    );

}

/* =====================================================
   INTENSITÀ RELATIVA DEL FLUSSO
===================================================== */

const ANEMOSCHESI_INTENSITA_FLUSSO = {

    [ANEMOS_FLUSSI.TRATTENUTO]:
        1,

    [ANEMOS_FLUSSI.DELICATO]:
        2,

    [ANEMOS_FLUSSI.SPONTANEO]:
        3,

    [ANEMOS_FLUSSI.FORZATO]:
        4

};


/* =====================================================
   VARIAZIONE REALE DI UN SETTORE
===================================================== */

function variazioneSettoreAnemoschesi(
    sequenza,
    anemomero,
    settore
) {

    if (
        !sequenza ||
        !anemomero ||
        !settore
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


    return Math.abs(
        livelloDopo -
        livelloPrima
    );

}


/* =====================================================
   VARIAZIONE COMPLESSIVA DI VOLUME
===================================================== */

function variazioneVolumeAnemomeroAnemoschesi(
    sequenza,
    anemomero
) {

    if (
        !sequenza ||
        !anemomero ||
        !Array.isArray(
            anemomero.settori
        )
    ) {

        return null;

    }


    let variazioneTotale =
        0;


    anemomero.settori.forEach(
        settore => {

            const variazione =
                variazioneSettoreAnemoschesi(
                    sequenza,
                    anemomero,
                    settore
                );


            if (
                typeof variazione ===
                "number"
            ) {

                variazioneTotale +=
                    variazione;

            }

        }
    );


    return variazioneTotale;

}
/* =====================================================
   VELOCITÀ VOLUMETRICA INTERNA
===================================================== */

/*
Indica quanti livelli complessivi di volume
vengono modificati per secondo.

Non rappresenta litri/secondo reali.
*/

function velocitaVolumetricaAnemoschesi(
    sequenza,
    anemomero
) {

    const variazione =
        variazioneVolumeAnemomeroAnemoschesi(
            sequenza,
            anemomero
        );


    const durata =
        Number(
            anemomero?.durata
        );


    if (
        typeof variazione !== "number" ||
        !Number.isFinite(
            durata
        ) ||
        durata <= 0
    ) {

        return null;

    }


    return (
        variazione /
        durata
    );

}


/* =====================================================
   FASCE DI VELOCITÀ PER FLUSSO
===================================================== */

/*
Fasce interne iniziali ANEMOSCHESI.

Più il flusso è intenso,
maggiore deve essere la quantità di volume
modificata nell'unità di tempo.

Le fasce saranno calibrate successivamente
sulla base del comportamento reale
del sistema.
*/

const ANEMOSCHESI_FASCE_FLUSSO = {

    [ANEMOS_FLUSSI.TRATTENUTO]: {

        minimo:
            0.05,

        idealeMin:
            0.10,

        idealeMax:
            0.40,

        massimo:
            0.60

    },


    [ANEMOS_FLUSSI.DELICATO]: {

        minimo:
            0.10,

        idealeMin:
            0.20,

        idealeMax:
            0.70,

        massimo:
            1.00

    },


    [ANEMOS_FLUSSI.SPONTANEO]: {

        minimo:
            0.20,

        idealeMin:
            0.35,

        idealeMax:
            1.10,

        massimo:
            1.50

    },


    [ANEMOS_FLUSSI.FORZATO]: {

        minimo:
            0.40,

        idealeMin:
            0.70,

        idealeMax:
            2.00,

        massimo:
            3.00

    }

};


/* =====================================================
   COERENZA TRA VOLUME, DURATA E FLUSSO
===================================================== */

function valutaCoerenzaFlussoAnemoschesi(
    sequenza,
    anemomero
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .VALIDO,
            "FLUSSO_NON_VALUTABILE",
            "Relazione tra flusso, volume e durata non valutabile."
        );

    }


    const velocita =
        velocitaVolumetricaAnemoschesi(
            sequenza,
            anemomero
        );


    const fascia =
        ANEMOSCHESI_FASCE_FLUSSO[
            anemomero.flusso
        ];


    if (
        velocita === null ||
        !fascia
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .VALIDO,
            "FLUSSO_NON_VALUTABILE",
            "Relazione tra flusso, volume e durata non valutabile."
        );

    }


    if (
        velocita <
            fascia.minimo ||
        velocita >
            fascia.massimo
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .CRITICO,
            "FLUSSO_INCOERENTE",
            "Flusso incoerente con durata e variazione di volume."
        );

    }


    if (
        velocita <
            fascia.idealeMin ||
        velocita >
            fascia.idealeMax
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ATTENZIONE,
            "FLUSSO_LIMITE",
            "Flusso vicino al limite di coerenza con durata e volume."
        );

    }


    return creaEsitoFisiologicoAnemoschesi(
        ANEMOSCHESI_ESITI_FISIOLOGICI
            .VALIDO,
        "FLUSSO_COHERENTE",
        "Flusso coerente con durata e variazione di volume."
    );

}
/* =====================================================
   RICONOSCIMENTO DEL PERCORSO NASALE
===================================================== */

function percorsoNasaleAnemoschesi(
    percorso
) {

    return (
        percorso ===
            ANEMOS_PERCORSI.NARICE_DESTRA ||
        percorso ===
            ANEMOS_PERCORSI.NARICE_SINISTRA ||
        percorso ===
            ANEMOS_PERCORSI.ENTRAMBE_NARICI
    );

}


/* =====================================================
   COERENZA DEL PERCORSO RESPIRATORIO
===================================================== */

/*
Il Percorso agisce come modulatore fisiologico
secondario.

Non determina da solo la coerenza
dell'Anemomero.

Principi iniziali:

- la via nasale è favorita nelle richieste
  ventilatorie basse e moderate;

- con richiesta molto elevata la sola via
  nasale diventa progressivamente meno adatta;

- la via orale è pienamente plausibile
  in espirazione;

- ES orale trattenuta e lunga NON viene
  penalizzata automaticamente;

- in inspirazione lenta e controllata,
  la bocca viene considerata meno favorevole
  della via nasale, senza essere considerata
  fisiologicamente errata.
*/

function valutaCoerenzaPercorsoAnemoschesi(
    sequenza,
    anemomero
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .VALIDO,
            "PERCORSO_NON_VALUTABILE",
            "Percorso respiratorio non valutabile."
        );

    }


    const velocita =
        velocitaVolumetricaAnemoschesi(
            sequenza,
            anemomero
        );


    if (
        velocita === null
    ) {

        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .VALIDO,
            "PERCORSO_NON_VALUTABILE",
            "Relazione tra percorso e richiesta ventilatoria non valutabile."
        );

    }


    const nasale =
        percorsoNasaleAnemoschesi(
            anemomero.percorso
        );


    const orale =
        anemomero.percorso ===
        ANEMOS_PERCORSI.BOCCA;


    /*
    =====================================================
    VIA NASALE
    =====================================================
    */

    if (
        nasale
    ) {

        /*
        Richiesta molto elevata:
        la sola via nasale diventa
        progressivamente meno favorevole.
        */

        if (
            velocita >
            ANEMOSCHESI_FASCE_FLUSSO[
                ANEMOS_FLUSSI.FORZATO
            ].idealeMax
        ) {

            return creaEsitoFisiologicoAnemoschesi(
                ANEMOSCHESI_ESITI_FISIOLOGICI
                    .ATTENZIONE,
                "NASO_RICHIESTA_ELEVATA",
                "Richiesta ventilatoria elevata per la sola via nasale."
            );

        }


        return creaEsitoFisiologicoAnemoschesi(
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .VALIDO,
            "PERCORSO_NASALE_COHERENTE",
            "Via nasale coerente con la richiesta respiratoria."
        );

    }


    /*
    =====================================================
    VIA ORALE
    =====================================================
    */

    if (
        orale
    ) {

        /*
        ESPIRAZIONE ORALE

        Anche una ES lunga e trattenuta
        può essere pienamente coerente.

        La compatibilità tra volume,
        durata e flusso viene già giudicata
        dal controllo del flusso.
        */

        if (
            anemomero.tipo ===
            ANEMOS_TIPI.ES
        ) {

            return creaEsitoFisiologicoAnemoschesi(
                ANEMOSCHESI_ESITI_FISIOLOGICI
                    .VALIDO,
                "ESPIRAZIONE_ORALE_COHERENTE",
                "Via orale fisiologicamente plausibile in espirazione."
            );

        }


        /*
        INSPIRAZIONE ORALE

        Con richiesta elevata è plausibile.

        Con respirazione lenta e controllata
        viene considerata meno favorevole
        rispetto alla via nasale.
        */

        if (
            anemomero.tipo ===
            ANEMOS_TIPI.IN
        ) {

            if (
                anemomero.flusso ===
                    ANEMOS_FLUSSI.TRATTENUTO ||
                anemomero.flusso ===
                    ANEMOS_FLUSSI.DELICATO
            ) {

                return creaEsitoFisiologicoAnemoschesi(
                    ANEMOSCHESI_ESITI_FISIOLOGICI
                        .ATTENZIONE,
                    "IN_ORALE_CONTROLLATA",
                    "Inspirazione orale poco favorevole in una respirazione lenta e controllata."
                );

            }


            return creaEsitoFisiologicoAnemoschesi(
                ANEMOSCHESI_ESITI_FISIOLOGICI
                    .VALIDO,
                "IN_ORALE_COHERENTE",
                "Via orale compatibile con la richiesta inspiratoria."
            );

        }

    }


    return creaEsitoFisiologicoAnemoschesi(
        ANEMOSCHESI_ESITI_FISIOLOGICI
            .VALIDO,
        "PERCORSO_NEUTRO",
        "Percorso respiratorio senza criticità rilevate."
    );

}

/* =====================================================
   VALUTAZIONE FISIOLOGICA DI UNA CONFIGURAZIONE CANDIDATA
===================================================== */

function valutaCandidatoFisiologicoAnemoschesi(
    sequenza,
    anemomero,
    modifiche = {}
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return null;

    }


    const candidato = {

        ...anemomero,

        ...modifiche,

        settori:
            Array.isArray(
                modifiche.settori
            )
                ? modifiche.settori
                : (
                    Array.isArray(
                        anemomero.settori
                    )
                        ? anemomero.settori.map(
                            settore => ({
                                ...settore
                            })
                        )
                        : []
                )

    };


    return valutaFisiologiaAnemomeroAnemoschesi(
        sequenza,
        candidato
    );

}
/* =====================================================
   VALUTAZIONE FISIOLOGICA DELL'ANEMOMERO
===================================================== */

function valutaFisiologiaAnemomeroAnemoschesi(
    sequenza,
    anemomero = null
) {

    if (
        anemomero === null
    ) {

        anemomero =
            sequenza;

        sequenza =
            null;

    }


    const controlli = [

        valutaDurataAssolutaAnemoschesi(
            anemomero
        )

    ];

if (
    sequenza
) {

    controlli.push(
        valutaCoerenzaFlussoAnemoschesi(
            sequenza,
            anemomero
        )
    );


    controlli.push(
        valutaCoerenzaPercorsoAnemoschesi(
            sequenza,
            anemomero
        )
    );

}
   
   const ordineGravita = {

        valido:
            0,

        attenzione:
            1,

        critico:
            2,

        errore:
            3

    };


    const peggiore =
        controlli.reduce(
            (
                risultato,
                controllo
            ) => {

                if (
                    ordineGravita[
                        controllo.livello
                    ] >
                    ordineGravita[
                        risultato.livello
                    ]
                ) {

                    return controllo;

                }


                return risultato;

            },
            controlli[0]
        );


    return {

        valido:
            peggiore.livello !==
            ANEMOSCHESI_ESITI_FISIOLOGICI
                .ERRORE,

        livello:
            peggiore.livello,

        esitoPrincipale:
            peggiore,

        controlli:
            controlli,

        variazioneVolume:
            sequenza
                ? variazioneVolumeAnemomeroAnemoschesi(
                    sequenza,
                    anemomero
                )
                : null

    };

}
/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole fisiologiche caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_FISIOLOGICHE_VERSIONE

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE FISIOLOGICHE
=========================================================
*/
