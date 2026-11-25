/* =====================================================
   ANEMOS 3.1
   AUTENTICAZIONE SUPABASE
===================================================== */


/* =====================================================
   SESSIONE ATTUALE
===================================================== */

async function anemosAuthSessione() {

    const {
        data,
        error
    } =
        await anemosSupabase.auth.getSession();


    if (error) {

        return {
            successo: false,
            sessione: null,
            errore: error
        };

    }


    return {
        successo: true,
        sessione: data.session,
        errore: null
    };

}


/* =====================================================
   REGISTRAZIONE
===================================================== */

async function anemosAuthRegistrati(
    email,
    password
) {

    const {
        data,
        error
    } =
        await anemosSupabase.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo: "https://giomar55-a11y.github.io/ANEMOS/index-3-1.html"
    }
});


    if (error) {

        return {
            successo: false,
            dati: null,
            errore: error
        };

    }


    return {
        successo: true,
        dati: data,
        errore: null
    };

}


/* =====================================================
   ACCESSO
===================================================== */

async function anemosAuthAccedi(
    email,
    password
) {

    const {
        data,
        error
    } =
        await anemosSupabase.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        return {
            successo: false,
            dati: null,
            errore: error
        };

    }


    return {
        successo: true,
        dati: data,
        errore: null
    };

}


/* =====================================================
   USCITA
===================================================== */

async function anemosAuthEsci() {

    const {
        error
    } =
        await anemosSupabase.auth.signOut();


    if (error) {

        return {
            successo: false,
            errore: error
        };

    }


    return {
        successo: true,
        errore: null
    };

}

/* =====================================================
   INTERFACCIA ACCOUNT
===================================================== */

const anemosAuthOverlay =
    document.getElementById(
        "anemos-auth-overlay"
    );

const anemosAuthChiudi =
    document.getElementById(
        "anemos-auth-chiudi"
    );

const anemosAuthForm =
    document.getElementById(
        "anemos-auth-form"
    );

const anemosAuthEmail =
    document.getElementById(
        "anemos-auth-email"
    );

const anemosAuthPassword =
    document.getElementById(
        "anemos-auth-password"
    );

const anemosAuthPulsanteAccedi =
    document.getElementById(
        "anemos-auth-accedi"
    );

const anemosAuthPulsanteRegistrati =
    document.getElementById(
        "anemos-auth-registrati"
    );

const anemosAuthUtente =
    document.getElementById(
        "anemos-auth-utente"
    );

const anemosAuthPulsanteEsci =
    document.getElementById(
        "anemos-auth-esci"
    );

const anemosAuthStato =
    document.getElementById(
        "anemos-auth-stato"
    );

const anemosAuthMenu =
    document.querySelector(
        ".menu-button"
    );


/* =====================================================
   APERTURA / CHIUSURA
===================================================== */

function anemosAuthApri() {

    anemosAuthOverlay.classList.add(
        "aperto"
    );

}

function anemosAuthChiudiPannello() {

    anemosAuthOverlay.classList.remove(
        "aperto"
    );

    anemosAuthStato.textContent = "";

}


/* =====================================================
   STATO INTERFACCIA
===================================================== */

function anemosAuthAggiornaInterfaccia(
    sessione
) {

    if (
        sessione &&
        sessione.user
    ) {

        anemosAuthForm.hidden = true;

        anemosAuthUtente.hidden = false;

        anemosAuthPulsanteEsci.hidden = false;

        anemosAuthUtente.textContent =
            "Connesso come " +
            sessione.user.email;

    } else {

        anemosAuthForm.hidden = false;

        anemosAuthUtente.hidden = true;

        anemosAuthPulsanteEsci.hidden = true;

        anemosAuthUtente.textContent = "";

    }

}


/* =====================================================
   EVENTI FINESTRA
===================================================== */

anemosAuthMenu.addEventListener(
    "click",
    function () {

        anemosAuthApri();

    }
);


anemosAuthChiudi.addEventListener(
    "click",
    function () {

        anemosAuthChiudiPannello();

    }
);


anemosAuthOverlay.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target ===
            anemosAuthOverlay
        ) {

            anemosAuthChiudiPannello();

        }

    }
);


/* =====================================================
   ACCESSO
===================================================== */

anemosAuthPulsanteAccedi.addEventListener(
    "click",
    async function () {

        const email =
            anemosAuthEmail.value.trim();

        const password =
            anemosAuthPassword.value;


        if (
            !email ||
            !password
        ) {

            anemosAuthStato.textContent =
                "Inserisci email e password.";

            return;

        }


        anemosAuthStato.textContent =
            "Accesso in corso…";


        const risultato =
            await anemosAuthAccedi(
                email,
                password
            );


        if (
            !risultato.successo
        ) {

            anemosAuthStato.textContent =
                "Accesso non riuscito: " +
                risultato.errore.message;

            return;

        }


        anemosAuthPassword.value = "";

        anemosAuthAggiornaInterfaccia(
            risultato.dati.session
        );

        anemosAuthStato.textContent =
            "Accesso effettuato.";

    }
);


/* =====================================================
   REGISTRAZIONE
===================================================== */

anemosAuthPulsanteRegistrati.addEventListener(
    "click",
    async function () {

        function mostraStato(testo, tipo) {
            anemosAuthStato.classList.remove(
                "in-corso", "successo", "errore"
            );
            anemosAuthStato.classList.add(tipo);
            anemosAuthStato.textContent = testo;
        }

        const email = anemosAuthEmail.value.trim();
        const password = anemosAuthPassword.value;

        if (!email || !password) {
            mostraStato(
                "Inserisci email e password.",
                "errore"
            );
            return;
        }

        if (password.length < 6) {
            mostraStato(
                "La password deve contenere almeno 6 caratteri.",
                "errore"
            );
            return;
        }

        mostraStato(
            "Registrazione in corso...",
            "in-corso"
        );

        anemosAuthPulsanteRegistrati.disabled = true;

        try {

            const risultato = await anemosAuthRegistrati(
                email,
                password
            );

            if (!risultato.successo) {
                mostraStato(
                    "Registrazione non riuscita: " +
                    risultato.errore.message,
                    "errore"
                );
                return;
            }

            anemosAuthPassword.value = "";

            if (risultato.dati.session) {

                anemosAuthAggiornaInterfaccia(
                    risultato.dati.session
                );

                mostraStato(
                    "Registrazione completata.",
                    "successo"
                );

            } else {

                mostraStato(
                    "Registrazione completata! Controlla la tua email per attivare l'account.",
                    "successo"
                );

            }

        } catch (errore) {

            mostraStato(
                "Si è verificato un errore. Riprova.",
                "errore"
            );

        } finally {

            anemosAuthPulsanteRegistrati.disabled = false;

        }

    }
);
/* =====================================================
   USCITA
===================================================== */

anemosAuthPulsanteEsci.addEventListener(
    "click",
    async function () {

        anemosAuthStato.textContent =
            "Disconnessione…";


        const risultato =
            await anemosAuthEsci();


        if (
            !risultato.successo
        ) {

            anemosAuthStato.textContent =
                "Disconnessione non riuscita.";

            return;

        }


        anemosAuthAggiornaInterfaccia(
            null
        );

        anemosAuthStato.textContent =
            "Disconnesso.";

    }
);


/* =====================================================
   SESSIONE INIZIALE
===================================================== */

async function anemosAuthInizializza() {

    const risultato =
        await anemosAuthSessione();


    if (
        risultato.successo
    ) {

        anemosAuthAggiornaInterfaccia(
            risultato.sessione
        );

    }

}

const anemosAuthPulsanteRecupera =
    document.getElementById("anemos-auth-recupera");

if (anemosAuthPulsanteRecupera) {

    anemosAuthPulsanteRecupera.hidden = false;

    anemosAuthPulsanteRecupera.addEventListener(
        "click",
        async function () {

            const email = anemosAuthEmail.value.trim();

            function mostraStato(testo, stato) {
                anemosAuthStato.classList.remove(
                    "in-corso", "successo", "errore"
                );
                anemosAuthStato.classList.add(stato);
                anemosAuthStato.textContent = testo;
            }

            if (!email) {
                mostraStato(
                    "Inserisci la tua email per recuperare la password.",
                    "errore"
                );
                return;
            }

            mostraStato(
                "Invio della richiesta in corso...",
                "in-corso"
            );

            anemosAuthPulsanteRecupera.disabled = true;

            try {

                const { error } =
                    await anemosSupabase.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                "https://giomar55-a11y.github.io/ANEMOS/index-3-1.html"
                        }
                    );

                if (error) {
                    mostraStato(
                        "Richiesta non riuscita. Riprova.",
                        "errore"
                    );
                    return;
                }

                mostraStato(
                    "Se l'indirizzo è registrato, riceverai una email per impostare una nuova password.",
                    "successo"
                );

            } catch (errore) {

                mostraStato(
                    "Si è verificato un errore. Riprova.",
                    "errore"
                );

            } finally {

                anemosAuthPulsanteRecupera.disabled = false;

            }

        }
    );
}
function anemosAuthNuovaPassword() {

    if (document.getElementById("anemos-recupero-overlay")) {
        return;
    }

    const overlay = document.createElement("div");

    overlay.id = "anemos-recupero-overlay";

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 20000;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    overlay.innerHTML = `
        <div style="
            background: white;
            color: #222;
            padding: 24px;
            border-radius: 20px;
            width: 100%;
            max-width: 380px;
            box-sizing: border-box;
        ">
            <h2>Nuova password</h2>

            <p>Scegli una nuova password per il tuo account ANEMOS.</p>

            <label for="anemos-nuova-password">Nuova password</label>
            <input
                id="anemos-nuova-password"
                type="password"
                autocomplete="new-password"
                placeholder="Nuova password"
                style="width:100%;padding:12px;margin:8px 0;box-sizing:border-box;"
            >

            <label for="anemos-conferma-password">Conferma password</label>
            <input
                id="anemos-conferma-password"
                type="password"
                autocomplete="new-password"
                placeholder="Conferma password"
                style="width:100%;padding:12px;margin:8px 0;box-sizing:border-box;"
            >

            <button
                id="anemos-salva-password"
                type="button"
                style="
                    width:100%;
                    padding:14px;
                    margin-top:12px;
                    background:#222;
                    color:white;
                    border:0;
                    border-radius:10px;
                    font-weight:600;
                "
            >
                Salva nuova password
            </button>

            <div
                id="anemos-recupero-stato"
                class="anemos-auth-stato"
                role="status"
            ></div>
        </div>
    `;

    document.body.appendChild(overlay);

    const pulsante =
        document.getElementById("anemos-salva-password");

    const stato =
        document.getElementById("anemos-recupero-stato");

    function mostraStato(testo, tipo) {

        stato.classList.remove(
            "in-corso", "successo", "errore"
        );

        stato.classList.add(tipo);
        stato.textContent = testo;
    }

    pulsante.addEventListener("click", async function () {

        const password =
            document.getElementById("anemos-nuova-password").value;

        const conferma =
            document.getElementById("anemos-conferma-password").value;

        if (password.length < 6) {

            mostraStato(
                "La password deve contenere almeno 6 caratteri.",
                "errore"
            );

            return;
        }

        if (password !== conferma) {

            mostraStato(
                "Le password non coincidono.",
                "errore"
            );

            return;
        }

        pulsante.disabled = true;

        mostraStato(
            "Salvataggio in corso...",
            "in-corso"
        );

        try {

            const { error } =
                await anemosSupabase.auth.updateUser({
                    password: password
                });

            if (error) {

                mostraStato(
                    "Impossibile aggiornare la password. Riprova o richiedi un nuovo link.",
                    "errore"
                );

                pulsante.disabled = false;
                return;
            }

            mostraStato(
                "Password aggiornata correttamente!",
                "successo"
            );

            document.getElementById("anemos-nuova-password").value = "";
            document.getElementById("anemos-conferma-password").value = "";

            setTimeout(function () {
                overlay.remove();
            }, 2500);

        } catch (errore) {

            mostraStato(
                "Si è verificato un errore. Riprova.",
                "errore"
            );

            pulsante.disabled = false;
        }

    });

}

anemosSupabase.auth.onAuthStateChange(
    function (evento, sessione) {

        if (evento === "PASSWORD_RECOVERY" && sessione) {

            anemosAuthNuovaPassword();

            return;
        }

        anemosAuthAggiornaInterfaccia(sessione);

    }
);

anemosAuthInizializza();
