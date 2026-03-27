const accordionElements = document.querySelectorAll(".accordion__element");

function resetAllButtons() {
  accordionElements.forEach((element) => {
    const button = element.querySelector(".accordion__btn");
    button.classList.remove("accordion__btn--active");
  });
}

export function handleClick() {
  const button = this.querySelector(".accordion__btn");

  if (button.classList.contains("accordion__btn--active")) {
    button.classList.remove("accordion__btn--active");
    return;
  }
  resetAllButtons();
  button.classList.add("accordion__btn--active");
}

accordionElements.forEach((element) => {
  element.addEventListener("click", handleClick);
});
