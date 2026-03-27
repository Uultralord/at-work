import { fetchData } from "./dataService.js";
import Basket from "./basket.js";
import { setupPagination } from "./pagination.js";
export default class Catalog {
  constructor(data) {
    if (!data) data = {};

    this.id = data.id ?? null;
    this.id = data.id ?? 0;
    this.name = data.name ?? "Товар без названия";
    this.priceOld = data.price?.old ?? 0;
    this.priceNew = data.price?.new ?? 0;
    this.image = data.image ?? "/images/no-image.jpg";
    this.availability = data.availability ?? {};
    this.type = data.type ?? [];
    this.goodsOfDay = data.goodsOfDay ?? false;
    this.formattedPriceOld = this.formatNumber(this.priceOld);
    this.formattedPriceNew = this.formatNumber(this.priceNew);

    this.cityNames = {
      moscow: "Москва",
      orenburg: "Оренбург",
      saintPetersburg: "Санкт-Петербург",
    };
  }

  getCard() {
    this.catalogList = document.querySelector(".catalog__list");
    this.catalogItem = this.createLi("catalog__item");
    this.productCard = this.createDiv("product-card");
    this.productCard.dataset.type = this.type.join(" ");
    this.productCardVisual = this.createDiv("product-card__visual");
    this.productCardInfo = this.createDiv("product-card__info");
    this.productCardMore = this.createDiv("product-card__more");

    this.imageEl = document.createElement("img");
    this.imageEl.classList.add("product-card__img");
    this.imageEl.alt = "Изображение товара";
    this.imageEl.src = this.image;

    this.productCardLinkBasket = this.createLink("btn--icon");
    this.productCardLinkBasket.addEventListener("click", () =>
      this.addToBasket(),
    );
    this.btnTextBasket = this.createSpan("В корзину", "btn__text");

    this.btnSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.btnSvg.setAttribute("width", "24");
    this.btnSvg.setAttribute("height", "24");

    this.useElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );
    this.useElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "images/sprite.svg#icon-basket",
    );

    this.productCardLinkMore = this.createLink("btn--secondary");
    this.btnTextMore = this.createSpan("Подробнее", "btn__text");

    this.title = document.createElement("h2");
    this.title.classList.add("product-card__title");
    this.title.textContent = this.name;

    this.productCardOld = this.createSpan("", "product-card__old");
    this.productCardOldNumber = this.createSpan(
      this.formattedPriceOld,
      "product-card__old-number",
    );
    this.productCardOldAdd = this.createSpan(" ₽", "product-card__old-add");

    this.productCardPrice = this.createSpan("", "product-card__price");
    this.productCardPriceNumber = this.createSpan(
      this.formattedPriceNew,
      "product-card__price-number",
    );
    this.productCardPriceAdd = this.createSpan(" ₽", "product-card__price-add");

    this.tooltip = this.createDiv("product-card__tooltip");
    this.tooltip.classList.add("tooltip");

    this.tooltipBtn = document.createElement("button");
    this.tooltipBtn.classList.add("tooltip__btn");
    this.tooltipBtn.alt = "Показать подсказку";

    this.tooltipBtnSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.tooltipBtnSvg.setAttribute("width", "5");
    this.tooltipBtnSvg.setAttribute("height", "10");

    this.tooltipUseElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );
    this.tooltipUseElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "images/sprite.svg#icon-i",
    );

    this.tooltipContent = this.createDiv("tooltip__content");
    this.tooltipText = this.createSpan(
      "Наличие товара по городам:",
      "tooltip__text",
    );

    this.tooltipList = document.createElement("ul");
    this.tooltipList.classList.add("tooltip__list");

    this.cities();

    this.tooltipBtnSvg.append(this.tooltipUseElem);
    this.tooltipBtn.append(this.tooltipBtnSvg);
    this.tooltipContent.append(this.tooltipText, this.tooltipList);

    this.tooltip.append(this.tooltipBtn, this.tooltipContent);

    this.productCard.append(this.productCardVisual, this.productCardInfo);

    this.productCardVisual.append(this.imageEl, this.productCardMore);
    this.productCardMore.append(
      this.productCardLinkBasket,
      this.productCardLinkMore,
    );
    this.productCardLinkBasket.append(this.btnTextBasket, this.btnSvg);
    this.btnSvg.append(this.useElem);
    this.productCardLinkMore.append(this.btnTextMore);

    this.productCardInfo.append(
      this.title,
      this.productCardOld,
      this.productCardPrice,
      this.tooltip,
    );

    this.productCardOld.append(
      this.productCardOldNumber,
      this.productCardOldAdd,
    );
    this.productCardPrice.append(
      this.productCardPriceNumber,
      this.productCardPriceAdd,
    );

    this.catalogItem.append(this.productCard);
    this.catalogList.append(this.catalogItem);

    tippy(this.tooltip, {
      content: () => {
        const container = document.createElement("div");
        container.appendChild(this.tooltipText);
        container.appendChild(this.tooltipList);
        return container;
      },
    });
  }

  createDiv(clas) {
    const divEl = document.createElement("div");
    divEl.classList.add(clas);
    return divEl;
  }

  createLi(clas) {
    const liEl = document.createElement("li");
    liEl.classList.add(clas);
    return liEl;
  }

  createLink(clas) {
    const linkEl = document.createElement("a");
    linkEl.classList.add("product-card__link", "btn", clas);
    linkEl.href = "#";
    return linkEl;
  }

  createSpan(text, clas) {
    const spanEl = document.createElement("span");
    spanEl.classList.add(clas);
    spanEl.textContent = text;
    return spanEl;
  }

  cities() {
    const availability = this.availability;

    if (!availability || Object.keys(availability).length === 0) {
      return [];
    }

    Object.entries(availability).forEach(([cityKey, count]) => {
      const cityDisplayName = this.cityNames[cityKey] || cityKey;

      const tooltipItem = this.createLi("tooltip__item");
      const cityLabel = this.createSpan(`${cityDisplayName}:`, "tooltip__text");
      const cityCount = this.createSpan(String(count), "tooltip__count");
      tooltipItem.append(cityLabel);
      tooltipItem.append(cityCount);
      this.tooltipList.append(tooltipItem);
    });
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  static async getCatalog(data = null) {
    const listEl = document.querySelector(".catalog__list");
    const paginEl = document.querySelector(".catalog__pagination");

    if (!listEl) return console.error("Нет .catalog__list");

    try {
      const items = data || (await fetchData());

      const renderItems = (itemList) => {
        listEl.innerHTML = "";
        itemList.forEach((item) => {
          const card = new Catalog(item);
          card.getCard();
        });
      };

      setupPagination(items, renderItems, paginEl, 6);
    } catch (err) {
      console.error("Ошибка загрузки каталога:", err);
    }
  }

  addToBasket() {
    if (!this.id || !this.name || !this.priceNew || !this.image) {
      console.warn("Недостаточно данных для добавления в корзину", this);
      return;
    }
    const productData = {
      id: this.id,
      name: this.name,
      priceNew: this.priceNew,
      image: this.image,
    };

    const storedBasket = localStorage.getItem("basketItems");
    let basketItems = [];

    if (storedBasket) {
      try {
        basketItems = JSON.parse(storedBasket);
      } catch (e) {
        console.error("Ошибка парсинга корзины из localStorage:", e);
        basketItems = [];
      }
    }

    basketItems.push(productData);
    localStorage.setItem("basketItems", JSON.stringify(basketItems));
    const basketItem = new Basket();
    basketItem.render();
  }
}
