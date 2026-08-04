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
   RENDER PRINCIPALE
===================================================== */

function renderAnemos31() {

    renderTimeline();

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
    indice
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
    ottieniValutazioneNodoAnemoschesi(
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

    const wrapper =
        document.createElement(
            "button"
        );


    wrapper.type =
        "button";


    wrapper.className =
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
                successivoId
            );

        }
    );


    return wrapper;

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
   DISPONIBILITÀ DEL SETTORE
===================================================== */

function settoreDisponibilePerTipo(
    anemodromo,
    nomeSettore
) {

    if (
        anemodromo.tipo ===
        ANEMOS_TIPI.IN
    ) {

        return settoreDisponibilePerInspirazione(
            anemos31,
            anemodromo.id,
            nomeSettore
        );

    }


    return settoreDisponibilePerEspirazione(
        anemos31,
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
                        anemos31,
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


    const anemodromo =
        trovaAnemodromo(
            anemos31,
            anemodromoSelezionatoId
        );


    if (!anemodromo) {
        return;
    }


    normalizzaSettoriIncoerenti(
        anemodromo
    );


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

localStorage.setItem(
    "ANEMOS_SEQUENZA_TEST",
    JSON.stringify(anemos31)
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


        localStorage.setItem(
            "ANEMOS_SEQUENZA_TEST",
            JSON.stringify(anemos31)
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
        "0 0 48 60"
    );

    svg.setAttribute(
        "width",
        "22"
    );

    svg.setAttribute(
        "height",
        "28"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    svg.style.marginRight =
        "8px";

    svg.style.flexShrink =
        "0";


    const parti = [

        {
            nome:
                ANEMOS_SETTORI
                    .TORACE_SUPERIORE,

            d:
                "M12 5 C16 2 32 2 36 5 L40 18 L8 18 Z"
        },

        {
            nome:
                ANEMOS_SETTORI
                    .TORACE_INFERIORE,

            d:
                "M8 18 L40 18 L37 36 L11 36 Z"
        },

        {
            nome:
                ANEMOS_SETTORI.ADDOME,

            d:
                "M11 36 L37 36 L34 55 L14 55 Z"
        }

    ];


    parti.forEach(
        parte => {

            const path =
                document.createElementNS(
                    ns,
                    "path"
                );


            path.setAttribute(
                "d",
                parte.d
            );

            path.setAttribute(
                "fill",
                parte.nome === settore
                    ? "#000"
                    : "#fff"
            );

            path.setAttribute(
                "stroke",
                "#000"
            );

            path.setAttribute(
                "stroke-width",
                "1.8"
            );

            path.setAttribute(
                "stroke-linejoin",
                "round"
            );


            svg.appendChild(
                path
            );

        }
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

                        }


                        renderAnemos31();

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


    const svgNS =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 40 40"
    );


    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    function creaCerchioBase(
        riempimento = "#fff"
    ) {

        const cerchio =
            document.createElementNS(
                svgNS,
                "circle"
            );


        cerchio.setAttribute(
            "cx",
            "20"
        );

        cerchio.setAttribute(
            "cy",
            "20"
        );

        cerchio.setAttribute(
            "r",
            "16"
        );

        cerchio.setAttribute(
            "fill",
            riempimento
        );

        cerchio.setAttribute(
            "stroke",
            "#000"
        );

        cerchio.setAttribute(
            "stroke-width",
            "2"
        );


        return cerchio;

    }


    /*
    =====================================================
    VUOTO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.VUOTO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );

    }


    /*
    =====================================================
    SCARSO
    1/4 NERO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.SCARSO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );


        const quarto =
            document.createElementNS(
                svgNS,
                "path"
            );


        quarto.setAttribute(
            "d",
            [
                "M 20 20",
                "L 36 20",
                "A 16 16 0 0 1 20 36",
                "Z"
            ].join(" ")
        );


        quarto.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            quarto
        );

    }


    /*
    =====================================================
    CONFORTEVOLE
    YIN-YANG
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.CONFORTEVOLE
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#fff"
            )
        );


        const metaNera =
            document.createElementNS(
                svgNS,
                "path"
            );


        metaNera.setAttribute(
            "d",
            [
                "M 20 4",
                "A 16 16 0 0 1 20 36",
                "A 8 8 0 0 1 20 20",
                "A 8 8 0 0 0 20 4",
                "Z"
            ].join(" ")
        );


        metaNera.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            metaNera
        );


        const biancoSuperiore =
            document.createElementNS(
                svgNS,
                "circle"
            );


        biancoSuperiore.setAttribute(
            "cx",
            "20"
        );

        biancoSuperiore.setAttribute(
            "cy",
            "12"
        );

        biancoSuperiore.setAttribute(
            "r",
            "8"
        );

        biancoSuperiore.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            biancoSuperiore
        );


        const neroInferiore =
            document.createElementNS(
                svgNS,
                "circle"
            );


        neroInferiore.setAttribute(
            "cx",
            "20"
        );

        neroInferiore.setAttribute(
            "cy",
            "28"
        );

        neroInferiore.setAttribute(
            "r",
            "8"
        );

        neroInferiore.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            neroInferiore
        );


        const puntoNero =
            document.createElementNS(
                svgNS,
                "circle"
            );


        puntoNero.setAttribute(
            "cx",
            "20"
        );

        puntoNero.setAttribute(
            "cy",
            "12"
        );

        puntoNero.setAttribute(
            "r",
            "2.5"
        );

        puntoNero.setAttribute(
            "fill",
            "#000"
        );


        svg.appendChild(
            puntoNero
        );


        const puntoBianco =
            document.createElementNS(
                svgNS,
                "circle"
            );


        puntoBianco.setAttribute(
            "cx",
            "20"
        );

        puntoBianco.setAttribute(
            "cy",
            "28"
        );

        puntoBianco.setAttribute(
            "r",
            "2.5"
        );

        puntoBianco.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            puntoBianco
        );

    }


    /*
    =====================================================
    ABBONDANTE
    3/4 NERO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.ABBONDANTE
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#000"
            )
        );


        const quartoBianco =
            document.createElementNS(
                svgNS,
                "path"
            );


        quartoBianco.setAttribute(
            "d",
            [
                "M 20 20",
                "L 4 20",
                "A 16 16 0 0 1 20 4",
                "Z"
            ].join(" ")
        );


        quartoBianco.setAttribute(
            "fill",
            "#fff"
        );


        svg.appendChild(
            quartoBianco
        );

    }


    /*
    =====================================================
    PIENO
    =====================================================
    */

    if (
        volume ===
        ANEMOS_VOLUMI.PIENO
    ) {

        svg.appendChild(
            creaCerchioBase(
                "#000"
            )
        );

    }


    contenitore.appendChild(
        svg
    );


    return contenitore;

}/* =====================================================
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
            anemos31,
            anemodromo.id,
            settore.nome,
            anemodromo.tipo
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


                        renderAnemos31();

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
