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


        if (
            password.length < 6
        ) {

            anemosAuthStato.textContent =
                "La password deve contenere almeno 6 caratteri.";

            return;

        }


        anemosAuthStato.textContent =
            "Registrazione in corso…";


        const risultato =
            await anemosAuthRegistrati(
                email,
                password
            );


        if (
            !risultato.successo
        ) {

            anemosAuthStato.textContent =
                "Registrazione non riuscita: " +
                risultato.errore.message;

            return;

        }


        anemosAuthPassword.value = "";


        if (
            risultato.dati.session
        ) {

            anemosAuthAggiornaInterfaccia(
                risultato.dati.session
            );

            anemosAuthStato.textContent =
                "Registrazione completata.";

        } else {

            anemosAuthStato.textContent =
                "Registrazione completata. Controlla la tua email per confermare l'account.";

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


anemosSupabase.auth.onAuthStateChange(
    function (
        evento,
        sessione
    ) {

        anemosAuthAggiornaInterfaccia(
            sessione
        );

    }
);


anemosAuthInizializza();
