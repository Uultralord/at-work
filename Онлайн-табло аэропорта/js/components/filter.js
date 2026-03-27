import { getFlights } from './localStorage.js';
const search = document.getElementById('header-search');

export function filterDirection() {
    const flights = getFlights();
    const searchValue = search.value.trim();

    if (!Array.isArray(flights)) {
        console.warn('getFlights() вернул не массив:', flights);
        return;
    }

    let filteredFlights;

    if (searchValue === '') {
        filteredFlights = flights;
    } else {
        filteredFlights = flights.filter(flight => {
            const direction = flight.direction || '';
            return direction.toLowerCase().includes(searchValue.toLowerCase());
        });
    }

    return filteredFlights;
}
export function filterType(id) {
    const flights = getFlights();

    if (!Array.isArray(flights)) {
        console.warn('getFlights() вернул не массив:', flights);
        return;
    }

    let filteredFlights;
    let idType = '';

    if (id === 'arrival') {
        idType = 'Прилет';
        filteredFlights = flights.filter(flight => {
            const flightType = flight.type || '';
            return flightType.toLowerCase().includes('прилет');
        });
    } else if (id === 'departure') {
        idType = 'Вылет';
        filteredFlights = flights.filter(flight => {
            const flightType = flight.type || '';
            return flightType.toLowerCase().includes('вылет');
        });
    } else {
        filteredFlights = flights;
    }

    return filteredFlights;
}