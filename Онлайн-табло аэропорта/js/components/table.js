import { getFlights, addToLocalStorage } from './localStorage.js';

export default class Table {
    _date = '';
    _time = '';
    _direction = '';
    _flight = '';
    _airline = '';
    _status = '';
    _type = '';

    constructor(data) {
        if (!data) data = {};
        this.date = data.date;
        this.time = data.time;
        this.direction = data.direction;
        this.flight = data.flight;
        this.airline = data.airline;
        this.status = data.status;
        this.statusColor = data.statusColor;
        this.type = data.type;

        this.airlineImages = {
            'Аэрофлот': './images/logo-airline/aeroflot.png',
            'Азимут': './images/logo-airline/azimuth.png',
            'Nordwind': './images/logo-airline/nordwind.png',
            'Россия': './images/logo-airline/russia.png',
            'S7 Airlines': './images/logo-airline/s7-airlines.png',
            'Ural Airlines': './images/logo-airline/ural-airlines.png'
        };
    }

    set date(value) {
        this._date = value;
        if (this.dateEl) {
            this.dateEl.textContent = value;
        }
    }
    get date() { return this._date; }

    set time(value) {
        this._time = value;
        if (this.timeEl) {
            this.timeEl.textContent = value;
        }
    }
    get time() { return this._time; }

    set direction(value) {
        this._direction = value;
        if (this.directionEl) {
            this.directionEl.textContent = value;
        }
    }
    get direction() { return this._direction; }

    set flight(value) {
        this._flight = value;
        if (this.flightEl) {
            this.flightEl.textContent = value;
        }
    }
    get flight() { return this._flight; }

    set airline(value) {
        this._airline = value;
        if (this.airlineEl) {
            this.airlineEl.textContent = value;
        }
    }
    get airline() { return this._airline; }

    set status(value) {
        this._status = value;
        if (this.statusEl) {
            this.statusEl.textContent = value;
        }
    }
    get status() { return this._status; }

    set statusColor(value) {
        this._statusColor = value;
        if (this.statusEl && value) {
            this.statusEl.style.color = value;
        }
    }
    get statusColor() { return this._statusColor; }

    createTableTr() {
        this.tRowEl = this.createTrow();

        this.dateEl = this.createLi(this.date);
        this.dateEl.classList.add('custom-table__text--date');
        this.timeEl = this.createLi(this.time);
        this.timeEl.classList.add('custom-table__text--time');
        this.directionEl = this.createLi(this.direction);
        this.directionEl.classList.add('custom-table__text--direction');
        this.statusGreyEl = this.createLi('Статус');
        this.statusGreyEl.classList.add('custom-table__text--grey');
        this.flightEl = this.createLi(this.flight);
        this.flightEl.classList.add('custom-table__text--flight');
        this.airlineEl = this.createAirlineCell();
        this.airlineEl.classList.add('custom-table__text--airline');
        this.statusEl = this.createLi(this.status);
        this.statusEl.classList.add('custom-table__text--status');
        if (this.statusColor) {
            this.statusEl.style.color = this.statusColor;
        }

        this.tRowEl.append(
            this.dateEl,
            this.timeEl,
            this.statusGreyEl,
            this.directionEl,
            this.flightEl,
            this.airlineEl,
            this.statusEl
        );

        return this.tRowEl;
    }

    createTbody() {
        const tbodyEl = document.createElement('div');
        tbodyEl.classList.add('custom-table__tbody');
        return tbodyEl;
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

    createAirlineCell() {
        const liEl = document.createElement('li');
        liEl.classList.add('custom-table__text');

        const imageEl = document.createElement('img');
        imageEl.classList.add('custom-table__text-img');
        imageEl.alt = this._airline;

        const logoPath = this.airlineImages[this._airline];
        if (logoPath) {
            imageEl.src = logoPath;
            liEl.append(imageEl);
        } else {
            liEl.textContent = this._airline;
        }
        return liEl;
    }
}

const customTableTbody = document.querySelector('.custom-table__tbody');

export function addFlight(form) {
    if (!form) {
        console.error('Форма не найдена');
        return false;
    }

    const statusSelect = form.querySelector('#status');
    let statusColor = '';
    if (statusSelect) {
        statusColor = statusSelect.dataset.color || '';
    }

    const data = new FormData(form);
    const labels = form.querySelectorAll('.custom-select__label[data-type]');
    const labelTexts = {};

    labels.forEach(label => {
        const type = label.dataset.type;
        if (type) {
            labelTexts[type] = label.textContent.trim();
        }
    });

    const newFlight = {
        date: data.get('date') || '',
        time: data.get('time') || '',
        direction: labelTexts.direction || '',
        flight: data.get('flight') || '',
        airline: labelTexts.airline || '',
        status: labelTexts.status || '',
        type: labelTexts.type || '',
        statusColor: statusColor
    };

    try {
        const flights = getFlights() || [];
        flights.unshift(newFlight);
        addToLocalStorage(flights);
        const newRow = new Table(newFlight).createTableTr();
        if (customTableTbody) {
            customTableTbody.insertBefore(newRow, customTableTbody.firstChild);
        } else {
            console.error('.custom-table__tbody не найден при добавлении строки');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Ошибка при добавлении рейса:', error);
        return false;
    }
}

