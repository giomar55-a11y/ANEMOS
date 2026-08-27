/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — REGOLE VOLUMETRICHE
=========================================================

Contiene esclusivamente i DATI utilizzati
per interpretare il comportamento volumetrico
dell'Anemomero rispetto agli Intenti.

Questo file NON esegue valutazioni.

Struttura:

1. coordinate dei volumi
2. pesi del nucleo volumetrico
3. pesi complessivi dell'Anemomero
4. soglie di dominanza
5. stato volumetrico per Intento
6. escursione per Intento
7. direzione per Intento
8. distribuzione per Intento

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_REGOLE_VOLUMETRICHE_VERSIONE =
    "0.1";


/* =====================================================
   SCALA QUALITATIVA INTERNA
===================================================== */

/*
+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole

Non sono percentuali.
Sono contributi elementari.
*/

const ANEMOSCHESI_SCALA_VOLUMETRICA = {

    MOLTO_SFAVOREVOLE:
        -2,

    SFAVOREVOLE:
        -1,

    NEUTRO:
        0,

    FAVOREVOLE:
        1,

    MOLTO_FAVOREVOLE:
        2

};


/* =====================================================
   COORDINATE DEI VOLUMI
===================================================== */

/*
La coordinata descrive lo stato volumetrico
rispetto al centro CONFORTEVOLE.

VUOTO          = -2
SCARSO         = -1
CONFORTEVOLE   =  0
ABBONDANTE     = +1
PIENO          = +2

Questa coordinata NON rappresenta
la qualità dell'Intento.
*/

const ANEMOSCHESI_COORDINATE_VOLUME = {

    [ANEMOS_VOLUMI.VUOTO]:
        -2,

    [ANEMOS_VOLUMI.SCARSO]:
        -1,

    [ANEMOS_VOLUMI.CONFORTEVOLE]:
        0,

    [ANEMOS_VOLUMI.ABBONDANTE]:
        1,

    [ANEMOS_VOLUMI.PIENO]:
        2

};


/* =====================================================
   PESI INTERNI DEL NUCLEO VOLUMETRICO
===================================================== */

const ANEMOSCHESI_PESI_NUCLEO_VOLUMETRICO = {

    stato:
        0.20,

    escursione:
        0.20,

    direzione:
        0.10,

    settore:
        0.20,

    distribuzione:
        0.30

};
/* =====================================================
   PESI COMPLESSIVI DELL'ANEMOMERO
===================================================== */

/*
Il nucleo volumetrico costituisce
la componente biomeccanica principale.

Percorso resta volutamente secondario.
*/

const ANEMOSCHESI_PESI_ANEMOMERO = {

    volume:
        0.45,

    durata:
        0.25,

    flusso:
        0.20,

    percorso:
        0.10

};


/* =====================================================
   SOGLIE DI DOMINANZA VOLUMETRICA
===================================================== */

/*
Queste soglie verranno applicate
successivamente dal motore.

Sotto 30:
il risultato non potrà superare ROSSO.

Da 30 a 49:
il risultato non potrà superare GIALLO.

Da 50:
nessuna limitazione.
*/

const ANEMOSCHESI_DOMINANZA_VOLUMETRICA = {

    massimoRossoSotto:
        30,

    massimoGialloSotto:
        50

};


/* =====================================================
   STATO VOLUMETRICO × INTENTO
===================================================== */

const ANEMOSCHESI_STATO_VOLUME_INTENTI = {

    calmare: {

        [ANEMOS_VOLUMI.VUOTO]:
            -2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    scaricare: {

        [ANEMOS_VOLUMI.VUOTO]:
            2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            0,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            -1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    recuperare: {

        [ANEMOS_VOLUMI.VUOTO]:
            -2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    riposare: {

        [ANEMOS_VOLUMI.VUOTO]:
            -2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    percepire: {

        [ANEMOS_VOLUMI.VUOTO]:
            1,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            1

    },


    coordinare: {

        [ANEMOS_VOLUMI.VUOTO]:
            -2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    mobilizzare: {

        [ANEMOS_VOLUMI.VUOTO]:
            2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            0,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            2

    },


    stabilizzare: {

        [ANEMOS_VOLUMI.VUOTO]:
            -2,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            -2

    },


    attivare: {

        [ANEMOS_VOLUMI.VUOTO]:
            1,

        [ANEMOS_VOLUMI.SCARSO]:
            0,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            0,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            2,

        [ANEMOS_VOLUMI.PIENO]:
            2

    },


    potenziare: {

        [ANEMOS_VOLUMI.VUOTO]:
            1,

        [ANEMOS_VOLUMI.SCARSO]:
            0,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            0,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            2,

        [ANEMOS_VOLUMI.PIENO]:
            2

    },


    resistere: {

        [ANEMOS_VOLUMI.VUOTO]:
            0,

        [ANEMOS_VOLUMI.SCARSO]:
            1,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            2,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            1,

        [ANEMOS_VOLUMI.PIENO]:
            0

    },


    performare: {

        [ANEMOS_VOLUMI.VUOTO]:
            1,

        [ANEMOS_VOLUMI.SCARSO]:
            0,

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            0,

        [ANEMOS_VOLUMI.ABBONDANTE]:
            2,

        [ANEMOS_VOLUMI.PIENO]:
            2

    }

};

/* =====================================================
   SETTORE ANATOMICO × INTENTO
===================================================== */

/*
Valuta la preferenza relativa per il settore
anatomico coinvolto nell'Anemomero.

Scala:

+2 = molto favorevole
+1 = favorevole
 0 = neutro
-1 = poco favorevole
-2 = sfavorevole

Questa matrice è distinta dalla distribuzione:

- distribuzione = come partecipano più settori
- settore anatomico = quale regione partecipa
*/

const ANEMOSCHESI_SETTORI_INTENTI = {

    calmare: {

        [ANEMOS_SETTORI.ADDOME]:
            2,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            1,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            -1

    },

    scaricare: {

        [ANEMOS_SETTORI.ADDOME]:
            1,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            2,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            1

    },

    recuperare: {

        [ANEMOS_SETTORI.ADDOME]:
            2,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            1,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            0

    },

    riposare: {

        [ANEMOS_SETTORI.ADDOME]:
            2,

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            1,

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            -1

    }

};
/* =====================================================
   ESCURSIONE × INTENTO
===================================================== */

/*
Escursione:

1 = piccola
2 = media
3 = grande
4 = massima
*/

const ANEMOSCHESI_ESCURSIONE_INTENTI = {

    calmare: {
        1: 2,
        2: 1,
        3: -1,
        4: -2
    },

    scaricare: {
        1: 0,
        2: 1,
        3: 2,
        4: 1
    },

    recuperare: {
        1: 2,
        2: 1,
        3: -1,
        4: -2
    },

    riposare: {
        1: 2,
        2: 0,
        3: -2,
        4: -2
    },

    percepire: {
        1: 1,
        2: 2,
        3: 2,
        4: 1
    },

    coordinare: {
        1: 1,
        2: 2,
        3: 2,
        4: 0
    },

    mobilizzare: {
        1: 0,
        2: 1,
        3: 2,
        4: 2
    },

    stabilizzare: {
        1: 2,
        2: 1,
        3: -1,
        4: -2
    },

    attivare: {
        1: 0,
        2: 1,
        3: 2,
        4: 1
    },

    potenziare: {
        1: -1,
        2: 1,
        3: 2,
        4: 2
    },

    resistere: {
        1: 2,
        2: 2,
        3: 0,
        4: -2
    },

    performare: {
        1: 0,
        2: 1,
        3: 2,
        4: 1
    }

};


/* =====================================================
   DIREZIONE × INTENTO
===================================================== */

const ANEMOSCHESI_DIREZIONE_INTENTI = {

    calmare: {
        espansione: 1,
        depressione: 2
    },

    scaricare: {
        espansione: -1,
        depressione: 2
    },

    recuperare: {
        espansione: 1,
        depressione: 2
    },

    riposare: {
        espansione: 0,
        depressione: 2
    },

    percepire: {
        espansione: 2,
        depressione: 2
    },

    coordinare: {
        espansione: 2,
        depressione: 2
    },

    mobilizzare: {
        espansione: 2,
        depressione: 2
    },

    stabilizzare: {
        espansione: 1,
        depressione: 1
    },

    attivare: {
        espansione: 2,
        depressione: 0
    },

    potenziare: {
        espansione: 2,
        depressione: 1
    },

    resistere: {
        espansione: 1,
        depressione: 1
    },

    performare: {
        espansione: 1,
        depressione: 1
    }

};


/* =====================================================
   DISTRIBUZIONE × INTENTO
===================================================== */

/*
Categorie iniziali:

selettiva
prevalente
graduata
equilibrata
globale

Il riconoscimento automatico
della categoria verrà implementato
successivamente.
*/

const ANEMOSCHESI_DISTRIBUZIONE_INTENTI = {

    calmare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: -1
    },

    scaricare: {
        selettiva: 1,
        prevalente: 2,
        graduata: 2,
        equilibrata: 1,
        globale: 1
    },

    recuperare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: 0
    },

    riposare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: -2
    },

    percepire: {
        selettiva: 2,
        prevalente: 2,
        graduata: 1,
        equilibrata: 1,
        globale: 0
    },

    coordinare: {
        selettiva: 1,
        prevalente: 2,
        graduata: 2,
        equilibrata: 2,
        globale: 1
    },

    mobilizzare: {
        selettiva: 2,
        prevalente: 2,
        graduata: 1,
        equilibrata: 1,
        globale: 2
    },

    stabilizzare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: 1
    },

    attivare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 1,
        equilibrata: 1,
        globale: 2
    },

    potenziare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 1,
        equilibrata: 1,
        globale: 2
    },

    resistere: {
        selettiva: -1,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: 0
    },

    performare: {
        selettiva: 0,
        prevalente: 1,
        graduata: 2,
        equilibrata: 2,
        globale: 2
    }

};


/* =====================================================
   CONTROLLO INIZIALE
===================================================== */

console.log(
    "ANEMOSCHESI — Regole volumetriche caricate",
    {

        versione:
            ANEMOSCHESI_REGOLE_VOLUMETRICHE_VERSIONE,

        intentiStato:
            Object.keys(
                ANEMOSCHESI_STATO_VOLUME_INTENTI
            ).length,

        intentiEscursione:
            Object.keys(
                ANEMOSCHESI_ESCURSIONE_INTENTI
            ).length,

        intentiDirezione:
            Object.keys(
                ANEMOSCHESI_DIREZIONE_INTENTI
            ).length,

        intentiDistribuzione:
            Object.keys(
                ANEMOSCHESI_DISTRIBUZIONE_INTENTI
            ).length

    }
);


/*
=========================================================
FINE ANEMOSCHESI — REGOLE VOLUMETRICHE
=========================================================
*/
