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
