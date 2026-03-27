import Catalog from "./components/catalog.js";
import Basket from "./components/basket.js";
import DayProduct from "./components/swiper.js";
import { burgerMenu } from "./components/burger-menu.js";
import { getLocation } from "./components/location.js";
import initSwiper from "./components/swiper.js";
import { handleClick } from "./components/fqa.js";
import * as filter from "./components/filter.js";
import { getForm } from "./components/questions-form.js";

const locationCity = document.querySelector(".location__city");
const customCheckboxField = document.querySelectorAll(
  ".custom-checkbox__field",
);
const catalogSortSelect = document.querySelector(".catalog__sort-select");
const radios = document.querySelectorAll('input[name="status"]');
const catalogFormReset = document.querySelector(".catalog-form__reset");
const basket = new Basket();
const dayProduct = new DayProduct();

locationCity.addEventListener("click", () => {
  getLocation();
});

catalogFormReset.addEventListener("click", () => {
  filter.filtersReset();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const initialData = await filter.getData();

    Catalog.getCatalog(initialData);
    dayProduct.initDayProducts();
    await filter.getCatalogForm(initialData);
    customCheckboxField.forEach((cb) =>
      cb.addEventListener("change", filter.getFilter),
    );

    if (catalogSortSelect) {
      catalogSortSelect.addEventListener("change", filter.getChangeSort);
    }

    radios.forEach((radio) =>
      radio.addEventListener("change", filter.getStatus),
    );
    basket.render();
  } catch (error) {
    console.error("Ошибка инициализации:", error);
  }
});
