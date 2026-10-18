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


function ottieniAnemosAudioContext() {

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
        anemosAudioContext.resume();
    }

    return anemosAudioContext;
}


/* =====================================================
   IMPULSO METRONOMO
===================================================== */

function anemosAudioImpulsoMetronomo() {

    const context =
        ottieniAnemosAudioContext();

    if (!context) {
        return;
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
        0.0001,
        context.currentTime
    );

    volume.gain.exponentialRampToValueAtTime(
        0.12,
        context.currentTime + 0.005
    );

    volume.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.07
    );


    oscillatore.connect(
        volume
    );

    volume.connect(
        context.destination
    );


    oscillatore.start(
        context.currentTime
    );

    oscillatore.stop(
        context.currentTime + 0.08
    );
}
