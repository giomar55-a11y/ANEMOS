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

    /*
    Il colore indica il risultato
    che si otterrà premendo il comando.

    punteggioAttuale resta tra gli argomenti
    perché la funzione è già richiamata così,
    ma in questa versione non serve.
    */

    return determinaSemaforoAnemoschesi(
        punteggioSimulato
    );

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


   const valutazioneIntento =
    valutaAnemomeroPerIntentoAnemoschesi(
        sequenza,
        simulato
    );


const valutazioneFisiologica =
    valutaFisiologiaAnemomeroAnemoschesi(
        sequenza,
        simulato
    );
   
   return {

    ...valutazioneIntento,

    fisiologia:
        valutazioneFisiologica

};
}
/* =====================================================
   SIMULAZIONE DEL FLUSSO
===================================================== */

function simulaFlussoAnemomeroAnemoschesi(
    sequenza,
    anemomero,
    nuovoFlusso
) {

    if (
        !sequenza ||
        !anemomero ||
        !nuovoFlusso
    ) {

        return null;

    }


    const simulato =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    simulato.flusso =
        nuovoFlusso;


    const valutazioneIntento =
        valutaAnemomeroPerIntentoAnemoschesi(
            sequenza,
            simulato
        );


    const valutazioneFisiologica =
        valutaFisiologiaAnemomeroAnemoschesi(
            sequenza,
            simulato
        );


    return {

        ...valutazioneIntento,

        fisiologia:
            valutazioneFisiologica

    };

}
/* =====================================================
   GUIDA DELLE OPZIONI DI FLUSSO
===================================================== */

function creaGuidaFlussoAnemoschesi(
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


    const flussi = [

        ANEMOS_FLUSSI.TRATTENUTO,

        ANEMOS_FLUSSI.DELICATO,

        ANEMOS_FLUSSI.SPONTANEO,

        ANEMOS_FLUSSI.FORZATO

    ];


    const guida =
        {};


    flussi.forEach(
        flusso => {

            const valutazione =
                simulaFlussoAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    flusso
                );


            guida[flusso] = {

                selezionato:
                    anemomero.flusso ===
                    flusso,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    valutazione
                        ? semaforoGuidaDurataAnemoschesi(
                            valutazioneAttuale.punteggio,
                            valutazione
                        )
                        : null

            };

        }
    );


    return guida;

}

/* =====================================================
   SIMULAZIONE DEL PERCORSO
===================================================== */

function simulaPercorsoAnemomeroAnemoschesi(
    sequenza,
    anemomero,
    nuovoPercorso
) {

    if (
        !sequenza ||
        !anemomero ||
        !nuovoPercorso
    ) {

        return null;

    }


    const simulato =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    simulato.percorso =
        nuovoPercorso;


    const valutazioneIntento =
        valutaAnemomeroPerIntentoAnemoschesi(
            sequenza,
            simulato
        );


    const valutazioneFisiologica =
        valutaFisiologiaAnemomeroAnemoschesi(
            sequenza,
            simulato
        );


    return {

        ...valutazioneIntento,

        fisiologia:
            valutazioneFisiologica

    };

}


/* =====================================================
   GUIDA DELLE OPZIONI DI PERCORSO
===================================================== */

function creaGuidaPercorsoAnemoschesi(
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


    const percorsi = [

        ANEMOS_PERCORSI.NARICE_DESTRA,

        ANEMOS_PERCORSI.NARICE_SINISTRA,

        ANEMOS_PERCORSI.ENTRAMBE_NARICI,

        ANEMOS_PERCORSI.BOCCA

    ];


    const guida =
        {};


    percorsi.forEach(
        percorso => {

            const valutazione =
                simulaPercorsoAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    percorso
                );


            guida[percorso] = {

                selezionato:
                    anemomero.percorso ===
                    percorso,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    valutazione
                        ? semaforoGuidaDurataAnemoschesi(
                            valutazioneAttuale.punteggio,
                            valutazione
                        )
                        : null

            };

        }
    );


    return guida;

}

/* =====================================================
   SIMULAZIONE DEL SETTORE
===================================================== */

function simulaSettoreAnemomeroAnemoschesi(
    sequenza,
    anemomero,
    nomeSettore
) {

    if (
        !sequenza ||
        !anemomero ||
        !nomeSettore
    ) {

        return null;

    }


    const simulato =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    const settoreEsistente =
        simulato.settori.find(
            settore =>
                settore.nome ===
                nomeSettore
        );


    /*
    Se il settore è già attivo,
    simuliamo la sua disattivazione.
    */

    if (
        settoreEsistente
    ) {

        simulato.settori =
            simulato.settori.filter(
                settore =>
                    settore.nome !==
                    nomeSettore
            );

    } else {

        /*
        Se il settore è inattivo,
        simuliamo la sua attivazione
        usando il primo volume
        fisiologicamente disponibile.
        */

        const volumeIniziale =
            primoVolumeDisponibilePerSettore(
                sequenza,
                anemomero.id,
                nomeSettore,
                anemomero.tipo
            );


        if (
            !volumeIniziale
        ) {

            return null;

        }


        simulato.settori.push({

            nome:
                nomeSettore,

            volume:
                volumeIniziale

        });

    }


    const valutazioneIntento =
        valutaAnemomeroPerIntentoAnemoschesi(
            sequenza,
            simulato
        );


    const valutazioneFisiologica =
        valutaFisiologiaAnemomeroAnemoschesi(
            sequenza,
            simulato
        );


    return {

        ...valutazioneIntento,

        fisiologia:
            valutazioneFisiologica

    };

}


/* =====================================================
   GUIDA DELLE OPZIONI DI SETTORE
===================================================== */

function creaGuidaSettoriAnemoschesi(
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


    const settori = [

        ANEMOS_SETTORI.ADDOME,

        ANEMOS_SETTORI.TORACE_INFERIORE,

        ANEMOS_SETTORI.TORACE_SUPERIORE

    ];


    const guida = {};


    settori.forEach(
        nomeSettore => {

            const valutazione =
                simulaSettoreAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    nomeSettore
                );


            guida[nomeSettore] = {

                selezionato:
                    anemomero.settori.some(
                        settore =>
                            settore.nome ===
                            nomeSettore
                    ),

                disponibile:
                    valutazione !== null,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    valutazione
                        ? semaforoGuidaDurataAnemoschesi(
                            valutazioneAttuale.punteggio,
                            valutazione
                        )
                        : null

            };

        }
    );


    return guida;

}

/* =====================================================
   PRECEDENZA FISIOLOGICA DELLA GUIDA
===================================================== */

function semaforoGuidaDurataAnemoschesi(
    punteggioAttuale,
    valutazioneSimulata
) {

    if (
        !valutazioneSimulata
    ) {

        return null;

    }


    const fisiologia =
        valutazioneSimulata.fisiologia;


    if (
        fisiologia
    ) {

        if (
            fisiologia.livello ===
                ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE ||
            fisiologia.livello ===
                ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO
        ) {

            return "rosso";

        }


        if (
            fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE
        ) {

            return "giallo";

        }

    }


    return semaforoGuidaAnemoschesi(
        punteggioAttuale,
        valutazioneSimulata.punteggio
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
        ? semaforoGuidaDurataAnemoschesi(
            valutazioneAttuale.punteggio,
            valutazioneMeno
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
        ? semaforoGuidaDurataAnemoschesi(
            valutazioneAttuale.punteggio,
            valutazionePiu
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
