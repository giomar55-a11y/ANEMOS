/*
=====================================================
ANEMOS 3.1
ANEMOSINTHESIS
Indice di complessità strutturale dell'Anemodromo
Versione 0.1
=====================================================

ANEMOSINTHESIS misura:
- struttura
- organizzazione dei settori
- articolazione dei volumi
- variazione dei parametri respiratori
- densità delle transizioni

NON misura:
- difficoltà esecutiva → ANEMOBAROS
- coerenza con l'Intento → ANEMOSCHESI

Range: 0–100

Pesi:
Struttura       max 20
Settori         max 25
Volumi          max 20
Parametri       max 20
Transizioni     max 15
=====================================================
*/


/* =====================================================
   UTILITÀ
===================================================== */

function anemosinthesisLimita(
    valore,
    minimo,
    massimo
) {
    return Math.max(
        minimo,
        Math.min(
            massimo,
            valore
        )
    );
}


function anemosinthesisMedia(
    valori
) {
    if (
        !Array.isArray(valori) ||
        valori.length === 0
    ) {
        return 0;
    }

    const totale =
        valori.reduce(
            (somma, valore) =>
                somma + valore,
            0
        );

    return totale /
        valori.length;
}


function anemosinthesisArrotonda1(
    valore
) {
    return Math.round(
        valore * 10
    ) / 10;
}


/* =====================================================
   VOLUMI
===================================================== */

function anemosinthesisLivelloVolume(
    volume
) {
    const testo =
        String(
            volume ?? ""
        )
            .trim()
            .toLowerCase();

    const mappa = {
        vuoto: 0,
        scarso: 1,
        confortevole: 2,
        abbondante: 3,
        pieno: 4
    };

    if (
        Object.prototype.hasOwnProperty.call(
            mappa,
            testo
        )
    ) {
        return mappa[testo];
    }

    /*
    Se il volume è già numerico 0–4
    lo utilizziamo direttamente.
    */

    const numero =
        Number(volume);

    if (
        Number.isFinite(numero) &&
        numero >= 0 &&
        numero <= 4
    ) {
        return numero;
    }

    return null;
}


/* =====================================================
   SETTORI
===================================================== */

function anemosinthesisNomiSettori(
    anemomero
) {
    if (
        !anemomero ||
        !Array.isArray(
            anemomero.settori
        )
    ) {
        return [];
    }

    return anemomero.settori
        .map(
            settore =>
                settore.nome
        )
        .filter(
            nome =>
                nome !== undefined &&
                nome !== null
        );
}


function anemosinthesisVolumeSettore(
    anemomero,
    nomeSettore
) {
    if (
        !anemomero ||
        !Array.isArray(
            anemomero.settori
        )
    ) {
        return null;
    }

    const settore =
        anemomero.settori.find(
            elemento =>
                elemento.nome ===
                nomeSettore
        );

    if (!settore) {
        return null;
    }

    return anemosinthesisLivelloVolume(
        settore.volume
    );
}


/* =====================================================
   CONFRONTO INSIEMI
===================================================== */

function anemosinthesisInsiemiUguali(
    insiemeA,
    insiemeB
) {
    if (
        insiemeA.size !==
        insiemeB.size
    ) {
        return false;
    }

    for (
        const valore
        of insiemeA
    ) {
        if (
            !insiemeB.has(
                valore
            )
        ) {
            return false;
        }
    }

    return true;
}


/* =====================================================
   ANEMOMERI ORDINATI
===================================================== */

function anemosinthesisOttieniAnemomeriOrdinati(
    sequenza
) {
    if (!sequenza) {
        return [];
    }

    /*
    Se l'Anemodromo arriva già
    come array ordinato di Anemomeri.
    */

    if (
        Array.isArray(sequenza) &&
        sequenza.length > 0
    ) {
        return sequenza;
    }

    /*
    Struttura ANEMOS:
    ordine[] + anemodromi[]
    */

    if (
        Array.isArray(sequenza.ordine) &&
        Array.isArray(sequenza.anemodromi)
    ) {
        return sequenza.ordine
            .map(
                id =>
                    sequenza.anemodromi.find(
                        anemomero =>
                            anemomero.id === id
                    )
            )
            .filter(Boolean);
    }

    /*
    Fallback:
    se gli Anemomeri sono già
    nell'ordine corretto.
    */

    if (
        Array.isArray(
            sequenza.anemodromi
        )
    ) {
        return [
            ...sequenza.anemodromi
        ];
    }

    return [];
}


/* =====================================================
   NORMALIZZAZIONE TIPO
===================================================== */

function anemosinthesisTipo(
    anemomero
) {
    return String(
        anemomero?.tipo ?? ""
    )
        .trim()
        .toUpperCase();
}


/* =====================================================
   MOTORE PRINCIPALE
===================================================== */

function calcolaAnemosinthesis(
    sequenza
) {

    const anemomeri =
        anemosinthesisOttieniAnemomeriOrdinati(
            sequenza
        );

    const apnee =
        sequenza &&
        Array.isArray(
            sequenza.apnee
        )
            ? sequenza.apnee
            : [];

    const N =
        anemomeri.length;

    const A =
        apnee.length;


    /* =================================================
       VALIDAZIONE
    ================================================= */

    if (N === 0) {
        return {
            valido: false,
            motivo:
                "Anemodromo vuoto"
        };
    }


    const contieneIN =
        anemomeri.some(
            anemomero =>
                anemosinthesisTipo(
                    anemomero
                ) === "IN"
        );


    const contieneES =
        anemomeri.some(
            anemomero =>
                anemosinthesisTipo(
                    anemomero
                ) === "ES"
        );


    if (
        !contieneIN ||
        !contieneES
    ) {
        return {
            valido: false,
            motivo:
                "Un Anemodromo richiede almeno un IN e un ES"
        };
    }


    /* =================================================
       TRANSIZIONI CICLICHE

       IMPORTANTE:
       viene considerata anche
       ultimo Anemomero → primo Anemomero.
    ================================================= */

    const transizioni = [];

    for (
        let i = 0;
        i < N;
        i += 1
    ) {
        transizioni.push({
            corrente:
                anemomeri[i],

            successivo:
                anemomeri[
                    (i + 1) % N
                ]
        });
    }


    /* =================================================
       1. STRUTTURA — MAX 20
    ================================================= */

    let puntiAnemomeri;

    if (N <= 2) {
        puntiAnemomeri = 2;

    } else if (N <= 4) {
        puntiAnemomeri = 4;

    } else if (N <= 6) {
        puntiAnemomeri = 6;

    } else if (N <= 8) {
        puntiAnemomeri = 8;

    } else if (N <= 12) {
        puntiAnemomeri = 10;

    } else {
        puntiAnemomeri = 12;
    }


    const puntiApnee =
        Math.min(
            A * 2,
            8
        );


    const punteggioStruttura =
        puntiAnemomeri +
        puntiApnee;


    /* =================================================
       2. SETTORI — MAX 25
    ================================================= */


    /*
    2A. Carico settoriale — max 10
    */

    const carichiSettoriali =
        anemomeri.map(
            anemomero => {

                const numeroSettori =
                    anemosinthesisNomiSettori(
                        anemomero
                    ).length;

                return anemosinthesisLimita(
                    (
                        numeroSettori - 1
                    ) / 2,
                    0,
                    1
                );
            }
        );


    const puntiCaricoSettoriale =
        anemosinthesisMedia(
            carichiSettoriali
        ) * 10;


    /*
    2B. Variazione settoriale — max 15
    */

    const variazioniSettori =
        transizioni.map(
            transizione => {

                const insiemeA =
                    new Set(
                        anemosinthesisNomiSettori(
                            transizione.corrente
                        )
                    );

                const insiemeB =
                    new Set(
                        anemosinthesisNomiSettori(
                            transizione.successivo
                        )
                    );

                const unione =
                    new Set([
                        ...insiemeA,
                        ...insiemeB
                    ]);

                if (
                    unione.size === 0
                ) {
                    return 0;
                }

                let intersezione = 0;

                insiemeA.forEach(
                    valore => {
                        if (
                            insiemeB.has(
                                valore
                            )
                        ) {
                            intersezione += 1;
                        }
                    }
                );

                return 1 -
                    (
                        intersezione /
                        unione.size
                    );
            }
        );


    const puntiVariazioneSettori =
        anemosinthesisMedia(
            variazioniSettori
        ) * 15;


    const punteggioSettori =
        puntiCaricoSettoriale +
        puntiVariazioneSettori;


    /* =================================================
       3. VOLUMI — MAX 20
    ================================================= */


    /*
    3A. Varietà dei livelli — max 6
    */

    const livelliUsati =
        new Set();


    anemomeri.forEach(
        anemomero => {

            (
                anemomero.settori ||
                []
            ).forEach(
                settore => {

                    const livello =
                        anemosinthesisLivelloVolume(
                            settore.volume
                        );

                    if (
                        livello !== null
                    ) {
                        livelliUsati.add(
                            livello
                        );
                    }
                }
            );
        }
    );


    const numeroLivelli =
        livelliUsati.size;


    const puntiVarietaVolumi =
        numeroLivelli <= 1
            ? 0
            : (
                (
                    numeroLivelli - 1
                ) / 4
            ) * 6;


    /*
    3B. Differenziazione interna — max 4
    */

    const dispersioni =
        anemomeri.map(
            anemomero => {

                const livelli =
                    (
                        anemomero.settori ||
                        []
                    )
                        .map(
                            settore =>
                                anemosinthesisLivelloVolume(
                                    settore.volume
                                )
                        )
                        .filter(
                            livello =>
                                livello !== null
                        );

                if (
                    livelli.length <= 1
                ) {
                    return 0;
                }

                return (
                    Math.max(
                        ...livelli
                    )
                    -
                    Math.min(
                        ...livelli
                    )
                ) / 4;
            }
        );


    const puntiDispersione =
        anemosinthesisMedia(
            dispersioni
        ) * 4;


    /*
    3C. Cambi di volume — max 10
    */

    const cambiVolume =
        transizioni.map(
            transizione => {

                const corrente =
                    transizione.corrente;

                const successivo =
                    transizione.successivo;


                const settoriA =
                    new Set(
                        anemosinthesisNomiSettori(
                            corrente
                        )
                    );

                const settoriB =
                    new Set(
                        anemosinthesisNomiSettori(
                            successivo
                        )
                    );


                const comuni =
                    [
                        ...settoriA
                    ].filter(
                        settore =>
                            settoriB.has(
                                settore
                            )
                    );


                if (
                    comuni.length > 0
                ) {
                    const differenze =
                        comuni
                            .map(
                                settore => {

                                    const volumeA =
                                        anemosinthesisVolumeSettore(
                                            corrente,
                                            settore
                                        );

                                    const volumeB =
                                        anemosinthesisVolumeSettore(
                                            successivo,
                                            settore
                                        );

                                    if (
                                        volumeA === null ||
                                        volumeB === null
                                    ) {
                                        return null;
                                    }

                                    return Math.abs(
                                        volumeB -
                                        volumeA
                                    ) / 4;
                                }
                            )
                            .filter(
                                valore =>
                                    valore !== null
                            );

                    return anemosinthesisMedia(
                        differenze
                    );
                }


                const livelliA =
                    (
                        corrente.settori ||
                        []
                    )
                        .map(
                            settore =>
                                anemosinthesisLivelloVolume(
                                    settore.volume
                                )
                        )
                        .filter(
                            valore =>
                                valore !== null
                        );


                const livelliB =
                    (
                        successivo.settori ||
                        []
                    )
                        .map(
                            settore =>
                                anemosinthesisLivelloVolume(
                                    settore.volume
                                )
                        )
                        .filter(
                            valore =>
                                valore !== null
                        );


                if (
                    livelliA.length === 0 ||
                    livelliB.length === 0
                ) {
                    return 0;
                }


                return Math.abs(
                    anemosinthesisMedia(
                        livelliB
                    )
                    -
                    anemosinthesisMedia(
                        livelliA
                    )
                ) / 4;
            }
        );


    const puntiCambiVolume =
        anemosinthesisMedia(
            cambiVolume
        ) * 10;


    const punteggioVolumi =
        puntiVarietaVolumi +
        puntiDispersione +
        puntiCambiVolume;


    /* =================================================
       4. PARAMETRI RESPIRATORI — MAX 20
    ================================================= */

    const cambiDurata = [];
    const cambiPercorso = [];
    const cambiFlusso = [];


    transizioni.forEach(
        transizione => {

            const corrente =
                transizione.corrente;

            const successivo =
                transizione.successivo;


            cambiDurata.push(
                corrente.durata !==
                successivo.durata
                    ? 1
                    : 0
            );


            cambiPercorso.push(
                corrente.percorso !==
                successivo.percorso
                    ? 1
                    : 0
            );


            cambiFlusso.push(
                corrente.flusso !==
                successivo.flusso
                    ? 1
                    : 0
            );
        }
    );


    const puntiDurata =
        anemosinthesisMedia(
            cambiDurata
        ) * 7;


    const puntiPercorso =
        anemosinthesisMedia(
            cambiPercorso
        ) * 6;


    const puntiFlusso =
        anemosinthesisMedia(
            cambiFlusso
        ) * 7;


    const punteggioParametri =
        puntiDurata +
        puntiPercorso +
        puntiFlusso;


    /* =================================================
       5. DENSITÀ DELLE TRANSIZIONI — MAX 15
    ================================================= */

    const densitaTransizioni =
        transizioni.map(
            transizione => {

                const corrente =
                    transizione.corrente;

                const successivo =
                    transizione.successivo;

                let cambiamenti = 0;


                /*
                TIPO
                */

                if (
                    anemosinthesisTipo(
                        corrente
                    ) !==
                    anemosinthesisTipo(
                        successivo
                    )
                ) {
                    cambiamenti += 1;
                }


                /*
                SETTORI
                */

                const settoriA =
                    new Set(
                        anemosinthesisNomiSettori(
                            corrente
                        )
                    );

                const settoriB =
                    new Set(
                        anemosinthesisNomiSettori(
                            successivo
                        )
                    );


                if (
                    !anemosinthesisInsiemiUguali(
                        settoriA,
                        settoriB
                    )
                ) {
                    cambiamenti += 1;
                }


                /*
                VOLUMI
                */

                const comuni =
                    [
                        ...settoriA
                    ].filter(
                        settore =>
                            settoriB.has(
                                settore
                            )
                    );


                const volumeCambiato =
                    comuni.some(
                        settore =>
                            anemosinthesisVolumeSettore(
                                corrente,
                                settore
                            )
                            !==
                            anemosinthesisVolumeSettore(
                                successivo,
                                settore
                            )
                    );


                if (
                    volumeCambiato
                ) {
                    cambiamenti += 1;
                }


                /*
                DURATA
                */

                if (
                    corrente.durata !==
                    successivo.durata
                ) {
                    cambiamenti += 1;
                }


                /*
                PERCORSO
                */

                if (
                    corrente.percorso !==
                    successivo.percorso
                ) {
                    cambiamenti += 1;
                }


                /*
                FLUSSO
                */

                if (
                    corrente.flusso !==
                    successivo.flusso
                ) {
                    cambiamenti += 1;
                }


                return cambiamenti / 6;
            }
        );


    const punteggioTransizioni =
        anemosinthesisMedia(
            densitaTransizioni
        ) * 15;


    /* =================================================
       6. ANEMOSINTHESIS COMPLESSIVO
    ================================================= */

    const punteggioGrezzo =
        punteggioStruttura
        +
        punteggioSettori
        +
        punteggioVolumi
        +
        punteggioParametri
        +
        punteggioTransizioni;


    const punteggio =
        Math.round(
            anemosinthesisLimita(
                punteggioGrezzo,
                0,
                100
            )
        );


    /* =================================================
       7. CLASSIFICAZIONE
    ================================================= */

    let livello;
    let simbolo;


    if (
        punteggio <= 33
    ) {
        livello =
            "Semplice";

        simbolo =
            "●○○";

    } else if (
        punteggio <= 66
    ) {
        livello =
            "Articolato";

        simbolo =
            "●●○";

    } else {
        livello =
            "Complesso";

        simbolo =
            "●●●";
    }


    /* =================================================
       8. RISULTATO
    ================================================= */

    return {
        valido:
            true,

        anemosinthesis:
            punteggio,

        livello:
            livello,

        simbolo:
            simbolo,

        dettaglio: {
            struttura:
                anemosinthesisArrotonda1(
                    punteggioStruttura
                ),

            settori:
                anemosinthesisArrotonda1(
                    punteggioSettori
                ),

            volumi:
                anemosinthesisArrotonda1(
                    punteggioVolumi
                ),

            parametri:
                anemosinthesisArrotonda1(
                    punteggioParametri
                ),

            transizioni:
                anemosinthesisArrotonda1(
                    punteggioTransizioni
                )
        }
    };
}
