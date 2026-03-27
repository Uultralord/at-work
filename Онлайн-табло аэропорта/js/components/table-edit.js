import { getFlights, addToLocalStorage } from './localStorage.js';
import Table from './table.js';

export default class EditTable extends Table {
    constructor(data, rowIndex) {
        super(data);
        this.rowIndex = rowIndex;

        if (!this.data) {
            this.data = {};
        }
        if (this.data.status === undefined) {
            this.data.status = 'Статус';
        }

        this.selectedStatus = this.data.status;
    }

    createTableTr() {
        const tRowEl = super.createTableTr();
        const statusEl = tRowEl.querySelector('.custom-table__text--status');
        if (!statusEl) {
            console.warn('Элемент статуса не найден для редактирования');
            return tRowEl;
        }

        statusEl.remove();
        const customTableText = document.createElement('div');
        customTableText.className = 'custom-table__text-wrap';

        const statusSelect = document.createElement('div');
        statusSelect.className = 'custom-select custom-select--table';
        statusSelect.id = `custom-select-${this.rowIndex}`;

        const btnEl = this.createBtn();
        statusSelect.appendChild(btnEl);

        const labelEl = document.createElement('span');
        labelEl.className = 'custom-select__label';
        labelEl.textContent = this.data.status || 'Статус';
        labelEl.dataset.rowIndex = this.rowIndex;
        btnEl.appendChild(labelEl);

        const statusList = this.createStatusList([
            'Прибыл',
            'Посадка',
            'Отменен',
            'В полете',
            'Задерживается',
            'Регистрация'
        ]);
        statusSelect.appendChild(statusList);
        const deleteBtn = this.createDeleteButton();
        customTableText.append(statusSelect);
        customTableText.append(deleteBtn);
        tRowEl.appendChild(customTableText);
        return tRowEl;
    }

    createBtn() {
        const button = document.createElement('button');
        button.className = 'custom-select__btn';
        button.type = 'button';
        button.innerHTML = `
      <svg class="custom-select__icon" width="14" height="9" aria-hidden="true">
        <use xlink:href="images/sprite.svg#arrow-down"></use>
      </svg>`;
        return button;
    }

    createStatusList(statuses) {
        const list = document.createElement('ul');
        list.className = 'custom-select__list';
        list.id = `status-list-${this.rowIndex}`;

        statuses.forEach(status => {
            const listItem = document.createElement('li');
            listItem.className = 'custom-select__item';

            const button = document.createElement('button');
            button.className = `custom-select__sublink ${this.getStatusClass(status)}`;
            button.type = 'button';
            button.textContent = status;

            const icon = this.createStatusIcon();
            button.appendChild(icon);

            if (status === this.selectedStatus) {
                button.classList.add('custom-select__sublink--selected');
            }

            listItem.appendChild(button);
            list.appendChild(listItem);
        });

        return list;
    }

    getStatusClass(status) {
        const statusClasses = {
            'Прибыл': 'custom-select__sublink--green',
            'Посадка': 'custom-select__sublink--blue',
            'Отменен': 'custom-select__sublink--red',
            'В полете': 'custom-select__sublink--blue',
            'Задерживается': 'custom-select__sublink--red',
            'Регистрация': ''
        };
        return statusClasses[status] || '';
    }

    createStatusIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '9');
        svg.setAttribute('aria-hidden', 'true');
        svg.classList.add('custom-select__item-icon');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'images/sprite.svg#arrow-check');

        svg.appendChild(use);
        return svg;
    }

    createDeleteButton() {
        const button = document.createElement('button');
        button.className = 'custom-table__delete-btn';
        button.type = 'button';

        button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24">
        <use xlink:href="images/sprite.svg#delete"></use>
      </svg>`;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteRow();
        });

        return button;
    }

    deleteRow() {
        const rowElement = this.tRowEl?.closest('.custom-table__trow');
        if (rowElement) {
            rowElement.remove();
            const flights = getFlights();
            flights.splice(this.rowIndex, 1);
            addToLocalStorage(flights);
        }
    }
}
