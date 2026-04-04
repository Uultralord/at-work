import currencyApi from './api/api.js'
import CustomSelect, { initFormSelect } from './components/custom-select.js'
import Table from './components/custom-table.js'
import { setupCurrencySelectors, swapValues } from './components/converter.js'

const customSelectBtn = document.querySelectorAll('.custom-select__btn')
const dateEl = document.getElementById('date')
const customSelectList = document.querySelectorAll('.custom-select__list')

async function showCurrencyInfo() {
    try {
        // Получаем дату
        const date = await currencyApi.getCurrentDate();
        const newDate = date.split('T');
        const newDateReverse = newDate[0].split('-').reverse().join('.')
        dateEl.textContent = `на ${newDateReverse}`
        // Заполняем выпадающий список
        const currencies = await currencyApi.getCurrenciesList();
        currencies.forEach(currency => {
            const customSelect = new CustomSelect(currency);
            const liEl = customSelect.createTableTr();
            customSelectList.forEach(list => {
                const liCopy = liEl.cloneNode(true);
                list.append(liCopy);
            })
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

const reversBtn = document.querySelector('.converter__btn-revers')
reversBtn.addEventListener('click', () => {
    swapValues()
})

document.addEventListener('DOMContentLoaded', () => {
    showCurrencyInfo()
    initFormSelect()
    setupCurrencySelectors();
});