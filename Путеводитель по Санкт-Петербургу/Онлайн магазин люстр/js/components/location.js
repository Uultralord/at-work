import Catalog from "./catalog.js";
import * as filter from "./filter.js";
const locationCity = document.querySelector(".location__city");
const locationSublink = document.querySelectorAll(".location__sublink");
const locationCityName = document.querySelector(".location__city-name");

export function getLocation() {
  locationCity.classList.add("location__city--active");
  locationSublink.forEach((button) => {
    button.addEventListener("click", () => {
      locationCityName.textContent = button.textContent;
      Catalog.getCatalog();
      filter.getStatus();
      locationCity.classList.remove("location__city--active");
    });
  });
}
