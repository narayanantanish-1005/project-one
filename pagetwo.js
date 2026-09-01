const plansVideo = document.querySelector(".plans-video");
const purchaseMessage = document.querySelector("#purchase-message");

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  plansVideo?.pause();
}

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const planName = button.dataset.plan;
    purchaseMessage.textContent = `${planName} plan selected.`;
  });
});
