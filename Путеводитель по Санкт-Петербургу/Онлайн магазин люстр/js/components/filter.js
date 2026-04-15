import { fetchData } from "./dataService.js";
import Catalog from "./catalog.js";

const catalogForm = document.querySelector(".catalog-form");
const customCheckboxField = document.querySelectorAll(
  ".custom-checkbox__field",
);
const catalogSortSelect = document.querySelector(".catalog__sort-select");
const inStockRadio = document.getElementById("instock");

let cachedData = null;

export async function getData() {
  if (cachedData !== null) return cachedData;

  try {
    const data = await fetchData();
    cachedData = data;
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return null;
  }
}

export async function getCatalogForm() {
  if (!catalogForm || customCheckboxField.length === 0) return;
  const data = await getData();
  customCheckboxField.forEach((checkbox) => {
    const value = checkbox.value;

    const filteredByType = data.filter(
      (item) => Array.isArray(item.type) && item.type.includes(value),
    );

    let finalCount = filteredByType.length;
    if (inStockRadio && inStockRadio.checked) {
      const inStockItems = filteredByType.filter((product) => {
        const totalCount = Object.values(product.availability || {}).reduce(
          (sum, count) => sum + count,
          0,
        );
        return totalCount > 0;
      });
      finalCount = inStockItems.length;
    }

    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (!label) return;
    const countEl = label.querySelector(".custom-checkbox__count");
    if (countEl) countEl.textContent = finalCount;
  });
}

export async function getFilter() {
  await getStatus();
}

function sortData(data, sortType) {
  switch (sortType) {
    case "price-min":
      return [...data].sort((a, b) => {
        const priceA = typeof a.price?.new === "number" ? a.price.new : 0;
        const priceB = typeof b.price?.new === "number" ? b.price.new : 0;
        return priceA - priceB;
      });
    case "price-max":
      return [...data].sort(
        (a, b) => (b.price?.new || 0) - (a.price?.new || 0),
      );
    case "rating-max":
      return [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return data;
  }
}

export async function getSortMin() {
  await sortAndRender("price-min");
}

export async function getSortMax() {
  await sortAndRender("price-max");
}

export async function getSortRating() {
  await sortAndRender("rating-max");
}

async function sortAndRender(sortType) {
  const data = await getData();
  if (!data) return;

  const sortedData = sortData(data, sortType);
  Catalog.getCatalog(sortedData);
}

export async function getChangeSort(event) {
  await getStatus();
}

export async function getStatus() {
  const data = await getData();
  if (!data) return;

  // 1. Фильтрация по типу товара
  const activeFilters = Array.from(
    document.querySelectorAll(".custom-checkbox__field:checked"),
  ).map((cb) => cb.value);

  let filteredData = data.filter(
    (product) =>
      activeFilters.length === 0 ||
      (Array.isArray(product.type) &&
        activeFilters.some((filter) => product.type.includes(filter))),
  );

  // 2. Фильтрация по наличию
  if (inStockRadio.checked) {
    filteredData = filteredData.filter((product) => {
      const totalCount = Object.values(product.availability || {}).reduce(
        (sum, count) => sum + count,
        0,
      );

      return totalCount > 0;
    });
  }
  await getCatalogForm();

  // 3. Сортировка
  const sortValue = catalogSortSelect?.value;
  if (sortValue) {
    filteredData = sortData(filteredData, sortValue);
  }
  Catalog.getCatalog(filteredData);
}

export function filtersReset() {
  customCheckboxField.forEach((checkbox) => {
    checkbox.checked = false;
  });
  if (inStockRadio) {
    inStockRadio.checked = false;
  }
  if (catalogSortSelect) {
    catalogSortSelect.value = "";
  }
  getStatus();
}
