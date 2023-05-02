const form = document.querySelector("#form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const genderInput = document.querySelector("#gender");
const birthdayInput = document.querySelector("#birthday");
const login = document.querySelector("#login");
const errorMessage = document.querySelector("#error-message");

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return [data];
    } else {
      throw { status: response.status, message: data.error };
    }
  } catch (error) {
    return [null, error];
  }
};

const handleError = async (error) => {
  console.error(error.message);
  errorMessage.textContent = error.message;
};

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
    date_of_birth: birthdayInput.value,
  };
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("checking start");
  errorMessage.textContent = "";

  const values = getValues();
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };
  const [data, error] = await fetchData("/api/users", option);
  if (error) return handleError(error);
  window.location.href = "/questions";
  eraseValues();
});
