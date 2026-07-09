const navButtons = document.querySelectorAll("[data-screen]");
const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".bottomNav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === screenId);
  });
}

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
  });
});

showScreen("home");