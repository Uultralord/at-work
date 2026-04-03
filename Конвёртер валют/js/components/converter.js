import currencyApi from '../api/api.js'

let selectedInputCode = null;
let selectedResultCode = null;

export function setupCurrencySelectors(inputSelector, resultSelector) {
    const selectInput = document.querySelector(inputSelector);
    const selectResult = document.querySelector(resultSelector);

    console.log(selectResult)

    if (!selectInput || !selectResult) {
        console.error('Не найдены элементы селекторов валют');
        return;
    }

    // Обработчик для входного селекта
    selectInput.addEventListener('click', (e) => {
        const item = e.target.closest('.custom-select__sublink');
        if (!item) return;

        e.preventDefault();
        selectedInputCode = item.dataset.type;
        console.log('Выбрана входная валюта:', selectedInputCode);
        performConversionIfReady();
    });

    // Обработчик для результирующего селекта
    selectResult.addEventListener('click', (e) => {
        const item = e.target.closest('.custom-select__sublink');
        console.log(item)
        if (!item) return;

        e.preventDefault();
        selectedResultCode = item.dataset.type;
        console.log('Выбрана результирующая валюта:', selectedResultCode);
        performConversionIfReady();
    });
}

async function performConversionIfReady() {
    // Ждём, пока будут выбраны обе валюты
    if (!selectedInputCode || !selectedResultCode) {
        console.log('Ожидание выбора второй валюты...');
        return;
    }

    try {
        const currencyData = await currencyApi.getCurrenciesList();

        // Ищем валюты по CharCode
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

        console.log('Входная валюта:', inputCurrency);
        console.log('Результирующая валюта:', resultCurrency);

        // Здесь можно добавить логику конвертации
        calculateConversion(inputCurrency, resultCurrency);
    } catch (error) {
        console.error('Ошибка при получении данных о валютах:', error);
    }
}

function calculateConversion(inputCurr, resultCurr) {
    console.log('Выполняем конвертацию между:');
    console.log(`- ${inputCurr.Name} (${inputCurr.CharCode}): ${inputCurr.Value}`);
    console.log(`- ${resultCurr.Name} (${resultCurr.CharCode}): ${resultCurr.Value}`);

    // Пример расчёта (упрощённый)
    const rate = resultCurr.Value / inputCurr.Value;
    console.log(`Курс: 1 ${inputCurr.CharCode} = ${rate.toFixed(4)} ${resultCurr.CharCode}`);
}

// Инициализация при загрузке DOM
// document.addEventListener('DOMContentLoaded', () => {
//     setupCurrencySelectors('#select-input', '#select-result');
// });
