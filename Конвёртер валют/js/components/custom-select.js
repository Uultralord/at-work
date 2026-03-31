import currencyApi from '../api/api.js'

const customSelect = document.querySelectorAll('.custom-select')
const customSelectList = document.querySelectorAll('.custom-select__list')

export default class CustomSelect {
    _Name = '';
    _CharCode = '';

    constructor(data) {
        if (!data) data = {};
        this.Name = data.name;
        this.CharCode = data.code;
    }

    set Name(value) {
        this._Name = value;
        if (this.NameEl) {
            this.NameEl.textContent = value;
        }
    }
    get Name() { return this._Name; }

    set CharCode(value) {
        this._CharCode = value;
        if (this.CharCodeEl) {
            this.CharCodeEl.textContent = value;
        }
    }
    get CharCode() { return this._CharCode; }

    createTableTr() {
        if (!customSelectList) {
            console.log('customSelectList не создан')
        }

        this.liEl = this.createLi()

        this.NameEl = this.createBtn(this.CharCode);
        this.CharCodeEl = this.createSpan(this.Name);

        this.NameEl.append(this.CharCodeEl)

        this.liEl.append(this.NameEl)

        customSelectList.append(this.liEl)

        return customSelectList;
    }

    createUl() {
        const ulEl = document.createElement('ul');
        ulEl.classList.add('custom-select__list');
        return ulEl;
    }

    createLi() {
        const liEl = document.createElement('li');
        liEl.classList.add('custom-select__item');
        return liEl;
    }

    createBtn(text) {
        const btnEl = document.createElement('button');
        btnEl.classList.add('custom-select__sublink');
        btnEl.textContent = text
        return btnEl;
    }

    createSpan(text) {
        const spanEl = document.createElement('span');
        spanEl.classList.add('custom-select__sublink-bold');
        spanEl.textContent = text
        return spanEl;
    }
}

export async function showCurrencyInfo2() {
    try {
        // Получаем дату
        const CharCode = await currencyApi.getCurrenciesList()
        CharCode.forEach(code => {
            const customSelect = new CustomSelect(code)
            console.log(customSelect)
        })
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}


customSelect.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('custom-select--active')
    })
})