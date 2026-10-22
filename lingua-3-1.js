/*
=====================================================
ANEMOS 3.1
SISTEMA LINGUA
=====================================================

Gestisce esclusivamente la terminologia mostrata
all'utilizzatore.

Non modifica i nomi tecnici interni, i dati
o la logica di ANEMOS.
=====================================================
*/


const ANEMOS_LINGUA = {

    TECNICA: "anemos",
    ITALIANO: "italiano"

};


let anemosLinguaCorrente =
    localStorage.getItem(
        "ANEMOS_LINGUA"
    ) || ANEMOS_LINGUA.TECNICA;


/*
=====================================================
DIZIONARIO
=====================================================
*/

const ANEMOS_DIZIONARIO = {

    ANEMOS: {
        anemos: "ANEMOS",
        italiano: "Padroneggiare il respiro"
    },

    ANEMOMERO: {
        anemos: "Anemomero",
        italiano: "Fase respiratoria"
    },

    ANEMODROMO: {
        anemos: "Anemodromo",
        italiano: "Atto respiratorio"
    },

    ANEMOGRAMMA: {
        anemos: "Anemogramma",
        italiano: "Visualizzatore"
    },

    ANEMOGRAFO: {
        anemos: "Anemografo",
        italiano: "Animatore di respirazioni"
    },

    ANEMOSYSTEMA: {
        anemos: "Anemosystema",
        italiano: "Sequenza di atti respiratori"
    },

    ANEMOSCHESI: {
        anemos: "Anemoschesi",
        italiano: "Misuratore di coerenza"
    },

    ANEMOSYNTHESIS: {
        anemos: "Anemosynthesis",
        italiano: "Programma respiratorio"
    },

    ASY: {
        anemos: "ASY",
        italiano: "Misuratore di complessità"
    },

    ANEMOBAROS: {
        anemos: "Anemobaros",
        italiano: "Misuratore di intensità"
    },

    ABS: {
        anemos: "ABS",
        italiano: "Misuratore di intensità"
    },

    ASC: {
        anemos: "ASC",
        italiano: "Misuratore di coerenza"
    },

    IN: {
        anemos: "IN",
        italiano: "Inspirazione"
    },

    ES: {
        anemos: "ES",
        italiano: "Espirazione"
    },

    APV: {
        anemos: "APV",
        italiano: "Apnea vuota"
    },

    APP: {
        anemos: "APP",
        italiano: "Apnea piena"
    },

    INTENTO: {
        anemos: "Intento",
        italiano: "Intento"
    },

    SETTORI: {
        anemos: "Settori",
        italiano: "Zone respiratorie"
    },

    VOLUMI: {
        anemos: "Volumi",
        italiano: "Quantità d'aria"
    },

    DURATA: {
        anemos: "Durata",
        italiano: "Durata"
    },

    PERCORSO: {
        anemos: "Percorso",
        italiano: "Via dell'aria"
    },

    FLUSSO: {
        anemos: "Flusso",
        italiano: "Flusso"
    },

    STATO_BIOMECCANICO: {
        anemos: "Stato biomeccanico",
        italiano: "Assetto respiratorio"
    }

};


/*
=====================================================
LETTURA TERMINE
=====================================================
*/

function anemosTermine(
    chiave
) {

    const voce =
        ANEMOS_DIZIONARIO[
            chiave
        ];


    if (!voce) {
        return chiave;
    }


    return (
        voce[
            anemosLinguaCorrente
        ] ||
        voce.anemos ||
        chiave
    );

}


/*
=====================================================
CAMBIO LINGUA
=====================================================
*/

function anemosImpostaLingua(
    lingua
) {

    if (
        lingua !==
            ANEMOS_LINGUA.TECNICA &&
        lingua !==
            ANEMOS_LINGUA.ITALIANO
    ) {
        return;
    }


    anemosLinguaCorrente =
        lingua;


    localStorage.setItem(
        "ANEMOS_LINGUA",
        lingua
    );

}


/*
=====================================================
LETTURA LINGUA CORRENTE
=====================================================
*/

function anemosOttieniLingua() {

    return anemosLinguaCorrente;

}
