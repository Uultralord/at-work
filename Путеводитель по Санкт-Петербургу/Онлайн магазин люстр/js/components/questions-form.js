const form = document.querySelector(".questions__form");
const questionsWrapper = document.querySelector(".questions__wrapper");
const validator = new JustValidate(form);

function getValidate() {
  validator
    .addField("#user-name", [
      {
        rule: "required",
        errorMessage: "Введите своё имя.",
      },
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Минимальная длина — три символа.",
      },
      {
        rule: "maxLength",
        value: 20,
        errorMessage: "Максимальная длина — двадцать символов.",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Введите свою почту.",
      },
      {
        rule: "email",
        errorMessage: "Введите корректную почту.",
      },
    ])
    .addField("#agree", [
      {
        rule: "required",
        errorMessage: "Согласие обязательно.",
      },
    ]);

  return validator;
}

getValidate();

export async function getForm() {
  const isValid = await validator.validate();

  if (!validator.isValid) return;

  const data = new FormData(form);

  const user = {
    name: data.get("user-name"),
    email: data.get("email"),
  };

  try {
    stop(validator);
    await addUser(user);
    let text = "Данные успешно отправлены!";
    renderForm(text);

    form.reset();
  } catch (error) {
    let text = "Ошибка при отправке.";
    renderForm(text);
  }
}

async function addUser(user) {
  const response = await fetch("https://httpbin.org/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

function renderForm(text) {
  const message = document.createElement("div");
  message.classList.add("message");
  const messageContent = document.createElement("div");
  messageContent.classList.add("message__content");
  const messageText = document.createElement("span");
  messageText.textContent = text;
  const messageClose = document.createElement("button");
  messageClose.classList.add("message__close");

  const messageCloseSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  messageCloseSvg.setAttribute("width", "24");
  messageCloseSvg.setAttribute("height", "24");

  const messageCloseUse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use",
  );
  messageCloseUse.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "images/sprite.svg#icon-close",
  );

  messageCloseSvg.append(messageCloseUse);
  messageClose.append(messageCloseSvg);
  messageContent.append(messageText, messageClose);
  message.append(messageContent);
  form.append(message);
  messageCloseSvg.addEventListener("click", () => form.removeChild(message));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getForm(e);
});
