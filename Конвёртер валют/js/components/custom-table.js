import currencyApi from '../api/api'

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

        this.airlineImages = {
            'Аэрофлот': './images/logo-airline/aeroflot.png',
            'Азимут': './images/logo-airline/azimuth.png',
            'Nordwind': './images/logo-airline/nordwind.png',
            'Россия': './images/logo-airline/russia.png',
            'S7 Airlines': './images/logo-airline/s7-airlines.png',
            'Ural Airlines': './images/logo-airline/ural-airlines.png'
        };
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
            this.ValueEl,
        );

        return this.tRowEl;
    }

    createTrow() {
        const trowEl = document.createElement('ul');
        trowEl.classList.add('custom-table__trow');
        return trowEl;
    }

    createLi(text) {
        const liEl = document.createElement('li');
        liEl.classList.add('custom-table__text');
        liEl.textContent = text;
        return liEl;
    }
}

const svgCache = new Map();

async function checkSvgWithCache(currencyCode, folderPath = 'svgs/') {
    const cacheKey = `${folderPath}${currencyCode}`;

    // Проверяем кэш
    if (svgCache.has(cacheKey)) {
        return svgCache.get(cacheKey);
    }

    const filename = `${folderPath}${currencyCode}.svg`;
    let exists = false;

    try {
        const response = await fetch(filename, { method: 'HEAD' });
        exists = response.status === 200;
    } catch (error) {
        console.warn(`Файл ${filename} не найден:`, error.message);
    }

    // Сохраняем в кэш
    svgCache.set(cacheKey, exists);
    return exists;
}
checkSvgWithCache()