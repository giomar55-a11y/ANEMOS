const screenButtons = document.querySelectorAll("[data-screen]");
const screens = document.querySelectorAll(".screen");

function showScreen(screenId)const backBtn = document.getElementById("homeBackBtn");

if (screenId === "home") {
    document.body.classList.add("homeActive");
} else {
    document.body.classList.remove("homeActive");
} {
  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === screenId);
  });
}

screenButtons.forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
  });
});

const accordionHeaders = document.querySelectorAll(".accordionHeader");

accordionHeaders.forEach(header => {
  header.addEventListener("click", () => {
    const item = header.closest(".accordionItem");
    item.classList.toggle("open");
  });
});
document.body.classList.add("homeActive");
showScreen("home");
