/* =====================================================
   ANEMOS 3.1
   LIBRERIA ANEMODROMI v1.0

   Archivio locale degli Anemodromi salvati.

   Principi:
   - la sequenza completa è la fonte originale
   - i motori possono essere ricalcolati
   - l'Intento è obbligatorio
   - prima versione basata su localStorage
===================================================== */


const ANEMOS_LIBRERIA_CHIAVE =
    "ANEMOS_LIBRERIA_3_1";

const ANEMOS_LIBRERIA_VERSIONE =
    1;


/* =====================================================
   LETTURA LIBRERIA
===================================================== */

function anemosLibreriaLeggi() {

    try {

        const dati =
            localStorage.getItem(
                ANEMOS_LIBRERIA_CHIAVE
            );

        if (!dati) {
            return [];
        }


        const libreria =
            JSON.parse(
                dati
            );


        if (
            !Array.isArray(libreria)
        ) {
            return [];
        }


        return libreria;

    } catch (errore) {

        return [];

    }
}


/* =====================================================
   SCRITTURA LIBRERIA
===================================================== */

function anemosLibreriaScrivi(
    libreria
) {

    if (
        !Array.isArray(libreria)
    ) {
        return false;
    }


    try {

        localStorage.setItem(
            ANEMOS_LIBRERIA_CHIAVE,
            JSON.stringify(
                libreria
            )
        );

        return true;

    } catch (errore) {

        return false;

    }
}


/* =====================================================
   COPIA INDIPENDENTE DELLA SEQUENZA

   Evita che successive modifiche nell'editor
   alterino l'Anemodromo già archiviato.
===================================================== */

function anemosLibreriaClona(
    valore
) {

    return JSON.parse(
        JSON.stringify(
            valore
        )
    );
}


/* =====================================================
   ID UNIVOCO
===================================================== */

function anemosLibreriaCreaId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        "anemos-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}

/* =====================================================
   SALVATAGGIO ANEMODROMO
===================================================== */

function anemosLibreriaSalva(
    sequenza,
    nome,
    intentoId,
    note = ""
) {

    const nomePulito =
        String(
            nome ?? ""
        ).trim();

    const intentoPulito =
        String(
            intentoId ?? ""
        ).trim();

    const notePulite =
        String(
            note ?? ""
        ).trim();


    /*
       Nome e Intento sono obbligatori.
    */

    if (
        !nomePulito ||
        !intentoPulito ||
        !sequenza
    ) {

        return {
            successo: false,
            motivo: "dati-mancanti"
        };

    }


    /*
       La sequenza deve contenere
       almeno un Anemomero.
    */

    const anemomeri =
        anemosLibreriaClona(
            sequenza
        );


    if (
        !Array.isArray(
            anemomeri.anemodromi
        ) ||
        anemomeri.anemodromi.length === 0
    ) {

        return {
            successo: false,
            motivo: "sequenza-vuota"
        };

    }


    const voce = {

        id:
            anemosLibreriaCreaId(),

        versione:
            ANEMOS_LIBRERIA_VERSIONE,

        creatoIl:
            new Date().toISOString(),

        nome:
            nomePulito,

        intento:
            intentoPulito,

        note:
            notePulite,

        sequenza:
            anemomeri

    };


    const libreria =
        anemosLibreriaLeggi();


    libreria.push(
        voce
    );


    const scritto =
        anemosLibreriaScrivi(
            libreria
        );


    if (!scritto) {

        return {
            successo: false,
            motivo: "errore-scrittura"
        };

    }


    return {
        successo: true,
        voce: voce
    };
}

/* =====================================================
   INTERFACCIA SALVATAGGIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const pulsanteSalva =
            document.getElementById(
                "salva-anemodromo"
            );

        const pannello =
            document.getElementById(
                "salva-libreria"
            );

        const pulsanteChiudi =
            document.getElementById(
                "chiudi-salva-libreria"
            );

        const pulsanteAnnulla =
            document.getElementById(
                "annulla-salva-libreria"
            );


        if (
            !pulsanteSalva ||
            !pannello
        ) {
            return;
        }


        function chiudiPannello() {

            pannello.classList.remove(
                "aperto"
            );

        }


        pulsanteSalva.addEventListener(
            "click",
            function () {

                /*
                   Deve esistere almeno
                   un Anemomero.
                */

                if (
                    typeof anemos31 === "undefined" ||
                    !Array.isArray(
                        anemos31.anemodromi
                    ) ||
                    anemos31.anemodromi.length === 0
                ) {

                    alert(
                        "Crea almeno un Anemomero prima di salvare."
                    );

                    return;

                }


                /*
                   L'Intento è obbligatorio.
                */

                if (
                    !anemos31.intento
                ) {

                    alert(
                        "Seleziona un Intento prima di salvare."
                    );

                    return;

                }


                /*
                   Nome già presente
                   nell'editor principale.
                */

                const nomePrincipale =
                    document.getElementById(
                        "nome-respirazione"
                    );

                const nomeSalvataggio =
                    document.getElementById(
                        "salva-libreria-nome"
                    );


                if (
                    nomePrincipale &&
                    nomeSalvataggio
                ) {

                    nomeSalvataggio.value =
                        nomePrincipale.value;

                }


                /*
                   Mostra il nome leggibile
                   dell'Intento selezionato.
                */

                const selettoreIntento =
                    document.getElementById(
                        "selettore-intento"
                    );

                const intentoAnteprima =
                    document.getElementById(
                        "salva-libreria-intento"
                    );


                if (
                    selettoreIntento &&
                    intentoAnteprima
                ) {

                    const opzione =
                        selettoreIntento.options[
                            selettoreIntento.selectedIndex
                        ];

                    intentoAnteprima.textContent =
                        opzione
                            ? opzione.textContent
                            : anemos31.intento;

                }


                /*
                   Recupera i risultati già
                   calcolati dal riepilogo.
                */

                const collegamenti = [

                    [
                        "durata-totale",
                        "salva-libreria-durata"
                    ],

                    [
                        "anemoschesi-esito",
                        "salva-libreria-anemoschesi"
                    ],

                    [
                        "anemobaros-esito",
                        "salva-libreria-anemobaros"
                    ],

                    [
                        "anemosinthesis-esito",
                        "salva-libreria-anemosinthesis"
                    ]

                ];


                collegamenti.forEach(
                    function (coppia) {

                        const origine =
                            document.getElementById(
                                coppia[0]
                            );

                        const destinazione =
                            document.getElementById(
                                coppia[1]
                            );


                        if (
                            origine &&
                            destinazione
                        ) {

                            destinazione.textContent =
                                origine.textContent;

                        }

                    }
                );


                /*
                   Apertura pannello.
                */

                pannello.classList.add(
                    "aperto"
                );

            }
        );


        if (pulsanteChiudi) {

            pulsanteChiudi.addEventListener(
                "click",
                chiudiPannello
            );

        }


        if (pulsanteAnnulla) {

            pulsanteAnnulla.addEventListener(
                "click",
                chiudiPannello
            );

        }


        /*
           Tocco sullo sfondo:
           chiude il pannello.
        */

        pannello.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === pannello
                ) {

                    chiudiPannello();

                }

            }
        );

    }
);
