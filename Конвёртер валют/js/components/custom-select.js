import currencyApi from '../api/api.js'

const customSelect = document.querySelectorAll('.custom-select')
const sublink = document.querySelectorAll('.custom-select__sublink')
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
        this.liEl = this.createLi()

        this.NameEl = this.createBtn(this.Name);
        this.CharCodeEl = this.createSpan(this.CharCode);

        this.NameEl.append(this.CharCodeEl)

        this.liEl.append(this.NameEl)

        return this.liEl;
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

export function initFormSelect() {
    const customSelects = document.querySelectorAll('.custom-select');

    // Обрабатываем каждый элемент .custom-select
    customSelects.forEach(select => {
        const customSelectBtn = select.querySelector('.custom-select__btn');
        const label = select.querySelector('.custom-select__label');
        const list = select.querySelector('.custom-select__list')

        label.dataset.originalText = label.textContent;

        // Проверяем, что элементы найдены
        if (!customSelectBtn || !label) {
            console.warn('В элементе .custom-select не найдены необходимые дочерние элементы');
            return;
        }

        // Обработчик клика по кнопке
        customSelectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            select.classList.toggle('custom-select--active');
        });

        // Закрытие при клике вне элемента
        document.addEventListener('click', () => {
            select.classList.remove('custom-select--active');
        });

        list.addEventListener('click', (e) => {
            const button = e.target.closest('.custom-select__sublink');
            if (!button) return;
            e.stopPropagation();
            const match = button.textContent.match(/([А-Яа-я\s]+)(\w+)/);
            label.textContent = match[1] + ' ' + match[2]
        });
    });
}

