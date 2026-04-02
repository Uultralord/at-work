import currencyApi from '../api/api.js'


export default function getButton() {
    const customSelectBtn = document.querySelectorAll('.custom-select__btn')
    customSelectBtn.forEach(button => {
        const text = button.textContent
        console.log(text)
    })
}


