const header = document.querySelector(".header");
const burger = document.querySelector(".burger");

burger.addEventListener("click", () => {
  header.classList.toggle("header--open");
})
