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
   COPIA DELLA SEQUENZA CON ANEMOMERO SIMULATO
===================================================== */

function copiaSequenzaConAnemomeroSimulatoAnemoschesi(
    sequenza,
    anemomeroSimulato
) {

    if (
        !sequenza ||
        !anemomeroSimulato
    ) {

        return null;

    }


    const sequenzaSimulata = {

        ...sequenza,

        anemodromi:
            sequenza.anemodromi.map(
                anemomero => {

                    if (
                        anemomero.id ===
                        anemomeroSimulato.id
                    ) {

                        return copiaAnemomeroPerSimulazioneAnemoschesi(
                            anemomeroSimulato
                        );

                    }


                    return copiaAnemomeroPerSimulazioneAnemoschesi(
                        anemomero
                    );

                }
            ),

        ordine:
            [
                ...sequenza.ordine
            ],

        apnee:
            sequenza.apnee.map(
                apnea => ({
                    ...apnea
                })
            )

    };


    return sequenzaSimulata;

}


/* =====================================================
   VALUTAZIONE DELL'ANEMODROMO SIMULATO
===================================================== */

function valutaAnemodromoConAnemomeroSimulatoAnemoschesi(
    sequenza,
    anemomeroSimulato
) {

    const sequenzaSimulata =
        copiaSequenzaConAnemomeroSimulatoAnemoschesi(
            sequenza,
            anemomeroSimulato
        );


    if (
        !sequenzaSimulata
    ) {

        return null;

    }


    return valutaAnemodromoPerIntentoAnemoschesi(
        sequenzaSimulata
    );

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
    valutaCandidatoFisiologicoAnemoschesi(
        sequenza,
        anemomero,
        {
            durata:
                nuovaDurata
        }
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
    valutaCandidatoFisiologicoAnemoschesi(
        sequenza,
        anemomero,
        {
            durata:
                nuovaDurata
        }
    );


const valutazioneAnemodromo =
    valutaAnemodromoConAnemomeroSimulatoAnemoschesi(
        sequenza,
        simulato
    );


return {

    ...valutazioneIntento,

    fisiologia:
        valutazioneFisiologica,

    anemodromo:
        valutazioneAnemodromo

};
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


    const valutazioniFlussi =
        {};


    flussi.forEach(
        flusso => {

            valutazioniFlussi[flusso] =
                simulaFlussoAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    flusso
                );

        }
    );


    const semaforiBase =
        {};


    flussi.forEach(
        flusso => {

            const valutazione =
                valutazioniFlussi[
                    flusso
                ];


            semaforiBase[flusso] =
                valutazione
                    ? semaforoGuidaDurataAnemoschesi(
                        valutazioneAttuale.punteggio,
                        valutazione
                    )
                    : null;

        }
    );


    const punteggiUtili =
        flussi
            .filter(
                flusso =>
                    valutazioniFlussi[flusso] &&
                    semaforiBase[flusso] !==
                        "rosso"
            )
            .map(
                flusso =>
                    valutazioniFlussi[
                        flusso
                    ].punteggio
            )
            .filter(
                punteggio =>
                    typeof punteggio ===
                    "number"
            );


    const migliorPunteggio =
        punteggiUtili.length
            ? Math.max(
                ...punteggiUtili
            )
            : null;


    const guida =
        {};


    flussi.forEach(
        flusso => {

            const valutazione =
                valutazioniFlussi[
                    flusso
                ];


            let semaforo =
                semaforiBase[
                    flusso
                ];


            if (
                valutazione &&
                semaforo !== "rosso" &&
                typeof migliorPunteggio ===
                    "number" &&
                valutazione.punteggio ===
                    migliorPunteggio
            ) {

                semaforo = "verde";

            }


            guida[flusso] = {

                selezionato:
                    anemomero.flusso ===
                    flusso,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    semaforo

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
    valutaCandidatoFisiologicoAnemoschesi(
        sequenza,
        anemomero,
        {
            percorso:
                nuovoPercorso
        }
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


    const valutazioniPercorsi =
        {};


    percorsi.forEach(
        percorso => {

            valutazioniPercorsi[percorso] =
                simulaPercorsoAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    percorso
                );

        }
    );


    const semaforiBase =
        {};


    percorsi.forEach(
        percorso => {

            const valutazione =
                valutazioniPercorsi[
                    percorso
                ];


            semaforiBase[percorso] =
                valutazione
                    ? semaforoGuidaDurataAnemoschesi(
                        valutazioneAttuale.punteggio,
                        valutazione
                    )
                    : null;

        }
    );


    const punteggiUtili =
        percorsi
            .filter(
                percorso =>
                    valutazioniPercorsi[percorso] &&
                    semaforiBase[percorso] !==
                        "rosso"
            )
            .map(
                percorso =>
                    valutazioniPercorsi[
                        percorso
                    ].punteggio
            )
            .filter(
                punteggio =>
                    typeof punteggio ===
                    "number"
            );


    const migliorPunteggio =
        punteggiUtili.length
            ? Math.max(
                ...punteggiUtili
            )
            : null;


    const guida =
        {};


    percorsi.forEach(
        percorso => {

            const valutazione =
                valutazioniPercorsi[
                    percorso
                ];


            let semaforo =
                semaforiBase[
                    percorso
                ];


            if (
                valutazione &&
                semaforo !== "rosso" &&
                typeof migliorPunteggio ===
                    "number" &&
                valutazione.punteggio ===
                    migliorPunteggio
            ) {

                semaforo = "verde";

            }


            guida[percorso] = {

                selezionato:
                    anemomero.percorso ===
                    percorso,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    semaforo

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
    valutaCandidatoFisiologicoAnemoschesi(
        sequenza,
        anemomero,
        {
            settori:
                simulato.settori
        }
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

               semaforo: (() => {

    const intentoId =
        ottieniIntento(
            sequenza
        );


    const valoreSettore =
        ANEMOSCHESI_SETTORI_INTENTI[
            intentoId
        ]?.[
            nomeSettore
        ];


    if (
        typeof valoreSettore !==
        "number"
    ) {

        return valutazione
            ? semaforoGuidaDurataAnemoschesi(
                valutazioneAttuale.punteggio,
                valutazione
            )
            : null;

    }


    if (
        valoreSettore === 2
    ) {

        return "verde";

    }


    if (
        valoreSettore === -2
    ) {

        return "rosso";

    }


    return "giallo";

})()
            };

        }
    );


    return guida;

}

/* =====================================================
   SIMULAZIONE DEL VOLUME
===================================================== */

function simulaVolumeAnemomeroAnemoschesi(
    sequenza,
    anemomero,
    nomeSettore,
    nuovoVolume
) {

    if (
        !sequenza ||
        !anemomero ||
        !nomeSettore ||
        !nuovoVolume
    ) {

        return null;

    }


    const simulato =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    const settore =
        simulato.settori.find(
            elemento =>
                elemento.nome ===
                nomeSettore
        );


    if (
        !settore
    ) {

        return null;

    }


    const disponibili =
        volumiDisponibiliPerSettore(
            sequenza,
            anemomero.id,
            nomeSettore,
            anemomero.tipo
        );


    if (
        !disponibili.includes(
            nuovoVolume
        )
    ) {

        return null;

    }


    settore.volume =
        nuovoVolume;


    const valutazioneIntento =
        valutaAnemomeroPerIntentoAnemoschesi(
            sequenza,
            simulato
        );


    const valutazioneFisiologica =
    valutaCandidatoFisiologicoAnemoschesi(
        sequenza,
        anemomero,
        {
            settori:
                simulato.settori
        }
    );

    return {

        ...valutazioneIntento,

        fisiologia:
            valutazioneFisiologica

    };

}


/* =====================================================
   GUIDA DELLE OPZIONI DI VOLUME
===================================================== */

function creaGuidaVolumiAnemoschesi(
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


    const settoreAttuale =
        anemomero.settori.find(
            settore =>
                settore.nome ===
                nomeSettore
        );


    if (
        !settoreAttuale
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


    const volumi =
        ottieniVolumiPerTipo(
            anemomero.tipo
        );


    const intentoId =
        ottieniIntento(
            sequenza
        );


    const valutazioniVolumi =
        {};


    volumi.forEach(
        volume => {

            valutazioniVolumi[volume] =
                simulaVolumeAnemomeroAnemoschesi(
                    sequenza,
                    anemomero,
                    nomeSettore,
                    volume
                );

        }
    );


    const valoriDisponibili =
        volumi
            .filter(
                volume =>
                    valutazioniVolumi[volume] !==
                    null
            )
            .map(
                volume =>
                    ANEMOSCHESI_STATO_VOLUME_INTENTI[
                        intentoId
                    ]?.[
                        volume
                    ]
            )
            .filter(
                valore =>
                    typeof valore ===
                    "number"
            );


    const migliorValoreDisponibile =
        valoriDisponibili.length
            ? Math.max(
                ...valoriDisponibili
            )
            : null;


    const guida =
        {};


    volumi.forEach(
        volume => {

            const valutazione =
                valutazioniVolumi[
                    volume
                ];


            const valoreVolume =
                ANEMOSCHESI_STATO_VOLUME_INTENTI[
                    intentoId
                ]?.[
                    volume
                ];


            let semaforo = null;


            if (
                typeof valoreVolume ===
                "number"
            ) {

                if (
                    migliorValoreDisponibile >= 1 &&
                    valoreVolume ===
                        migliorValoreDisponibile
                ) {

                    semaforo = "verde";

                }

                else if (
                    valoreVolume === -2
                ) {

                    semaforo = "rosso";

                }

                else {

                    semaforo = "giallo";

                }

            }

            else {

                semaforo =
                    valutazione
                        ? semaforoGuidaDurataAnemoschesi(
                            valutazioneAttuale.punteggio,
                            valutazione
                        )
                        : null;

            }


            guida[volume] = {

                selezionato:
                    settoreAttuale.volume ===
                    volume,

                disponibile:
                    valutazione !== null,

                punteggio:
                    valutazione
                        ? valutazione.punteggio
                        : null,

                semaforo:
                    semaforo

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
   DIREZIONE GUIDA DELLA DURATA
===================================================== */

function semaforoDirezioneDurataAnemoschesi(
    sequenza,
    anemomero,
    direzione,
    valutazioneSimulata
) {

    if (
        !sequenza ||
        !anemomero ||
        !valutazioneSimulata
    ) {

        return null;

    }


    /*
    Prima viene sempre rispettata
    la plausibilità fisiologica.
    */

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


    const intentoId =
        ottieniIntento(
            sequenza
        );


    const regole =
        ANEMOSCHESI_DURATA_INTENTI[
            intentoId
        ]?.[
            anemomero.tipo
        ];


    if (
        !regole
    ) {

        return null;

    }


    const fasciaAttuale =
        riconosciFasciaDurataAnemoschesi(
            anemomero.durata
        );


    if (
        !fasciaAttuale
    ) {

        return null;

    }


    const valoreAttuale =
        regole[
            fasciaAttuale
        ];


    if (
        typeof valoreAttuale !==
        "number"
    ) {

        return null;

    }


    /*
    Cerchiamo nella direzione scelta
    se esiste una durata più favorevole.

    Questo permette, ad esempio,
    di mostrare + verde a 1 secondo
    anche se 1 -> 2 resta nella stessa fascia.
    */

    const passo =
        direzione === "aumenta"
            ? 1
            : -1;


    let durataEsplorata =
        anemomero.durata +
        passo;

   /*
Se il passo immediato mantiene
una fascia già favorevole,
la direzione resta favorevole.
*/

const fasciaImmediata =
    riconosciFasciaDurataAnemoschesi(
        durataEsplorata
    );


const valoreImmediato =
    regole[
        fasciaImmediata
    ];


if (
    typeof valoreImmediato ===
        "number" &&
    valoreImmediato ===
        valoreAttuale &&
    valoreAttuale >= 1
) {

    return "verde";

}


    while (
        durataEsplorata >= 1 &&
        durataEsplorata < 30
    ) {

        const fascia =
            riconosciFasciaDurataAnemoschesi(
                durataEsplorata
            );


        const valore =
            regole[
                fascia
            ];


        if (
            typeof valore ===
            "number" &&
            valore !== valoreAttuale
        ) {

            if (
                valore >
                valoreAttuale
            ) {

                return "verde";

            }


            if (
                valore <
                valoreAttuale
            ) {

                return "rosso";

            }

        }


        durataEsplorata +=
            passo;

    }


    /*
    Nessun miglioramento o peggioramento
    significativo nella direzione esplorata.
    */

    return "giallo";

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
        ? semaforoDirezioneDurataAnemoschesi(
            sequenza,
            anemomero,
            "diminuisci",
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
        ? semaforoDirezioneDurataAnemoschesi(
            sequenza,
            anemomero,
            "aumenta",
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
