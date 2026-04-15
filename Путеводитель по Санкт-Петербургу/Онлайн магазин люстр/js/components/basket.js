const basket = document.querySelector(".basket");
const headerUserBtn = document.querySelector(".header__user-btn");
const basketEmptyBlock = document.querySelector(".basket__empty-block");
const basketLink = document.querySelector(".basket__link");
const headerUserCount = document.querySelector(".header__user-count");
const basketList = document.querySelector(".basket__list");

export default class Basket {
  constructor(data) {
    if (!data) data = {};
    this.id = data.id ?? 0;
    this.name = data.name ?? "Товар без названия";
    this.priceNew = data.priceNew ?? 0;
    this.image = data.image ?? "/images/no-image.jpg";

    this.formattedPriceNew = this.formatNumber(this.priceNew);
  }
  getBasket() {
    this.basketItem = this.createLi("basket__item");
    this.basketImg = this.createDiv("basket__img");

    this.basketImageEl = document.createElement("img");
    this.basketImageEl.alt = "Изображение товара";
    this.basketImageEl.src = this.image;

    this.basketBtn = document.createElement("button");
    this.basketBtn.classList.add("basket__item-close");
    this.basketBtn.addEventListener("click", () => this.removeItem(this.id));
    this.basketSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.basketSvg.setAttribute("width", "24");
    this.basketSvg.setAttribute("height", "24");
    this.basketSvg.classList = "main-menu__icon";

    this.basketUseElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );
    this.basketUseElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "images/sprite.svg#icon-close",
    );

    this.basketImg.append(this.basketImageEl);
    this.basketName = this.createSpan(this.name, "basket__name");
    this.basketPrice = this.createSpan(this.formattedPriceNew, "basket__price");
    this.basketBtn.append(this.basketSvg);
    this.basketSvg.append(this.basketUseElem);

    this.basketItem.append(
      this.basketImg,
      this.basketName,
      this.basketPrice,
      this.basketBtn,
    );
    basketList.append(this.basketItem);
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

  createSpan(text, clas) {
    const spanEl = document.createElement("span");
    spanEl.classList.add(clas);
    spanEl.textContent = text;
    return spanEl;
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  loadItems() {
    const storedBasket = localStorage.getItem("basketItems");

    if (!storedBasket) return [];
    try {
      return JSON.parse(storedBasket);
    } catch (e) {
      console.error("Ошибка при чтении корзины:", e);
      return [];
    }
  }

  render() {
    try {
      if (!basketList) {
        console.warn("Не удалось найти .basket__list. Рендеринг отменён.");
        return;
      }
      basketList.innerHTML = "";
      let items = this.loadItems();
      headerUserCount.textContent = items.length;
      if (items.length > 0) {
        basketLink.style.display = "flex";
        basketEmptyBlock.style.display = "none";
      } else {
        basketLink.style.display = "none";
        basketEmptyBlock.style.display = "block";
      }
      items.forEach((itemData) => {
        const basketItem = new Basket(itemData);
        basketItem.getBasket();
      });
    } catch (error) {
      console.error("Ошибка при загрузке или рендеринге:", error);
    }
  }

  removeItem(id) {
    const items = this.loadItems();
    const updatedItems = items.filter((item) => item.id !== id);

    localStorage.setItem("basketItems", JSON.stringify(updatedItems));
    basketList.innerHTML = "";
    this.render();
  }
}

function basketMenu() {
  basket.classList.toggle("basket--active");
}

headerUserBtn.addEventListener("click", () => {
  basketMenu();
});
