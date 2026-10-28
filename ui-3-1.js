/*
=========================================================
ANEMOS 3.1
INTERFACCIA UTENTE
=========================================================

Gestisce:
- timeline degli Anemodromi
- apnee, compresa l'apnea finale
- editor
- IN / ES
- durata
- percorso
- flusso
- settori
- progressione rigida dei volumi
- Motore di Coerenza

Dipende da:
model-3-1.js
=========================================================
*/


/* =====================================================
   STATO UI
===================================================== */

let anemodromoSelezionatoId = null;
let sequenzaEditorAttiva = null;
let intentiAnemoschesiDisponibili =
    [];


/* =====================================================
   RIFERIMENTI UI
===================================================== */

function ottieniElementiUI() {

    return {

        timeline:
            document.getElementById(
                "timeline-anemodromi"
            ),

        editor:
            document.getElementById(
                "editor-anemodromo"
            ),

        editorTitolo:
            document.getElementById(
                "editor-titolo"
            ),

        editorContenuto:
            document.getElementById(
                "editor-contenuto"
            ),

        chiudiEditor:
            document.getElementById(
                "chiudi-editor"
            )

    };

}

/* =====================================================
   RIEPILOGO COMPLESSIVO ANEMOSCHESI
===================================================== */

function renderRiepilogoAnemoschesi() {

    const contenitore =
        document.getElementById(
            "anemoschesi-riepilogo"
        );


    const esito =
        document.getElementById(
            "anemoschesi-esito"
        );


    if (
        !contenitore ||
        !esito
    ) {

        return;

    }


    contenitore.classList.remove(
        "anemoschesi-verde",
        "anemoschesi-giallo",
        "anemoschesi-rosso"
    );


    const valutazione =
        valutaAnemodromoPerIntentoAnemoschesi(
            anemos31
        );


    if (
        !valutazione ||
        !valutazione.valido
    ) {

        esito.textContent =
            "—";


        contenitore.removeAttribute(
            "title"
        );


        return;

    }


    const distribuzioneDiagnostica =
    valutazione
        .distribuzioneApneeMatriceTemporale;


const orientamentoDiagnostico =
    valutazione
        .orientamentoApneeIntento;


let suggerimentoApnee =
    "";


if (
    distribuzioneDiagnostica &&
    orientamentoDiagnostico
) {

    if (
        orientamentoDiagnostico.esito ===
        "opposto"
    ) {

        if (
            distribuzioneDiagnostica.prevalenza ===
            "ain"
        ) {

            suggerimentoApnee =
                " · Apnee: riduci dopo IN e/o aumenta dopo ES";

        }


        if (
            distribuzioneDiagnostica.prevalenza ===
            "aes"
        ) {

            suggerimentoApnee =
                " · Apnee: riduci dopo ES e/o aumenta dopo IN";

        }

    }


   if (
    orientamentoDiagnostico.esito ===
    "coerente"
) {

    suggerimentoApnee =
        " · Apnee: distribuzione coerente";

}


if (
    orientamentoDiagnostico.esito ===
    "parzialmente_coerente"
) {

    const presentiAIN =
        Number(
            distribuzioneDiagnostica.durataAIN
        ) > 0;


    const presentiAES =
        Number(
            distribuzioneDiagnostica.durataAES
        ) > 0;


    if (
        presentiAIN !== presentiAES
    ) {

        suggerimentoApnee =
            " · Apnee: orientamento favorevole";

    } else {

        suggerimentoApnee =
            " · Apnee: distribuzione parzialmente coerente";

    }

}

if (
    orientamentoDiagnostico.esito ===
    "assenza_apnee"
) {

    suggerimentoApnee =
        "";

}
}

esito.textContent =
    valutazione.punteggioComplessivo +
    "%" +
    suggerimentoApnee;
   contenitore.classList.add(
    "anemoschesi-" +
    valutazione.semaforo
);

    const distribuzioneApnee =
    valutazione
        .distribuzioneApneeMatriceTemporale;


const orientamentoApnee =
    valutazione
        .orientamentoApneeIntento;


contenitore.title =
    "Coerenza complessiva con l'Intento " +
    valutazione.intentoNome +
    ": " +
    valutazione.punteggioComplessivo +
    "%." +
    (
        distribuzioneApnee
            ? " | AIN: " +
              Math.round(
                  distribuzioneApnee.quotaAIN * 100
              ) +
              "% | AES: " +
              Math.round(
                  distribuzioneApnee.quotaAES * 100
              ) +
              "% | prevalenza: " +
              distribuzioneApnee.prevalenza +
              " | forza: " +
              distribuzioneApnee.forzaPrevalenza
            : ""
    ) +
    (
        orientamentoApnee
            ? " | orientamento: " +
              orientamentoApnee.esito
            : ""
    );
}

/* =====================================================
   RENDER PRINCIPALE
===================================================== */

function renderAnemos31() {

    renderTimeline();
    renderRiepilogoAnemoschesi();
   
    if (
        anemodromoSelezionatoId
    ) {

        renderEditor();

    }

}



/* =====================================================
   TIMELINE
===================================================== */

function renderTimeline() {

    const ui =
        ottieniElementiUI();


    if (!ui.timeline) {
        return;
    }


    ui.timeline.innerHTML =
        "";


    const anemodromi =
        ottieniAnemodromiOrdinati(
            anemos31
        );


    if (
        anemodromi.length === 0
    ) {

        const vuoto =
            document.createElement(
                "div"
            );


        vuoto.className =
            "timeline-vuota";


        vuoto.textContent =
    anemosOttieniLingua() ===
    ANEMOS_LINGUA.ITALIANO
        ? "Composizione del respiro"
        : "Composizione di un ANEMODROMO";
        ui.timeline.appendChild(
            vuoto
        );


        return;

    }


    anemodromi.forEach(
        (
            anemodromo,
            indice
        ) => {

            const nodo =
                creaNodoAnemodromo(
                    anemodromo,
                    indice
                );


            ui.timeline.appendChild(
                nodo
            );


            const successivo =
                anemodromi[
                    indice + 1
                ] || null;


            const collegamento =
                creaCollegamento(
                    anemodromo,
                    successivo
                );


            ui.timeline.appendChild(
                collegamento
            );

        }
    );

}

/* =====================================================
   VALUTAZIONE ANEMOSCHESI DEL NODO
===================================================== */

function ottieniValutazioneNodoAnemoschesi(
    anemodromo
) {

    const intentoId =
        ottieniIntento(
            anemos31
        );


    if (
        !intentoId
    ) {

        return null;

    }


    const valutazione =
        valutaAnemomeroPerIntentoAnemoschesi(
            anemos31,
            anemodromo,
            intentoId
        );


    if (
        !valutazione ||
        !valutazione.valido
    ) {

        return null;

    }


    return valutazione;

}

/* =====================================================
   NODO ANEMODROMO
===================================================== */

function creaNodoAnemodromo(
    anemodromo,
    indice,
    onClick = null
) {
    const wrapper =
        document.createElement(
            "button"
        );


    wrapper.type =
        "button";


    wrapper.className =
        "anemodromo-node";

   const valutazioneAnemoschesi =
    onClick
        ? null
        : ottieniValutazioneNodoAnemoschesi(
            anemodromo
        );

if (
    valutazioneAnemoschesi
) {

    wrapper.classList.add(
        "anemoschesi-" +
        valutazioneAnemoschesi.semaforo
    );


    wrapper.dataset
        .anemoschesiPunteggio =
            valutazioneAnemoschesi
                .punteggio;


    wrapper.title =
        valutazioneAnemoschesi
            .motivazione;

}

    if (
        anemodromo.id ===
        anemodromoSelezionatoId
    ) {

        wrapper.classList.add(
            "selezionato"
        );

    }


    wrapper.addEventListener(
    "click",
    function () {

        if (onClick) {

            onClick(
                anemodromo
            );

            return;
        }

        apriEditor(
            anemodromo.id
        );

    }
);

    const numero =
        document.createElement(
            "span"
        );


    numero.className =
        "anemodromo-numero";


    numero.textContent =
        indice + 1;


    const tipo =
        document.createElement(
            "span"
        );


    tipo.className =
        "anemodromo-tipo";


    tipo.textContent =
        anemodromo.tipo;


    const durata =
        document.createElement(
            "span"
        );


    durata.className =
        "anemodromo-durata";


    durata.textContent =
        anemodromo.durata +
        " s";


    wrapper.appendChild(
        numero
    );


    wrapper.appendChild(
        tipo
    );


    wrapper.appendChild(
        durata
    );


    return wrapper;

}



/* =====================================================
   APNEA
===================================================== */

function creaCollegamento(
    precedente,
    successivo = null
) {

    const contenitore =
        document.createElement(
            "div"
        );


    contenitore.className =
        "apnea-link";


    const successivoId =
        successivo
            ? successivo.id
            : null;


    const apnea =
        trovaApneaTra(
            anemos31,
            precedente.id,
            successivoId
        );


    const guidaApnea =
    ottieniIntento(
        anemos31
    )
        ? creaGuidaApneaAnemoschesi(
            anemos31,
            precedente,
            successivoId
        )
        : null;

    /*
    =================================================
    APNEA NON PRESENTE
    =================================================
    */

    if (
        !apnea
    ) {

        const aggiungi =
            document.createElement(
                "button"
            );


        aggiungi.type =
            "button";


        aggiungi.className =
            "apnea-link";


        aggiungi.textContent =
            "+ apnea";


        if (
            guidaApnea
                ?.piu
                ?.semaforo
        ) {

            aggiungi.classList.add(
                "anemoschesi-" +
                guidaApnea.piu.semaforo
            );

        }


        aggiungi.addEventListener(
    "click",
    function () {

        inserisciApnea(
            anemos31,
            precedente.id,
            successivoId,
            1
        );

        localStorage.setItem(
            "ANEMOS_SEQUENZA_TEST",
            JSON.stringify(anemos31)
        );

        renderAnemos31();
    }
);

        return aggiungi;

    }


    /*
    =================================================
    APNEA PRESENTE: −  ⏸ X s  +
    =================================================
    */

    contenitore.classList.add(
        "attiva"
    );


    const meno =
        document.createElement(
            "button"
        );


    meno.type =
        "button";


    meno.textContent =
        "−";


    meno.className =
        "apnea-comando";


    const valore =
        document.createElement(
            "button"
        );


    valore.type =
        "button";


    valore.className =
        "apnea-valore";


    valore.textContent =
        "⏸ " +
        apnea.durata +
        " s";


    const piu =
        document.createElement(
            "button"
        );


    piu.type =
        "button";


    piu.textContent =
        "+";


    piu.className =
        "apnea-comando";
   
   
    /*
    =================================================
    SEMAFORI − / +
    =================================================
    */

    if (
        guidaApnea
            ?.meno
            ?.disponibile &&
        guidaApnea
            ?.meno
            ?.semaforo
    ) {

        meno.classList.add(
            "anemoschesi-" +
            guidaApnea.meno.semaforo
        );


        meno.title =
            guidaApnea.meno.rimuove
                ? "Rimuovi apnea"
                : "Riduci apnea a " +
                  guidaApnea.meno.nuovaDurata +
                  " s";

    }


    if (
        guidaApnea
            ?.piu
            ?.disponibile &&
        guidaApnea
            ?.piu
            ?.semaforo
    ) {

        piu.classList.add(
            "anemoschesi-" +
            guidaApnea.piu.semaforo
        );


        piu.title =
            "Aumenta apnea a " +
            guidaApnea.piu.nuovaDurata +
            " s";

    }


    /*
    Il valore centrale mantiene
    la valutazione fisiologica
    dell'apnea attuale.
    */

    const analisiApnea =
        analizzaApneaAnemoschesi(
            apnea,
            precedente
        );


    const fisiologiaApnea =
        analisiApnea
            ? valutaFisiologiaApneaAnemoschesi(
                analisiApnea
            )
            : null;


    if (
        fisiologiaApnea
    ) {

        valore.classList.add(
            "apnea-fisiologia-" +
            fisiologiaApnea.livello
        );

    }


    /*
    =================================================
    COMANDO −
    =================================================
    */

    meno.addEventListener(
        "click",
        function () {

            const nuovaDurata =
                Number(
                    apnea.durata
                ) - 1;


            if (
                nuovaDurata <= 0
            ) {

                rimuoviApnea(
                    anemos31,
                    precedente.id,
                    successivoId
                );

            } else {

                inserisciApnea(
                    anemos31,
                    precedente.id,
                    successivoId,
                    nuovaDurata
                );

            }


            localStorage.setItem(
                "ANEMOS_SEQUENZA_TEST",
                JSON.stringify(
                    anemos31
                )
            );


            renderAnemos31();

        }
    );


    /*
    =================================================
    COMANDO +
    =================================================
    */

    piu.addEventListener(
        "click",
        function () {

            inserisciApnea(
                anemos31,
                precedente.id,
                successivoId,
                Number(
                    apnea.durata
                ) + 1
            );


            localStorage.setItem(
                "ANEMOS_SEQUENZA_TEST",
                JSON.stringify(
                    anemos31
                )
            );


            renderAnemos31();

        }
    );


    /*
    Toccando il valore centrale
    resta disponibile il prompt originale.
    */

    valore.disabled = true;

    contenitore.appendChild(
        meno
    );


    contenitore.appendChild(
        valore
    );


    contenitore.appendChild(
        piu
    );

     
    return contenitore;

}

function modificaApneaTra(
    precedenteId,
    successivoId = null
) {

    const esistente =
        trovaApneaTra(
            anemos31,
            precedenteId,
            successivoId
        );


    const valoreIniziale =
        esistente
            ? esistente.durata
            : 0;


    const risposta =
        window.prompt(
            "Durata apnea in secondi. Scrivi 0 per rimuoverla.",
            valoreIniziale
        );


    if (
        risposta === null
    ) {

        return;

    }


    const secondi =
        normalizzaSecondi(
            risposta,
            0
        );


    if (
        secondi === 0
    ) {

        rimuoviApnea(
            anemos31,
            precedenteId,
            successivoId
        );

    } else {

        inserisciApnea(
            anemos31,
            precedenteId,
            successivoId,
            secondi
        );

    }


    localStorage.setItem(
        "ANEMOS_SEQUENZA_TEST",
        JSON.stringify(
            anemos31
        )
    );


    renderAnemos31();

}

/* =====================================================
   APERTURA / CHIUSURA EDITOR
===================================================== */

function apriEditor(
    anemodromoId,
    sequenza = null
) {

    sequenzaEditorAttiva =
        sequenza;
    anemodromoSelezionatoId =
        anemodromoId;


    const ui =
        ottieniElementiUI();


    if (!ui.editor) {
        return;
    }


    ui.editor.classList.add(
    "aperto"
);

if (sequenzaEditorAttiva) {

    renderEditor();

} else {

    renderAnemos31();
}
}



function chiudiEditorAnemodromo() {

    const editorDaAnemosystema =
        Boolean(sequenzaEditorAttiva);

    anemodromoSelezionatoId =
        null;

    sequenzaEditorAttiva =
        null;

    const ui =
        ottieniElementiUI();

    if (!ui.editor) {
        return;
    }

    ui.editor.classList.remove(
        "aperto"
    );

    if (editorDaAnemosystema) {

        renderAnemosystema();

    } else {

        renderTimeline();
    }

}


/* =====================================================
   DISPONIBILITÀ DEL SETTORE
===================================================== */

function settoreDisponibilePerTipo(
    anemodromo,
    nomeSettore
) {

    const sequenzaAttiva =
        sequenzaEditorAttiva ||
        anemos31;

    if (
        anemodromo.tipo ===
        ANEMOS_TIPI.IN
    ) {

        return settoreDisponibilePerInspirazione(
            sequenzaAttiva,
            anemodromo.id,
            nomeSettore
        );

    }

    return settoreDisponibilePerEspirazione(
        sequenzaAttiva,
        anemodromo.id,
        nomeSettore
    );

}


/* =====================================================
   NORMALIZZAZIONE COERENZA
===================================================== */

function normalizzaSettoriIncoerenti(
    anemodromo
) {

    const sequenzaAttiva =
        sequenzaEditorAttiva ||
        anemos31;

    anemodromo.settori =
        anemodromo.settori.filter(
            settore => {

                if (
                    !settoreDisponibilePerTipo(
                        anemodromo,
                        settore.nome
                    )
                ) {

                    return false;

                }

                const disponibili =
                    volumiDisponibiliPerSettore(
                        sequenzaAttiva,
                        anemodromo.id,
                        settore.nome,
                        anemodromo.tipo
                    );

                return disponibili.includes(
                    settore.volume
                );

            }
        );

}

/* =====================================================
   EDITOR
===================================================== */

function renderEditor() {

    const ui =
        ottieniElementiUI();


    if (
        !ui.editorContenuto ||
        !ui.editorTitolo
    ) {

        return;

    }


    const sequenzaAttiva =
    sequenzaEditorAttiva ||
    anemos31;

const anemodromo =
    trovaAnemodromo(
        sequenzaAttiva,
        anemodromoSelezionatoId
    );

    if (!anemodromo) {
        return;
    }


    normalizzaSettoriIncoerenti(
        anemodromo
    );


    ui.editorTitolo.textContent =
    (
        anemosOttieniLingua() ===
        ANEMOS_LINGUA.ITALIANO
            ? "Fase respiratoria "
            : "Anemodromo "
    ) +
    anemodromo.tipo;

    ui.editorContenuto.innerHTML =
        "";


   ui.editorContenuto.appendChild(
    creaBloccoTipo(
        anemodromo
    )
);


ui.editorContenuto.appendChild(
    creaBloccoSettori(
        anemodromo
    )
);


ui.editorContenuto.appendChild(
    creaBloccoDurata(
        anemodromo
    )
);


ui.editorContenuto.appendChild(
    creaBloccoPercorso(
        anemodromo
    )
);


ui.editorContenuto.appendChild(
    creaBloccoFlusso(
        anemodromo
    )
);
}



/* =====================================================
   BLOCCO GENERICO
===================================================== */

function creaBloccoEditor(
    titolo
) {

    const blocco =
        document.createElement(
            "section"
        );


    blocco.className =
        "editor-blocco";


    const label =
        document.createElement(
            "div"
        );


    label.className =
        "editor-label";


    label.textContent =
        titolo;


    blocco.appendChild(
        label
    );


    return blocco;

}



/* =====================================================
   TIPO IN / ES
===================================================== */

function creaBloccoTipo(
    anemodromo
) {

    const blocco =
        creaBloccoEditor(
            "Tipo"
        );


    const gruppo =
        document.createElement(
            "div"
        );


    gruppo.className =
        "editor-opzioni";


    const opzioni = [

        {
            valore:
                ANEMOS_TIPI.IN,

            etichetta:
                "IN"
        },

        {
            valore:
                ANEMOS_TIPI.ES,

            etichetta:
                "ES"
        }

    ];


    opzioni.forEach(
        opzione => {

            const pulsante =
                creaPulsanteOpzione(
                    opzione.etichetta,
                    anemodromo.tipo ===
                        opzione.valore
                );


            pulsante.addEventListener(
                "click",
                function () {

                    impostaTipo(
                        anemodromo,
                        opzione.valore
                    );


                    if (sequenzaEditorAttiva) {

    renderAnemosystema();
    renderEditor();

} else {

    renderAnemos31();
}
                }
            );


            gruppo.appendChild(
                pulsante
            );

        }
    );


    blocco.appendChild(
        gruppo
    );


    return blocco;

}



/* =====================================================
   DURATA
===================================================== */

function creaBloccoDurata(
    anemodromo
) {

    const blocco =
        creaBloccoEditor(
            "Durata"
        );


    const riga =
        document.createElement(
            "div"
        );


    riga.className =
        "durata-riga";


    const meno =
        document.createElement(
            "button"
        );


    meno.type =
        "button";


    meno.textContent =
        "−";


    const valore =
        document.createElement(
            "span"
        );


    valore.className =
        "durata-valore";


    valore.textContent =
        anemodromo.durata +
        " s";


    const piu =
        document.createElement(
            "button"
        );


    piu.type =
        "button";


    piu.textContent =
        "+";

const guidaDurata =
    sequenzaEditorAttiva
        ? null
        : creaGuidaDurataAnemoschesi(
            anemos31,
            anemodromo
        );

if (
    guidaDurata
) {

    if (
        guidaDurata.meno.disponibile &&
        guidaDurata.meno.semaforo
    ) {

        meno.classList.add(
            "anemoschesi-" +
            guidaDurata.meno.semaforo
        );

        meno.title =
            "Riduci durata: " +
            guidaDurata.meno.punteggio +
            "%";

    }


    if (
        guidaDurata.piu.disponibile &&
        guidaDurata.piu.semaforo
    ) {

        piu.classList.add(
            "anemoschesi-" +
            guidaDurata.piu.semaforo
        );

        piu.title =
            "Aumenta durata: " +
            guidaDurata.piu.punteggio +
            "%";

    }

}
    meno.addEventListener(
        "click",
        function () {

            impostaDurata(
                anemodromo,
                Math.max(
                    1,
                    anemodromo.durata - 1
                )
            );

if (sequenzaEditorAttiva) {

    renderAnemosystema();
    renderEditor();

} else {

    localStorage.setItem(
        "ANEMOS_SEQUENZA_TEST",
        JSON.stringify(anemos31)
    );

    renderAnemos31();
}
        }
    );


    piu.addEventListener(
    "click",
    function () {

        impostaDurata(
            anemodromo,
            anemodromo.durata + 1
        );


        if (sequenzaEditorAttiva) {

    renderAnemosystema();
    renderEditor();

} else {

    localStorage.setItem(
        "ANEMOS_SEQUENZA_TEST",
        JSON.stringify(anemos31)
    );

    renderAnemos31();
}
    }
);

    riga.appendChild(
        meno
    );


    riga.appendChild(
        valore
    );


    riga.appendChild(
        piu
    );


    blocco.appendChild(
        riga
    );


    return blocco;

}



/* =====================================================
   PERCORSO
===================================================== */

function creaBloccoPercorso(
    anemodromo
) {

    const blocco =
        creaBloccoEditor(
            "Percorso"
        );


    const gruppo =
        document.createElement(
            "div"
        );


    gruppo.className =
        "editor-opzioni percorso";


    const opzioni = [

        {
            valore:
                ANEMOS_PERCORSI
                    .NARICE_DESTRA,

            etichetta:
                "👃 Dx"
        },

        {
            valore:
                ANEMOS_PERCORSI
                    .NARICE_SINISTRA,

            etichetta:
                "👃 Sn"
        },

        {
            valore:
                ANEMOS_PERCORSI
                    .ENTRAMBE_NARICI,

            etichetta:
                "👃"
        },

        {
            valore:
                ANEMOS_PERCORSI
                    .BOCCA,

            etichetta:
                "👄"
        }

    ];

const guidaPercorso =
    sequenzaEditorAttiva
        ? null
        : creaGuidaPercorsoAnemoschesi(
            anemos31,
            anemodromo
        );   
    opzioni.forEach(
        opzione => {

            const pulsante =
                creaPulsanteOpzione(
                    opzione.etichetta,
                    anemodromo.percorso ===
                        opzione.valore
                );

           const guidaOpzione =
    guidaPercorso
        ? guidaPercorso[
            opzione.valore
        ]
        : null;


if (
    guidaOpzione &&
    guidaOpzione.semaforo
) {

    pulsante.classList.add(
        "anemoschesi-" +
        guidaOpzione.semaforo
    );

}

            pulsante.addEventListener(
    "click",
    function () {

        impostaPercorso(
            anemodromo,
            opzione.valore
        );

        if (sequenzaEditorAttiva) {

            renderAnemosystema();
            renderEditor();

        } else {

            renderAnemos31();
        }

    }
);

            gruppo.appendChild(
                pulsante
            );

        }
    );


    blocco.appendChild(
        gruppo
    );


    return blocco;

}

/* =====================================================
   ICONA GRAFICA DEL FLUSSO
===================================================== */

function creaIconaFlusso(
    flusso
) {

    const contenitore =
        document.createElement(
            "span"
        );

    contenitore.className =
        "flusso-icon";


    const svgNS =
        "http://www.w3.org/2000/svg";

    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );

    svg.setAttribute(
        "viewBox",
        "0 0 42 30"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    let lineeAttive = 0;
    let trattenuto = false;


    if (
    flusso ===
    ANEMOS_FLUSSI.TRATTENUTO
) {
    lineeAttive = 1;
}
    if (
        flusso ===
        ANEMOS_FLUSSI.DELICATO
    ) {
        lineeAttive = 1;
    }

    if (
        flusso ===
        ANEMOS_FLUSSI.SPONTANEO
    ) {
        lineeAttive = 2;
    }

    if (
        flusso ===
        ANEMOS_FLUSSI.FORZATO
    ) {
        lineeAttive = 3;
    }


    const posizioniY =
    [7, 15, 23];


posizioniY.forEach(
    function (
        y,
        indice
    ) {

        const onda =
            document.createElementNS(
                svgNS,
                "path"
            );

        const percorso =
            "M 5 " + y +
            " C 10 " + (y - 5) +
            ", 15 " + (y - 5) +
            ", 21 " + y +
            " C 27 " + (y + 5) +
            ", 32 " + (y + 5) +
            ", 37 " + y;

        onda.setAttribute(
            "d",
            percorso
        );

        onda.setAttribute(
            "fill",
            "none"
        );

        onda.setAttribute(
            "stroke",
            "currentColor"
        );

        onda.setAttribute(
            "stroke-width",
            indice < lineeAttive
                ? "3"
                : "1.5"
        );

        onda.setAttribute(
            "stroke-linecap",
            "round"
        );

        onda.setAttribute(
            "stroke-linejoin",
            "round"
        );

        if (
    flusso ===
        ANEMOS_FLUSSI.TRATTENUTO &&
    indice === 0
) {

    onda.setAttribute(
        "stroke-dasharray",
        "4 6"
    );

}

        if (
            indice >= lineeAttive
        ) {
            onda.setAttribute(
                "opacity",
                "0.22"
            );
        }


        if (
            trattenuto &&
            indice === 0
        ) {
            onda.setAttribute(
                "stroke-dasharray",
                "4 3"
            );
        }


        svg.appendChild(
            onda
        );

    }
);

    contenitore.appendChild(
        svg
    );


    return contenitore;

}

/* =====================================================
   FLUSSO
===================================================== */

function creaBloccoFlusso(
    anemodromo
) {

    const blocco =
        creaBloccoEditor(
            "Flusso"
        );


    const gruppo =
        document.createElement(
            "div"
        );


    gruppo.className =
        "editor-opzioni flusso";


    const opzioni = [

        {
            valore:
                ANEMOS_FLUSSI
                    .TRATTENUTO,

            icona:
                "🕸️",

            nome:
                "Trattenuto"
        },

        {
            valore:
                ANEMOS_FLUSSI
                    .DELICATO,

            icona:
                "☁️",

            nome:
                "Delicato"
        },

        {
            valore:
                ANEMOS_FLUSSI
                    .SPONTANEO,

            icona:
                "💨",

            nome:
                "Spontaneo"
        },

        {
            valore:
                ANEMOS_FLUSSI
                    .FORZATO,

            icona:
                "🌪️",

            nome:
                "Forzato"
        }

    ];

   const guidaFlusso =
    sequenzaEditorAttiva
        ? null
        : creaGuidaFlussoAnemoschesi(
            anemos31,
            anemodromo
        );   
    opzioni.forEach(
        opzione => {

            const pulsante =
    creaPulsanteOpzione(
        opzione.nome,

        anemodromo.flusso ===
            opzione.valore
    );

pulsante.prepend(
    creaIconaFlusso(
        opzione.valore
    )
);
const guidaOpzione =
    guidaFlusso
        ? guidaFlusso[
            opzione.valore
        ]
        : null;


if (
    guidaOpzione &&
    guidaOpzione.semaforo
) {

    pulsante.classList.add(
        "anemoschesi-" +
        guidaOpzione.semaforo
    );

}
            pulsante.addEventListener(
    "click",
    function () {

        impostaFlusso(
            anemodromo,
            opzione.valore
        );

        if (sequenzaEditorAttiva) {

            renderAnemosystema();
            renderEditor();

        } else {

            renderAnemos31();
        }

    }
);

            gruppo.appendChild(
                pulsante
            );

        }
    );


    blocco.appendChild(
        gruppo
    );


    return blocco;

}



/* =====================================================
   SETTORI + MOTORE DI COERENZA
===================================================== */
function creaIconaSettore(
    settore
) {

    const ns =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            ns,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 100 160"
    );

    svg.setAttribute(
        "width",
        "25"
    );

    svg.setAttribute(
        "height",
        "40"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    svg.style.marginRight =
        "8px";

    svg.style.flexShrink =
        "0";


    const coloriSettori = {

        [ANEMOS_SETTORI.TORACE_SUPERIORE]:
            "#35C6E8",

        [ANEMOS_SETTORI.TORACE_INFERIORE]:
            "#9B51E0",

        [ANEMOS_SETTORI.ADDOME]:
            "#2457D6"

    };


    /*
    TESTA
    */

    const testa =
        document.createElementNS(
            ns,
            "circle"
        );

    testa.setAttribute(
        "cx",
        "50"
    );

    testa.setAttribute(
        "cy",
        "17"
    );

    testa.setAttribute(
        "r",
        "14"
    );

    testa.setAttribute(
        "fill",
        "#fff"
    );

    testa.setAttribute(
        "stroke",
        "#000"
    );

    testa.setAttribute(
        "stroke-width",
        "3"
    );

    svg.appendChild(
        testa
    );


    /*
    BRACCIO SINISTRO
    */

    const braccioSinistro =
        document.createElementNS(
            ns,
            "path"
        );

    braccioSinistro.setAttribute(
        "d",
        [
            "M49 39",
            "C42 34 35 34 28 37",
            "C21 40 13 45 6 51",
            "C2 55 2 60 5 64",
            "L18 81",
            "C21 85 27 85 30 81",
            "C33 77 32 72 30 68",
            "L19 54",
            "L27 49",
            "C31 47 34 49 36 53"
        ].join(" ")
    );

    braccioSinistro.setAttribute(
        "fill",
        "none"
    );

    braccioSinistro.setAttribute(
        "stroke",
        "#000"
    );

    braccioSinistro.setAttribute(
        "stroke-width",
        "3"
    );

    braccioSinistro.setAttribute(
        "stroke-linecap",
        "round"
    );

    braccioSinistro.setAttribute(
        "stroke-linejoin",
        "round"
    );

    svg.appendChild(
        braccioSinistro
    );


    /*
    BRACCIO DESTRO
    */

    const braccioDestro =
        document.createElementNS(
            ns,
            "path"
        );

    braccioDestro.setAttribute(
        "d",
        [
            "M51 39",
            "C58 34 65 34 72 37",
            "C79 40 87 45 94 51",
            "C98 55 98 60 95 64",
            "L82 81",
            "C79 85 73 85 70 81",
            "C67 77 68 72 70 68",
            "L81 54",
            "L73 49",
            "C69 47 66 49 64 53"
        ].join(" ")
    );

    braccioDestro.setAttribute(
        "fill",
        "none"
    );

    braccioDestro.setAttribute(
        "stroke",
        "#000"
    );

    braccioDestro.setAttribute(
        "stroke-width",
        "3"
    );

    braccioDestro.setAttribute(
        "stroke-linecap",
        "round"
    );

    braccioDestro.setAttribute(
        "stroke-linejoin",
        "round"
    );

    svg.appendChild(
        braccioDestro
    );


    /*
    TRE SETTORI RESPIRATORI
    */

    const moduli = [

        {
            nome:
                ANEMOS_SETTORI
                    .TORACE_SUPERIORE,

            x: 34,
            y: 39,
            width: 32,
            height: 19
        },

        {
            nome:
                ANEMOS_SETTORI
                    .TORACE_INFERIORE,

            x: 34,
            y: 60,
            width: 32,
            height: 19
        },

        {
            nome:
                ANEMOS_SETTORI.ADDOME,

            x: 34,
            y: 81,
            width: 32,
            height: 19
        }

    ];


    moduli.forEach(
        function (
            modulo
        ) {

            const rettangolo =
                document.createElementNS(
                    ns,
                    "rect"
                );

            rettangolo.setAttribute(
                "x",
                String(
                    modulo.x
                )
            );

            rettangolo.setAttribute(
                "y",
                String(
                    modulo.y
                )
            );

            rettangolo.setAttribute(
                "width",
                String(
                    modulo.width
                )
            );

            rettangolo.setAttribute(
                "height",
                String(
                    modulo.height
                )
            );

            rettangolo.setAttribute(
                "rx",
                "5"
            );

            rettangolo.setAttribute(
                "ry",
                "5"
            );

            rettangolo.setAttribute(
                "fill",
                modulo.nome === settore
                    ? coloriSettori[
                        modulo.nome
                    ]
                    : "#fff"
            );

            rettangolo.setAttribute(
                "stroke",
                "#000"
            );

            rettangolo.setAttribute(
                "stroke-width",
                "3"
            );

            svg.appendChild(
                rettangolo
            );

        }
    );


    /*
    GAMBA SINISTRA
    */

    const gambaSinistra =
        document.createElementNS(
            ns,
            "path"
        );

    gambaSinistra.setAttribute(
        "d",
        [
            "M34 100",
            "L34 146",
            "C34 153 38 157 44 157",
            "C48 157 50 154 50 149",
            "L50 100",
            "Z"
        ].join(" ")
    );

    gambaSinistra.setAttribute(
        "fill",
        "#fff"
    );

    gambaSinistra.setAttribute(
        "stroke",
        "#000"
    );

    gambaSinistra.setAttribute(
        "stroke-width",
        "3"
    );

    gambaSinistra.setAttribute(
        "stroke-linejoin",
        "round"
    );

    svg.appendChild(
        gambaSinistra
    );


    /*
    GAMBA DESTRA
    */

    const gambaDestra =
        document.createElementNS(
            ns,
            "path"
        );

    gambaDestra.setAttribute(
        "d",
        [
            "M50 100",
            "L50 149",
            "C50 154 52 157 56 157",
            "C62 157 66 153 66 146",
            "L66 100",
            "Z"
        ].join(" ")
    );

    gambaDestra.setAttribute(
        "fill",
        "#fff"
    );

    gambaDestra.setAttribute(
        "stroke",
        "#000"
    );

    gambaDestra.setAttribute(
        "stroke-width",
        "3"
    );

    gambaDestra.setAttribute(
        "stroke-linejoin",
        "round"
    );

    svg.appendChild(
        gambaDestra
    );


    return svg;

}

function creaBloccoSettori(
    anemodromo
) {

    const blocco =
        creaBloccoEditor(
            "Settori"
        );


    const settori = [

        {
            valore:
                ANEMOS_SETTORI.ADDOME,

            nome:
                "Addome"
        },

        {
            valore:
                ANEMOS_SETTORI
                    .TORACE_INFERIORE,

            nome:
                "Torace inferiore"
        },

        {
            valore:
                ANEMOS_SETTORI
                    .TORACE_SUPERIORE,

            nome:
                "Torace superiore"
        }

    ];

const guidaSettori =
    sequenzaEditorAttiva
        ? null
        : creaGuidaSettoriAnemoschesi(
            anemos31,
            anemodromo
        );   
    settori.forEach(
        configurazione => {

            const riga =
                document.createElement(
                    "div"
                );


            riga.className =
                "settore-riga";


            const disponibile =
                settoreDisponibilePerTipo(
                    anemodromo,
                    configurazione.valore
                );


            if (
                !disponibile &&
                settoreAttivo(
                    anemodromo,
                    configurazione.valore
                )
            ) {

                disattivaSettore(
                    anemodromo,
                    configurazione.valore
                );

            }


            const attivo =
                settoreAttivo(
                    anemodromo,
                    configurazione.valore
                );


            const pulsanteSettore =
                creaPulsanteOpzione(
                    configurazione.nome,
                    attivo
                );
const guidaOpzione =
    guidaSettori
        ? guidaSettori[
            configurazione.valore
        ]
        : null;


if (
    guidaOpzione &&
    guidaOpzione.semaforo
) {

    pulsanteSettore.classList.add(
        "anemoschesi-" +
        guidaOpzione.semaforo
    );

}
           
            pulsanteSettore.insertBefore(
                creaIconaSettore(
                    configurazione.valore
    ),
    pulsanteSettore.firstChild
);

            if (!disponibile) {

                pulsanteSettore.disabled =
                    true;


                pulsanteSettore.setAttribute(
                    "aria-disabled",
                    "true"
                );


                if (
                    anemodromo.tipo ===
                    ANEMOS_TIPI.IN
                ) {

                    pulsanteSettore.title =
                        "Settore non disponibile: è già pieno.";

                } else {

                    pulsanteSettore.title =
                        "Settore non disponibile: è già vuoto.";

                }

            } else {

                pulsanteSettore.addEventListener(
                    "click",
                    function () {

                        if (attivo) {

                            disattivaSettore(
                                anemodromo,
                                configurazione.valore
                            );

                        } else {

                            const volumeIniziale =
    primoVolumeDisponibilePerSettore(
        sequenzaEditorAttiva ||
            anemos31,
        anemodromo.id,
        configurazione.valore,
        anemodromo.tipo
    );

                            if (
                                volumeIniziale
                            ) {

                                attivaSettore(
                                    anemodromo,
                                    configurazione.valore,
                                    volumeIniziale
                                );

                            }

                           const avvisoAvvio =
    document.getElementById(
        "avviso-avvio-anemos"
    );

if (
    avvisoAvvio &&
    !sequenzaEditorAttiva &&
    anemodromoHaSettoriCompleti(
        anemos31
    )
) {
    avvisoAvvio.hidden = true;
}

                        }


                                                if (sequenzaEditorAttiva) {

                            renderAnemosystema();
                            renderEditor();

                        } else {

                            renderAnemos31();
                        }

                    }
                );
            }


            riga.appendChild(
                pulsanteSettore
            );


            if (
                attivo &&
                disponibile
            ) {

                const settore =
                    anemodromo
                        .settori
                        .find(
                            elemento =>
                                elemento.nome ===
                                configurazione.valore
                        );


                if (settore) {

                    riga.appendChild(
                        creaSelettoreVolume(
                            anemodromo,
                            settore
                        )
                    );

                }

            }


            blocco.appendChild(
                riga
            );

        }
    );


    return blocco;

}



/* =====================================================
   ETICHETTE VOLUME
===================================================== */

function etichettaVolume(
    volume
) {

    const etichette = {

        [ANEMOS_VOLUMI.SCARSO]:
            "Scarso",

        [ANEMOS_VOLUMI.CONFORTEVOLE]:
            "Confortevole",

        [ANEMOS_VOLUMI.ABBONDANTE]:
            "Abbondante",

        [ANEMOS_VOLUMI.PIENO]:
            "Pieno",

        [ANEMOS_VOLUMI.VUOTO]:
            "Vuoto"

    };


    return etichette[volume] ||
        volume;

}
/* =====================================================
   ICONA GRAFICA DEL VOLUME
===================================================== */

/*
Riprende il linguaggio grafico ANEMOS
dei cerchi concentrici.

0 = Vuoto
1 = Scarso
2 = Confortevole
3 = Abbondante
4 = Pieno
*/

function creaIconaVolume(
    volume
) {

    const contenitore =
        document.createElement(
            "span"
        );

    contenitore.className =
        "volume-icon";


    const ns =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            ns,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 64 64"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
    NUMERO DI LIVELLI PIENI
    */

    let livelliPieni = 0;


    if (
        volume ===
        ANEMOS_VOLUMI.SCARSO
    ) {
        livelliPieni = 1;
    }


    if (
        volume ===
        ANEMOS_VOLUMI.CONFORTEVOLE
    ) {
        livelliPieni = 2;
    }


    if (
        volume ===
        ANEMOS_VOLUMI.ABBONDANTE
    ) {
        livelliPieni = 3;
    }


    if (
        volume ===
        ANEMOS_VOLUMI.PIENO
    ) {
        livelliPieni = 4;
    }


    /*
    FORMA DEI POLMONI
    */

    const polmoneSinistro =
        "M29 18 C25 16 21 17 18 21 C14 27 12 36 13 46 C14 53 18 57 23 56 C27 55 29 50 29 44 Z";


    const polmoneDestro =
        "M35 18 C39 16 43 17 46 21 C50 27 52 36 51 46 C50 53 46 57 41 56 C37 55 35 50 35 44 Z";


    /*
    4 LIVELLI DISTINTI
    DAL BASSO VERSO L'ALTO
    */

    const livelli = [

        {
            y: 47,
            altezza: 10
        },

        {
            y: 37,
            altezza: 10
        },

        {
            y: 27,
            altezza: 10
        },

        {
            y: 17,
            altezza: 10
        }

    ];


    livelli.forEach(
        function (
            livello,
            indice
        ) {

            const clipId =
                "anemos-volume-" +
                Math.random()
                    .toString(36)
                    .slice(2);


            const defs =
                document.createElementNS(
                    ns,
                    "defs"
                );


            const clip =
                document.createElementNS(
                    ns,
                    "clipPath"
                );


            clip.setAttribute(
                "id",
                clipId
            );


            [
                polmoneSinistro,
                polmoneDestro
            ].forEach(
                function (
                    d
                ) {

                    const forma =
                        document.createElementNS(
                            ns,
                            "path"
                        );


                    forma.setAttribute(
                        "d",
                        d
                    );


                    clip.appendChild(
                        forma
                    );

                }
            );


            defs.appendChild(
                clip
            );


            svg.appendChild(
                defs
            );


            /*
            FASCIA
            */

            const fascia =
                document.createElementNS(
                    ns,
                    "rect"
                );


            fascia.setAttribute(
                "x",
                "11"
            );


            fascia.setAttribute(
                "y",
                String(
                    livello.y
                )
            );


            fascia.setAttribute(
                "width",
                "42"
            );


            fascia.setAttribute(
                "height",
                String(
                    livello.altezza
                )
            );


            fascia.setAttribute(
                "fill",
                indice < livelliPieni
                    ? "#777"
                    : "#F1F1F1"
            );


            fascia.setAttribute(
                "stroke",
                "#555"
            );


            fascia.setAttribute(
                "stroke-width",
                "1.5"
            );


            fascia.setAttribute(
                "clip-path",
                "url(#" +
                clipId +
                ")"
            );


            svg.appendChild(
                fascia
            );

        }
    );


    /*
    CONTORNO ESTERNO DEI POLMONI
    */

    [
        polmoneSinistro,
        polmoneDestro
    ].forEach(
        function (
            d
        ) {

            const bordo =
                document.createElementNS(
                    ns,
                    "path"
                );


            bordo.setAttribute(
                "d",
                d
            );


            bordo.setAttribute(
                "fill",
                "none"
            );


            bordo.setAttribute(
                "stroke",
                "#555"
            );


            bordo.setAttribute(
                "stroke-width",
                "2"
            );


            bordo.setAttribute(
                "stroke-linejoin",
                "round"
            );


            svg.appendChild(
                bordo
            );

        }
    );


    contenitore.appendChild(
        svg
    );


    return contenitore;

}
/* =====================================================
   VOLUME SINGOLO SETTORE
===================================================== */

function creaSelettoreVolume(
    anemodromo,
    settore
) {

    const gruppo =
        document.createElement(
            "div"
        );


    gruppo.className =
        "volume-opzioni";


    /*
    Mantiene l'ordine richiesto:

    IN:
    Scarso
    Confortevole
    Abbondante
    Pieno

    ES:
    Abbondante
    Confortevole
    Scarso
    Vuoto
    */

    const tutteLeOpzioni =
        ottieniVolumiPerTipo(
            anemodromo.tipo
        );


    const disponibili =
    volumiDisponibiliPerSettore(
        sequenzaEditorAttiva ||
            anemos31,
        anemodromo.id,
        settore.nome,
        anemodromo.tipo
    );
   const guidaVolumi =
    sequenzaEditorAttiva
        ? null
        : creaGuidaVolumiAnemoschesi(
            anemos31,
            anemodromo,
            settore.nome
        );
    tutteLeOpzioni.forEach(
        volume => {

            const pulsante =
    creaPulsanteOpzione(
        "",
        settore.volume ===
            volume
    );


pulsante.classList.add(
    "volume-button"
);

const guidaOpzione =
    guidaVolumi
        ? guidaVolumi[
            volume
        ]
        : null;


if (
    guidaOpzione &&
    guidaOpzione.semaforo
) {

    pulsante.classList.add(
        "anemoschesi-" +
        guidaOpzione.semaforo
    );

}
           
/*
Icona ANEMOS del livello.
*/

const icona =
    creaIconaVolume(
        volume
    );


/*
Aggettivo del volume.
*/

const testo =
    document.createElement(
        "span"
    );


testo.className =
    "volume-label";


testo.textContent =
    etichettaVolume(
        volume
    );


pulsante.appendChild(
    icona
);


pulsante.appendChild(
    testo
);

            const consentito =
                disponibili.includes(
                    volume
                );


            /*
            I livelli incoerenti restano visibili
            ma diventano inattivi.
            */

            if (
                !consentito &&
                settore.volume !==
                    volume
            ) {

                pulsante.disabled =
                    true;


                pulsante.setAttribute(
                    "aria-disabled",
                    "true"
                );

            }


            if (consentito) {

                pulsante.addEventListener(
                    "click",
                    function (
                        evento
                    ) {

                        evento.stopPropagation();


                        impostaVolumeSettore(
    anemodromo,
    settore.nome,
    volume
);

const avvisoAvvio =
    document.getElementById(
        "avviso-avvio-anemos"
    );

if (
    avvisoAvvio &&
    !sequenzaEditorAttiva &&
    anemodromoHaSettoriCompleti(
        anemos31
    )
) {
    avvisoAvvio.hidden = true;
}                       

if (sequenzaEditorAttiva) {

    renderAnemosystema();
    renderEditor();

} else {

    renderAnemos31();
}
                       
                    }
                );

            }


            gruppo.appendChild(
                pulsante
            );

        }
    );


    return gruppo;

}



/* =====================================================
   PULSANTE OPZIONE
===================================================== */

function creaPulsanteOpzione(
    testo,
    selezionato
) {

    const pulsante =
        document.createElement(
            "button"
        );


    pulsante.type =
        "button";


    pulsante.className =
        "opzione-button";


    if (selezionato) {

        pulsante.classList.add(
            "attiva"
        );

    }


    pulsante.textContent =
        testo;


    return pulsante;

}



/* =====================================================
   NUOVO ANEMODROMO
===================================================== */

function aggiungiNuovoAnemodromo(
    tipo = ANEMOS_TIPI.IN
) {

    const nuovo =
        creaAnemodromo(
            tipo
        );


    aggiungiAnemodromo(
        anemos31,
        nuovo
    );

   localStorage.setItem(
    "ANEMOS_SEQUENZA_TEST",
    JSON.stringify(anemos31)
);

    renderAnemos31();


    return nuovo;

}



/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function inizializzaUIAnemos31() {

    const ui =
        ottieniElementiUI();


    intentiAnemoschesiDisponibili =
        elencoIntentiAnemoschesi();


    if (
        ui.chiudiEditor
    ) {

        ui.chiudiEditor
            .addEventListener(
                "click",
                chiudiEditorAnemodromo
            );

    }


    renderAnemos31();

}


/*
=========================================================
FINE UI ANEMOS 3.1
=========================================================
*/
