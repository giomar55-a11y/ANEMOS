/*
=========================================================
ANEMOS 3.1
MODELLO DATI + MOTORE DI COERENZA
=========================================================

MODELLO DEL VOLUME

Ogni settore possiede uno stato ordinato:

0 = VUOTO
1 = SCARSO
2 = CONFORTEVOLE
3 = ABBONDANTE
4 = PIENO

ANEMODROMO IN
può soltanto portare il settore
verso un livello SUPERIORE.

ANEMODROMO ES
può soltanto portare il settore
verso un livello INFERIORE.

Non è consentito restare allo stesso livello.

=========================================================
*/


/* =====================================================
   TIPO DI ANEMODROMO
===================================================== */

const ANEMOS_TIPI = {
    IN: "IN",
    ES: "ES"
};

/* =====================================================
   LIMITE ANEMODROMO
===================================================== */

const ANEMOS_MAX_ANEMOMERI =
    12;

/* =====================================================
   PERCORSO
===================================================== */

const ANEMOS_PERCORSI = {

    NARICE_DESTRA:
        "narice_destra",

    NARICE_SINISTRA:
        "narice_sinistra",

    ENTRAMBE_NARICI:
        "entrambe_narici",

    BOCCA:
        "bocca"

};



/* =====================================================
   FLUSSO
===================================================== */

const ANEMOS_FLUSSI = {

    TRATTENUTO:
        "trattenuto",

    DELICATO:
        "delicato",

    SPONTANEO:
        "spontaneo",

    FORZATO:
        "forzato"

};


const ANEMOS_ICONE_FLUSSO = {

    trattenuto: "🕸️",

    delicato: "☁️",

    spontaneo: "💨",

    forzato: "🌪️"

};



/* =====================================================
   SETTORI
===================================================== */

const ANEMOS_SETTORI = {

    ADDOME:
        "addome",

    TORACE_INFERIORE:
        "torace_inferiore",

    TORACE_SUPERIORE:
        "torace_superiore"

};


const ANEMOS_ELENCO_SETTORI = [

    ANEMOS_SETTORI.ADDOME,

    ANEMOS_SETTORI.TORACE_INFERIORE,

    ANEMOS_SETTORI.TORACE_SUPERIORE

];



/* =====================================================
   VOLUMI
===================================================== */

/*
I valori rappresentano lo STATO
raggiunto dal settore.

VUOTO         = 0
SCARSO        = 1
CONFORTEVOLE  = 2
ABBONDANTE    = 3
PIENO         = 4
*/

const ANEMOS_VOLUMI = {

    VUOTO:
        "vuoto",

    SCARSO:
        "scarso",

    CONFORTEVOLE:
        "confortevole",

    ABBONDANTE:
        "abbondante",

    PIENO:
        "pieno"

};



/* =====================================================
   LIVELLI NUMERICI DEL VOLUME
===================================================== */

const ANEMOS_LIVELLI_VOLUME = {

    [ANEMOS_VOLUMI.VUOTO]:
        0,

    [ANEMOS_VOLUMI.SCARSO]:
        1,

    [ANEMOS_VOLUMI.CONFORTEVOLE]:
        2,

    [ANEMOS_VOLUMI.ABBONDANTE]:
        3,

    [ANEMOS_VOLUMI.PIENO]:
        4

};



/* =====================================================
   VOLUMI MOSTRATI PER TIPO
===================================================== */

function ottieniVolumiPerTipo(
    tipo
) {

    if (
        tipo ===
        ANEMOS_TIPI.ES
    ) {

        /*
        Ordine grafico ES:

        Abbondante
        Confortevole
        Scarso
        Vuoto
        */

        return [

            ANEMOS_VOLUMI
                .ABBONDANTE,

            ANEMOS_VOLUMI
                .CONFORTEVOLE,

            ANEMOS_VOLUMI
                .SCARSO,

            ANEMOS_VOLUMI
                .VUOTO

        ];

    }


    /*
    Ordine grafico IN:

    Scarso
    Confortevole
    Abbondante
    Pieno
    */

    return [

        ANEMOS_VOLUMI
            .SCARSO,

        ANEMOS_VOLUMI
            .CONFORTEVOLE,

        ANEMOS_VOLUMI
            .ABBONDANTE,

        ANEMOS_VOLUMI
            .PIENO

    ];

}



/* =====================================================
   LIVELLO DI UN VOLUME
===================================================== */

function livelloVolume(
    volume
) {

    const livello =
        ANEMOS_LIVELLI_VOLUME[
            volume
        ];


    if (
        typeof livello !==
        "number"
    ) {

        return null;

    }


    return livello;

}



/* =====================================================
   VOLUME DA LIVELLO
===================================================== */

function volumeDaLivello(
    livello
) {

    const voce =
        Object.entries(
            ANEMOS_LIVELLI_VOLUME
        )
        .find(
            ([volume, valore]) =>
                valore === livello
        );


    return voce
        ? voce[0]
        : null;

}



/* =====================================================
   CONTROLLO VOLUME PER TIPO
===================================================== */

function volumeValidoPerTipo(
    tipo,
    volume
) {

    return ottieniVolumiPerTipo(
        tipo
    )
    .includes(
        volume
    );

}



/* =====================================================
   UTILITÀ
===================================================== */

function creaId(
    prefisso = "elemento"
) {

    return (
        prefisso +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}



function normalizzaSecondi(
    valore,
    minimo = 0
) {

    const numero =
        Number(
            valore
        );


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return minimo;

    }


    return Math.max(
        minimo,
        Math.round(
            numero
        )
    );

}



/* =====================================================
   SETTORE RESPIRATORIO
===================================================== */

function creaSettore(
    nome,
    volume
) {

    return {

        nome:
            nome,

        volume:
            volume

    };

}



/* =====================================================
   ANEMODROMO
===================================================== */

function creaAnemodromo(
    tipo = ANEMOS_TIPI.IN
) {

    return {

        id:
            creaId(
                "anemodromo"
            ),

        tipo:
            tipo,

        durata:
            1,

        percorso:
            ANEMOS_PERCORSI
                .ENTRAMBE_NARICI,

        flusso:
            ANEMOS_FLUSSI
                .SPONTANEO,

        settori:
            []

    };

}



/* =====================================================
   GESTIONE SETTORI
===================================================== */

function settoreAttivo(
    anemodromo,
    nomeSettore
) {

    return anemodromo
        .settori
        .some(
            settore =>
                settore.nome ===
                nomeSettore
        );

}



function attivaSettore(
    anemodromo,
    nomeSettore,
    volume
) {

    if (
        settoreAttivo(
            anemodromo,
            nomeSettore
        )
    ) {

        return anemodromo;

    }


    anemodromo
        .settori
        .push(

            creaSettore(
                nomeSettore,
                volume
            )

        );


    return anemodromo;

}



function disattivaSettore(
    anemodromo,
    nomeSettore
) {

    anemodromo.settori =
        anemodromo
            .settori
            .filter(
                settore =>
                    settore.nome !==
                    nomeSettore
            );


    return anemodromo;

}



/* =====================================================
   MODIFICA VOLUME DEL SETTORE
===================================================== */

function impostaVolumeSettore(
    anemodromo,
    nomeSettore,
    volume
) {

    if (
        !volumeValidoPerTipo(
            anemodromo.tipo,
            volume
        )
    ) {

        return false;

    }


    const settore =
        anemodromo
            .settori
            .find(
                elemento =>
                    elemento.nome ===
                    nomeSettore
            );


    if (!settore) {

        return false;

    }


    settore.volume =
        volume;


    return true;

}



/* =====================================================
   MODIFICA TIPO
===================================================== */

function impostaTipo(
    anemodromo,
    tipo
) {

    if (
        tipo !==
            ANEMOS_TIPI.IN &&
        tipo !==
            ANEMOS_TIPI.ES
    ) {

        return anemodromo;

    }


    if (
        anemodromo.tipo ===
        tipo
    ) {

        return anemodromo;

    }


    anemodromo.tipo =
        tipo;


    /*
    Cambiando direzione,
    eliminiamo i settori già configurati.

    È la soluzione più sicura:
    sarà l'utente a riselezionarli
    secondo lo stato reale della timeline.
    */

    anemodromo.settori =
        [];


    return anemodromo;

}



/* =====================================================
   DURATA
===================================================== */

function impostaDurata(
    anemodromo,
    secondi
) {

    anemodromo.durata =
        normalizzaSecondi(
            secondi,
            1
        );


    return anemodromo;

}



/* =====================================================
   PERCORSO
===================================================== */

function impostaPercorso(
    anemodromo,
    percorso
) {

    anemodromo.percorso =
        percorso;


    return anemodromo;

}



/* =====================================================
   FLUSSO
===================================================== */

function impostaFlusso(
    anemodromo,
    flusso
) {

    anemodromo.flusso =
        flusso;


    return anemodromo;

}



/* =====================================================
   APNEA
===================================================== */

function creaApnea(
    anemodromoPrecedenteId,
    anemodromoSuccessivoId = null,
    durata = 1
) {

    return {

        id:
            creaId(
                "apnea"
            ),

        precedente:
            anemodromoPrecedenteId,

        successivo:
            anemodromoSuccessivoId,

        durata:
            normalizzaSecondi(
                durata,
                1
            )

    };

}



/* =====================================================
   SEQUENZA
===================================================== */

function creaSequenzaAnemos() {

    return {

        id:
            creaId(
                "sequenza"
            ),

        anemodromi:
            [],

        ordine:
            [],

        apnee:
            []

    };

}



/* =====================================================
   AGGIUNTA ANEMODROMO
===================================================== */

function aggiungiAnemodromo(
    sequenza,
    anemodromo
) {
if (
    sequenza.anemodromi.length >=
    ANEMOS_MAX_ANEMOMERI
) {

    return null;

}
    const precedenteId =
        sequenza.ordine.length > 0

            ? sequenza.ordine[
                sequenza.ordine.length - 1
            ]

            : null;


    /*
    Se esiste un'apnea finale
    dopo l'attuale ultimo Anemodromo,
    collegandone uno nuovo quella apnea
    diventa automaticamente intermedia.
    */

    if (
        precedenteId
    ) {

        const apneaFinale =
            sequenza
                .apnee
                .find(
                    apnea =>
                        apnea.precedente ===
                            precedenteId &&
                        apnea.successivo ===
                            null
                );


        if (
            apneaFinale
        ) {

            apneaFinale.successivo =
                anemodromo.id;

        }

    }


    sequenza.anemodromi.push(
        anemodromo
    );


    sequenza.ordine.push(
        anemodromo.id
    );


    return anemodromo;

}



/* =====================================================
   RICERCA ANEMODROMO
===================================================== */

function trovaAnemodromo(
    sequenza,
    id
) {

    return (
        sequenza
            .anemodromi
            .find(
                anemodromo =>
                    anemodromo.id ===
                    id
            )
        ||
        null
    );

}

/* =====================================================
   ANEMOMERO PRECEDENTE
===================================================== */

function trovaAnemomeroPrecedente(
    sequenza,
    anemomeroId
) {

    const indice =
        sequenza.ordine.indexOf(
            anemomeroId
        );


    if (
        indice <= 0
    ) {

        return null;

    }


    const precedenteId =
        sequenza.ordine[
            indice - 1
        ];


    return trovaAnemodromo(
        sequenza,
        precedenteId
    );

}

/* =====================================================
   APNEE
===================================================== */

function trovaApneaTra(
    sequenza,
    precedenteId,
    successivoId = null
) {

    return (
        sequenza
            .apnee
            .find(
                apnea =>
                    apnea.precedente ===
                        precedenteId &&
                    apnea.successivo ===
                        successivoId
            )
        ||
        null
    );

}



function inserisciApnea(
    sequenza,
    precedenteId,
    successivoId = null,
    durata = 1
) {

    const esistente =
        trovaApneaTra(
            sequenza,
            precedenteId,
            successivoId
        );


    if (
        esistente
    ) {

        esistente.durata =
            normalizzaSecondi(
                durata,
                1
            );


        return esistente;

    }


    const apnea =
        creaApnea(
            precedenteId,
            successivoId,
            durata
        );


    sequenza.apnee.push(
        apnea
    );


    return apnea;

}



function rimuoviApnea(
    sequenza,
    precedenteId,
    successivoId = null
) {

    sequenza.apnee =
        sequenza
            .apnee
            .filter(
                apnea =>
                    !(
                        apnea.precedente ===
                            precedenteId &&
                        apnea.successivo ===
                            successivoId
                    )
            );

}



/* =====================================================
   ELIMINAZIONE ANEMODROMO
===================================================== */

function eliminaAnemodromo(
    sequenza,
    anemodromoId
) {

    sequenza.anemodromi =
        sequenza
            .anemodromi
            .filter(
                elemento =>
                    elemento.id !==
                    anemodromoId
            );


    sequenza.ordine =
        sequenza
            .ordine
            .filter(
                id =>
                    id !==
                    anemodromoId
            );


    sequenza.apnee =
        sequenza
            .apnee
            .filter(
                apnea =>
                    apnea.precedente !==
                        anemodromoId &&
                    apnea.successivo !==
                        anemodromoId
            );

}



/* =====================================================
   ANEMODROMI ORDINATI
===================================================== */

function ottieniAnemodromiOrdinati(
    sequenza
) {

    return sequenza.ordine

        .map(
            id =>
                trovaAnemodromo(
                    sequenza,
                    id
                )
        )

        .filter(
            Boolean
        );

}



/* =====================================================
   STATO RESPIRATORIO
===================================================== */

/*
Ogni settore parte da VUOTO = livello 0.
*/

function creaStatoSettoriVuoto() {

    return {

        [ANEMOS_SETTORI.ADDOME]:
            0,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            0,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            0

    };

}



function copiaStatoSettori(
    stato
) {

    return {

        [ANEMOS_SETTORI.ADDOME]:
            stato[
                ANEMOS_SETTORI.ADDOME
            ],

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            stato[
                ANEMOS_SETTORI
                    .TORACE_INFERIORE
            ],

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            stato[
                ANEMOS_SETTORI
                    .TORACE_SUPERIORE
            ]

    };

}



/* =====================================================
   APPLICAZIONE DI UN ANEMODROMO ALLO STATO
===================================================== */

function applicaAnemodromoAlloStato(
    stato,
    anemodromo
) {

    const nuovoStato =
        copiaStatoSettori(
            stato
        );


    anemodromo
        .settori
        .forEach(
            settore => {

                const nome =
                    settore.nome;


                const livelloDestinazione =
                    livelloVolume(
                        settore.volume
                    );


                if (
                    livelloDestinazione ===
                    null
                ) {

                    return;

                }


                const livelloAttuale =
                    nuovoStato[
                        nome
                    ];


                /*
                IN:
                può soltanto aumentare.
                */

                if (
                    anemodromo.tipo ===
                    ANEMOS_TIPI.IN
                ) {

                    if (
                        livelloDestinazione >
                        livelloAttuale
                    ) {

                        nuovoStato[nome] =
                            livelloDestinazione;

                    }


                    return;

                }


                /*
                ES:
                può soltanto diminuire.
                */

                if (
                    anemodromo.tipo ===
                    ANEMOS_TIPI.ES
                ) {

                    if (
                        livelloDestinazione <
                        livelloAttuale
                    ) {

                        nuovoStato[nome] =
                            livelloDestinazione;

                    }

                }

            }
        );


    return nuovoStato;

}



/* =====================================================
   STATO PRIMA DI UN ANEMODROMO
===================================================== */

function statoSettoriPrimaDi(
    sequenza,
    anemodromoId
) {

    let stato =
        creaStatoSettoriVuoto();


    const anemodromi =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    for (
        const anemodromo
        of anemodromi
    ) {

        if (
            anemodromo.id ===
            anemodromoId
        ) {

            break;

        }


        stato =
            applicaAnemodromoAlloStato(
                stato,
                anemodromo
            );

    }


    return stato;

}



/* =====================================================
   LIVELLO ATTUALE DI UN SETTORE
===================================================== */

function livelloSettorePrimaDi(
    sequenza,
    anemodromoId,
    nomeSettore
) {

    const stato =
        statoSettoriPrimaDi(
            sequenza,
            anemodromoId
        );


    return stato[
        nomeSettore
    ];

}



/* =====================================================
   DISPONIBILITÀ SETTORE PER IN
===================================================== */

function settoreDisponibilePerInspirazione(
    sequenza,
    anemodromoId,
    nomeSettore
) {

    const livello =
        livelloSettorePrimaDi(
            sequenza,
            anemodromoId,
            nomeSettore
        );


    return livello < 4;

}



/* =====================================================
   DISPONIBILITÀ SETTORE PER ES
===================================================== */

function settoreDisponibilePerEspirazione(
    sequenza,
    anemodromoId,
    nomeSettore
) {

    const livello =
        livelloSettorePrimaDi(
            sequenza,
            anemodromoId,
            nomeSettore
        );


    return livello > 0;

}



/* =====================================================
   VOLUMI CONSENTITI PER UN SETTORE
===================================================== */

/*
Questa è la funzione centrale
del nuovo Motore di Coerenza.

IN:
restituisce soltanto livelli
SUPERIORI allo stato attuale.

ES:
restituisce soltanto livelli
INFERIORI allo stato attuale.
*/

function volumiDisponibiliPerSettore(
    sequenza,
    anemodromoId,
    nomeSettore,
    tipo
) {

    const livelloAttuale =
        livelloSettorePrimaDi(
            sequenza,
            anemodromoId,
            nomeSettore
        );


    return ottieniVolumiPerTipo(
        tipo
    )
    .filter(
        volume => {

            const livello =
                livelloVolume(
                    volume
                );


           /*
CONFORTEVOLE è uno stato speciale.

Può essere mantenuto allo stesso livello
quando cambia la fase respiratoria:

IN confortevole -> ES confortevole
ES confortevole -> IN confortevole
*/

const precedente =
    trovaAnemomeroPrecedente(
        sequenza,
        anemodromoId
    );


const cambioFase =
    precedente &&
    precedente.tipo !==
        tipo;


const mantieneConfortevole =
    livelloAttuale ===
        ANEMOS_LIVELLI_VOLUME[
            ANEMOS_VOLUMI.CONFORTEVOLE
        ] &&
    volume ===
        ANEMOS_VOLUMI.CONFORTEVOLE &&
    cambioFase;


if (
    mantieneConfortevole
) {

    return true;

}


if (
    tipo ===
    ANEMOS_TIPI.IN
) {

    return (
        livello >
        livelloAttuale
    );

}


return (
    livello <
    livelloAttuale
);
}
    );


}


/* =====================================================
   PRIMO VOLUME CONSENTITO
===================================================== */

/*
Serve quando l'utente attiva
un settore nel nuovo Anemodromo.

Viene selezionato automaticamente
il primo livello coerente disponibile.
*/

function primoVolumeDisponibilePerSettore(
    sequenza,
    anemodromoId,
    nomeSettore,
    tipo
) {

    const disponibili =
        volumiDisponibiliPerSettore(
            sequenza,
            anemodromoId,
            nomeSettore,
            tipo
        );


    return disponibili.length > 0
        ? disponibili[0]
        : null;

}



/* =====================================================
   STATO FINALE
===================================================== */

function statoSettoriFinale(
    sequenza
) {

    let stato =
        creaStatoSettoriVuoto();


    const anemodromi =
        ottieniAnemodromiOrdinati(
            sequenza
        );


    anemodromi.forEach(
        anemodromo => {

            stato =
                applicaAnemodromoAlloStato(
                    stato,
                    anemodromo
                );

        }
    );


    return stato;

}



/* =====================================================
   VALIDAZIONE ANEMODROMO
===================================================== */

function validaAnemodromo(
    anemodromo
) {

    const errori =
        [];


    if (
        anemodromo.tipo !==
            ANEMOS_TIPI.IN &&
        anemodromo.tipo !==
            ANEMOS_TIPI.ES
    ) {

        errori.push(
            "Tipo di Anemodromo non valido."
        );

    }


    if (
        !Number.isInteger(
            anemodromo.durata
        ) ||
        anemodromo.durata < 1
    ) {

        errori.push(
            "La durata deve essere espressa in secondi interi."
        );

    }


    if (
        anemodromo.settori.length ===
        0
    ) {

        errori.push(
            "Deve essere selezionato almeno un settore."
        );

    }


    anemodromo
        .settori
        .forEach(
            settore => {

                if (
                    !volumeValidoPerTipo(
                        anemodromo.tipo,
                        settore.volume
                    )
                ) {

                    errori.push(
                        "Volume non compatibile con il tipo di Anemodromo."
                    );

                }

            }
        );


    return {

        valido:
            errori.length === 0,

        errori:
            errori

    };

}



/* =====================================================
   STATO INIZIALE
===================================================== */

const anemos31 =
    creaSequenzaAnemos();



/*
=========================================================
FINE MODELLO ANEMOS 3.1
=========================================================
*/
