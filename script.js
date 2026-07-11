document.addEventListener("DOMContentLoaded", () => {
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
        mode: null,
        organization: null,
        sequence: [],

        essential: {
          abdominal: null,
          lowerThoracic: null,
          upperThoracic: null
        },

        biomechanical: {}
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

        if (phase === "in") {
          currentBreath.path.in = value;
        }

        if (phase === "es") {
          currentBreath.path.out = value;
        }
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

        if (phase === "in") {
          currentBreath.flow.in = value;
        }

        if (phase === "es") {
          currentBreath.flow.out = value;
        }
      });
    });

  // ========================================
  // DISTRIBUZIONE
  // ========================================

  const distributionSummary =
    document.getElementById("distributionSummary");

  const essentialDistributionPanel =
    document.getElementById("essentialDistributionPanel");

  const biomechanicalDistributionPanel =
    document.getElementById("biomechanicalDistributionPanel");

  const sequenceInstruction =
    document.getElementById("sequenceInstruction");

  const sequenceSummaryBox =
    document.getElementById("sequenceSummaryBox");

  const volumeLabels = {
    abdominal: "Addominale",
    lowerThoracic: "Toracico inferiore/laterale",
    upperThoracic: "Toracico superiore"
  };

  const levelLabels = {
    reduced: "Ridotto",
    natural: "Naturale",
    full: "Completo"
  };

  function clearSequenceVisuals() {
    document
      .querySelectorAll(".distributionChoice")
      .forEach(button => {
        button.classList.remove("sequenceOrdered");
        button.removeAttribute("data-order");
      });
  }

  function renderSequence() {
    clearSequenceVisuals();

    currentBreath.distribution.sequence.forEach(
      (volume, index) => {
        const selectedButton = document.querySelector(
          `.distributionChoice[data-volume="${volume}"].selected`
        );

        if (selectedButton) {
          selectedButton.classList.add("sequenceOrdered");
          selectedButton.dataset.order = index + 1;
        }
      }
    );

    if (!sequenceSummaryBox) {
      return;
    }

    if (
      currentBreath.distribution.organization !==
      "sequential"
    ) {
      sequenceSummaryBox.textContent =
        "Organizzazione simultanea.";
      return;
    }

    if (
      currentBreath.distribution.sequence.length === 0
    ) {
      sequenceSummaryBox.textContent =
        "Nessuna sequenza impostata.";
      return;
    }

    sequenceSummaryBox.textContent =
      currentBreath.distribution.sequence
        .map(
          (volume, index) =>
            `${index + 1}. ${volumeLabels[volume]}`
        )
        .join(" → ");
  }

  document
    .querySelectorAll(".distributionModeChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        selectOnly(
          button,
          ".distributionModeChoice"
        );

        const mode = button.dataset.mode;

        currentBreath.distribution.mode = mode;

        essentialDistributionPanel?.classList.toggle(
          "active",
          mode === "essential"
        );

        biomechanicalDistributionPanel?.classList.toggle(
          "active",
          mode === "biomechanical"
        );
      });
    });

  document
    .querySelectorAll(".distributionOrganizationChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        selectOnly(
          button,
          ".distributionOrganizationChoice"
        );

        const organization =
          button.dataset.organization;

        currentBreath.distribution.organization =
          organization;

        const isSequential =
          organization === "sequential";

        document.body.classList.toggle(
          "sequenceMode",
          isSequential
        );

        if (sequenceInstruction) {
          sequenceInstruction.textContent =
            isSequential
              ? "Tocca i volumi nell’ordine desiderato."
              : "Seleziona il livello di ciascun volume.";
        }

        if (!isSequential) {
          currentBreath.distribution.sequence = [];
          clearSequenceVisuals();
        } else {
          currentBreath.distribution.sequence = [];

          Object.entries(
            currentBreath.distribution.essential
          ).forEach(([volume, level]) => {
            if (level) {
              currentBreath.distribution.sequence.push(
                volume
              );
            }
          });
        }

        renderSequence();
      });
    });

  document
    .querySelectorAll(".distributionChoice")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const volume = button.dataset.volume;
        const level = button.dataset.level;

        const currentLevel =
          currentBreath.distribution.essential[volume];

        const isSameSelectedButton =
          button.classList.contains("selected") &&
          currentLevel === level;

        if (
          currentBreath.distribution.organization ===
          "sequential" &&
          isSameSelectedButton
        ) {
          button.classList.remove("selected");
          button.classList.remove("sequenceOrdered");
          button.removeAttribute("data-order");

          currentBreath.distribution.essential[volume] =
            null;

          currentBreath.distribution.sequence =
            currentBreath.distribution.sequence.filter(
              item => item !== volume
            );

          renderSequence();
          return;
        }

        selectOnly(
          button,
          `.distributionChoice[data-volume="${volume}"]`
        );

        currentBreath.distribution.essential[volume] =
          level;

        if (
          currentBreath.distribution.organization ===
          "sequential"
        ) {
          const alreadyPresent =
            currentBreath.distribution.sequence.includes(
              volume
            );

          if (!alreadyPresent) {
            currentBreath.distribution.sequence.push(
              volume
            );
          }

          renderSequence();
        }
      });
    });

  function getEssentialDistributionSummary() {
    const values =
      currentBreath.distribution.essential;

    const configured = [
      values.abdominal
        ? `Addome ${levelLabels[values.abdominal]}`
        : null,

      values.lowerThoracic
        ? `Torace inf. ${levelLabels[values.lowerThoracic]}`
        : null,

      values.upperThoracic
        ? `Torace sup. ${levelLabels[values.upperThoracic]}`
        : null
    ].filter(Boolean);

    if (configured.length === 0) {
      return "Essenziale";
    }

    const organizationLabel =
      currentBreath.distribution.organization ===
      "sequential"
        ? "Sequenziale"
        : currentBreath.distribution.organization ===
          "simultaneous"
        ? "Simultanea"
        : null;

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
          if (
            currentBreath.distribution.mode ===
            "essential"
          ) {
            distributionSummary.textContent =
              `${getEssentialDistributionSummary()} ▾`;
          } else if (
            currentBreath.distribution.mode ===
            "biomechanical"
          ) {
            distributionSummary.textContent =
              "Biomeccanica Resplora ▾";
          } else {
            distributionSummary.textContent =
              "Nessuna ▾";
          }

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
      .querySelectorAll(".distributionPanel")
      .forEach(panel => {
        panel.classList.remove("active");
      });

    document.body.classList.remove("sequenceMode");

    clearSequenceVisuals();

    if (sequenceInstruction) {
      sequenceInstruction.textContent =
        "Seleziona il volume desiderato.";
    }

    if (sequenceSummaryBox) {
      sequenceSummaryBox.textContent =
        "Nessuna sequenza impostata.";
    }

    finalitySummary.textContent = "Nessuna ▾";
    pathSummary.textContent = "— → — ▾";
    timeSummary.textContent = "0 • 0 • 0 • 0 ▾";
    flowSummary.textContent = "— → — ▾";
    distributionSummary.textContent = "Nessuna ▾";

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
