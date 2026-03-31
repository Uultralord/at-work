// Базовый URL API
const BASE_URL = 'https://www.cbr-xml-daily.ru';

// Общая функция для выполнения запросов
async function apiRequest(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка API запроса:', error);
        throw error;
    }
}

const currencyApi = {
    _cachedData: null,
    _isLoading: false,
    _pendingRequests: [],

    async _fetchData() {
        if (this._isLoading) {
            // Если уже идёт запрос, ждём его завершения
            return new Promise((resolve) => {
                this._pendingRequests.push(resolve);
            });
        }

        this._isLoading = true;

        try {
            const data = await apiRequest('/daily_json.js');
            this._cachedData = data;

            // Разблокируем все ожидающие запросы
            this._pendingRequests.forEach(resolve => resolve(data));
            this._pendingRequests = [];
            return data;
        } catch (error) {
            // При ошибке разблокируем ожидающие запросы с ошибкой
            this._pendingRequests.forEach(resolve => {
                resolve(Promise.reject(error));
            });
            this._pendingRequests = [];
            throw error;
        } finally {
            this._isLoading = false;
        }
    },

    async getCurrentRates() {
        if (this._cachedData) {
            return this._cachedData;
        }
        return this._fetchData();
    },

    async getCurrentDate() {
        const data = await this.getCurrentRates();
        return data.Date;
    },

    async getCurrenciesList() {
        const data = await this.getCurrentRates();
        return Object.entries(data.Valute).map(([code, currency]) => ({
            code: code,
            name: currency.Name,
        }));
    },
    async getCurrencyRate(currencyCode) {
        const data = await this.getCurrentRates();
        return data.Valute[currencyCode]?.Value;
    },

    async getCurrencyInfo(currencyCode) {
        const data = await this.getCurrentRates();
        return data.Valute[currencyCode];
    },

    async getCurrencyName(currencyCode) {
        const data = await this.getCurrentRates();
        return data.Valute[currencyCode]?.Name;
    }
};

export default currencyApi;
