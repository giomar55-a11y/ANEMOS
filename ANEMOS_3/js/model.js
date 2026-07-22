// ANEMOS 3.0
// Modello dati principale dell'applicazione

export const VOLUME_KEYS = [
  "abdominal",
  "lowerThoracic",
  "upperThoracic"
];

export const VOLUME_DEFINITIONS = {
  abdominal: {
    id: "abdominal",
    label: "Addome",
    icon: "🎈"
  },

  lowerThoracic: {
    id: "lowerThoracic",
    label: "Torace inferiore",
    icon: "🪭"
  },

  upperThoracic: {
    id: "upperThoracic",
    label: "Torace superiore",
    icon: "🐚"
  }
};

export const LEVEL_OPTIONS = [
  {
    id: "excluded",
    label: "Escluso",
    value: 0
  },
  {
    id: "reduced",
    label: "Ridotto",
    value: 1
  },
  {
    id: "natural",
    label: "Naturale",
    value: 2
  },
  {
    id: "complete",
    label: "Completo",
    value: 3
  }
];

export const PATH_OPTIONS = [
  {
    id: "nose",
    label: "Naso"
  },
  {
    id: "mouth",
    label: "Bocca"
  }
];

export const FLOW_OPTIONS = [
  {
    id: "restrained",
    label: "Trattenuto"
  },
  {
    id: "delicate",
    label: "Delicato"
  },
  {
    id: "spontaneous",
    label: "Spontaneo"
  },
  {
    id: "forced",
    label: "Forzato"
  }
];

export const FINALITY_OPTIONS = [
  {
    id: "relaxation",
    label: "Rilassamento"
  },
  {
    id: "activation",
    label: "Attivazione"
  },
  {
    id: "coherence",
    label: "Coerenza"
  },
  {
    id: "recovery",
    label: "Recupero"
  },
  {
    id: "performance",
    label: "Performance"
  },
  {
    id: "sleep",
    label: "Sonno"
  },
  {
    id: "meditation",
    label: "Meditazione"
  },
  {
    id: "free",
    label: "Libera"
  }
];

export const ORGANIZATION_OPTIONS = [
  {
    id: "simultaneous",
    label: "Simultanea"
  },
  {
    id: "sequential",
    label: "Sequenziale"
  }
];

function createPhase() {
  return {
    path: null,
    flow: null,
    duration: 0
  };
}

function createVolume() {
  return {
    enabled: false,
    level: "excluded",

    inhale: createPhase(),
    pauseAfterInhale: 0,

    exhale: createPhase(),
    pauseAfterExhale: 0
  };
}

function createCommonParameters() {
  return {
    inhale: createPhase(),
    pauseAfterInhale: 0,

    exhale: createPhase(),
    pauseAfterExhale: 0
  };
}

function createCoherenceState() {
  return {
    physiological: {
      status: "not-evaluated",
      score: null,
      messages: []
    },

    finality: {
      status: "not-evaluated",
      score: null,
      messages: []
    },

    user: {
      status: "not-evaluated",
      score: null,
      messages: []
    },

    overall: {
      status: "not-evaluated",
      score: null,
      messages: []
    }
  };
}

export function createEmptyBreath() {
  const now = new Date().toISOString();

  return {
    id: null,

    identity: {
      name: "",
      description: ""
    },

    finality: null,

    organization: null,

    common: createCommonParameters(),

    volumes: {
      abdominal: createVolume(),
      lowerThoracic: createVolume(),
      upperThoracic: createVolume()
    },

    sequence: [
      "abdominal",
      "lowerThoracic",
      "upperThoracic"
    ],

    coherence: createCoherenceState(),

    metadata: {
      version: "3.0",
      createdAt: now,
      updatedAt: now
    }
  };
}

export function cloneBreath(breath) {
  return structuredClone(breath);
}

export function updateTimestamp(breath) {
  breath.metadata.updatedAt = new Date().toISOString();
  return breath;
}

export function resetCoherence(breath) {
  breath.coherence = createCoherenceState();
  return breath;
}

export function getActiveVolumes(breath) {
  return VOLUME_KEYS.filter((volumeKey) => {
    return breath.volumes[volumeKey].enabled;
  });
}

export function isSimultaneous(breath) {
  return breath.organization === "simultaneous";
}

export function isSequential(breath) {
  return breath.organization === "sequential";
}
