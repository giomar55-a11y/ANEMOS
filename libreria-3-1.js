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
   LETTURA LIBRERIA DA SUPABASE
===================================================== */

async function anemosLibreriaLeggiSupabase() {

    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await anemosSupabase.auth.getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            return {
                successo: false,
                motivo: "utente-non-autenticato",
                libreria: []
            };

        }


        const {
            data,
            error
        } =
            await anemosSupabase
                .from("anemodromi")
                .select(
                    "id, user_id, nome, intento_id, note, sequenza, versione, created_at, updated_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            return {
                successo: false,
                motivo: "errore-lettura",
                errore: error,
                libreria: []
            };

        }


        return {
            successo: true,
            libreria: data || []
        };


    } catch (errore) {

        return {
            successo: false,
            motivo: "errore-lettura",
            errore: errore,
            libreria: []
        };

    }

}

/* =====================================================
   SCRITTURA LIBRERIA SU SUPABASE
===================================================== */

async function anemosLibreriaScriviSupabase(
    nome,
    intentoId,
    note,
    sequenza
) {

    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await anemosSupabase.auth.getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            return {
                successo: false,
                motivo: "utente-non-autenticato"
            };

        }


        const utente =
            sessionData.session.user;


        const {
            data,
            error
        } =
            await anemosSupabase
                .from("anemodromi")
                .insert({
                    user_id: utente.id,
                    nome: String(nome ?? "").trim(),
                    intento_id: String(intentoId ?? "").trim(),
                    note: String(note ?? "").trim(),
                    sequenza: sequenza,
                    versione: ANEMOS_LIBRERIA_VERSIONE
                })
                .select(
                    "id, user_id, nome, intento_id, note, sequenza, versione, created_at, updated_at"
                )
                .single();


        if (error) {

            return {
                successo: false,
                motivo: "errore-scrittura",
                errore: error
            };

        }


        return {
            successo: true,
            voce: data
        };


    } catch (errore) {

        return {
            successo: false,
            motivo: "errore-scrittura",
            errore: errore
        };

    }

}

/* =====================================================
   MODIFICA LIBRERIA SU SUPABASE
===================================================== */

async function anemosLibreriaModificaSupabase(
    id,
    nome,
    intentoId,
    note,
    sequenza
) {

    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await anemosSupabase.auth.getSession();

        if (
            sessionError ||
            !sessionData.session
        ) {
            return {
                successo: false,
                motivo: "utente-non-autenticato"
            };
        }

        const {
            data,
            error
        } =
            await anemosSupabase
                .from("anemodromi")
                .update({
                    nome: String(nome ?? "").trim(),
                    intento_id: String(intentoId ?? "").trim(),
                    note: String(note ?? "").trim(),
                    sequenza: sequenza,
                    versione: ANEMOS_LIBRERIA_VERSIONE,
                    updated_at: new Date().toISOString()
                })
                .eq(
                    "id",
                    String(id)
                )
                .select(
                    "id, user_id, nome, intento_id, note, sequenza, versione, created_at, updated_at"
                )
                .single();

        if (error) {
            return {
                successo: false,
                motivo: "errore-modifica",
                errore: error
            };
        }

        return {
            successo: true,
            voce: data
        };

    } catch (errore) {
        return {
            successo: false,
            motivo: "errore-modifica",
            errore: errore
        };
    }

}

/* =====================================================
   ELIMINAZIONE LIBRERIA DA SUPABASE
===================================================== */

async function anemosLibreriaEliminaSupabase(
    id
) {

    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await anemosSupabase.auth.getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            return {
                successo: false,
                motivo: "utente-non-autenticato"
            };

        }


        const {
            error
        } =
            await anemosSupabase
                .from("anemodromi")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            return {
                successo: false,
                motivo: "errore-eliminazione",
                errore: error
            };

        }


        return {
            successo: true
        };


    } catch (errore) {

        return {
            successo: false,
            motivo: "errore-eliminazione",
            errore: errore
        };

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
   MODIFICA DATI VOCE LIBRERIA
===================================================== */

function anemosLibreriaModifica(
    id,
    nome,
    note = ""
) {

    const nomePulito =
        String(
            nome ?? ""
        ).trim();

    const notePulite =
        String(
            note ?? ""
        ).trim();


    if (
        !id ||
        !nomePulito
    ) {

        return {
            successo: false,
            motivo: "dati-mancanti"
        };

    }


    const libreria =
        anemosLibreriaLeggi();


    const voce =
        libreria.find(
            function (elemento) {
                return elemento.id === id;
            }
        );


    if (!voce) {

        return {
            successo: false,
            motivo: "non-trovato"
        };

    }


    voce.nome =
        nomePulito;

    voce.note =
        notePulite;


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
   DUPLICA VOCE LIBRERIA
===================================================== */

function anemosLibreriaDuplica(
    id
) {

    if (!id) {

        return {
            successo: false,
            motivo: "dati-mancanti"
        };

    }


    const libreria =
        anemosLibreriaLeggi();


    const originale =
        libreria.find(
            function (elemento) {
                return elemento.id === id;
            }
        );


    if (!originale) {

        return {
            successo: false,
            motivo: "non-trovato"
        };

    }


    const copia =
        anemosLibreriaClona(
            originale
        );


    copia.id =
        anemosLibreriaCreaId();

    copia.creatoIl =
        new Date().toISOString();

    copia.nome =
        originale.nome + " copia";


    libreria.push(
        copia
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
        voce: copia
    };

}

/* =====================================================
   ELIMINA VOCE LIBRERIA
===================================================== */

function anemosLibreriaElimina(
    id
) {

    if (!id) {

        return {
            successo: false,
            motivo: "dati-mancanti"
        };

    }


    const libreria =
        anemosLibreriaLeggi();


    const nuovaLibreria =
        libreria.filter(
            function (elemento) {
                return elemento.id !== id;
            }
        );


    if (
        nuovaLibreria.length ===
        libreria.length
    ) {

        return {
            successo: false,
            motivo: "non-trovato"
        };

    }


    const scritto =
        anemosLibreriaScrivi(
            nuovaLibreria
        );


    if (!scritto) {

        return {
            successo: false,
            motivo: "errore-scrittura"
        };

    }


    return {
        successo: true
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


        /*
           Conferma salvataggio
           nella Libreria.
        */

        const pulsanteConferma =
            document.getElementById(
                "conferma-salva-libreria"
            );


        if (pulsanteConferma) {

            pulsanteConferma.addEventListener(
                "click",
                function () {

                    const campoNome =
                        document.getElementById(
                            "salva-libreria-nome"
                        );

                    const campoNote =
                        document.getElementById(
                            "salva-libreria-note"
                        );


                    const nome =
                        campoNome
                            ? campoNome.value.trim()
                            : "";

                    const note =
                        campoNote
                            ? campoNote.value.trim()
                            : "";


                    if (!nome) {

                        alert(
                            "Inserisci un nome per l'Anemodromo."
                        );

                        return;

                    }


                    const modificaId =
    pannello.dataset.modificaId || "";


if (
    !modificaId &&
    (
        typeof anemos31 === "undefined" ||
        !anemos31.intento
    )
) {

    alert(
        "Seleziona un Intento prima di salvare."
    );

    return;

}

                 
let risultato;


if (modificaId) {

    risultato =
        anemosLibreriaModifica(
            modificaId,
            nome,
            note
        );

} else {

    risultato =
        anemosLibreriaSalva(
            anemos31,
            nome,
            anemos31.intento,
            note
        );

}

                    if (
                        !risultato.successo
                    ) {

                        alert(
                            "Non è stato possibile salvare l'Anemodromo."
                        );

                        return;

                    }


                    /*
                       Mantiene sincronizzato
                       anche il nome principale.
                    */

                    const nomePrincipale =
                        document.getElementById(
                            "nome-respirazione"
                        );


                    if (nomePrincipale) {

                        nomePrincipale.value =
                            nome;

                    }


                    /*
                       Pulisce le note per
                       il prossimo salvataggio.
                    */

                    if (campoNote) {

                        campoNote.value = "";

                    }


                  const eraModifica =
    Boolean(
        pannello.dataset.modificaId
    );


delete pannello.dataset.modificaId;


pulsanteConferma.textContent =
    "Salva nella Libreria";


chiudiPannello();


if (eraModifica) {

    renderLibreria();

    alert(
        "Modifiche salvate."
    );

} else {

    alert(
        "Anemodromo salvato nella Libreria."
    );

}
                }
            );

        }

    }
);

/* =====================================================
   INTERFACCIA LIBRERIA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const pulsanteApri =
            document.getElementById(
                "apri-libreria"
            );

        const libreriaPannello =
            document.getElementById(
                "libreria-anemodromi"
            );

        const pulsanteChiudi =
            document.getElementById(
                "chiudi-libreria"
            );

        const contenitore =
            document.getElementById(
                "libreria-risultati"
            );

        const filtroIntento =
            document.getElementById(
                "libreria-filtro-intento"
            );


        if (
            !pulsanteApri ||
            !libreriaPannello ||
            !contenitore
        ) {
            return;
        }


        /*
           Restituisce il nome leggibile
           dell'Intento partendo dal suo ID.
        */

        function nomeIntento(
            intentoId
        ) {

            const selettore =
                document.getElementById(
                    "selettore-intento"
                );


            if (selettore) {

                const opzione =
                    Array.from(
                        selettore.options
                    ).find(
                        function (voce) {

                            return (
                                voce.value ===
                                intentoId
                            );

                        }
                    );


                if (opzione) {

                    return opzione.textContent;

                }

            }


            return intentoId;

        }


        /*
           Popola il filtro Intento
           usando gli Intenti realmente
           presenti nella Libreria.
        */

        function aggiornaFiltroIntenti(
            libreria
        ) {

            if (!filtroIntento) {
                return;
            }


            const valoreAttuale =
                filtroIntento.value;


            filtroIntento.innerHTML =
                '<option value="">Tutti</option>';


            const intenti =
                [
                    ...new Set(
                        libreria
                            .map(
                                function (voce) {
                                    return voce.intento;
                                }
                            )
                            .filter(Boolean)
                    )
                ];


            intenti.forEach(
                function (intentoId) {

                    const opzione =
                        document.createElement(
                            "option"
                        );

                    opzione.value =
                        intentoId;

                    opzione.textContent =
                        nomeIntento(
                            intentoId
                        );

                    filtroIntento.appendChild(
                        opzione
                    );

                }
            );


            if (
                intenti.includes(
                    valoreAttuale
                )
            ) {

                filtroIntento.value =
                    valoreAttuale;

            }

        }


        /*
   Disegna le respirazioni
   realmente archiviate.

   Gli indici vengono ricalcolati
   dalla sequenza originale salvata.
*/

function renderLibreria() {

    const libreria =
        anemosLibreriaLeggi();


    aggiornaFiltroIntenti(
        libreria
    );


    contenitore.innerHTML = "";


    if (
        libreria.length === 0
    ) {

        const vuota =
            document.createElement(
                "div"
            );

        vuota.className =
            "libreria-vuota";

        vuota.textContent =
            "Nessun Anemodromo salvato.";

        contenitore.appendChild(
            vuota
        );

        return;

    }


        /*
       Legge i filtri correnti.
    */

    const ricerca =
        (
            document.getElementById(
                "libreria-ricerca"
            )?.value || ""
        )
        .trim()
        .toLowerCase();


    const filtroIntento =
        document.getElementById(
            "libreria-filtro-intento"
        )?.value || "";


    const filtroAnemobaros =
        document.getElementById(
            "libreria-filtro-anemobaros"
        )?.value || "";


    const filtroAnemosinthesis =
        document.getElementById(
            "libreria-filtro-anemosinthesis"
        )?.value || "";


    /*
       Ricalcola gli indici di ogni
       Anemodromo salvato.

       I valori non vengono congelati
       nella Libreria: vengono sempre
       ricavati dai motori attuali.
    */

    const vociValutate =
        libreria
            .map(
                function (voce) {

                    return {

                        voce,

                        risultatoAnemoschesi:
                            valutaAnemodromoPerIntentoAnemoschesi(
                                voce.sequenza
                            ),

                        risultatoAnemobaros:
                            calcolaAnemobaros(
                                voce.sequenza
                            ),

                        risultatoAnemosinthesis:
                            calcolaAnemosinthesis(
                                voce.sequenza
                            )

                    };

                }
            )


            /*
               FILTRI
            */

            .filter(
                function (elemento) {

                    const voce =
                        elemento.voce;


                    if (
                        ricerca &&
                        !(
                            voce.nome || ""
                        )
                        .toLowerCase()
                        .includes(
                            ricerca
                        )
                    ) {

                        return false;

                    }


                    if (
                        filtroIntento &&
                        voce.intento !==
                            filtroIntento
                    ) {

                        return false;

                    }


                    if (
                        filtroAnemobaros &&
                        elemento
                            .risultatoAnemobaros
                            .livello !==
                            filtroAnemobaros
                    ) {

                        return false;

                    }


                    if (
                        filtroAnemosinthesis &&
                        elemento
                            .risultatoAnemosinthesis
                            .livello !==
                            filtroAnemosinthesis
                    ) {

                        return false;

                    }


                    return true;

                }
            )


            /*
               ANEMOSCHESI non è un filtro.

               Ordina invece i risultati
               dal più coerente al meno
               coerente con l'Intento.
            */

            .sort(
                function (a, b) {

                    return (
                        b.risultatoAnemoschesi
                            .punteggioComplessivo -
                        a.risultatoAnemoschesi
                            .punteggioComplessivo
                    );

                }
            );


    /*
       Nessun risultato dopo i filtri.
    */

    if (
        vociValutate.length === 0
    ) {

        const vuota =
            document.createElement(
                "div"
            );

        vuota.className =
            "libreria-vuota";

        vuota.textContent =
            "Nessun Anemodromo corrisponde ai filtri.";

        contenitore.appendChild(
            vuota
        );

        return;

    }


    vociValutate.forEach(
        function (elemento) {

            const voce =
                elemento.voce;

            const risultatoAnemoschesi =
                elemento.risultatoAnemoschesi;

            const risultatoAnemobaros =
                elemento.risultatoAnemobaros;

            const risultatoAnemosinthesis =
                elemento.risultatoAnemosinthesis;

            /*
               Durata totale.

               ANEMOBAROS la calcola già
               comprendendo Anemomeri e apnee.
            */

            const durata =
                risultatoAnemobaros &&
                risultatoAnemobaros.dettaglio
                    ? risultatoAnemobaros
                        .dettaglio
                        .durataTotale
                    : 0;


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "libreria-card";


            /*
               NOME
            */

            const titolo =
                document.createElement(
                    "h3"
                );

            titolo.textContent =
                voce.nome;


            /*
               INTENTO + DURATA
            */

            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "libreria-card-meta";

            meta.textContent =
                nomeIntento(
                    voce.intento
                ) +
                " · " +
                durata +
                " s";


            /*
               INDICI
            */

            const indici =
                document.createElement(
                    "div"
                );

            indici.className =
                "libreria-card-indici";


            const schedaAnemoschesi =
                document.createElement(
                    "div"
                );

            schedaAnemoschesi.className =
                "libreria-card-indice";

            schedaAnemoschesi.innerHTML =
                "<span>ANEMOSCHESI</span>" +
                "<strong>" +
                Math.round(
                    risultatoAnemoschesi
                        .punteggioComplessivo
                ) +
                "%</strong>";


            const schedaAnemobaros =
                document.createElement(
                    "div"
                );

            schedaAnemobaros.className =
                "libreria-card-indice";

            schedaAnemobaros.innerHTML =
                "<span>ANEMOBAROS</span>" +
                "<strong>" +
                risultatoAnemobaros.anemobaros +
                "/100 · " +
                risultatoAnemobaros.simbolo +
                " " +
                risultatoAnemobaros.livello +
                "</strong>";


            const schedaAnemosinthesis =
                document.createElement(
                    "div"
                );

            schedaAnemosinthesis.className =
                "libreria-card-indice";

            schedaAnemosinthesis.innerHTML =
                "<span>ANEMOSINTHESIS</span>" +
                "<strong>" +
                risultatoAnemosinthesis
                    .anemosinthesis +
                "/100 · " +
                risultatoAnemosinthesis.simbolo +
                " " +
                risultatoAnemosinthesis.livello +
                "</strong>";


            indici.appendChild(
                schedaAnemoschesi
            );

            indici.appendChild(
                schedaAnemobaros
            );

            indici.appendChild(
                schedaAnemosinthesis
            );


            /*
               AZIONI

               Per ora vengono predisposti
               i pulsanti. CARICA verrà
               collegato nel passaggio
               successivo.
            */

            const azioni =
                document.createElement(
                    "div"
                );

            azioni.className =
                "libreria-card-azioni";


            const carica =
                document.createElement(
                    "button"
                );

            carica.type =
                "button";

            carica.textContent =
                "CARICA";

            carica.dataset.id =
                voce.id;

                       /*
               CARICA

               Mantiene l'oggetto anemos31
               esistente e ne sostituisce
               soltanto il contenuto.
            */

            carica.addEventListener(
                "click",
                function () {

                    const sequenzaCaricata =
                        anemosLibreriaClona(
                            voce.sequenza
                        );


                    /*
                       Svuota lo stato corrente
                       senza sostituire anemos31.
                    */

                    Object.keys(
                        anemos31
                    ).forEach(
                        function (chiave) {

                            delete anemos31[
                                chiave
                            ];

                        }
                    );


                    /*
                       Copia nello stato ANEMOS
                       la respirazione archiviata.
                    */

                    Object.assign(
                        anemos31,
                        sequenzaCaricata
                    );


                    /*
                       Ripristina il nome.
                    */

                    const nomePrincipale =
                        document.getElementById(
                            "nome-respirazione"
                        );


                    if (nomePrincipale) {

                        nomePrincipale.value =
                            voce.nome;

                    }


                    /*
                       Ripristina l'Intento
                       nel selettore visibile.
                    */

                    const selettoreIntento =
                        document.getElementById(
                            "selettore-intento"
                        );


                    if (selettoreIntento) {

                        selettoreIntento.value =
                            anemos31.intento || "";

                    }


                    /*
                       Nessun Anemomero deve
                       rimanere selezionato
                       dal lavoro precedente.
                    */

                    if (
                        typeof anemodromoSelezionatoId !==
                        "undefined"
                    ) {

                        anemodromoSelezionatoId =
                            null;

                    }


                    const editor =
                        document.getElementById(
                            "editor-anemodromo"
                        );


                    if (editor) {

                        editor.classList.remove(
                            "aperto"
                        );

                    }


                                       /*
                       Chiude subito la Libreria
                       prima del rendering.
                    */

                    libreriaPannello.classList.remove(
                        "aperta"
                    );


                    /*
                       Ridisegna l'intera app.

                       Il render principale aggiorna
                       anche durata, indici e stato
                       dei pulsanti IN / ES.
                    */

                  
                                       /*
                       Feedback visivo
                       del caricamento.
                    */

                    const feedback =
                        document.getElementById(
                            "feedback-caricamento"
                        );


                    if (feedback) {

                        feedback.textContent =
                            "✓ “" +
                            voce.nome +
                            "” caricato";

                        feedback.classList.add(
                            "visibile"
                        );


                        setTimeout(
                            function () {

                                feedback.classList.remove(
                                    "visibile"
                                );

                            },
                            2000
                        );

                    }

                    renderAnemos31();
                   
                }
            );


            const anemogramma =
                document.createElement(
                    "button"
                );

            anemogramma.type =
                "button";

            anemogramma.textContent =
                "ANEMOGRAMMA";

            anemogramma.dataset.id =
                voce.id;
           
anemogramma.addEventListener(
    "click",
    function () {

        creaPannelloAnemogramma(
            anemosLibreriaClona(
                voce.sequenza
            )
        );

    }
);

            const menu =
                document.createElement(
                    "button"
                );

            menu.type =
                "button";

            menu.textContent =
                "⋯";

            menu.dataset.id =
                voce.id;

           menu.addEventListener(
    "click",
    function () {

        const menuEsistente =
            card.querySelector(
                ".libreria-menu-azioni"
            );


        if (menuEsistente) {

            menuEsistente.remove();

            return;

        }


        const pannelloMenu =
            document.createElement(
                "div"
            );

        pannelloMenu.className =
            "libreria-menu-azioni";


        const modifica =
            document.createElement(
                "button"
            );

        modifica.type =
            "button";

        modifica.textContent =
            "Rinomina / Note";
       
modifica.addEventListener(
    "click",
    function () {

        const pannello =
            document.getElementById(
                "salva-libreria"
            );

        const nome =
            document.getElementById(
                "salva-libreria-nome"
            );

        const note =
            document.getElementById(
                "salva-libreria-note"
            );

        const intento =
            document.getElementById(
                "salva-libreria-intento"
            );

        const conferma =
            document.getElementById(
                "conferma-salva-libreria"
            );


        if (
            !pannello ||
            !nome ||
            !note ||
            !conferma
        ) {
            return;
        }


        nome.value =
            voce.nome || "";

        note.value =
            voce.note || "";


        if (intento) {

            intento.textContent =
                nomeIntento(
                    voce.intento
                );

        }


        pannello.dataset.modificaId =
            voce.id;


        conferma.textContent =
            "Salva modifiche";

        const pannelloLibreria =
    document.getElementById(
        "libreria-anemodromi"
    );


if (pannelloLibreria) {

    pannelloLibreria.classList.remove(
        "aperta"
    );

}

        pannello.classList.add(
            "aperto"
        );

    }
);

        const duplica =
            document.createElement(
                "button"
            );

        duplica.type =
            "button";

        duplica.textContent =
            "Duplica";

       duplica.addEventListener(
    "click",
    function () {

        const risultato =
            anemosLibreriaDuplica(
                voce.id
            );


        if (
            !risultato.successo
        ) {

            alert(
                "Non è stato possibile duplicare l'Anemodromo."
            );

            return;

        }


        renderLibreria();


        alert(
            "Anemodromo duplicato."
        );

    }
);
       
        const elimina =
            document.createElement(
                "button"
            );

        elimina.type =
            "button";

        elimina.textContent =
            "Elimina";

        elimina.className =
            "libreria-menu-elimina";

        elimina.addEventListener(
    "click",
    function () {

        const conferma =
            confirm(
                "Vuoi eliminare \"" +
                voce.nome +
                "\" dalla Libreria?"
            );


        if (!conferma) {
            return;
        }


        const risultato =
            anemosLibreriaElimina(
                voce.id
            );


        if (
            !risultato.successo
        ) {

            alert(
                "Non è stato possibile eliminare l'Anemodromo."
            );

            return;

        }


        renderLibreria();


        alert(
            "Anemodromo eliminato."
        );

    }
);
       
        pannelloMenu.appendChild(
            modifica
        );

        pannelloMenu.appendChild(
            duplica
        );

        pannelloMenu.appendChild(
            elimina
        );


        card.appendChild(
            pannelloMenu
        );

    }
);

            azioni.appendChild(
                carica
            );

            azioni.appendChild(
                anemogramma
            );

            azioni.appendChild(
                menu
            );


            /*
               COMPOSIZIONE CARD
            */

            card.appendChild(
                titolo
            );

            card.appendChild(
                meta
            );

            card.appendChild(
                indici
            );

            card.appendChild(
                azioni
            );


            contenitore.appendChild(
                card
            );

        }
    );

}

        /*
           Aggiornamento immediato
           dei risultati della Libreria
           quando cambiano i filtri.
        */

        const ricercaLibreria =
            document.getElementById(
                "libreria-ricerca"
            );

        const filtroAnemobarosLibreria =
            document.getElementById(
                "libreria-filtro-anemobaros"
            );

        const filtroAnemosinthesisLibreria =
            document.getElementById(
                "libreria-filtro-anemosinthesis"
            );


        if (ricercaLibreria) {

            ricercaLibreria.addEventListener(
                "input",
                renderLibreria
            );

        }


        if (filtroIntento) {

            filtroIntento.addEventListener(
                "change",
                renderLibreria
            );

        }


        if (filtroAnemobarosLibreria) {

            filtroAnemobarosLibreria.addEventListener(
                "change",
                renderLibreria
            );

        }


        if (filtroAnemosinthesisLibreria) {

            filtroAnemosinthesisLibreria.addEventListener(
                "change",
                renderLibreria
            );

        }       

        /*
           Apertura Libreria.
        */

        pulsanteApri.addEventListener(
            "click",
            function () {

                renderLibreria();

                libreriaPannello.classList.add(
                    "aperta"
                );

            }
        );


        /*
           Chiusura Libreria.
        */

        if (pulsanteChiudi) {

            pulsanteChiudi.addEventListener(
                "click",
                function () {

                    libreriaPannello.classList.remove(
                        "aperta"
                    );

                }
            );

        }

    }
);

/* TEST TEMPORANEO INSERT + UPDATE SUPABASE */

window.anemosTestModificaSupabase =
    async function () {

        const inserimento =
            await anemosLibreriaScriviSupabase(
                "TEST UPDATE",
                "test",
                "Riga temporanea prima della modifica",
                []
            );

        if (!inserimento.successo) {

            alert(
                "Supabase INSERT per UPDATE ERRORE — " +
                inserimento.motivo
            );

            return;
        }

        const id =
            inserimento.voce.id;

        const modifica =
            await anemosLibreriaModificaSupabase(
                id,
                "TEST UPDATE MODIFICATO",
                "test",
                "Riga temporanea modificata correttamente",
                []
            );

        if (modifica.successo) {

            alert(
                "Supabase UPDATE OK — " +
                modifica.voce.nome +
                " — ID: " +
                modifica.voce.id
            );

        } else {

            alert(
                "Supabase UPDATE ERRORE — " +
                modifica.motivo
            );

        }

    };

