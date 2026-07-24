/*
=========================================================
ANEMOS 3.1
MODELLO DATI + STATO RESPIRATORIO
=========================================================

ANEMODROMO
- tipo: IN / ES
- durata: secondi interi
- percorso
- flusso
- settori attivi
- volume percettivo indipendente per settore

APNEA
- elemento temporale separato
- non modifica lo stato dei settori

STATO RESPIRATORIO
- determina quali settori contengono ancora aria
  in ogni punto della timeline
- serve al Motore di Coerenza

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
   PERCORSO
===================================================== */

const ANEMOS_PERCORSI = {
    NARICE_DESTRA: "narice_destra",
    NARICE_SINISTRA: "narice_sinistra",
    ENTRAMBE_NARICI: "entrambe_narici",
    BOCCA: "bocca"
};



/* =====================================================
   FLUSSO
===================================================== */

const ANEMOS_FLUSSI = {
    TRATTENUTO: "trattenuto",
    DELICATO: "delicato",
    SPONTANEO: "spontaneo",
    FORZATO: "forzato"
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
    ADDOME: "addome",
    TORACE_INFERIORE: "torace_inferiore",
    TORACE_SUPERIORE: "torace_superiore"
};


const ANEMOS_ELENCO_SETTORI = [

    ANEMOS_SETTORI.ADDOME,

    ANEMOS_SETTORI.TORACE_INFERIORE,

    ANEMOS_SETTORI.TORACE_SUPERIORE

];



/* =====================================================
   VOLUME PERCETTIVO
===================================================== */

const ANEMOS_VOLUMI = {

    BASSO: "basso",

    CONFORTEVOLE: "confortevole",

    PIENO: "pieno",

    VUOTO: "vuoto"

};



/* =====================================================
   VOLUMI DISPONIBILI PER TIPO
===================================================== */

function ottieniVolumiPerTipo(tipo) {

    if (tipo === ANEMOS_TIPI.ES) {

        return [
            ANEMOS_VOLUMI.BASSO,
            ANEMOS_VOLUMI.CONFORTEVOLE,
            ANEMOS_VOLUMI.VUOTO
        ];

    }


    return [
        ANEMOS_VOLUMI.BASSO,
        ANEMOS_VOLUMI.CONFORTEVOLE,
        ANEMOS_VOLUMI.PIENO
    ];

}



function volumePredefinitoPerTipo(tipo) {

    return ANEMOS_VOLUMI.CONFORTEVOLE;

}



function volumeValidoPerTipo(
    tipo,
    volume
) {

    return ottieniVolumiPerTipo(tipo)
        .includes(volume);

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
        Number(valore);


    if (!Number.isFinite(numero)) {

        return minimo;

    }


    return Math.max(
        minimo,
        Math.round(numero)
    );

}



/* =====================================================
   SETTORE RESPIRATORIO
===================================================== */

function creaSettore(
    nome,
    volume =
        ANEMOS_VOLUMI.CONFORTEVOLE
) {

    return {
        nome: nome,
        volume: volume
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
    volume = null
) {

    if (
        settoreAttivo(
            anemodromo,
            nomeSettore
        )
    ) {

        return anemodromo;

    }


    const volumeIniziale =
        volume ||
        volumePredefinitoPerTipo(
            anemodromo.tipo
        );


    anemodromo.settori.push(

        creaSettore(
            nomeSettore,
            volumeIniziale
        )

    );


    return anemodromo;

}



function disattivaSettore(
    anemodromo,
    nomeSettore
) {

    anemodromo.settori =
        anemodromo.settori.filter(
            settore =>
                settore.nome !==
                nomeSettore
        );


    return anemodromo;

}



/* =====================================================
   VOLUME DEL SETTORE
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
        anemodromo.settori.find(
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

    const vecchioTipo =
        anemodromo.tipo;


    if (vecchioTipo === tipo) {

        return anemodromo;

    }


    anemodromo.tipo =
        tipo;


    anemodromo.settori.forEach(
        settore => {

            if (
                tipo ===
                    ANEMOS_TIPI.ES &&
                settore.volume ===
                    ANEMOS_VOLUMI.PIENO
            ) {

                settore.volume =
                    ANEMOS_VOLUMI.VUOTO;

            }


            if (
                tipo ===
                    ANEMOS_TIPI.IN &&
                settore.volume ===
                    ANEMOS_VOLUMI.VUOTO
            ) {

                settore.volume =
                    ANEMOS_VOLUMI.PIENO;

            }

        }
    );


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
    anemodromoSuccessivoId,
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
        sequenza.anemodromi.find(
            anemodromo =>
                anemodromo.id === id
        ) || null
    );

}



/* =====================================================
   APNEE
===================================================== */

function trovaApneaTra(
    sequenza,
    precedenteId,
    successivoId
) {

    return (
        sequenza.apnee.find(
            apnea =>
                apnea.precedente ===
                    precedenteId &&
                apnea.successivo ===
                    successivoId
        ) || null
    );

}



function inserisciApnea(
    sequenza,
    precedenteId,
    successivoId,
    durata = 1
) {

    const esistente =
        trovaApneaTra(
            sequenza,
            precedenteId,
            successivoId
        );


    if (esistente) {

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
    successivoId
) {

    sequenza.apnee =
        sequenza.apnee.filter(
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
        sequenza.anemodromi.filter(
            elemento =>
                elemento.id !==
                anemodromoId
        );


    sequenza.ordine =
        sequenza.ordine.filter(
            id =>
                id !==
                anemodromoId
        );


    sequenza.apnee =
        sequenza.apnee.filter(
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

        .filter(Boolean);

}



/* =====================================================
   MOTORE DI COERENZA
   STATO DEI SETTORI
===================================================== */

/*
Lo stato non misura litri o percentuali.

Indica soltanto se, in quel punto della
timeline, il settore contiene aria utile
per una successiva espirazione.

false = settore non disponibile all'ES
true  = settore disponibile all'ES
*/

function creaStatoSettoriVuoto() {

    return {

        [ANEMOS_SETTORI.ADDOME]:
            false,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            false,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            false

    };

}



/*
Crea una copia indipendente dello stato.
*/

function copiaStatoSettori(
    stato
) {

    return {

        [ANEMOS_SETTORI.ADDOME]:
            Boolean(
                stato[
                    ANEMOS_SETTORI.ADDOME
                ]
            ),

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            Boolean(
                stato[
                    ANEMOS_SETTORI
                        .TORACE_INFERIORE
                ]
            ),

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            Boolean(
                stato[
                    ANEMOS_SETTORI
                        .TORACE_SUPERIORE
                ]
            )

    };

}



/*
Applica un singolo Anemodromo allo stato.

IN:
qualsiasi settore coinvolto diventa
disponibile all'espirazione.

ES Basso:
rimane aria.

ES Confortevole:
rimane aria.

ES Vuoto:
il settore viene considerato svuotato.
*/

function applicaAnemodromoAlloStato(
    stato,
    anemodromo
) {

    const nuovoStato =
        copiaStatoSettori(
            stato
        );


    anemodromo.settori.forEach(
        settore => {

            const nome =
                settore.nome;


            if (
                anemodromo.tipo ===
                ANEMOS_TIPI.IN
            ) {

                nuovoStato[nome] =
                    true;

                return;

            }


            if (
                anemodromo.tipo ===
                    ANEMOS_TIPI.ES
            ) {

                /*
                Se il settore era già vuoto,
                rimane vuoto.

                Questo controllo verrà poi
                anticipato dall'interfaccia,
                che impedirà la selezione.
                */

                if (
                    !nuovoStato[nome]
                ) {

                    return;

                }


                if (
                    settore.volume ===
                    ANEMOS_VOLUMI.VUOTO
                ) {

                    nuovoStato[nome] =
                        false;

                } else {

                    nuovoStato[nome] =
                        true;

                }

            }

        }
    );


    return nuovoStato;

}



/*
Calcola lo stato dei settori PRIMA
di un determinato Anemodromo.

È questa la funzione principale che
userà l'editor ES.

Esempio:

IN Addome
IN Torace inferiore
ES ...

prima dell'ES:

Addome           = true
Torace inferiore = true
Torace superiore = false
*/

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



/*
Verifica se un settore può essere utilizzato
da un Anemodromo espiratorio in quel punto
della timeline.
*/

function settoreDisponibilePerEspirazione(
    sequenza,
    anemodromoId,
    nomeSettore
) {

    const stato =
        statoSettoriPrimaDi(
            sequenza,
            anemodromoId
        );


    return Boolean(
        stato[nomeSettore]
    );

}



/*
Restituisce l'elenco dei soli settori
disponibili per l'espirazione.
*/

function settoriDisponibiliPerEspirazione(
    sequenza,
    anemodromoId
) {

    const stato =
        statoSettoriPrimaDi(
            sequenza,
            anemodromoId
        );


    return ANEMOS_ELENCO_SETTORI
        .filter(
            settore =>
                stato[settore]
        );

}



/*
Calcola lo stato finale dopo l'intera
sequenza.

Sarà utile successivamente per:

- validazione
- player
- riepilogo
- Motore di Coerenza
*/

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

    const errori = [];


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


    anemodromo.settori.forEach(
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
