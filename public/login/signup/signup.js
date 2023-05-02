const form = document.querySelector("#form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const genderInput = document.querySelector("#gender");
const birthdayInput = document.querySelector("#birthday");
const login = document.querySelector("#login");

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    if (response.status === 204) return [{}];
    return [await response.json()];
  } catch (error) {
    return [null, error];
  }
};

const handleError = (error) => console.error(error.message);

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

  const values = getValues();
  console.log(values);
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };
  const [data, error] = await fetchData("/api/users", option);
  if (error) return handleError(error);
  console.log(data);
  console.log("checking end");
  window.location.href = "../questions/index.html";
  eraseValues();
});
