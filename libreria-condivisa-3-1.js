/* =====================================================
   ANEMOS 3.1
   LIBRERIA CONDIVISA v1.0

   Gestione:
   - riconoscimento Programmatori
   - consultazione Libreria Condivisa
   - pubblicazione
   - modifica ed eliminazione
   - copia nella Libreria Personale
===================================================== */


/* =====================================================
   RICONOSCIMENTO UTENTE E RUOLO
===================================================== */

async function anemosCondivisaUtente() {

    const {
        data,
        error
    } = await anemosSupabase.auth.getSession();

    if (error) {
        throw error;
    }

    if (!data.session) {
        return null;
    }

    return data.session.user;
}


async function anemosCondivisaProgrammatore() {

    const utente =
        await anemosCondivisaUtente();

    if (!utente) {
        return false;
    }

    const {
        data,
        error
    } = await anemosSupabase
        .from("anemos_operators")
        .select("user_id")
        .eq("user_id", utente.id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return Boolean(data);
}


/* =====================================================
   CONVERSIONE DATI
===================================================== */

function anemosCondivisaConverti(riga) {

    const dati =
        riga.breathing_data;

    return {

        id: riga.id,
       
       origine: "condivisa",

        autoreId: riga.author_id,

       sourceId: riga.source_id || null,

        nome: riga.title,

        note: riga.description || "",

        creatoIl: riga.created_at,

        versione: dati.versione,

        tipo: dati.tipo,

        intento: dati.intento || "",

        sequenza:
            anemosLibreriaClona(
                dati.sequenza
            )

    };
}


function anemosCondivisaPrepara(voce) {

    if (
        !voce ||
        !String(voce.nome || "").trim() ||
        !voce.sequenza
    ) {
        throw new Error("Dati mancanti");
    }

    const tipo =
        voce.tipo ||
        ANEMOS_TIPO_ANEMODROMO;

    if (tipo === ANEMOS_TIPO_ANEMODROMO) {

        if (
            !voce.intento ||
            !Array.isArray(voce.sequenza.anemodromi) ||
            voce.sequenza.anemodromi.length === 0
        ) {
            throw new Error("Anemodromo non valido");
        }

    } else if (
        tipo === ANEMOS_TIPO_ANEMOSYSTEMA
    ) {

        if (!anemosSystemaValido(voce.sequenza)) {
            throw new Error("Anemosystema non valido");
        }

    } else {

        throw new Error("Tipo non riconosciuto");

    }

    return {

        title:
            String(voce.nome).trim(),

        description:
            String(voce.note || "").trim(),

        breathing_data: {

            versione:
                voce.versione ||
                ANEMOS_LIBRERIA_VERSIONE,

            tipo: tipo,

            intento:
                voce.intento || "",

            sequenza:
                anemosLibreriaClona(
                    voce.sequenza
                )

        }

    };
}


/* =====================================================
   LETTURA LIBRERIA CONDIVISA
===================================================== */

async function anemosCondivisaLeggi() {

    try {

        const utente =
            await anemosCondivisaUtente();

        if (!utente) {

            return {
                successo: false,
                motivo: "utente-non-autenticato",
                libreria: []
            };

        }

        const {
            data,
            error
        } = await anemosSupabase
            .from("anemos_shared_library")
            .select(
                "id, author_id, title, description, breathing_data, created_at, source_id"
            )
            .order(
                "created_at",
                { ascending: false }
            );

        if (error) {
            throw error;
        }

        return {

            successo: true,

            libreria:
                (data || []).map(
                    anemosCondivisaConverti
                )

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
   PUBBLICAZIONE
===================================================== */

async function anemosCondivisaPubblica(voce) {

    try {

        if (!await anemosCondivisaProgrammatore()) {

            return {
                successo: false,
                motivo: "permesso-negato"
            };

        }

        const contenuto =
    anemosCondivisaPrepara(voce);

contenuto.source_id = voce.id;

        const {
            data,
            error
        } = await anemosSupabase
            .from("anemos_shared_library")
            .insert(contenuto)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return {

            successo: true,

            voce:
                anemosCondivisaConverti(data)

        };

    } catch (errore) {

        return {
            successo: false,
            motivo: "errore-pubblicazione",
            errore: errore
        };

    }

}


/* =====================================================
   MODIFICA PUBBLICAZIONE
===================================================== */

async function anemosCondivisaModifica(
    id,
    voce
) {

    try {

        const utente =
            await anemosCondivisaUtente();

        if (
            !utente ||
            !await anemosCondivisaProgrammatore()
        ) {

            return {
                successo: false,
                motivo: "permesso-negato"
            };

        }

        const contenuto =
            anemosCondivisaPrepara(voce);

        const {
            data,
            error
        } = await anemosSupabase
            .from("anemos_shared_library")
            .update(contenuto)
            .eq("id", id)
            .eq("author_id", utente.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return {

            successo: true,

            voce:
                anemosCondivisaConverti(data)

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
   ELIMINAZIONE PUBBLICAZIONE
===================================================== */

async function anemosCondivisaElimina(id) {

    try {

        const utente =
            await anemosCondivisaUtente();

        if (
            !utente ||
            !await anemosCondivisaProgrammatore()
        ) {

            return {
                successo: false,
                motivo: "permesso-negato"
            };

        }

        const {
            data,
            error
        } = await anemosSupabase
            .from("anemos_shared_library")
            .delete()
            .eq("id", id)
            .eq("author_id", utente.id)
            .select("id")
            .single();

        if (error) {
            throw error;
        }

        return {
            successo: true,
            id: data.id
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
   COPIA NELLA LIBRERIA PERSONALE
===================================================== */

async function anemosCondivisaSalvaPersonale(voce) {

    try {

        anemosCondivisaPrepara(voce);

        return await anemosLibreriaScriviSupabase(

            voce.nome,

            voce.intento || "",

            voce.note || "",

            anemosLibreriaClona(
                voce.sequenza
            ),

            voce.tipo ||
    ANEMOS_TIPO_ANEMODROMO,

voce.id
        );

    } catch (errore) {

        return {
            successo: false,
            motivo: "errore-salvataggio",
            errore: errore
        };

    }

}
