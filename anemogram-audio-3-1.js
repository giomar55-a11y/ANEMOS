/*
=====================================================
ANEMOS 3.1
ANEMOGRAMMA — AUDIO
=====================================================

Modulo dedicato alla guida sonora dell'ANEMOGRAMMA.

Gestirà:
- metronomo sincronizzato
- guida sonora IN
- guida sonora ES
- segnali delle apnee
- segnali di transizione

Il modulo audio non modifica i dati dell'ANEMODROMO
o dell'ANEMOSYSTEMA.
=====================================================
*/
/* =====================================================
   MOTORE AUDIO
===================================================== */

let anemosAudioContext =
    null;


async function ottieniAnemosAudioContext() {

    if (!anemosAudioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        anemosAudioContext =
            new AudioContext();
    }

    if (
        anemosAudioContext.state ===
        "suspended"
    ) {
        await anemosAudioContext.resume();
    }

    return anemosAudioContext;
}

/* =====================================================
   IMPULSO METRONOMO
===================================================== */

async function anemosAudioImpulsoMetronomo() {

    const context =
        ottieniAnemosAudioContext();

    if (!context) {
        return;
    }

    if (
        context.state ===
        "suspended"
    ) {
        await context.resume();
    }
    const oscillatore =
        context.createOscillator();

    const volume =
        context.createGain();


    oscillatore.type =
        "sine";

    oscillatore.frequency.setValueAtTime(
        880,
        context.currentTime
    );


    volume.gain.setValueAtTime(
    0.5,
    context.currentTime
);

volume.gain.setValueAtTime(
    0.5,
    context.currentTime + 1
);

    oscillatore.connect(
    context.destination
);

    oscillatore.start(
        context.currentTime
    );

    oscillatore.stop(
    context.currentTime + 1
);
}
document.addEventListener(
    "dblclick",
    function () {
        anemosAudioImpulsoMetronomo();
    }
);
