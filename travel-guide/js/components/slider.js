const slider = document.querySelector('.about__slider-wrap'),
    slides = document.querySelectorAll('.about__slide'),
    arrows = document.querySelectorAll('.about__icon'),
    arrowLeft = document.querySelectorAll('.arrow-left'),
    arrowRight = document.querySelectorAll('.arrow-right');

let currentIndex = 0;

/* Функция смены слайдов */
export function goToSlide(index) {
    // Проверяем, что слайды существуют
    if (slides.length === 0) return;

    // Нормализуем индекс: приводим к диапазону [0, slides.length-1]
    const normalizedIndex = ((index % slides.length) + slides.length) % slides.length;
    currentIndex = normalizedIndex;

    // Убираем класс у всех слайдов
    slides.forEach(slide => {
        slide.classList.remove('about__slide--active');
    });

    // Добавляем класс к текущему слайду
    slides[currentIndex].classList.add('about__slide--active');

    // Убираем класс у всех стрелок
    arrows.forEach(arrow => {
        arrow.classList.remove('active');
    });

    // Добавляем класс к текущей стрелке (если есть)
    if (arrows[currentIndex]) {
        arrows[currentIndex].classList.add('active');
    }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {

    if (slides.length === 0) {
        console.warn('No slides found in the slider');
        return;
    }

    // Устанавливаем первый активный слайд при загрузке страницы
    goToSlide(0);

    // Находим кнопки «Назад» и «Вперёд»
    const prevButton = document.querySelector('.arrow-left');
    const nextButton = document.querySelector('.arrow-right');

    // Добавляем обработчик клика для кнопки «Назад», если кнопка существует
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    } else {
        console.warn('Previous button (.arrow-left) not found');
    }

    // Добавляем обработчик клика для кнопки «Вперёд», если кнопка существует
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    } else {
        console.warn('Next button (.arrow-right) not found');
    }
});
