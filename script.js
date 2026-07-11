document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // NAVIGAZIONE
  // =========================

  const screenButtons = document.querySelectorAll("[data-screen]");
  const screens = document.querySelectorAll(".screen");

  function showScreen(screenId) {
    screens.forEach(screen => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    document.body.classList.toggle("homeActive", screenId === "home");
  }

  screenButtons.forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });


  // =========================
  // FISARMONICHE
  // =========================

  document.querySelectorAll(".accordionHeader").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordionItem");

      if (item) {
        item.classList.toggle("open");
      }
    });
  });


  // =========================
  // FINALITÀ
  // =========================

  const finalityCards = document.querySelectorAll(".choiceCard");

  finalityCards.forEach(card => {
    card.addEventListener("click", event => {
      event.stopPropagation();

      const value = card.dataset.finality;
      const item = card.closest(".accordionItem");
      const summary = item?.querySelector(".accordionHeader span");

      if (summary) {
        summary.textContent = `${value} ▾`;
      }

      if (item) {
        item.classList.remove("open");
      }
    });
  });


  // =========================
  // PERCORSO
  // =========================

  let pathIn = "👃";
  let pathOut = "👃";

  const pathSummary = document.getElementById("pathSummary");

  document.querySelectorAll(".pathChoice").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const phase = button.dataset.phase;
      const value = button.dataset.value;

      document
        .querySelectorAll(`.pathChoice[data-phase="${phase}"]`)
        .forEach(item => item.classList.remove("selected"));

      button.classList.add("selected");

      if (phase === "in") {
        pathIn = value;
      }

      if (phase === "es") {
        pathOut = value;
      }

      if (pathSummary) {
        pathSummary.textContent = `${pathIn} → ${pathOut} ▾`;
      }
    });
  });


  // =========================
  // TEMPI
  // =========================

  const times = {
    in: 4,
    pauseIn: 0,
    out: 4,
    pauseOut: 0
  };

  const timeElementIds = {
    in: "timeIn",
    pauseIn: "timePauseIn",
    out: "timeOut",
    pauseOut: "timePauseOut"
  };

  function updateTimeDisplay() {
    Object.entries(timeElementIds).forEach(([key, elementId]) => {
      const element = document.getElementById(elementId);

      if (element) {
        element.textContent = times[key];
      }
    });

    const summary = document.getElementById("timeSummary");

    if (summary) {
      summary.textContent =
        `${times.in} • ${times.pauseIn} • ${times.out} • ${times.pauseOut} ▾`;
    }
  }

  document.querySelectorAll(".timePlus").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const target = button.dataset.target;
      times[target] += 1;

      updateTimeDisplay();
    });
  });

  document.querySelectorAll(".timeMinus").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const target = button.dataset.target;
      times[target] = Math.max(0, times[target] - 1);

      updateTimeDisplay();
    });
  });


  // =========================
  // FLUSSO
  // =========================

  let flowIn = "—";
  let flowOut = "—";

  const flowSummary = document.getElementById("flowSummary");

  document.querySelectorAll(".flowChoice").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const phase = button.dataset.phase;
      const value = button.dataset.value;

      document
        .querySelectorAll(`.flowChoice[data-phase="${phase}"]`)
        .forEach(item => item.classList.remove("selected"));

      button.classList.add("selected");

      if (phase === "in") {
        flowIn = value;
      }

      if (phase === "es") {
        flowOut = value;
      }

      if (flowSummary) {
        flowSummary.textContent = `${flowIn} → ${flowOut} ▾`;
      }
    });
  });


  // =========================
  // AVVIO
  // =========================

  updateTimeDisplay();
  showScreen("home");

});
