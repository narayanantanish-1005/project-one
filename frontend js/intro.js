const startButton = document.querySelector("#start-button");
const startMessage = document.querySelector("#start-message");
const heroVideo = document.querySelector(".hero-video");

startButton.addEventListener("click", () => {
  startMessage.textContent = "Wonderful. Taking you to the next step now.";
  window.setTimeout(() => {
    window.location.href = "pagetwo.html";
  }, 300);
});

document.querySelectorAll(".status-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".status-link.is-active")?.classList.remove("is-active");
    link.classList.add("is-active");
  });
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo?.pause();
}
