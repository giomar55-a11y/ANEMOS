/*
=========================================================
ANEMOS 3.1
INTERFACCIA UTENTE
=========================================================

Questo file gestisce:

- timeline degli Anemodromi
- eventuali apnee tra Anemodromi
- apertura editor
- modifica dei parametri
- aggiornamento grafico

Dipende da:
model-3-1.js
=========================================================
*/


/* =====================================================
   STATO UI
===================================================== */

let anemodromoSelezionatoId = null;



/* =====================================================
   RIFERIMENTI PRINCIPALI
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
   RENDER PRINCIPALE
===================================================== */

function renderAnemos31() {

    renderTimeline();

    if (anemodromoSelezionatoId) {
        renderEditor();
    }

}



/* =====================================================
   TIMELINE
===================================================== */

function renderTimeline() {

    const ui = ottieniElementiUI();

    if (!ui.timeline) {
        return;
    }

    ui.timeline.innerHTML = "";

    const anemodromi =
        ottieniAnemodromiOrdinati(
            anemos31
        );


    if (anemodromi.length === 0) {

        const vuoto =
            document.createElement(
                "div"
            );

        vuoto.className =
            "timeline-vuota";

        vuoto.textContent =
            "Nessun Anemodromo";

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
                ];


            if (successivo) {

                const collegamento =
                    creaCollegamento(
                        anemodromo,
                        successivo
                    );

                ui.timeline.appendChild(
                    collegamento
                );

            }

        }
    );

}



/* =====================================================
   NODO ANEMODROMO
===================================================== */

function creaNodoAnemodromo(
    anemodromo,
    indice
) {

    const wrapper =
        document.createElement(
            "button"
        );

    wrapper.type = "button";

    wrapper.className =
        "anemodromo-node";

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
   COLLEGAMENTO / APNEA
===================================================== */

function creaCollegamento(
    precedente,
    successivo
) {

    const wrapper =
        document.createElement(
            "button"
        );

    wrapper.type = "button";

    wrapper.className =
        "apnea-link";


    const apnea =
        trovaApneaTra(
            anemos31,
            precedente.id,
            successivo.id
        );


    if (apnea) {

        wrapper.classList.add(
            "attiva"
        );

        wrapper.textContent =
            "⏸ " +
            apnea.durata +
            " s";

    } else {

        wrapper.textContent =
            "+ apnea";

    }


    wrapper.addEventListener(
        "click",
        function () {

            modificaApneaTra(
                precedente.id,
                successivo.id
            );

        }
    );


    return wrapper;

}



/* =====================================================
   MODIFICA APNEA
===================================================== */

function modificaApneaTra(
    precedenteId,
    successivoId
) {

    const esistente =
        trovaApneaTra(
            anemos31,
            precedenteId,
            successivoId
        );


    let valoreIniziale = 0;

    if (esistente) {
        valoreIniziale =
            esistente.durata;
    }


    const risposta =
        window.prompt(
            "Durata apnea in secondi. Scrivi 0 per rimuoverla.",
            valoreIniziale
        );


    if (risposta === null) {
        return;
    }


    const secondi =
        normalizzaSecondi(
            risposta,
            0
        );


    if (secondi === 0) {

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


    renderAnemos31();

}



/* =====================================================
   APERTURA / CHIUSURA EDITOR
===================================================== */

function apriEditor(
    anemodromoId
) {

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

    renderAnemos31();

}


function chiudiEditorAnemodromo() {

    anemodromoSelezionatoId =
        null;

    const ui =
        ottieniElementiUI();

    if (!ui.editor) {
        return;
    }

    ui.editor.classList.remove(
        "aperto"
    );

    renderTimeline();

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


    const anemodromo =
        trovaAnemodromo(
            anemos31,
            anemodromoSelezionatoId
        );


    if (!anemodromo) {
        return;
    }


    ui.editorTitolo.textContent =
        "Anemodromo " +
        anemodromo.tipo;


    ui.editorContenuto.innerHTML =
        "";


    ui.editorContenuto.appendChild(
        creaBloccoTipo(
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


    ui.editorContenuto.appendChild(
        creaBloccoSettori(
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

                    renderAnemos31();

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

    meno.type = "button";
    meno.textContent = "−";


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

    piu.type = "button";
    piu.textContent = "+";


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

            renderAnemos31();

        }
    );


    piu.addEventListener(
        "click",
        function () {

            impostaDurata(
                anemodromo,
                anemodromo.durata + 1
            );

            renderAnemos31();

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


    opzioni.forEach(
        opzione => {

            const pulsante =
                creaPulsanteOpzione(
                    opzione.etichetta,
                    anemodromo.percorso ===
                        opzione.valore
                );


            pulsante.addEventListener(
                "click",
                function () {

                    impostaPercorso(
                        anemodromo,
                        opzione.valore
                    );

                    renderAnemos31();

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


    opzioni.forEach(
        opzione => {

            const pulsante =
                creaPulsanteOpzione(
                    opzione.icona +
                    " " +
                    opzione.nome,
                    anemodromo.flusso ===
                        opzione.valore
                );


            pulsante.addEventListener(
                "click",
                function () {

                    impostaFlusso(
                        anemodromo,
                        opzione.valore
                    );

                    renderAnemos31();

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
   SETTORI + VOLUME
===================================================== */

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
                ANEMOS_SETTORI
                    .ADDOME,
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


    settori.forEach(
        configurazione => {

            const riga =
                document.createElement(
                    "div"
                );

            riga.className =
                "settore-riga";


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


            pulsanteSettore.addEventListener(
                "click",
                function () {

                    if (attivo) {

                        disattivaSettore(
                            anemodromo,
                            configurazione.valore
                        );

                    } else {

                        attivaSettore(
                            anemodromo,
                            configurazione.valore,
                            ANEMOS_VOLUMI
                                .NATURALE
                        );

                    }


                    renderAnemos31();

                }
            );


            riga.appendChild(
                pulsanteSettore
            );


            if (attivo) {

                const settore =
                    anemodromo
                        .settori
                        .find(
                            elemento =>
                                elemento.nome ===
                                configurazione
                                    .valore
                        );


                riga.appendChild(
                    creaSelettoreVolume(
                        anemodromo,
                        settore
                    )
                );

            }


            blocco.appendChild(
                riga
            );

        }
    );


    return blocco;

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


    const opzioni = [

        {
            valore:
                ANEMOS_VOLUMI
                    .RIDOTTO,
            etichetta:
                "Ridotto"
        },

        {
            valore:
                ANEMOS_VOLUMI
                    .NATURALE,
            etichetta:
                "Naturale"
        },

        {
            valore:
                ANEMOS_VOLUMI
                    .COMPLETO,
            etichetta:
                "Completo"
        }

    ];


    opzioni.forEach(
        opzione => {

            const pulsante =
                creaPulsanteOpzione(
                    opzione.etichetta,
                    settore.volume ===
                        opzione.valore
                );


            pulsante.classList.add(
                "volume-button"
            );


            pulsante.addEventListener(
                "click",
                function (evento) {

                    evento.stopPropagation();

                    impostaVolumeSettore(
                        anemodromo,
                        settore.nome,
                        opzione.valore
                    );

                    renderAnemos31();

                }
            );


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


    renderAnemos31();


    return nuovo;

}



/* =====================================================
   INIZIALIZZAZIONE UI
===================================================== */

function inizializzaUIAnemos31() {

    const ui =
        ottieniElementiUI();


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
