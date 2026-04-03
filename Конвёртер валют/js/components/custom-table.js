import currencyApi from '../api/api.js';
let rowId = 1
let headId = 1
export default class Table {
    _CharCode = '';
    _Name = '';
    _Nominal = '';
    _Value = '';

    constructor(data) {
        if (!data) data = {};
        this.CharCode = data.CharCode;
        this.Name = data.Name;
        this.Nominal = data.Nominal;
        this.Value = data.Value;

    }

    set CharCode(value) {
        this._CharCode = value;
        if (this.CharCodeEl) {
            this.CharCodeEl.textContent = value;
        }
    }
    get CharCode() { return this._CharCode; }

    set Name(value) {
        this._Name = value;
        if (this.NameEl) {
            this.NameEl.textContent = value;
        }
    }
    get Name() { return this._Name; }

    set Nominal(value) {
        this._Nominal = value;
        if (this.NominalEl) {
            this.NominalEl.textContent = value;
        }
    }
    get Nominal() { return this._Nominal; }

    set Value(value) {
        this._Value = value;
        if (this.ValueEl) {
            this.ValueEl.textContent = value;
        }
    }
    get Value() { return this._Value; }

    createTableTr() {
        this.tRowEl = this.createTrow();

        // const svgPath = `./images/sprite/flags/${this.CharCode}.svg`;
        // const checker = new Image();

        // checker.onload = () => {
        //     const img = document.createElement('img');
        //     img.src = svgPath;
        //     img.alt = this.CharCode;
        //     img.classList.add('custom-table__text-icon');
        //     this.CharCodeEl.appendChild(img);
        //     console.log(`SVG добавлен для ${this.CharCode}`);
        // };

        // checker.onerror = () => {
        //     this.CharCodeEl.style.paddingLeft = '35px';
        //     console.log(`SVG для ${this.CharCode} не найден, добавлен отступ`);
        // };

        // checker.src = svgPath;

        this.CharCodeEl = this.createLi(this.CharCode);
        this.CharCodeEl.classList.add('custom-table__text--code');
        this.NameEl = this.createLi(this.Name);
        this.NameEl.classList.add('custom-table__text--currency');
        this.NominalEl = this.createLi(this.Nominal);
        this.NominalEl.classList.add('custom-table__text--unit');
        this.ValueEl = this.createLi(this.Value);
        this.ValueEl.classList.add('custom-table__text--basic-course');




        this.tRowEl.append(
            this.CharCodeEl,
            this.NominalEl,
            this.NameEl,
            this.ValueEl
        );

        return this.tRowEl;
    }

    createTableHead() {
        this.tRowEl = this.createTrowHead();
        if (this.tRowEl.id % 2 !== 0) {
            this.tRowEl.classList.add('custom-table__thead-trow--background')
        }

        this.headCodeEl = this.createLi('Код');
        this.headCodeEl.classList.add('custom-table__head--code');

        this.headNameEl = this.createLi('Единица');
        this.headNameEl.classList.add('custom-table__head--currency');

        this.headNominalEl = this.createLi('Валюта');
        this.headNominalEl.classList.add('custom-table__head--unit');

        this.headValueEl = this.createLi('Курс базовой валюты');
        this.headValueEl.classList.add('custom-table__head--basic-course');

        this.tRowEl.append(
            this.headCodeEl,
            this.headNameEl,
            this.headNominalEl,
            this.headValueEl
        );

        return this.tRowEl;
    }

    createSmallTable() {
        this.tRowEl = this.createTrow();

        // const svgPath = `./images/sprite/flags/${this.CharCode}.svg`;
        // const checker = new Image();

        // checker.onload = () => {
        //     const img = document.createElement('img');
        //     img.src = svgPath;
        //     img.alt = this.CharCode;
        //     img.classList.add('custom-table__text-icon');
        //     this.CharCodeEl.appendChild(img);
        //     console.log(`SVG добавлен для ${this.CharCode}`);
        // };

        // checker.onerror = () => {
        //     console.log(`SVG для ${this.CharCode} не найден, добавлен отступ`);
        // };

        // checker.src = svgPath;

        this.headCodeEl = this.createLi('Код');

        this.CharCodeEl = this.createSpan(this.CharCode);
        this.CharCodeEl.classList.add('custom-table__text--code');

        this.headCodeEl.append(this.CharCodeEl)

        this.headNameEl = this.createLi('Единица');

        this.NameEl = this.createSpan(this.Name);
        this.NameEl.classList.add('custom-table__text--currency');

        this.headNameEl.append(this.NameEl)

        this.headNominalEl = this.createLi('Валюта');

        this.NominalEl = this.createSpan(this.Nominal);
        this.NominalEl.classList.add('custom-table__text--unit');

        this.headNominalEl.append(this.NominalEl)

        this.headValueEl = this.createLi('Курс базовой валюты');

        this.ValueEl = this.createSpan(this.Value);
        this.ValueEl.classList.add('custom-table__text--basic-course');

        this.headValueEl.append(this.ValueEl)

        this.tRowEl.append(
            this.headCodeEl,
            this.headNameEl,
            this.headNominalEl,
            this.headValueEl
        );

        return this.tRowEl;
    }

    createTrow() {
        const trowEl = document.createElement('ul');
        trowEl.classList.add('custom-table__trow');
        trowEl.id = `${rowId++}`
        return trowEl;
    }

    createTrowHead() {
        const trowEl = document.createElement('ul');
        trowEl.classList.add('custom-table__thead-trow');
        trowEl.id = `${headId++}`
        return trowEl;
    }

    createLi(text) {
        const liEl = document.createElement('li');
        liEl.classList.add('custom-table__text');
        liEl.textContent = text;
        return liEl;
    }

    createSpan(text) {
        const liEl = document.createElement('span');
        //liEl.classList.add('');
        liEl.textContent = text;
        return liEl;
    }
}

const customTableTbody = document.querySelector('.custom-table__tbody ')
const customTableThead = document.querySelector('.custom-table__thead ')

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function renderCurrencyTable() {
    rowId = 1;
    headId = 1;

    customTableThead.innerHTML = '';
    customTableTbody.innerHTML = '';

    const courses = await currencyApi.getCurrentRates();
    const valutes = Object.values(courses.Valute);

    if (window.innerWidth >= 1024) {
        const tableHead = new Table();
        const tableThead = tableHead.createTableHead();
        customTableThead.append(tableThead);
        valutes.forEach(valute => {
            const table = new Table(valute);
            const liEl = table.createTableTr();
            customTableTbody.append(liEl);
        });
    } else {
        valutes.forEach(valute => {
            const table = new Table(valute);
            const tableSmall = table.createSmallTable();
            if (tableSmall.id % 2 !== 0) {
                tableSmall.classList.add('custom-table__trow--background')
            }
            //customTableThead.append(tableThead);

            // const table = new Table(valute);
            // const liEl = table.createTableTr();

            customTableTbody.append(tableSmall);
        });
    }
}

renderCurrencyTable();

window.addEventListener('resize', debounce(renderCurrencyTable, 100));
