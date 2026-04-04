import currencyApi from '../api/api.js'

let selectedInputCode = null;
let selectedResultCode = null;
const inputContainer = document.getElementById('select-input');
const resultContainer = document.getElementById('select-result');

export function setupCurrencySelectors() {

    if (!inputContainer || !resultContainer) {
        console.error('Не найдены контейнеры селекторов валют');
        return;
    }

    const inputList = inputContainer.querySelector('.custom-select__list');
    if (inputList) {
        inputList.addEventListener('click', (e) => {
            const item = e.target.closest('.custom-select__sublink')

            e.preventDefault();

            selectedInputCode = item.dataset.type;
            performConversionIfReady();
        });
    } else {
        console.error('Список .custom-select__list не найден в результирующем селекте');
    }

    const resultList = resultContainer.querySelector('.custom-select__list');
    if (resultList) {
        resultList.addEventListener('click', (e) => {
            const item = e.target.closest('.custom-select__sublink');

            e.preventDefault();

            selectedResultCode = item.dataset.type;
            performConversionIfReady();
        });
    } else {
        console.error('Список .custom-select__list не найден в результирующем селекте');
    }
}

async function performConversionIfReady() {
    if (!selectedInputCode || !selectedResultCode) {
        return;
    }

    try {
        const currencyData = await currencyApi.getCurrentRates();

        if (!currencyData || !currencyData.Valute) {
            console.error('Данные о валютах не загружены или структура неверна');
            return;
        }

        const inputCurrency = currencyData.Valute[selectedInputCode];
        const resultCurrency = currencyData.Valute[selectedResultCode];

        if (!inputCurrency) {
            console.warn(`Валюта с кодом ${selectedInputCode} не найдена`);
            return;
        }
        if (!resultCurrency) {
            console.warn(`Валюта с кодом ${selectedResultCode} не найдена`);
            return;
        }

        calculateConversion(inputCurrency, resultCurrency);
    } catch (error) {
        console.error('Ошибка при получении данных о валютах:', error);
    }
}

function calculateConversion(inputCurr, resultCurr) {
    const amountInput = document.getElementById('input');
    const amountValue = parseFloat(amountInput.value.trim());

    const amountResult = document.getElementById('result');

    if (isNaN(amountValue) || amountValue <= 0) {
        console.warn('Некорректное значение суммы:', amountInput.value);
        showConversionError('Введите положительное число для конвертации');
        return;
    }

    const rate = resultCurr.Value / inputCurr.Value;
    const convertedAmount = amountValue * rate;
    amountResult.value = convertedAmount.toFixed(4)
}

export function swapValues() {
    const amountInput = document.getElementById('input').value;
    const amountResult = document.getElementById('result').value;

    document.getElementById('input').value = amountResult;
    document.getElementById('result').value = amountInput;

    const selectInputBtn = document.querySelector('#select-input .custom-select__btn .custom-select__label');
    const selectResultBtn = document.querySelector('#select-result .custom-select__btn .custom-select__label');

    if (!selectInputBtn || !selectResultBtn) {
        console.error('Не найдены элементы для обмена текста кнопок');
        return;
    }

    const inputText = selectInputBtn.textContent;
    const resultText = selectResultBtn.textContent;

    selectInputBtn.textContent = resultText;
    selectResultBtn.textContent = inputText;

    const tempCode = selectedInputCode;
    selectedInputCode = selectedResultCode;
    selectedResultCode = tempCode;

    performConversionIfReady();
}
