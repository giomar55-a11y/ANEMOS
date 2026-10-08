/* =====================================================
   ANEMOS 3.1
   SUPABASE
===================================================== */

const ANEMOS_SUPABASE_URL =
    "https://sgpxthvttkoamimejslu.supabase.co";

const ANEMOS_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Wvkb3ugT2gCz5EwXmeGAnA_9qAvhVNv";

const anemosSupabase =
    window.supabase.createClient(
        ANEMOS_SUPABASE_URL,
        ANEMOS_SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );
