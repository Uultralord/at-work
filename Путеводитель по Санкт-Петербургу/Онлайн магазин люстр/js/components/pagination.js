export function setupPagination(
  items,
  renderFunc,
  container,
  itemsPerPage = 6,
) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  let currentPage = 1;

  function showPage(page) {
    currentPage = page;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = items.slice(start, end);

    renderFunc(pageItems);

    updateButtons();
  }

  function updateButtons() {
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const liEl = document.createElement("li");
      liEl.classList.add("catalog__pagination-item");

      const btnEl = document.createElement("button");
      btnEl.textContent = i;
      btnEl.className = "catalog__pagination-link";

      if (i === currentPage) {
        btnEl.classList.add("catalog__pagination-link--active");
      }

      btnEl.addEventListener("click", () => showPage(i));
      liEl.append(btnEl);
      container.appendChild(liEl);
    }
  }

  showPage(1);
}
