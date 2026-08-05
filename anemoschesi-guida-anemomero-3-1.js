/*
=========================================================
ANEMOS 3.1
ANEMOSCHESI — GUIDA DELL'ANEMOMERO
=========================================================

Calcola il colore guida dei comandi
dell'editor confrontando virtualmente
le possibili modifiche con l'Intento.

Versione iniziale: 0.1
=========================================================
*/


/* =====================================================
   VERSIONE
===================================================== */

const ANEMOSCHESI_GUIDA_ANEMOMERO_VERSIONE =
    "0.1";


/* =====================================================
   CONFRONTO PUNTEGGI
===================================================== */

function semaforoGuidaAnemoschesi(
    punteggioAttuale,
    punteggioSimulato
) {

    if (
        punteggioSimulato >
        punteggioAttuale
    ) {

        return "verde";

    }


    if (
        punteggioSimulato ===
        punteggioAttuale
    ) {

        return "giallo";

    }


    return "rosso";

}

/* =====================================================
   COPIA TEMPORANEA DELL'ANEMOMERO
===================================================== */

function copiaAnemomeroPerSimulazioneAnemoschesi(
    anemomero
) {

    if (
        !anemomero
    ) {

        return null;

    }


    return {

        ...anemomero,

        settori:
            anemomero.settori.map(
                settore => ({
                    ...settore
                })
            )

    };

}


/* =====================================================
   SIMULAZIONE DELLA DURATA
===================================================== */

function simulaDurataAnemomeroAnemoschesi(
    sequenza,
    anemomero,
    nuovaDurata
) {

    if (
        !sequenza ||
        !anemomero ||
        nuovaDurata < 1
    ) {

        return null;

    }


    const simulato =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    simulato.durata =
        nuovaDurata;


    return valutaAnemomeroPerIntentoAnemoschesi(
        sequenza,
        simulato
    );

}


/* =====================================================
   GUIDA DEI COMANDI − E +
===================================================== */

function creaGuidaDurataAnemoschesi(
    sequenza,
    anemomero
) {

    if (
        !sequenza ||
        !anemomero
    ) {

        return null;

    }


    const valutazioneAttuale =
        valutaAnemomeroPerIntentoAnemoschesi(
            sequenza,
            anemomero
        );


    if (
        !valutazioneAttuale ||
        !valutazioneAttuale.valido
    ) {

        return null;

    }


    const valutazioneMeno =
        anemomero.durata > 1

            ? simulaDurataAnemomeroAnemoschesi(
                sequenza,
                anemomero,
                anemomero.durata - 1
            )

            : null;


    const valutazionePiu =
        simulaDurataAnemomeroAnemoschesi(
            sequenza,
            anemomero,
            anemomero.durata + 1
        );


    return {

        punteggioAttuale:
            valutazioneAttuale.punteggio,

        meno: {

            disponibile:
                valutazioneMeno !== null,

            punteggio:
                valutazioneMeno
                    ? valutazioneMeno.punteggio
                    : null,

            semaforo:
                valutazioneMeno
                    ? semaforoGuidaAnemoschesi(
                        valutazioneAttuale.punteggio,
                        valutazioneMeno.punteggio
                    )
                    : null

        },

        piu: {

            disponibile:
                valutazionePiu !== null,

            punteggio:
                valutazionePiu
                    ? valutazionePiu.punteggio
                    : null,

            semaforo:
                valutazionePiu
                    ? semaforoGuidaAnemoschesi(
                        valutazioneAttuale.punteggio,
                        valutazionePiu.punteggio
                    )
                    : null

        }

    };

}
console.log(
    "ANEMOSCHESI — Guida Anemomero caricata",
    {
        versione:
            ANEMOSCHESI_GUIDA_ANEMOMERO_VERSIONE
    }
);
