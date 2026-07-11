document.addEventListener("DOMContentLoaded", () => {
  const state = {
    finality: null,

    pathIn: null,
    pathOut: null,

    times: {
      in: 0,
      pauseIn: 0,
      out: 0,
      pauseOut: 0
    },

    flowIn: null,
    flowOut: null
  };

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
        state.finality = button.dataset.value;
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
          state.pathIn = value;
        }

        if (phase === "es") {
          state.pathOut = value;
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
          element.textContent = state.times[key];
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

        if (target in state.times) {
          state.times[target] += 1;
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

        if (target in state.times) {
          state.times[target] = Math.max(
            0,
            state.times[target] - 1
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
          state.flowIn = value;
        }

        if (phase === "es") {
          state.flowOut = value;
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
            `${state.finality || "Nessuna"} ▾`;

          closeAccordion("finalityAccordion");
        }

        if (section === "path") {
          pathSummary.textContent =
            `${state.pathIn || "—"} → ` +
            `${state.pathOut || "—"} ▾`;

          closeAccordion("pathAccordion");
        }

        if (section === "times") {
          const times = state.times;

          timeSummary.textContent =
            `${times.in} • ${times.pauseIn} • ` +
            `${times.out} • ${times.pauseOut} ▾`;

          closeAccordion("timeAccordion");
        }

        if (section === "flow") {
          flowSummary.textContent =
            `${state.flowIn || "—"} → ` +
            `${state.flowOut || "—"} ▾`;

          closeAccordion("flowAccordion");
        }
      });
    });

  // ========================================
  // AZZERA TUTTO
  // ========================================

  function resetAll() {
    state.finality = null;

    state.pathIn = null;
    state.pathOut = null;

    state.times.in = 0;
    state.times.pauseIn = 0;
    state.times.out = 0;
    state.times.pauseOut = 0;

    state.flowIn = null;
    state.flowOut = null;

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
    ?.addEventListener("click", resetAll);

  // ========================================
  // AVVIO
  // ========================================

  renderTimeValues();
  resetAll();
  showScreen("home");
});
