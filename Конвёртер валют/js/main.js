import currencyApi from './api/api.js'
import { showCurrencyInfo2 } from './components/custom-select.js'

const customSelectBtn = document.querySelectorAll('.custom-select__btn')
const dateEl = document.getElementById('date')

async function showCurrencyInfo() {
    try {
        // Получаем дату
        const date = await currencyApi.getCurrentDate();
        const newDate = date.split('T');
        const newDateReverse = newDate[0].split('-').reverse().join('.')
        dateEl.textContent = `на ${newDateReverse}`
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}


customSelectBtn.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('custom-select__btn--active')
    })
})

document.addEventListener('DOMContentLoaded', () => {
    showCurrencyInfo()
    showCurrencyInfo2()
});
