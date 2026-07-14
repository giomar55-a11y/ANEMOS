document.addEventListener("DOMContentLoaded", () => {

  function createDistributionPhase() {
    return {
      mode: null,
      organization: null,
      sequence: [],

      essential: {
        abdominal: null,
        lowerThoracic: null,
        upperThoracic: null
      },

      selective: {
  upperAnteriorRight: null,
  upperAnteriorLeft: null,

  lowerLateralRight: null,
  lowerLateralLeft: null,

  abdominal: null,

  upperPosteriorRight: null,
  upperPosteriorLeft: null,

  lowerPosteriorRight: null,
  lowerPosteriorLeft: null,

  lumbar: null
}
    };
  }

  function createEmptyBreath() {
    return {
      id: null,
      name: "",
      description: "",
      finality: null,

      path: {
        in: null,
        out: null
      },

      timing: {
        in: 0,
        pauseIn: 0,
        out: 0,
        pauseOut: 0
      },

      flow: {
        in: null,
        out: null
      },

      distribution: {
        in: createDistributionPhase(),
        out: createDistributionPhase()
      },

      anemoscope: {
        enabled: false
      },

      coherence: {
        physiological: null,
        finality: null,
        user: null
      },

      metadata: {
        author: "",
        version: 1,
        createdAt: null,
        modifiedAt: null,
        notes: "",
        tags: []
      }
    };
  }

  const currentBreath = createEmptyBreath();

  // ========================================
  // NAVIGAZIONE
  // ========================================

  const screens = document.querySelectorAll(".screen");
  const screenButtons = document.querySelectorAll("[data-screen]");

  function showScreen(screenId) {
    screens.forEach(screen => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    document.body.classList.toggle(
      "homeActive",
      screenId === "home"
    );
  }

  screenButtons.forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  // ========================================
  // FISARMONICHE
  // ========================================

  const accordionItems =
    document.querySelectorAll(".accordionItem");

  document
    .querySelectorAll(".accordionHeader")
    .forEach(header => {
      header.addEventListener("click", () => {
        const item = header.closest(".accordionItem");

        if (item) {
          item.classList.toggle("open");
        }
      });
    });

  function closeAccordion(id) {
    document
      .getElementById(id)
      ?.classList.remove("open");
  }

  function closeAllAccordions() {
    accordionItems.forEach(item => {
      item.classList.remove("open");
    });
  }

  // ========================================
  // SELEZIONE VISIVA
  // ========================================

  function selectOnly(button, selector) {
    document.querySelectorAll(selector).forEach(item => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");
  }

  // ========================================
  // FINALITÀ
  // ========================================

  const finalitySummary =
    document.getElementById("finalitySummary");

  document
    .querySelectorAll(".finalityChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        selectOnly(button, ".finalityChoice");
        currentBreath.finality = button.dataset.value;
      });
    });

  // ========================================
  // PERCORSO
  // ========================================

  const pathSummary =
    document.getElementById("pathSummary");

  document
    .querySelectorAll(".pathChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const phase = button.dataset.phase;
        const value = button.dataset.value;

        selectOnly(
          button,
          `.pathChoice[data-phase="${phase}"]`
        );

        const phaseKey = phase === "es" ? "out" : phase;
currentBreath.path[phaseKey] = value;
      });
    });

  // ========================================
  // TEMPI
  // ========================================

  const timeElementIds = {
    in: "timeIn",
    pauseIn: "timePauseIn",
    out: "timeOut",
    pauseOut: "timePauseOut"
  };

  const timeSummary =
    document.getElementById("timeSummary");

  function renderTimeValues() {
    Object.entries(timeElementIds).forEach(
      ([key, elementId]) => {
        const element =
          document.getElementById(elementId);

        if (element) {
          element.textContent =
            currentBreath.timing[key];
        }
      }
    );
  }

  document
    .querySelectorAll(".timePlus")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const target = button.dataset.target;

        if (target in currentBreath.timing) {
          currentBreath.timing[target] += 1;
          renderTimeValues();
        }
      });
    });

  document
    .querySelectorAll(".timeMinus")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const target = button.dataset.target;

        if (target in currentBreath.timing) {
          currentBreath.timing[target] = Math.max(
            0,
            currentBreath.timing[target] - 1
          );

          renderTimeValues();
        }
      });
    });

  // ========================================
  // FLUSSO
  // ========================================

  const flowSummary =
    document.getElementById("flowSummary");

  document
    .querySelectorAll(".flowChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const phase = button.dataset.phase;
        const value = button.dataset.value;

        selectOnly(
          button,
          `.flowChoice[data-phase="${phase}"]`
        );

        const phaseKey = phase === "es" ? "out" : phase;
currentBreath.flow[phaseKey] = value;
      });
    });
    // ========================================
  // DISTRIBUZIONE IN / ES
  // ========================================

  const distributionSummary =
    document.getElementById("distributionSummary");

  const volumeLabels = {
    abdominal: "Addominale",
    lowerThoracic: "Toracica inferiore",
    upperThoracic: "Toracico superiore"
  };

  const levelLabels = {
    reduced: "Ridotto",
    natural: "Naturale",
    full: "Completo"
  };

  function getDistributionPhase(phase) {
    return currentBreath.distribution[phase];
  }

  function getEssentialPanel(phase) {
    return document.getElementById(
      phase === "in"
        ? "inEssentialDistributionPanel"
        : "outEssentialDistributionPanel"
    );
  }

  function getBiomechanicalPanel(phase) {
    return document.getElementById(
      phase === "in"
        ? "inBiomechanicalDistributionPanel"
        : "outBiomechanicalDistributionPanel"
    );
  }

  function getSequenceInstruction(phase) {
    return document.getElementById(
      phase === "in"
        ? "inSequenceInstruction"
        : "outSequenceInstruction"
    );
  }

  function getSequenceSummaryBox(phase) {
    return document.getElementById(
      phase === "in"
        ? "inSequenceSummaryBox"
        : "outSequenceSummaryBox"
    );
  }

  function clearSequenceVisuals(phase) {
    document
      .querySelectorAll(
        `.distributionChoice[data-phase="${phase}"]`
      )
      .forEach(button => {
        button.classList.remove("sequenceOrdered");
        button.removeAttribute("data-order");
      });
  }

  function renderSequence(phase) {
    const distribution = getDistributionPhase(phase);
    const summaryBox = getSequenceSummaryBox(phase);

    clearSequenceVisuals(phase);

    distribution.sequence.forEach((volume, index) => {
      const selectedButton = document.querySelector(
        `.distributionChoice[data-phase="${phase}"]` +
        `[data-volume="${volume}"].selected`
      );

      if (selectedButton) {
        selectedButton.classList.add("sequenceOrdered");
        selectedButton.dataset.order = index + 1;
      }
    });

    if (!summaryBox) {
      return;
    }

    if (distribution.organization === "simultaneous") {
      summaryBox.style.display = "block";
      summaryBox.textContent =
        "I volumi selezionati lavorano simultaneamente.";
      return;
    }

    if (distribution.organization !== "sequential") {
      summaryBox.style.display = "none";
      return;
    }

    summaryBox.style.display = "block";

    if (distribution.sequence.length === 0) {
      summaryBox.textContent =
        phase === "in"
          ? "Nessuna sequenza inspiratoria impostata."
          : "Nessuna sequenza espiratoria impostata.";
      return;
    }

    summaryBox.textContent =
      distribution.sequence
        .map(
          (volume, index) =>
            `${index + 1}. ${volumeLabels[volume]}`
        )
        .join(" → ");
  }

  document
  .querySelectorAll(".distributionGlobalModeChoice")
  .forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      selectOnly(
        button,
        ".distributionGlobalModeChoice"
      );

      const mode = button.dataset.mode;

      currentBreath.distribution.in.mode = mode;
      currentBreath.distribution.out.mode = mode;

      document
        .querySelectorAll(
          "#inEssentialDistributionPanel,#outEssentialDistributionPanel"
        )
        .forEach(panel=>{
          panel.classList.toggle(
            "active",
            mode==="essential"
          );
        });

      document
        .querySelectorAll(
          "#inSelectiveDistributionPanel,#outSelectiveDistributionPanel"
        )
        .forEach(panel=>{
          panel.classList.toggle(
            "active",
            mode==="selective"
          );
        });

    });

  });
  document
    .querySelectorAll(".distributionOrganizationChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const phase = button.dataset.phase;
        const organization =
          button.dataset.organization;

        const distribution =
          getDistributionPhase(phase);

        selectOnly(
          button,
          `.distributionOrganizationChoice[data-phase="${phase}"]`
        );

        distribution.organization = organization;
        distribution.sequence = [];

        const instruction =
          getSequenceInstruction(phase);

        if (instruction) {
          instruction.textContent =
            organization === "sequential"
              ? "Tocca i volumi nell’ordine desiderato."
              : "Seleziona il livello di ciascun volume.";
        }

        if (organization === "sequential") {
          Object.entries(distribution.essential)
            .forEach(([volume, level]) => {
              if (level) {
                distribution.sequence.push(volume);
              }
            });
        }

        renderSequence(phase);
      });
    });

  document
    document
  .querySelectorAll(".volumeStateButton")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const phase = button.dataset.phase;

      const volume =
        button.dataset.volume ||
        button.dataset.field;

      const distribution =
        getDistributionPhase(phase);

      const values = button.classList.contains(
        "selectiveVolumeButton"
      )
        ? distribution.selective
        : distribution.essential;

      const states = [
        null,
        "reduced",
        "natural",
        "full"
      ];

      const currentState = values[volume];

      const currentIndex =
        states.indexOf(currentState);

      const nextState =
        states[(currentIndex + 1) % states.length];

      values[volume] = nextState;
      button.dataset.state = nextState || "0";

      button.classList.remove(
        "stateReduced",
        "stateNatural",
        "stateFull",
        "sequenceOrdered"
      );

      button.removeAttribute("data-order");

      if (nextState === "reduced") {
        button.classList.add("stateReduced");
      }

      if (nextState === "natural") {
        button.classList.add("stateNatural");
      }

      if (nextState === "full") {
        button.classList.add("stateFull");
      }

      if (
        distribution.organization === "sequential"
      ) {
        distribution.sequence =
          distribution.sequence.filter(
            item => item !== volume
          );

        if (nextState) {
          distribution.sequence.push(volume);
        }

        renderSequence(phase);
      }
    });
  });
  function getPhaseDistributionSummary(phase) {
    const distribution =
      getDistributionPhase(phase);

    if (!distribution.mode) {
      return "Nessuna";
    }

   if (distribution.mode === "biomechanical") {
  return "Selettiva";
}
    
    const configured = Object.entries(
      distribution.essential
    )
      .filter(([, level]) => level)
      .map(
        ([volume, level]) =>
          `${volumeLabels[volume]} ${levelLabels[level]}`
      );

    const organizationLabel =
      distribution.organization === "sequential"
        ? "Sequenziale"
        : distribution.organization === "simultaneous"
        ? "Simultanea"
        : null;

    if (configured.length === 0) {
      return organizationLabel
        ? `${organizationLabel} · Essenziale`
        : "Essenziale";
    }

    return organizationLabel
      ? `${organizationLabel} · ${configured.join(" · ")}`
      : configured.join(" · ");
  }
    // ========================================
  // CONFERME MANUALI
  // ========================================

  document
    .querySelectorAll(".confirmButton")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const section = button.dataset.confirm;

        if (section === "finality") {
          finalitySummary.textContent =
            `${currentBreath.finality || "Nessuna"} ▾`;

          closeAccordion("finalityAccordion");
        }

        if (section === "path") {
          pathSummary.textContent =
            `${currentBreath.path.in || "—"} → ` +
            `${currentBreath.path.out || "—"} ▾`;

          closeAccordion("pathAccordion");
        }

        if (section === "times") {
          const timing = currentBreath.timing;

          timeSummary.textContent =
            `${timing.in} • ${timing.pauseIn} • ` +
            `${timing.out} • ${timing.pauseOut} ▾`;

          closeAccordion("timeAccordion");
        }

        if (section === "flow") {
          flowSummary.textContent =
            `${currentBreath.flow.in || "—"} → ` +
            `${currentBreath.flow.out || "—"} ▾`;

          closeAccordion("flowAccordion");
        }

        if (section === "distribution") {
          const inSummary =
            getPhaseDistributionSummary("in");

          const outSummary =
            getPhaseDistributionSummary("out");

          distributionSummary.textContent =
            `IN: ${inSummary} · ES: ${outSummary} ▾`;

          closeAccordion("distributionAccordion");
        }

        currentBreath.metadata.modifiedAt =
          new Date().toISOString();
      });
    });

  // ========================================
  // AZZERA TUTTO
  // ========================================

  function resetCurrentBreath() {
    const emptyBreath = createEmptyBreath();

    Object.keys(currentBreath).forEach(key => {
      delete currentBreath[key];
    });

    Object.assign(currentBreath, emptyBreath);

    document
      .querySelectorAll(".choiceButton.selected")
      .forEach(button => {
        button.classList.remove("selected");
      });
document
  .querySelectorAll(".essentialVolumeButton")
  .forEach(button => {

    button.dataset.state = "0";

    button.classList.remove(
      "stateReduced",
      "stateNatural",
      "stateFull"
    );

  });
    document
      .querySelectorAll(".distributionPanel")
      .forEach(panel => {
        panel.classList.remove("active");
      });

    clearSequenceVisuals("in");
    clearSequenceVisuals("out");

    const inInstruction =
      getSequenceInstruction("in");

    const outInstruction =
      getSequenceInstruction("out");

    if (inInstruction) {
      inInstruction.textContent =
        "Seleziona il livello di ciascun volume.";
    }

    if (outInstruction) {
      outInstruction.textContent =
        "Seleziona il livello di ciascun volume.";
    }

    const inSequenceBox =
      getSequenceSummaryBox("in");

    const outSequenceBox =
      getSequenceSummaryBox("out");

    if (inSequenceBox) {
      inSequenceBox.style.display = "none";
      inSequenceBox.textContent =
        "Nessuna sequenza inspiratoria impostata.";
    }

    if (outSequenceBox) {
      outSequenceBox.style.display = "none";
      outSequenceBox.textContent =
        "Nessuna sequenza espiratoria impostata.";
    }

    finalitySummary.textContent = "Nessuna ▾";
    pathSummary.textContent = "— → — ▾";
    timeSummary.textContent = "0 • 0 • 0 • 0 ▾";
    flowSummary.textContent = "— → — ▾";

    distributionSummary.textContent =
      "IN: Nessuna · ES: Nessuna ▾";

    const anemoscopeSummary =
      document.getElementById("anemoscopeSummary");

    if (anemoscopeSummary) {
      anemoscopeSummary.textContent =
        "Non configurato ▾";
    }

    renderTimeValues();
    closeAllAccordions();
  }

  document
    .getElementById("resetAllButton")
    ?.addEventListener(
      "click",
      resetCurrentBreath
    );

  // ========================================
  // AVVIO
  // ========================================

  renderTimeValues();
  resetCurrentBreath();
  showScreen("home");

  window.currentBreath = currentBreath;
});
