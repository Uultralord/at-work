import { getFlights, addToLocalStorage } from './localStorage.js';

// FORM
export function initFormSelects() {
    document.querySelectorAll('form .custom-select')
        .forEach(select => {
            if (select.dataset.initialized === 'form') return;
            select.dataset.initialized = 'form';
            initFormSelect(select);
        });
}

function initFormSelect(item) {
    const customSelectBtn = item.querySelector('.custom-select__btn');
    const label = item.querySelector('.custom-select__label');

    if (!customSelectBtn || !label) return;

    label.dataset.originalText = label.textContent;

    const computedStyle = window.getComputedStyle(label);
    label.style.color = computedStyle.color;
    label.dataset.originalColor = computedStyle.color;

    customSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('custom-select--open');
    });

    item.addEventListener('click', (e) => {
        const button = e.target.closest('.custom-select__sublink');
        if (!button) return;
        e.stopPropagation();
        updateSelectState(item, button, label);
    });
}

// TABLE
export function initTableSelects() {
    document.querySelectorAll('.custom-table .custom-select')
        .forEach(select => {
            if (select.dataset.initialized === 'table') return;
            select.dataset.initialized = 'table';
            initTableSelect(select);
        });
}

function initTableSelect(item) {
    const flights = getFlights();
    const customSelectBtn = item.querySelector('.custom-select__btn');
    const label = item.querySelector('.custom-select__label');
    const rowIndex = parseInt(label.dataset.rowIndex, 10);

    if (isNaN(rowIndex)) {
        console.error('Invalid data-row-index:', label);
        return;
    }

    const initialStatus = flights?.[rowIndex]?.status || 'Статус';
    const initialColor = flights?.[rowIndex]?.statusColor;

    label.textContent = initialStatus;
    label.dataset.originalText = initialStatus;

    if (initialColor) {
        label.style.color = initialColor;
        label.dataset.originalColor = initialColor;
    }

    if (!customSelectBtn || !label) return;

    customSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('custom-select--open');
    });

    item.querySelectorAll('.custom-select__sublink')
        .forEach(sublink => {
            sublink.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectState(item, sublink, label);
            });
        });
}

function updateSelectState(selectItem, selectedButton, label) {
    selectItem.querySelectorAll('.custom-select__sublink')
        .forEach(btn => btn.classList.remove('custom-select__sublink--active'));
    selectedButton.classList.add('custom-select__sublink--active');
    label.textContent = selectedButton.textContent.trim();

    const computedStyle = window.getComputedStyle(selectedButton);
    label.style.color = computedStyle.color;
    label.dataset.color = computedStyle.color;

    selectItem.classList.remove('custom-select--open');
}

export function resetCustomSelectLabels() {
    document.querySelectorAll('form .custom-select__label')
        .forEach(label => {
            if (label.dataset.originalText) {
                label.textContent = label.dataset.originalText;
            }
            if (label.dataset.originalColor) {
                label.style.color = label.dataset.originalColor;
            }
        });
    document.querySelectorAll('form .custom-select__sublink')
        .forEach(sublink => {
            sublink.classList.remove('custom-select__sublink--active')
        });
}

export function handleCancelSelection(selectItem, label) {
    label.textContent = label.dataset.originalText;
    if (label.dataset.originalColor) {
        label.style.color = label.dataset.originalColor;
    }

    selectItem.querySelectorAll('.custom-select__sublink')
        .forEach(btn => btn.classList.remove('custom-select__sublink--active'));

    selectItem.classList.remove('custom-select--open');
}

export function handleSaveSelection(selectItem, label, rowIndex) {
    console.log('Save clicked for row:', rowIndex);

    const flights = getFlights();
    if (!flights) {
        console.error('Flights data not found in localStorage');
        return;
    }

    if (flights[rowIndex] === undefined) {
        console.error('Invalid row index:', rowIndex, 'Flights length:', flights.length);
        return;
    }

    flights[rowIndex].status = label.textContent.trim();
    flights[rowIndex].statusColor = window.getComputedStyle(label).color;

    addToLocalStorage(flights);
    console.log('Saved to localStorage:', flights[rowIndex]);

    label.dataset.originalText = label.textContent;
    label.dataset.originalColor = flights[rowIndex].statusColor;

    selectItem.classList.remove('custom-select--open');
}
