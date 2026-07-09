const screenButtons = document.querySelectorAll("[data-screen]");
const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
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

showScreen("home");