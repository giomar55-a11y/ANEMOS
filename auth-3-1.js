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
