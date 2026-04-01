import currencyApi from './api/api.js'
import CustomSelect, { initFormSelect } from './components/custom-select.js'
import Table from './components/custom-table.js'


const customSelectBtn = document.querySelectorAll('.custom-select__btn')
const dateEl = document.getElementById('date')
const customSelectList = document.querySelectorAll('.custom-select__list')
const customTableTbody = document.querySelector('.custom-table__tbody ')

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
        // Заполняем таблицу
        const courses = await currencyApi.getCurrentRates();
        const valutes = Object.values(courses.Valute)
        console.log(valutes)
        valutes.forEach(valute => {
            const table = new Table(valute)
            const liEl = table.createTableTr();
            // customSelectList.forEach(list => {
            //     const liCopy = liEl.cloneNode(true);
            //     list.append(liCopy);
            // })
            customTableTbody.append(liEl)
        });
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
    initFormSelect()
});
