import Catalog from "./catalog.js";
import { fetchData } from "./dataService.js";
export default class DayProduct extends Catalog {
  constructor(data) {
    super(data);
  }
  getProduct() {
    super.getCard();
    this.catalogList = document.querySelector(".day-products__list");
    this.catalogItem.classList.remove("catalog__item");
    this.catalogItem.classList.add("day-products__item", "swiper-slide");
    this.productCard.classList.add("product-card--small");

    this.catalogItem.append(this.productCard);
    this.catalogList.append(this.catalogItem);

    return this.catalogItem;
  }

  async initDayProducts() {
    const items = await fetchData();
    const dayItems = items.filter((item) => item.goodsOfDay === true);

    dayItems.forEach((itemData) => {
      const dayProduct = new DayProduct(itemData);
      dayProduct.getProduct();
    });
    this.initSwiper();
  }

  initSwiper() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper не загружен. Проверьте подключение скрипта.");
      return;
    }
    const swiperContainer = document.querySelector(
      ".day-products__slider.swiper",
    );
    if (!swiperContainer) {
      console.error(
        "Не найден контейнер слайдера .day-products__slider.swiper",
      );
      return;
    }

    new Swiper(swiperContainer, {
      navigation: {
        nextEl: ".day-products__navigation-btn--next",
        prevEl: ".day-products__navigation-btn--prev",
      },
      spaceBetween: 20,
      slidesPerView: 4,
      loop: false,
      speed: 600,
      grabCursor: true,
    });
  }
}
