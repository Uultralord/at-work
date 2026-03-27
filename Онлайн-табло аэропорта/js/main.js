import Table, { addFlight } from './components/table.js';
import { getFlights } from './components/localStorage.js';
import EditTable from './components/table-edit.js';
import {
    initTableSelects, initFormSelects, resetCustomSelectLabels,
    handleSaveSelection, handleCancelSelection
} from './components/selects.js';
import { validateForm } from './components/validate.js';
import { filterDirection, filterType } from './components/filter.js';

const form = document.getElementById('flight__form');
const customTableTbody = document.querySelector('.custom-table__tbody');
const customTable = document.querySelector('.custom-table');
const editBtn = document.querySelector('.header__edit-btn');
const saveBtn = document.querySelector('.header__btn');
const search = document.getElementById('header-search');
const arrivalLinks = document.querySelector('.arrival__links');
const links = arrivalLinks.querySelectorAll('.arrival__link');

// ONLY ADMIN
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm(form)) {
            addFlight(form);
            form.reset();
            resetCustomSelectLabels();
            updateTableView()
        }
    });
}

if (editBtn) {
    editBtn.addEventListener('click', () => {
        const isCurrentlyEditing = editBtn.textContent.trim() === 'Отменить редактирование';

        if (isCurrentlyEditing) {
            const tableSelects = document.querySelectorAll('.custom-table .custom-select');
            tableSelects.forEach(selectItem => {
                const label = selectItem.querySelector('.custom-select__label');
                if (label) {
                    handleCancelSelection(selectItem, label);
                }
            });

            customTable.classList.remove('custom-table--edit');
            editBtn.textContent = 'редактирование';
            updateTableView();
        } else {
            customTable.classList.add('custom-table--edit');
            editBtn.textContent = 'Отменить редактирование';
            updateTableView();
        }
    });
}

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const tableSelects = document.querySelectorAll('.custom-table .custom-select');
        tableSelects.forEach(selectItem => {
            const label = selectItem.querySelector('.custom-select__label');
            const rowIndex = parseInt(label.dataset.rowIndex, 10);
            if (label && !isNaN(rowIndex)) {
                handleSaveSelection(selectItem, label, rowIndex);
            } else {
                console.warn('Invalid rowIndex or missing label for selectItem:', selectItem);
            }
        });

        customTable.classList.remove('custom-table--edit');
        editBtn.textContent = 'редактирование';
        updateTableView();
    });
}

// ALL

function updateTableView() {
    const isEditing = customTable.classList.contains('custom-table--edit');
    const searchQuery = search ? search.value.trim() : '';
    const directionFilter = searchQuery ? filterDirection() : null;

    const activeLink = document.querySelector('.arrival__link--active');
    const typeId = activeLink ? activeLink.id : '';
    const typeFilter = typeId ? filterType(typeId) : null;

    let filteredData = null;

    if (directionFilter !== null && typeFilter !== null) {
        filteredData = directionFilter.filter(flight =>
            typeFilter.some(f => f.id === flight.id)
        );
    } else if (directionFilter !== null) {
        filteredData = directionFilter;
    } else if (typeFilter !== null) {
        filteredData = typeFilter;
    }
    renderTable(isEditing, filteredData);
}

function renderTable(isEditing = false, data = null) {
    const flights = data !== null ? data : getFlights();
    const allFlights = getFlights();

    if (!customTableTbody) {
        console.error('.custom-table__tbody не найден');
        return;
    }

    customTableTbody.innerHTML = '';

    flights.forEach((flight, filteredIndex) => {
        let rowIndex = -1;

        for (let i = 0; i < allFlights.length; i++) {
            const storedFlight = allFlights[i];
            if (
                storedFlight.date === flight.date &&
                storedFlight.time === flight.time &&
                storedFlight.direction === flight.direction &&
                storedFlight.flight === flight.flight &&
                storedFlight.airline === flight.airline
            ) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex === -1) {
            console.warn('Не удалось найти оригинальный индекс для рейса:', flight);
            rowIndex = filteredIndex;
        }

        const flightRow = isEditing
            ? new EditTable(flight, rowIndex)
            : new Table(flight);

        const tableRowEl = flightRow.createTableTr();
        customTableTbody.appendChild(tableRowEl);
    });

    initTableSelects();
}

search.addEventListener('keyup', updateTableView);

arrivalLinks.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('arrival__link')) {
        event.preventDefault();
        links.forEach(link => link.classList.remove('arrival__link--active'));
        target.classList.add('arrival__link--active');
        updateTableView();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateTableView();
    initFormSelects();
});
