function getFlights() {
    const flightsJSON = localStorage.getItem('flights')
    return flightsJSON ? JSON.parse(flightsJSON) : []
}

function addToLocalStorage(flights) {
    localStorage.setItem('flights', JSON.stringify(flights))
}

export {
    getFlights,
    addToLocalStorage
}