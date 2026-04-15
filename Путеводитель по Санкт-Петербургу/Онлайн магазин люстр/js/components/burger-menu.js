const mainMenu = document.querySelector(".main-menu");
const menuCloseBtn = document.querySelector(".main-menu__close");
const catalogBtn = document.querySelector(".header__catalog-btn");

export function burgerMenu() {
  mainMenu.classList.toggle("main-menu--active");
}

menuCloseBtn.addEventListener("click", () => {
  burgerMenu();
});

catalogBtn.addEventListener("click", () => {
  burgerMenu();
});
