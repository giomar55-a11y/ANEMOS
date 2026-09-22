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
   COPIA SEQUENZA CON APNEA SIMULATA
===================================================== */

function copiaSequenzaConApneaSimulataAnemoschesi(
    sequenza,
    precedenteId,
    successivoId = null,
    durata = 0
) {

    if (
        !sequenza ||
        !precedenteId
    ) {

        return null;

    }


    const sequenzaSimulata = {

        ...sequenza,

        anemodromi:
            sequenza.anemodromi.map(
                anemomero =>
                    copiaAnemomeroPerSimulazioneAnemoschesi(
                        anemomero
                    )
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


    if (
        durata <= 0
    ) {

        rimuoviApnea(
            sequenzaSimulata,
            precedenteId,
            successivoId
        );

    } else {

        inserisciApnea(
            sequenzaSimulata,
            precedenteId,
            successivoId,
            durata
        );

    }


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
   VALUTAZIONE ANEMODROMO CON APNEA SIMULATA
===================================================== */

function valutaAnemodromoConApneaSimulataAnemoschesi(
    sequenza,
    precedenteId,
    successivoId = null,
    durata = 0
) {

    const sequenzaSimulata =
        copiaSequenzaConApneaSimulataAnemoschesi(
            sequenza,
            precedenteId,
            successivoId,
            durata
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
   CONFRONTO ORIENTAMENTO APNEE PRIMA / DOPO
===================================================== */

function valoreOrientamentoApneeGuidaAnemoschesi(
    orientamento
) {

    if (
        !orientamento
    ) {

        return null;

    }


    const valori = {

        coerente:
            2,

        parzialmente_coerente:
            1,

        assenza_apnee:
            0,

        opposto:
            -2

    };


    const valore =
        valori[
            orientamento.esito
        ];


    return typeof valore === "number"
        ? valore
        : null;

}


function confrontaOrientamentoApneeGuidaAnemoschesi(
    valutazioneAttuale,
    valutazioneSimulata
) {

    const orientamentoAttuale =
        valutazioneAttuale
            ?.orientamentoApneeIntento;


    const orientamentoSimulato =
        valutazioneSimulata
            ?.orientamentoApneeIntento;


    const valoreAttuale =
        valoreOrientamentoApneeGuidaAnemoschesi(
            orientamentoAttuale
        );


    const valoreSimulato =
        valoreOrientamentoApneeGuidaAnemoschesi(
            orientamentoSimulato
        );


    if (
        typeof valoreAttuale !== "number" ||
        typeof valoreSimulato !== "number"
    ) {

        return null;

    }


    if (
        valoreSimulato >
        valoreAttuale
    ) {

        return "migliora";

    }


    if (
        valoreSimulato <
        valoreAttuale
    ) {

        return "peggiora";

    }


    return "stabile";

}

/* =====================================================
   SIMULAZIONE DELLA SINGOLA APNEA
===================================================== */

function simulaApneaAnemoschesi(
    sequenza,
    precedente,
    successivoId = null,
    nuovaDurata = 0
) {

    if (
        !sequenza ||
        !precedente ||
        nuovaDurata < 0
    ) {

        return null;

    }


    const sequenzaSimulata =
        copiaSequenzaConApneaSimulataAnemoschesi(
            sequenza,
            precedente.id,
            successivoId,
            nuovaDurata
        );


    if (
        !sequenzaSimulata
    ) {

        return null;

    }


    const valutazioneAnemodromo =
        valutaAnemodromoPerIntentoAnemoschesi(
            sequenzaSimulata
        );


    /*
    Durata 0 = rimozione dell'apnea.
    Non esiste quindi un'apnea locale
    da classificare o valutare
    fisiologicamente.
    */

    if (
        nuovaDurata === 0
    ) {

        return {

            durata:
                0,

            rimossa:
                true,

            analisi:
                null,

            intento:
                null,

            fisiologia:
                null,

            anemodromo:
                valutazioneAnemodromo

        };

    }


    const apneaSimulata =
        trovaApneaTra(
            sequenzaSimulata,
            precedente.id,
            successivoId
        );


    if (
        !apneaSimulata
    ) {

        return null;

    }


    const precedenteSimulato =
        sequenzaSimulata.anemodromi.find(
            anemomero =>
                anemomero.id ===
                precedente.id
        );


    if (
        !precedenteSimulato
    ) {

        return null;

    }


    const analisi =
        analizzaApneaAnemoschesi(
            apneaSimulata,
            precedenteSimulato
        );


    if (
        !analisi
    ) {

        return null;

    }


    const intentoId =
        ottieniIntento(
            sequenzaSimulata
        );


    const valutazioneIntento =
        valutaApneaPerIntentoAnemoschesi(
            analisi,
            intentoId
        );


    const valutazioneFisiologica =
        valutaFisiologiaApneaAnemoschesi(
            analisi
        );


    return {

        durata:
            nuovaDurata,

        rimossa:
            false,

        analisi:
            analisi,

        intento:
            valutazioneIntento,

        fisiologia:
            valutazioneFisiologica,

        anemodromo:
            valutazioneAnemodromo

    };

}

/* =====================================================
   SEMAFORO DELLA SINGOLA APNEA
===================================================== */

function semaforoLocaleApneaAnemoschesi(
    valutazioneApnea
) {

    const valore =
        valutazioneApnea
            ?.intento
            ?.valore;


    if (
        typeof valore !== "number"
    ) {

        return null;

    }


    if (
        valore >= 1
    ) {

        return "verde";

    }


    if (
        valore <= -2
    ) {

        return "rosso";

    }


    return "giallo";

}


/* =====================================================
   INFLUENZA ORIENTAMENTO AIN / AES
===================================================== */

function applicaOrientamentoApneeAllaGuidaAnemoschesi(
    semaforoBase,
    confrontoOrientamento
) {

    if (
        !semaforoBase ||
        !confrontoOrientamento ||
        confrontoOrientamento === "stabile"
    ) {

        return semaforoBase;

    }


    /*
    L'orientamento complessivo AIN/AES
    può modificare il colore locale
    di un solo livello.
    */

    if (
        confrontoOrientamento === "migliora"
    ) {

        if (
            semaforoBase === "rosso"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }


        return "verde";

    }


    if (
        confrontoOrientamento === "peggiora"
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }


        return "rosso";

    }


    return semaforoBase;

}


/* =====================================================
   PRECEDENZA FISIOLOGICA DELL'APNEA
===================================================== */

function applicaFisiologiaApneaAllaGuidaAnemoschesi(
    semaforoBase,
    fisiologia
) {

    if (
        !semaforoBase ||
        !fisiologia
    ) {

        return semaforoBase;

    }


    if (
        fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO ||
        fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE
    ) {

        return "rosso";

    }


    if (
        fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE &&
        semaforoBase === "verde"
    ) {

        return "giallo";

    }


    return semaforoBase;

}

/* =====================================================
   GUIDA DEI COMANDI − E + DELL'APNEA
===================================================== */
function descriviFisiologiaApneaGuidaAnemoschesi(
    fisiologia
) {

    if (!fisiologia) {
        return null;
    }


    if (
        fisiologia.livello ===
        ANEMOSCHESI_ESITI_FISIOLOGICI.VALIDO
    ) {

        return "Durata fisiologicamente valida";

    }


    if (
        fisiologia.livello ===
        ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE
    ) {

        return "Durata fisiologicamente impegnativa";

    }


    if (
        fisiologia.livello ===
        ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO
    ) {

        return "Durata fisiologicamente critica";

    }


    if (
        fisiologia.livello ===
        ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE
    ) {

        return "Durata fisiologicamente non ammessa";

    }


    return null;

}

/* =====================================================
   SPIEGAZIONE ORIENTAMENTO AIN / AES DELL'APNEA
===================================================== */

function descriviOrientamentoApneaGuidaAnemoschesi(
    valutazioneAttuale,
    valutazioneSimulata
) {

    const orientamentoSimulato =
        valutazioneSimulata
            ?.orientamentoApneeIntento;


    if (!orientamentoSimulato) {
        return null;
    }


    const confronto =
        confrontaOrientamentoApneeGuidaAnemoschesi(
            valutazioneAttuale,
            valutazioneSimulata
        );


    if (
        confronto === "migliora"
    ) {

        return "Migliora la distribuzione AIN/AES rispetto all'Intento";

    }


    if (
        confronto === "peggiora"
    ) {

        return "Peggiora la distribuzione AIN/AES rispetto all'Intento";

    }


    if (
        orientamentoSimulato.esito ===
        "coerente"
    ) {

        return "Distribuzione AIN/AES coerente con l'Intento";

    }


    if (
        orientamentoSimulato.esito ===
        "parzialmente_coerente"
    ) {

        return "Distribuzione AIN/AES parzialmente coerente con l'Intento";

    }


    if (
        orientamentoSimulato.esito ===
        "opposto"
    ) {

        return "Distribuzione AIN/AES opposta all'Intento";

    }


    if (
        orientamentoSimulato.esito ===
        "assenza_apnee"
    ) {

        return "La modifica elimina la distribuzione delle apnee";

    }


    return null;

}

function creaGuidaApneaAnemoschesi(
    sequenza,
    precedente,
    successivoId = null
) {

    if (
        !sequenza ||
        !precedente
    ) {

        return null;

    }


    const apneaAttuale =
        trovaApneaTra(
            sequenza,
            precedente.id,
            successivoId
        );


    /*
    Se l'apnea non esiste ancora,
    consideriamo durata attuale 0.

    Il comando + simulerà quindi
    la creazione di un'apnea di 1 secondo.
    */

    const durataAttuale =
        apneaAttuale
            ? Number(apneaAttuale.durata)
            : 0;


    if (
        !Number.isFinite(durataAttuale) ||
        durataAttuale < 0
    ) {

        return null;

    }


    const valutazioneAttualeAnemodromo =
        valutaAnemodromoPerIntentoAnemoschesi(
            sequenza
        );


    /*
    ==========================
    SIMULAZIONE DEL COMANDO −
    ==========================
    */

    const nuovaDurataMeno =
        durataAttuale > 0
            ? durataAttuale - 1
            : null;


    const valutazioneMeno =
        nuovaDurataMeno !== null
            ? simulaApneaAnemoschesi(
                sequenza,
                precedente,
                successivoId,
                nuovaDurataMeno
            )
            : null;


    /*
    ==========================
    SIMULAZIONE DEL COMANDO +
    ==========================
    */

    const nuovaDurataPiu =
        durataAttuale + 1;


    const valutazionePiu =
        simulaApneaAnemoschesi(
            sequenza,
            precedente,
            successivoId,
            nuovaDurataPiu
        );


    /*
    =================================================
    COLORE DI UNA MODIFICA DELL'APNEA
    =================================================
    */

    function calcolaSemaforoModificaApnea(
        valutazione,
        nuovaDurata
    ) {

        if (
            !valutazione
        ) {

            return null;

        }


        const confrontoOrientamento =
            confrontaOrientamentoApneeGuidaAnemoschesi(
                valutazioneAttualeAnemodromo,
                valutazione.anemodromo
            );


        /*
        CASO SPECIALE: durata 0.

        L'apnea viene rimossa.

        Non utilizziamo la matrice
        Apnea × Intento e non esiste
        una fisiologia dell'apnea rimossa.

        Il colore dipende esclusivamente
        dall'effetto della rimozione
        sull'orientamento complessivo AIN/AES.
        */

        if (
            nuovaDurata === 0
        ) {

            if (
                confrontoOrientamento ===
                    "migliora"
            ) {

                return "verde";

            }


            if (
                confrontoOrientamento ===
                    "peggiora"
            ) {

                return "rosso";

            }


            /*
            Orientamento invariato oppure
            non confrontabile:
            rimozione neutra.
            */

            return "giallo";

        }


        /*
        Per un'apnea realmente presente
        partiamo dalla relazione locale
        Apnea × Intento.
        */

        let semaforo =
            semaforoLocaleApneaAnemoschesi(
                valutazione
            );


        if (
            !semaforo
        ) {

            return null;

        }


        /*
        L'orientamento AIN/AES può
        modificare il colore locale
        al massimo di un livello.
        */

        semaforo =
            applicaOrientamentoApneeAllaGuidaAnemoschesi(
                semaforo,
                confrontoOrientamento
            );


        /*
        La fisiologia ha sempre
        l'ultima parola.
        */

        semaforo =
            applicaFisiologiaApneaAllaGuidaAnemoschesi(
                semaforo,
                valutazione.fisiologia
            );


        return semaforo;

    }


    let semaforoMeno =
        valutazioneMeno
            ? calcolaSemaforoModificaApnea(
                valutazioneMeno,
                nuovaDurataMeno
            )
            : null;


    let semaforoPiu =
        valutazionePiu
            ? calcolaSemaforoModificaApnea(
                valutazionePiu,
                nuovaDurataPiu
            )
            : null;

   /*
=================================================
RANKING RELATIVO DEI COMANDI − E +
=================================================

I semafori precedenti restano autorevoli.

Questo passaggio serve soltanto a far emergere
la scelta migliore tra − e + quando:

- entrambe le simulazioni sono disponibili;
- nessuna promozione contraddice la fisiologia;
- una delle due produce un punteggio
  ANEMOSCHESI superiore all'altra.

Un candidato in ATTENZIONE, CRITICO o ERRORE
non viene promosso a verde.
*/

function puoEsserePromossaApneaAnemoschesi(
    valutazione,
    semaforo
) {

    if (
        !valutazione ||
        semaforo === "rosso"
    ) {

        return false;

    }


    const livello =
        valutazione.fisiologia?.livello;


    if (
        livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE ||
        livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO ||
        livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE
    ) {

        return false;

    }


    return true;

}


const punteggioMeno =
    valutazioneMeno
        ?.anemodromo
        ?.punteggioComplessivo;


const punteggioPiu =
    valutazionePiu
        ?.anemodromo
        ?.punteggioComplessivo;


if (
    typeof punteggioMeno === "number" &&
    typeof punteggioPiu === "number" &&
    punteggioMeno !== punteggioPiu
) {

    /*
    Se i due comandi producono risultati
    differenti, il migliore deve emergere.

    Il peggiore, se era verde, viene
    declassato a giallo.

    Un rosso non viene modificato.
    */

    if (
        punteggioMeno > punteggioPiu
    ) {

        if (
            puoEsserePromossaApneaAnemoschesi(
                valutazioneMeno,
                semaforoMeno
            )
        ) {

            semaforoMeno = "verde";

        }


        if (
            semaforoPiu === "verde"
        ) {

            semaforoPiu = "giallo";

        }

    }


    if (
        punteggioPiu > punteggioMeno
    ) {

        if (
            puoEsserePromossaApneaAnemoschesi(
                valutazionePiu,
                semaforoPiu
            )
        ) {

            semaforoPiu = "verde";

        }


        if (
            semaforoMeno === "verde"
        ) {

            semaforoMeno = "giallo";

        }

    }

}
    if (
        punteggioMeno > punteggioPiu &&
        puoEsserePromossaApneaAnemoschesi(
            valutazioneMeno,
            semaforoMeno
        )
    ) {

        semaforoMeno = "verde";

    }


    if (
        punteggioPiu > punteggioMeno &&
        puoEsserePromossaApneaAnemoschesi(
            valutazionePiu,
            semaforoPiu
        )
    ) {

        semaforoPiu = "verde";

    }

}
   
    /*
    =================================================
    MOTIVAZIONI DEI COMANDI − E +
    =================================================
    */

    function creaMotiviModificaApnea(
        valutazione,
        nuovaDurata
    ) {

        if (!valutazione) {
            return [];
        }


        const motivi = [];


        const motivoOrientamento =
            descriviOrientamentoApneaGuidaAnemoschesi(
                valutazioneAttualeAnemodromo,
                valutazione.anemodromo
            );


        if (motivoOrientamento) {
            motivi.push(
                motivoOrientamento
            );
        }


        /*
        Se durata = 0 l'apnea viene rimossa:
        non esiste quindi una fisiologia
        dell'apnea risultante.
        */

        if (
            nuovaDurata > 0
        ) {

            const motivoFisiologia =
                descriviFisiologiaApneaGuidaAnemoschesi(
                    valutazione.fisiologia
                );


            if (motivoFisiologia) {
                motivi.push(
                    motivoFisiologia
                );
            }

        }


        return motivi;

    }


    const motiviMeno =
        valutazioneMeno
            ? creaMotiviModificaApnea(
                valutazioneMeno,
                nuovaDurataMeno
            )
            : [];


    const motiviPiu =
        valutazionePiu
            ? creaMotiviModificaApnea(
                valutazionePiu,
                nuovaDurataPiu
            )
            : [];

    return {

        durataAttuale:
            durataAttuale,

        meno: {

            disponibile:
                valutazioneMeno !== null,

            nuovaDurata:
                nuovaDurataMeno,

            rimuove:
                nuovaDurataMeno === 0,

                       semaforo:
                semaforoMeno,

            motivi:
                motiviMeno
        },

        piu: {

            disponibile:
                valutazionePiu !== null,

            nuovaDurata:
                nuovaDurataPiu,

            rimuove:
                false,

                     semaforo:
                semaforoPiu,

            motivi:
                motiviPiu
        }

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
                flusso:
                    nuovoFlusso
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


if (
    valutazione &&
    semaforo
) {

    semaforo =
        applicaTransizioneFlussoAllaGuidaAnemoschesi(
            sequenza,
            valutazione,
            semaforo
        );

}


/*
La fisiologia mantiene sempre
la precedenza finale.
*/

if (
    valutazione?.fisiologia
) {

    if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE ||
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO
    ) {

        semaforo = "rosso";

    }

    else if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE &&
        semaforo === "verde"
    ) {

        semaforo = "giallo";

    }

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

            valutazioniPercorsi[
                percorso
            ] =
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


            semaforiBase[
                percorso
            ] =
                valutazione
                    ? semaforoGuidaDurataAnemoschesi(
                        valutazioneAttuale.punteggio,
                        valutazione
                    )
                    : null;

        }
    );


    /*
    Per ciascun percorso simulato
    valutiamo la transizione direttamente
    coinvolta dall'Anemomero corrente.
    */

    const transizioniLocaliPercorsi =
        {};


    percorsi.forEach(
        percorso => {

            transizioniLocaliPercorsi[
                percorso
            ] =
                valutaTransizioneLocalePercorsoGuidaAnemoschesi(
                    sequenza,
                    anemomero,
                    valutazioniPercorsi[
                        percorso
                    ]
                );

        }
    );


    /*
    Serve a distinguere una transizione
    neutra da una realmente preferita.

    Se esiste almeno una scelta preferita
    fisiologicamente/localmente ammissibile,
    una scelta neutra non deve restare verde.
    */

    const esisteTransizionePreferita =
        percorsi.some(
            percorso =>
                semaforiBase[
                    percorso
                ] !== "rosso" &&
                transizioniLocaliPercorsi[
                    percorso
                ]?.esito ===
                    "preferito"
        );


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


            const transizioneLocale =
                transizioniLocaliPercorsi[
                    percorso
                ];


            /*
            La grammatica locale può
            promuovere o declassare di
            un solo livello il semaforo.

            Non può recuperare un rosso
            prodotto dalla valutazione locale.
            */

            if (
                valutazione &&
                semaforo !== "rosso" &&
                transizioneLocale
            ) {

                if (
                    transizioneLocale.esito ===
                        "preferito"
                ) {

                    if (
                        semaforo === "giallo"
                    ) {

                        semaforo =
                            "verde";

                    }

                }

                else if (
                    transizioneLocale.esito ===
                        "neutro" &&
                    esisteTransizionePreferita &&
                    semaforo === "verde"
                ) {

                    semaforo =
                        "giallo";

                }

                else if (
                    transizioneLocale.esito ===
                        "sconsigliato"
                ) {

                    if (
                        semaforo === "verde"
                    ) {

                        semaforo =
                            "giallo";

                    }

                    else if (
                        semaforo === "giallo"
                    ) {

                        semaforo =
                            "rosso";

                    }

                }

            }


            /*
            La fisiologia rimane
            l'autorità finale.
            */

            if (
                valutazione
                    ?.fisiologia
                    ?.livello ===
                    ANEMOSCHESI_ESITI_FISIOLOGICI
                        .ATTENZIONE &&
                semaforo ===
                    "verde"
            ) {

                semaforo =
                    "giallo";

            }


            if (
                valutazione
                    ?.fisiologia
                    ?.livello ===
                        ANEMOSCHESI_ESITI_FISIOLOGICI
                            .CRITICO ||
                valutazione
                    ?.fisiologia
                    ?.livello ===
                        ANEMOSCHESI_ESITI_FISIOLOGICI
                            .ERRORE
            ) {

                semaforo =
                    "rosso";

            }


            guida[
                percorso
            ] = {

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
Il semaforo deve descrivere la configurazione
rappresentata dal settore.

Se il settore è già attivo,
manteniamo quindi la configurazione attuale.

Se è inattivo, simuliamo la sua attivazione
usando il primo volume disponibile.
*/

if (
    !settoreEsistente
) {

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


let semaforo = null;


/*
Prima determiniamo il colore locale
del settore rispetto all'Intento.
*/

if (
    typeof valoreSettore ===
        "number"
) {

    if (
        valoreSettore === 2
    ) {

        semaforo = "verde";

    }

    else if (
        valoreSettore === -2
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


/*
Poi valutiamo come l'attivazione
o disattivazione del settore modifica
la transizione di carico dell'Anemodromo.
*/

if (
    valutazione &&
    semaforo
) {

    semaforo =
    applicaTransizioneSettoreAllaGuidaAnemoschesi(
        sequenza,
        anemomero,
        nomeSettore,
        valutazione,
        semaforo
    );
}


/*
La fisiologia mantiene sempre
la precedenza finale.
*/

if (
    valutazione?.fisiologia
) {

    if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE ||
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO
    ) {

        semaforo = "rosso";

    }

    else if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE &&
        semaforo === "verde"
    ) {

        semaforo = "giallo";

    }

}


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
        semaforo

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


if (
    valutazione &&
    semaforo
) {

    semaforo =
        applicaTransizioneCaricoAllaGuidaAnemoschesi(
            sequenza,
            valutazione,
            semaforo
        );

}

           if (
    valutazione?.fisiologia
) {

    if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ERRORE ||
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.CRITICO
    ) {

        semaforo = "rosso";

    }

    else if (
        valutazione.fisiologia.livello ===
            ANEMOSCHESI_ESITI_FISIOLOGICI.ATTENZIONE &&
        semaforo === "verde"
    ) {

        semaforo = "giallo";

    }

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
   INFLUENZA DELLE TRANSIZIONI SULLA GUIDA
===================================================== */

function valoreEsitoTransizioneGuidaAnemoschesi(
    esito
) {

    if (
        esito === "preferito"
    ) {

        return 2;

    }


    if (
        esito === "neutro"
    ) {

        return 1;

    }


    if (
        esito === "sconsigliato"
    ) {

        return 0;

    }


    return null;

}


function applicaTransizioneDurataAllaGuidaAnemoschesi(
    sequenza,
    valutazioneSimulata,
    semaforoBase
) {

    if (
        !sequenza ||
        !valutazioneSimulata ||
        !semaforoBase
    ) {

        return semaforoBase;

    }


    const valutazioneAttualeAnemodromo =
        valutaAnemodromoPerIntentoAnemoschesi(
            sequenza
        );


    const valutazioneSimulataAnemodromo =
        valutazioneSimulata.anemodromo;


   const esitoAttuale =
    valutazioneAttualeAnemodromo
        ?.valutazioneTransizioni
        ?.durata
        ?.esito;


const esitoSimulato =
    valutazioneSimulataAnemodromo
        ?.valutazioneTransizioni
        ?.durata
        ?.esito;
   

    const valoreAttuale =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoAttuale
        );


    const valoreSimulato =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoSimulato
        );


    /*
    Se non esiste ancora una vera transizione
    confrontabile, la guida resta invariata.
    */

    if (
        typeof valoreAttuale !==
            "number" ||
        typeof valoreSimulato !==
            "number" ||
        valoreAttuale ===
            valoreSimulato
    ) {

        return semaforoBase;

    }


    /*
    La transizione modifica il risultato
    di un solo livello.

    Non può trasformare direttamente
    un rosso in verde o viceversa.
    */

    if (
        valoreSimulato >
        valoreAttuale
    ) {

        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }


        return semaforoBase;

    }


    if (
        valoreSimulato <
        valoreAttuale
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }

    }


    return semaforoBase;

}

/* =====================================================
   RIFERIMENTO DI CARICO PER LA GUIDA DEI SETTORI
===================================================== */

function creaRiferimentoSettoreAnemoschesi(
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


    const riferimento =
        copiaAnemomeroPerSimulazioneAnemoschesi(
            anemomero
        );


    /*
    Il riferimento rappresenta sempre
    la configurazione senza il settore
    che stiamo valutando.
    */

    riferimento.settori =
        riferimento.settori.filter(
            settore =>
                settore.nome !==
                nomeSettore
        );


    return valutaAnemodromoConAnemomeroSimulatoAnemoschesi(
        sequenza,
        riferimento
    );

}

function applicaTransizioneSettoreAllaGuidaAnemoschesi(
    sequenza,
    anemomero,
    nomeSettore,
    valutazioneSimulata,
    semaforoBase
) {

    if (
        !sequenza ||
        !anemomero ||
        !nomeSettore ||
        !valutazioneSimulata ||
        !semaforoBase
    ) {

        return semaforoBase;

    }


    const valutazioneRiferimento =
        creaRiferimentoSettoreAnemoschesi(
            sequenza,
            anemomero,
            nomeSettore
        );


    const esitoRiferimento =
        valutazioneRiferimento
            ?.valutazioneTransizioni
            ?.carico
            ?.esito;


    const esitoConSettore =
        valutazioneSimulata
            .anemodromo
            ?.valutazioneTransizioni
            ?.carico
            ?.esito;


    const valoreRiferimento =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoRiferimento
        );


    const valoreConSettore =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoConSettore
        );


    if (
        typeof valoreRiferimento !==
            "number" ||
        typeof valoreConSettore !==
            "number" ||
        valoreRiferimento ===
            valoreConSettore
    ) {

        return semaforoBase;

    }


    if (
        valoreConSettore >
        valoreRiferimento
    ) {

        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }

        return semaforoBase;

    }


    if (
        valoreConSettore <
        valoreRiferimento
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }

    }


    return semaforoBase;

}

/* =====================================================
   INFLUENZA DELLE TRANSIZIONI DI CARICO SULLA GUIDA
===================================================== */

function applicaTransizioneCaricoAllaGuidaAnemoschesi(
    sequenza,
    valutazioneSimulata,
    semaforoBase
) {

    if (
        !sequenza ||
        !valutazioneSimulata ||
        !semaforoBase
    ) {

        return semaforoBase;

    }


    const valutazioneAttualeAnemodromo =
        valutaAnemodromoPerIntentoAnemoschesi(
            sequenza
        );


    const valutazioneSimulataAnemodromo =
        valutazioneSimulata.anemodromo;


    const esitoAttuale =
        valutazioneAttualeAnemodromo
            ?.valutazioneTransizioni
            ?.carico
            ?.esito;


    const esitoSimulato =
        valutazioneSimulataAnemodromo
            ?.valutazioneTransizioni
            ?.carico
            ?.esito;


    const valoreAttuale =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoAttuale
        );


    const valoreSimulato =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoSimulato
        );


    /*
    Se non esiste una transizione confrontabile
    oppure l'esito non cambia,
    manteniamo la guida locale del volume.
    */

    if (
        typeof valoreAttuale !==
            "number" ||
        typeof valoreSimulato !==
            "number" ||
        valoreAttuale ===
            valoreSimulato
    ) {

        return semaforoBase;

    }


    /*
    Miglioramento della transizione:
    giallo -> verde.

    Un volume localmente rosso
    non viene promosso.
    */

    if (
        valoreSimulato >
        valoreAttuale
    ) {

        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }


        return semaforoBase;

    }


    /*
    Peggioramento della transizione:
    verde -> giallo
    giallo -> rosso.
    */

    if (
        valoreSimulato <
        valoreAttuale
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }

    }


    return semaforoBase;

}

/* =====================================================
   INFLUENZA DELLE TRANSIZIONI DI FLUSSO SULLA GUIDA
===================================================== */

function applicaTransizioneFlussoAllaGuidaAnemoschesi(
    sequenza,
    valutazioneSimulata,
    semaforoBase
) {

    if (
        !sequenza ||
        !valutazioneSimulata ||
        !semaforoBase
    ) {

        return semaforoBase;

    }


    const valutazioneAttualeAnemodromo =
        valutaAnemodromoPerIntentoAnemoschesi(
            sequenza
        );


    const valutazioneSimulataAnemodromo =
        valutazioneSimulata.anemodromo;


    const esitoAttuale =
        valutazioneAttualeAnemodromo
            ?.valutazioneTransizioni
            ?.flusso
            ?.esito;


    const esitoSimulato =
        valutazioneSimulataAnemodromo
            ?.valutazioneTransizioni
            ?.flusso
            ?.esito;


    const valoreAttuale =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoAttuale
        );


    const valoreSimulato =
        valoreEsitoTransizioneGuidaAnemoschesi(
            esitoSimulato
        );


    /*
    Se non esiste ancora una transizione
    confrontabile oppure l'esito non cambia,
    manteniamo la guida locale del flusso.
    */

    if (
        typeof valoreAttuale !==
            "number" ||
        typeof valoreSimulato !==
            "number" ||
        valoreAttuale ===
            valoreSimulato
    ) {

        return semaforoBase;

    }


    /*
    Miglioramento della transizione:
    giallo -> verde.

    Un flusso localmente rosso
    non viene promosso.
    */

    if (
        valoreSimulato >
        valoreAttuale
    ) {

        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }


        return semaforoBase;

    }


    /*
    Peggioramento della transizione:
    verde -> giallo
    giallo -> rosso.
    */

    if (
        valoreSimulato <
        valoreAttuale
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }

    }


    return semaforoBase;

}

function applicaTransizionePercorsoAllaGuidaAnemoschesi(
    sequenza,
    valutazioneSimulata,
    semaforoBase
) {

    if (
        !sequenza ||
        !valutazioneSimulata ||
        !semaforoBase
    ) {

        return semaforoBase;

    }


    const punteggioTransizione =
        valutazioneSimulata
            .anemodromo
            ?.valutazioneTransizioniPercorso
            ?.punteggio;


    /*
    Se non esiste ancora una transizione
    di percorso valutabile,
    manteniamo la guida locale.
    */

    if (
        typeof punteggioTransizione !==
            "number"
    ) {

        return semaforoBase;

    }


    /*
    La grammatica viene letta direttamente
    dalla configurazione che risulterebbe
    dopo il click.

    >= 75  favorevole
    >= 50  neutra/intermedia
    < 50   sfavorevole
    */


    if (
        punteggioTransizione >= 75
    ) {

        if (
            semaforoBase === "giallo"
        ) {

            return "verde";

        }


        return semaforoBase;

    }


    if (
        punteggioTransizione < 50
    ) {

        if (
            semaforoBase === "verde"
        ) {

            return "giallo";

        }


        if (
            semaforoBase === "giallo"
        ) {

            return "rosso";

        }

    }


    return semaforoBase;

}

/* =====================================================
   TRANSIZIONE LOCALE DEL PERCORSO PER LA GUIDA
===================================================== */

function valutaTransizioneLocalePercorsoGuidaAnemoschesi(
    sequenza,
    anemomero,
    valutazioneSimulata
) {

    if (
        !sequenza ||
        !anemomero ||
        !valutazioneSimulata
    ) {

        return null;

    }


    const transizioni =
        valutazioneSimulata
            .anemodromo
            ?.transizioniAnemomeri;


    if (
        !Array.isArray(
            transizioni
        )
    ) {

        return null;

    }


    const indiceAnemomero =
        sequenza.anemodromi.findIndex(
            elemento =>
                elemento.id ===
                anemomero.id
        );


    if (
        indiceAnemomero < 0
    ) {

        return null;

    }


    /*
    Per la guida del singolo pulsante
    consideriamo la transizione che entra
    nell'Anemomero modificato.

    Se è il primo Anemomero,
    utilizziamo invece la transizione
    verso il successivo.
    */

    let transizione =
        transizioni.find(
            elemento =>
                elemento.indiceSuccessivo ===
                indiceAnemomero
        );


    if (
        !transizione
    ) {

        transizione =
            transizioni.find(
                elemento =>
                    elemento.indicePrecedente ===
                    indiceAnemomero
            );

    }


    const categoria =
        transizione
            ?.transizionePercorso;


    if (
        !categoria
    ) {

        return null;

    }


    const intentoId =
        sequenza.intento;


    const regoleIntento =
        ANEMOSCHESI_TRANSIZIONI_PERCORSO_INTENTI[
            intentoId
        ];


    if (
        !regoleIntento
    ) {

        return null;

    }


    if (
        Array.isArray(
            regoleIntento.preferiti
        ) &&
        regoleIntento.preferiti.includes(
            categoria
        )
    ) {

        return {
            categoria:
                categoria,
            esito:
                "preferito",
            punteggio:
                100
        };

    }


    if (
        Array.isArray(
            regoleIntento.sconsigliati
        ) &&
        regoleIntento.sconsigliati.includes(
            categoria
        )
    ) {

        return {
            categoria:
                categoria,
            esito:
                "sconsigliato",
            punteggio:
                0
        };

    }


    return {
        categoria:
            categoria,
        esito:
            "neutro",
        punteggio:
            50
    };

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


    let semaforoBase =
        "giallo";


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

        semaforoBase =
            "verde";

    }


    /*
    Se il passo immediato non ha già
    determinato una direzione favorevole,
    esploriamo le fasce successive.
    */

    if (
        semaforoBase !==
            "verde"
    ) {

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
                valore !==
                    valoreAttuale
            ) {

                if (
    valore <
    valoreAttuale
) {

    semaforoBase =
        valore < 0
            ? "rosso"
            : "giallo";

    break;

}

                if (
                    valore <
                    valoreAttuale
                ) {

                    semaforoBase =
                        "rosso";

                    break;

                }

            }


            durataEsplorata +=
                passo;

        }

    }


    return applicaTransizioneDurataAllaGuidaAnemoschesi(
        sequenza,
        valutazioneSimulata,
        semaforoBase
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
