document.addEventListener("DOMContentLoaded", () => {
  const currentBreath = createEmptyBreath();

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
    document.getElementById(id)?.classList.remove("open");
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

    finalitySummary.textContent = "Nessuna ▾";
    pathSummary.textContent = "— → — ▾";
    timeSummary.textContent = "0 • 0 • 0 • 0 ▾";
    flowSummary.textContent = "— → — ▾";

    const distributionSummary =
      document.getElementById("distributionSummary");

    const anemoscopeSummary =
      document.getElementById("anemoscopeSummary");

    if (distributionSummary) {
      distributionSummary.textContent = "Nessuna ▾";
    }

    if (anemoscopeSummary) {
      anemoscopeSummary.textContent =
        "Non configurato ▾";
    }

    renderTimeValues();
    closeAllAccordions();
  }

  document
    .getElementById("resetAllButton")
    ?.addEventListener("click", resetCurrentBreath);

  // ========================================
  // AVVIO
  // ========================================

  renderTimeValues();
  resetCurrentBreath();
  showScreen("home");

  // Utile per controllare temporaneamente i dati
  window.currentBreath = currentBreath;
});
