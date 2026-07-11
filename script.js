const screenButtons = document.querySelectorAll("[data-screen]");
const screens = document.querySelectorAll(".screen");
const backButton = document.getElementById("homeBackBtn");

function showScreen(screenId){

    screens.forEach(screen=>{
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

    if(screenId==="home"){
        document.body.classList.add("homeActive");
    }else{
        document.body.classList.remove("homeActive");
    }
}

screenButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        showScreen(button.dataset.screen);
    });
});

const accordionHeaders=document.querySelectorAll(".accordionHeader");

accordionHeaders.forEach(header=>{

    header.addEventListener("click",()=>{

        const item=header.parentElement;

        item.classList.toggle("open");

    });

});

showScreen("home");
const finalityCards = document.querySelectorAll(".choiceCard");

finalityCards.forEach(card => {
  card.addEventListener("click", () => {
    const value = card.dataset.finality;

    const header = document.querySelector(".accordionHeader span");
    header.textContent = value + " ▾";

    const item = card.closest(".accordionItem");
    item.classList.remove("open");
  });
});
let pathIn = "👃";
let pathOut = "👃";

const pathButtons = document.querySelectorAll(".pathChoice");
const pathSummary = document.getElementById("pathSummary");

pathButtons.forEach(button => {

  button.addEventListener("click", () => {

    const phase = button.dataset.phase;
    const value = button.dataset.value;

    if (phase === "in") {
      pathIn = value;

      document.querySelectorAll('.pathChoice[data-phase="in"]').forEach(b=>{
        b.classList.remove("selected");
      });

    } else {

      pathOut = value;

      document.querySelectorAll('.pathChoice[data-phase="es"]').forEach(b=>{
        b.classList.remove("selected");
      });

    }

    button.classList.add("selected");

    pathSummary.textContent = `${pathIn} → ${pathOut} ▾`;

  });

});
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

updateTimeDisplay();
let flowIn = "—";
let flowOut = "—";

const flowButtons = document.querySelectorAll(".flowChoice");
const flowSummary = document.getElementById("flowSummary");

flowButtons.forEach(button => {

  button.addEventListener("click", () => {

    const phase = button.dataset.phase;
    const value = button.dataset.value;

    if (phase === "in") {

      flowIn = value;

      document.querySelectorAll('.flowChoice[data-phase="in"]').forEach(b=>{
        b.classList.remove("selected");
      });

    } else {

      flowOut = value;

      document.querySelectorAll('.flowChoice[data-phase="es"]').forEach(b=>{
        b.classList.remove("selected");
      });

    }

    button.classList.add("selected");

    flowSummary.textContent = `${flowIn} → ${flowOut} ▾`;

  });

});
