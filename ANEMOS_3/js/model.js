/*
 * ==========================================================
 * ANEMOS 3.0
 * Modello dati respiratorio
 * ==========================================================
 */

/*
 * Settori respiratori disponibili
 */

export const RESPIRATORY_SECTORS = {
    abdomen: {
        id: "abdomen",
        label: "Addome"
    },

    lowerChest: {
        id: "lowerChest",
        label: "Torace inferiore"
    },

    upperChest: {
        id: "upperChest",
        label: "Torace superiore"
    }
};


/*
 * Volumi respiratori
 */

export const VOLUME_OPTIONS = {
    reduced: {
        id: "reduced",
        label: "Ridotto"
    },

    natural: {
        id: "natural",
        label: "Naturale"
    },

    complete: {
        id: "complete",
        label: "Completo"
    }
};


/*
 * Percorsi dell’aria
 */

export const PATH_OPTIONS = {
    nose: {
        id: "nose",
        label: "Naso"
    },

    mouth: {
        id: "mouth",
        label: "Bocca"
    },

    noseAndMouth: {
        id: "noseAndMouth",
        label: "Naso e bocca"
    }
};


/*
 * Fasi respiratorie principali
 */

export const PHASE_TYPES = {
    inhale: {
        id: "inhale",
        label: "Inspirazione",
        shortLabel: "IN"
    },

    exhale: {
        id: "exhale",
        label: "Espirazione",
        shortLabel: "ES"
    }
};


/*
 * Organizzazione dichiarata dall’utente
 */

export const ORGANIZATION_TYPES = {
    simultaneous: {
        id: "simultaneous",
        label: "Simultanea"
    },

    sequential: {
        id: "sequential",
        label: "Sequenziale"
    }
};


/*
 * Crea un settore inserito all’interno di un passaggio.
 *
 * Ogni settore mantiene un volume indipendente.
 */

export function createStepSector(
    sectorId,
    volume = "natural"
) {
    return {
        sectorId,
        volume
    };
}


/*
 * Crea un passaggio respiratorio.
 *
 * Un passaggio può contenere:
 *
 * - un solo settore;
 * - due settori simultanei;
 * - tutti e tre i settori simultanei.
 *
 * Percorso e tempo appartengono al passaggio.
 */

export function createBreathingStep({
    id = crypto.randomUUID(),
    path = "nose",
    duration = 2,
    sectors = []
} = {}) {
    return {
        id,
        path,
        duration,
        sectors
    };
}


/*
 * Crea una fase respiratoria.
 *
 * Una fase è composta da uno o più passaggi.
 *
 * Esempio simultaneo:
 *
 * IN
 * Passaggio 1:
 * Addome + Torace inferiore + Torace superiore
 *
 * Esempio sequenziale:
 *
 * IN
 * Passaggio 1: Addome
 * Passaggio 2: Torace inferiore + Torace superiore
 */

export function createBreathingPhase(
    type = "inhale"
) {
    return {
        type,
        steps: []
    };
}


/*
 * Configurazione iniziale simultanea.
 *
 * È rappresentata da un unico passaggio,
 * contenente tutti i settori attivi.
 */

export function createDefaultSimultaneousPhase(
    type
) {
    return {
        type,

        steps: [
            createBreathingStep({
                path: "nose",

                duration:
                    type === "inhale"
                        ? 4
                        : 6,

                sectors: [
                    createStepSector(
                        "abdomen",
                        "natural"
                    ),

                    createStepSector(
                        "lowerChest",
                        "natural"
                    ),

                    createStepSector(
                        "upperChest",
                        "reduced"
                    )
                ]
            })
        ]
    };
}


/*
 * Configurazione iniziale sequenziale.
 *
 * Ogni settore occupa inizialmente
 * un passaggio distinto.
 */

export function createDefaultSequentialPhase(
    type
) {
    const defaultDuration = 2;

    return {
        type,

        steps: [
            createBreathingStep({
                path: "nose",
                duration: defaultDuration,

                sectors: [
                    createStepSector(
                        "abdomen",
                        "natural"
                    )
                ]
            }),

            createBreathingStep({
                path: "nose",
                duration: defaultDuration,

                sectors: [
                    createStepSector(
                        "lowerChest",
                        "natural"
                    )
                ]
            }),

            createBreathingStep({
                path: "nose",
                duration: defaultDuration,

                sectors: [
                    createStepSector(
                        "upperChest",
                        "reduced"
                    )
                ]
            })
        ]
    };
}


/*
 * Crea lo stato iniziale del Motore di Coerenza.
 */

export function createCoherenceState() {
    return {
        physiological: {
            status: "neutral",
            message:
                "In attesa della configurazione."
        },

        purpose: {
            status: "neutral",
            message:
                "Finalità non ancora configurata."
        },

        observations: []
    };
}


/*
 * Crea una respirazione vuota.
 */

export function createEmptyBreath() {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),

        version: "3.0",

        name: "",

        organization: "simultaneous",

        inhale:
            createDefaultSimultaneousPhase(
                "inhale"
            ),

        postInhalePause: 0,

        exhale:
            createDefaultSimultaneousPhase(
                "exhale"
            ),

        postExhalePause: 0,

        purpose: null,

        coherence:
            createCoherenceState(),

        createdAt: now,

        updatedAt: now
    };
}


/*
 * Cambia l’organizzazione respiratoria.
 *
 * La respirazione simultanea usa un solo passaggio.
 * La respirazione sequenziale usa più passaggi.
 */

export function setOrganization(
    breath,
    organization
) {
    if (
        organization !== "simultaneous" &&
        organization !== "sequential"
    ) {
        throw new Error(
            "Organizzazione respiratoria non valida."
        );
    }

    breath.organization = organization;

    if (organization === "simultaneous") {
        breath.inhale =
            createDefaultSimultaneousPhase(
                "inhale"
            );

        breath.exhale =
            createDefaultSimultaneousPhase(
                "exhale"
            );
    }

    if (organization === "sequential") {
        breath.inhale =
            createDefaultSequentialPhase(
                "inhale"
            );

        breath.exhale =
            createDefaultSequentialPhase(
                "exhale"
            );
    }

    updateTimestamp(breath);

    return breath;
}


/*
 * Aggiunge un nuovo passaggio a una fase.
 */

export function addStepToPhase(
    breath,
    phaseType,
    step = createBreathingStep()
) {
    const phase = getPhase(
        breath,
        phaseType
    );

    phase.steps.push(step);

    updateTimestamp(breath);

    return step;
}


/*
 * Rimuove un passaggio da una fase.
 */

export function removeStepFromPhase(
    breath,
    phaseType,
    stepId
) {
    const phase = getPhase(
        breath,
        phaseType
    );

    phase.steps =
        phase.steps.filter(
            (step) => step.id !== stepId
        );

    updateTimestamp(breath);
}


/*
 * Aggiunge un settore a un passaggio.
 *
 * È così possibile rendere simultanei
 * due o tre settori all’interno
 * di una sequenza.
 */

export function addSectorToStep(
    breath,
    phaseType,
    stepId,
    sectorId,
    volume = "natural"
) {
    const step = getStep(
        breath,
        phaseType,
        stepId
    );

    const alreadyPresent =
        step.sectors.some(
            (sector) =>
                sector.sectorId === sectorId
        );

    if (alreadyPresent) {
        return step;
    }

    step.sectors.push(
        createStepSector(
            sectorId,
            volume
        )
    );

    updateTimestamp(breath);

    return step;
}


/*
 * Rimuove un settore da un passaggio.
 */

export function removeSectorFromStep(
    breath,
    phaseType,
    stepId,
    sectorId
) {
    const step = getStep(
        breath,
        phaseType,
        stepId
    );

    step.sectors =
        step.sectors.filter(
            (sector) =>
                sector.sectorId !== sectorId
        );

    updateTimestamp(breath);

    return step;
}


/*
 * Modifica il volume di un settore.
 */

export function updateSectorVolume(
    breath,
    phaseType,
    stepId,
    sectorId,
    volume
) {
    const step = getStep(
        breath,
        phaseType,
        stepId
    );

    const sector =
        step.sectors.find(
            (item) =>
                item.sectorId === sectorId
        );

    if (!sector) {
        throw new Error(
            "Settore non presente nel passaggio."
        );
    }

    sector.volume = volume;

    updateTimestamp(breath);

    return sector;
}


/*
 * Modifica percorso e durata di un passaggio.
 */

export function updateStepParameters(
    breath,
    phaseType,
    stepId,
    {
        path,
        duration
    }
) {
    const step = getStep(
        breath,
        phaseType,
        stepId
    );

    if (path !== undefined) {
        step.path = path;
    }

    if (duration !== undefined) {
        step.duration = Number(duration);
    }

    updateTimestamp(breath);

    return step;
}


/*
 * Restituisce una fase.
 */

export function getPhase(
    breath,
    phaseType
) {
    if (phaseType === "inhale") {
        return breath.inhale;
    }

    if (phaseType === "exhale") {
        return breath.exhale;
    }

    throw new Error(
        "Fase respiratoria non valida."
    );
}


/*
 * Restituisce un passaggio specifico.
 */

export function getStep(
    breath,
    phaseType,
    stepId
) {
    const phase = getPhase(
        breath,
        phaseType
    );

    const step =
        phase.steps.find(
            (item) => item.id === stepId
        );

    if (!step) {
        throw new Error(
            "Passaggio respiratorio non trovato."
        );
    }

    return step;
}


/*
 * Calcola la durata totale
 * di una fase respiratoria.
 */

export function getPhaseDuration(
    phase
) {
    return phase.steps.reduce(
        (total, step) =>
            total + Number(step.duration || 0),
        0
    );
}


/*
 * Calcola la durata totale
 * di un ciclo respiratorio.
 */

export function getBreathCycleDuration(
    breath
) {
    return (
        getPhaseDuration(breath.inhale) +
        Number(breath.postInhalePause || 0) +
        getPhaseDuration(breath.exhale) +
        Number(breath.postExhalePause || 0)
    );
}


/*
 * Crea una copia indipendente
 * della respirazione.
 */

export function cloneBreath(
    breath
) {
    return structuredClone(breath);
}


/*
 * Aggiorna la data di modifica.
 */

export function updateTimestamp(
    breath
) {
    breath.updatedAt =
        new Date().toISOString();
}


/*
 * Riporta il Motore di Coerenza
 * allo stato neutro.
 */

export function resetCoherence(
    breath
) {
    breath.coherence =
        createCoherenceState();

    updateTimestamp(breath);
}
