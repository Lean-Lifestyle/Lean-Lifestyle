
const form = document.querySelector("#form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const genderInput = document.querySelector("#gender");
const birthdayInput = document.querySelector("#birthday");
const login = document.querySelector("#login");

const handleFetch = async (url, options) => {
    try {
      const response = await fetch(url, options);
      const { status, statusText, ok } = response;
      if (!ok) return [null, { status, statusText }];
  
      const content = (status === 204) || await response.json();
      return [content, null];
    } catch (error) {
      return [null, error];
    }
};

const handleError = (error) => alert(error.message);

const data = [
  firstNameInput,
  lastNameInput,
  emailInput,
  usernameInput,
  passwordInput,
  genderInput,
  birthdayInput,
];

const eraseValues = () => data.forEach((item) => (item.value = ""));
const getValues = () => {
  return {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    email: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
    gender: genderInput.value,
    birthday: birthdayInput.value,
  };
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("checking start");
  const values = getValues();
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };
  const [data, error] = await handleFetch("/api/users", option);

  if (error) return handleError(error);
  console.log(data);
  console.log("checking end");
  window.location.href = "/";
  eraseValues();
});