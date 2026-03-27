export async function fetchData(url = "./data/data.json") {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return null;
  }
}
