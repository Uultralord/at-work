export function validateForm(form) {
    let isValid = true;

    form.querySelectorAll('.custom-input input[required]').forEach(input => {
        const inputContainer = input.closest('.custom-input');
        const isEmpty = !input.value.trim();

        if (isEmpty) {
            inputContainer.classList.add('custom-input--error');
            isValid = false;
        } else {
            inputContainer.classList.remove('custom-input--error');
        }
    });

    form.querySelectorAll('.custom-select__label[data-type]').forEach(label => {
        const selectContainer = label.closest('.custom-select');
        const originalText = label.dataset.originalText;
        const currentText = label.textContent.trim();
        const isNotSelected = currentText === originalText;

        if (isNotSelected) {
            selectContainer.classList.add('custom-select--error');
            isValid = false;
        } else {
            selectContainer.classList.remove('custom-select--error');
        }
    });

    return isValid;
}
